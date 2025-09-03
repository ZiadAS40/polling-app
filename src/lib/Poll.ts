import { Poll, PollOption, CreatePollData, VoteData, User } from '@/types';
import { pollsApi } from './api';

export interface PollFilters {
  page?: number;
  limit?: number;
  search?: string;
  authorId?: string;
  isPublic?: boolean;
  isActive?: boolean;
}

export interface PollStats {
  totalVotes: number;
  participationRate: number;
  mostPopularOption?: PollOption;
  leastPopularOption?: PollOption;
}

export class PollService {
  private static instance: PollService;
  
  private constructor() {}
  
  public static getInstance(): PollService {
    if (!PollService.instance) {
      PollService.instance = new PollService();
    }
    return PollService.instance;
  }

  // CREATE Operations
  async createPoll(data: CreatePollData, author: User): Promise<Poll> {
    try {
      // Validate poll data
      this.validatePollData(data);
      
      const pollData = {
        ...data,
        expiresAt: data.expiresAt?.toISOString(),
      };
      
      const createdPoll = await pollsApi.createPoll(pollData) as Poll;
      return createdPoll;
    } catch (error) {
      console.error('Failed to create poll:', error);
      throw new Error(`Failed to create poll: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // READ Operations
  async getPoll(id: string): Promise<Poll> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Poll ID is required');
      }
      
      const poll = await pollsApi.getPoll(id) as Poll;
      return this.normalizePollDates(poll);
    } catch (error) {
      console.error(`Failed to get poll ${id}:`, error);
      throw new Error(`Failed to get poll: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPolls(filters: PollFilters = {}): Promise<Poll[]> {
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        search: filters.search,
      };
      
      const polls = await pollsApi.getPolls(params) as Poll[];
      return polls.map(poll => this.normalizePollDates(poll));
    } catch (error) {
      console.error('Failed to get polls:', error);
      throw new Error(`Failed to get polls: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getMyPolls(): Promise<Poll[]> {
    try {
      const polls = await pollsApi.getMyPolls() as Poll[];
      return polls.map(poll => this.normalizePollDates(poll));
    } catch (error) {
      console.error('Failed to get my polls:', error);
      throw new Error(`Failed to get my polls: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPollsByAuthor(authorId: string): Promise<Poll[]> {
    try {
      const allPolls = await this.getPolls();
      return allPolls.filter(poll => poll.authorId === authorId);
    } catch (error) {
      console.error(`Failed to get polls by author ${authorId}:`, error);
      throw new Error(`Failed to get polls by author: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // UPDATE Operations
  async updatePoll(id: string, data: Partial<CreatePollData>): Promise<Poll> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Poll ID is required');
      }

      // Validate update data
      if (data.title !== undefined) {
        this.validateTitle(data.title);
      }
      if (data.options !== undefined) {
        this.validateOptions(data.options);
      }

      const updateData = {
        ...data,
        expiresAt: data.expiresAt?.toISOString(),
      };

      const updatedPoll = await pollsApi.updatePoll(id, updateData) as Poll;
      return this.normalizePollDates(updatedPoll);
    } catch (error) {
      console.error(`Failed to update poll ${id}:`, error);
      throw new Error(`Failed to update poll: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async togglePollStatus(id: string): Promise<Poll> {
    try {
      const poll = await this.getPoll(id);
      const updatedPoll = await this.updatePoll(id, { 
        // Assuming we have an isActive field that can be toggled
        // This would need to be implemented in your backend
      });
      return updatedPoll;
    } catch (error) {
      console.error(`Failed to toggle poll status ${id}:`, error);
      throw new Error(`Failed to toggle poll status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // DELETE Operations
  async deletePoll(id: string): Promise<void> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Poll ID is required');
      }
      
      await pollsApi.deletePoll(id);
    } catch (error) {
      console.error(`Failed to delete poll ${id}:`, error);
      throw new Error(`Failed to delete poll: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // VOTE Operations
  async voteOnPoll(pollId: string, optionIds: string[]): Promise<Poll> {
    try {
      if (!pollId || pollId.trim() === '') {
        throw new Error('Poll ID is required');
      }
      
      if (!optionIds || optionIds.length === 0) {
        throw new Error('At least one option must be selected');
      }

      // Validate that poll exists and is active
      const poll = await this.getPoll(pollId);
      this.validatePollForVoting(poll);

      await pollsApi.vote(pollId, { optionIds });
      
      // Return updated poll
      return await this.getPoll(pollId);
    } catch (error) {
      console.error(`Failed to vote on poll ${pollId}:`, error);
      throw new Error(`Failed to vote on poll: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // VALIDATION Methods
  private validatePollData(data: CreatePollData): void {
    this.validateTitle(data.title);
    this.validateOptions(data.options);
    this.validateExpirationDate(data.expiresAt);
  }

  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Poll title is required');
    }
    if (title.trim().length < 3) {
      throw new Error('Poll title must be at least 3 characters long');
    }
    if (title.trim().length > 200) {
      throw new Error('Poll title must be less than 200 characters');
    }
  }

  private validateOptions(options: string[]): void {
    if (!options || options.length < 2) {
      throw new Error('Poll must have at least 2 options');
    }
    if (options.length > 10) {
      throw new Error('Poll cannot have more than 10 options');
    }
    
    const validOptions = options.filter(opt => opt && opt.trim().length > 0);
    if (validOptions.length < 2) {
      throw new Error('Poll must have at least 2 valid options');
    }
    
    // Check for duplicate options
    const uniqueOptions = new Set(validOptions.map(opt => opt.trim().toLowerCase()));
    if (uniqueOptions.size !== validOptions.length) {
      throw new Error('Poll options must be unique');
    }
  }

  private validateExpirationDate(expiresAt?: Date): void {
    if (expiresAt && expiresAt <= new Date()) {
      throw new Error('Expiration date must be in the future');
    }
  }

  private validatePollForVoting(poll: Poll): void {
    if (!poll.isActive) {
      throw new Error('This poll is not active');
    }
    
    if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
      throw new Error('This poll has expired');
    }
  }

  // UTILITY Methods
  private normalizePollDates(poll: Poll): Poll {
    return {
      ...poll,
      createdAt: new Date(poll.createdAt),
      updatedAt: new Date(poll.updatedAt),
      expiresAt: poll.expiresAt ? new Date(poll.expiresAt) : undefined,
    };
  }

  isPollExpired(poll: Poll): boolean {
    return poll.expiresAt ? new Date(poll.expiresAt) < new Date() : false;
  }

  isPollActive(poll: Poll): boolean {
    return poll.isActive && !this.isPollExpired(poll);
  }

  getPollStats(poll: Poll): PollStats {
    const totalVotes = poll.totalVotes;
    const participationRate = totalVotes > 0 ? (totalVotes / 100) * 100 : 0; // Assuming 100 is max possible votes
    
    const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);
    const mostPopularOption = sortedOptions[0];
    const leastPopularOption = sortedOptions[sortedOptions.length - 1];
    
    return {
      totalVotes,
      participationRate,
      mostPopularOption: mostPopularOption?.votes > 0 ? mostPopularOption : undefined,
      leastPopularOption: leastPopularOption?.votes > 0 ? leastPopularOption : undefined,
    };
  }

  getPollDuration(poll: Poll): number | null {
    if (!poll.expiresAt) return null;
    return new Date(poll.expiresAt).getTime() - new Date(poll.createdAt).getTime();
  }

  getTimeUntilExpiration(poll: Poll): number | null {
    if (!poll.expiresAt) return null;
    const now = new Date().getTime();
    const expiration = new Date(poll.expiresAt).getTime();
    return Math.max(0, expiration - now);
  }

  formatPollDuration(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  searchPolls(polls: Poll[], searchTerm: string): Poll[] {
    if (!searchTerm || searchTerm.trim().length === 0) return polls;
    
    const term = searchTerm.toLowerCase().trim();
    return polls.filter(poll => 
      poll.title.toLowerCase().includes(term) ||
      poll.description?.toLowerCase().includes(term) ||
      poll.author.name.toLowerCase().includes(term)
    );
  }

  filterPolls(polls: Poll[], filters: {
    isActive?: boolean;
    isPublic?: boolean;
    authorId?: string;
    expired?: boolean;
  }): Poll[] {
    return polls.filter(poll => {
      if (filters.isActive !== undefined && this.isPollActive(poll) !== filters.isActive) {
        return false;
      }
      if (filters.isPublic !== undefined && poll.isPublic !== filters.isPublic) {
        return false;
      }
      if (filters.authorId && poll.authorId !== filters.authorId) {
        return false;
      }
      if (filters.expired !== undefined && this.isPollExpired(poll) !== filters.expired) {
        return false;
      }
      return true;
    });
  }

  sortPolls(polls: Poll[], sortBy: 'createdAt' | 'updatedAt' | 'totalVotes' | 'title' = 'createdAt', order: 'asc' | 'desc' = 'desc'): Poll[] {
    return [...polls].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'createdAt':
        case 'updatedAt':
          aValue = new Date(a[sortBy]).getTime();
          bValue = new Date(b[sortBy]).getTime();
          break;
        case 'totalVotes':
          aValue = a.totalVotes;
          bValue = b.totalVotes;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }
}

// Export singleton instance
export const pollService = PollService.getInstance();// Export class for direct instantiation if needed
export { PollService };



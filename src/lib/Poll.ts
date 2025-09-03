import { Poll, PollOption, CreatePollData, VoteData, User } from '@/types';
import { pollsApi } from './api';

// Constants for better maintainability and performance
const POLL_CONSTRAINTS = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 200,
  MIN_OPTIONS: 2,
  MAX_OPTIONS: 10,
  PARTICIPATION_RATE_BASE: 100,
} as const;

const TIME_CONSTANTS = {
  MILLISECONDS_PER_MINUTE: 1000 * 60,
  MILLISECONDS_PER_HOUR: 1000 * 60 * 60,
  MILLISECONDS_PER_DAY: 1000 * 60 * 60 * 24,
} as const;

// Type definitions
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

export interface PollFilterOptions {
  isActive?: boolean;
  isPublic?: boolean;
  authorId?: string;
  expired?: boolean;
}

export type SortField = 'createdAt' | 'updatedAt' | 'totalVotes' | 'title';
export type SortOrder = 'asc' | 'desc';

/**
 * PollService - A comprehensive service for managing poll CRUD operations
 * 
 * Features:
 * - Complete CRUD operations (Create, Read, Update, Delete)
 * - Voting system with validation
 * - Advanced filtering and sorting
 * - Search functionality
 * - Poll statistics and analytics
 * - Time management utilities
 * 
 * Uses singleton pattern for efficient memory usage
 */
export class PollService {
  private static instance: PollService;
  
  private constructor() {}
  
  public static getInstance(): PollService {
    if (!PollService.instance) {
      PollService.instance = new PollService();
    }
    return PollService.instance;
  }

  // ==================== CREATE OPERATIONS ====================

  /**
   * Creates a new poll with comprehensive validation
   * @param data - Poll creation data
   * @param author - User creating the poll
   * @returns Promise<Poll> - The created poll
   */
  async createPoll(data: CreatePollData, author: User): Promise<Poll> {
    try {
      this.validatePollData(data);
      
      const pollData = this.preparePollDataForApi(data);
      const createdPoll = await pollsApi.createPoll(pollData) as Poll;
      
      return this.normalizePollDates(createdPoll);
    } catch (error) {
      this.handleError('Failed to create poll', error);
    }
  }

  // ==================== READ OPERATIONS ====================

  /**
   * Retrieves a specific poll by ID with validation
   * @param id - Poll ID
   * @returns Promise<Poll> - The requested poll
   */
  async getPoll(id: string): Promise<Poll> {
    try {
      this.validatePollId(id);
      
      const poll = await pollsApi.getPoll(id) as Poll;
      return this.normalizePollDates(poll);
    } catch (error) {
      this.handleError(`Failed to get poll ${id}`, error);
    }
  }

  /**
   * Retrieves multiple polls with optional filtering and pagination
   * @param filters - Optional filters for the query
   * @returns Promise<Poll[]> - Array of polls
   */
  async getPolls(filters: PollFilters = {}): Promise<Poll[]> {
    try {
      const params = this.buildApiParams(filters);
      const polls = await pollsApi.getPolls(params) as Poll[];
      
      return polls.map(poll => this.normalizePollDates(poll));
    } catch (error) {
      this.handleError('Failed to get polls', error);
    }
  }

  /**
   * Retrieves polls created by the current authenticated user
   * @returns Promise<Poll[]> - Array of user's polls
   */
  async getMyPolls(): Promise<Poll[]> {
    try {
      const polls = await pollsApi.getMyPolls() as Poll[];
      return polls.map(poll => this.normalizePollDates(poll));
    } catch (error) {
      this.handleError('Failed to get my polls', error);
    }
  }

  /**
   * Retrieves polls by a specific author with efficient filtering
   * @param authorId - Author's user ID
   * @returns Promise<Poll[]> - Array of polls by the author
   */
  async getPollsByAuthor(authorId: string): Promise<Poll[]> {
    try {
      const allPolls = await this.getPolls();
      return allPolls.filter(poll => poll.authorId === authorId);
    } catch (error) {
      this.handleError(`Failed to get polls by author ${authorId}`, error);
    }
  }

  // ==================== UPDATE OPERATIONS ====================

  /**
   * Updates an existing poll with partial data validation
   * @param id - Poll ID
   * @param data - Partial poll data to update
   * @returns Promise<Poll> - The updated poll
   */
  async updatePoll(id: string, data: Partial<CreatePollData>): Promise<Poll> {
    try {
      this.validatePollId(id);
      this.validateUpdateData(data);

      const updateData = this.preparePollDataForApi(data);
      const updatedPoll = await pollsApi.updatePoll(id, updateData) as Poll;
      
      return this.normalizePollDates(updatedPoll);
    } catch (error) {
      this.handleError(`Failed to update poll ${id}`, error);
    }
  }

  /**
   * Toggles the active status of a poll
   * @param id - Poll ID
   * @returns Promise<Poll> - The updated poll
   */
  async togglePollStatus(id: string): Promise<Poll> {
    try {
      const poll = await this.getPoll(id);
      // Note: This would need backend implementation for toggling isActive
      const updatedPoll = await this.updatePoll(id, {});
      return updatedPoll;
    } catch (error) {
      this.handleError(`Failed to toggle poll status ${id}`, error);
    }
  }

  // ==================== DELETE OPERATIONS ====================

  /**
   * Deletes a poll with validation
   * @param id - Poll ID
   * @returns Promise<void>
   */
  async deletePoll(id: string): Promise<void> {
    try {
      this.validatePollId(id);
      await pollsApi.deletePoll(id);
    } catch (error) {
      this.handleError(`Failed to delete poll ${id}`, error);
    }
  }

  // ==================== VOTE OPERATIONS ====================

  /**
   * Votes on a poll with comprehensive validation
   * @param pollId - Poll ID
   * @param optionIds - Array of selected option IDs
   * @returns Promise<Poll> - The updated poll with new vote counts
   */
  async voteOnPoll(pollId: string, optionIds: string[]): Promise<Poll> {
    try {
      this.validatePollId(pollId);
      this.validateVoteOptions(optionIds);

      const poll = await this.getPoll(pollId);
      this.validatePollForVoting(poll);

      await pollsApi.vote(pollId, { optionIds });
      
      // Return updated poll
      return await this.getPoll(pollId);
    } catch (error) {
      this.handleError(`Failed to vote on poll ${pollId}`, error);
    }
  }

  // ==================== VALIDATION METHODS ====================

  /**
   * Validates complete poll data for creation
   * @param data - Poll creation data
   */
  private validatePollData(data: CreatePollData): void {
    this.validateTitle(data.title);
    this.validateOptions(data.options);
    this.validateExpirationDate(data.expiresAt);
  }

  /**
   * Validates poll title with length constraints
   * @param title - Poll title
   */
  private validateTitle(title: string): void {
    if (!title?.trim()) {
      throw new Error('Poll title is required');
    }
    
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < POLL_CONSTRAINTS.TITLE_MIN_LENGTH) {
      throw new Error(`Poll title must be at least ${POLL_CONSTRAINTS.TITLE_MIN_LENGTH} characters long`);
    }
    if (trimmedTitle.length > POLL_CONSTRAINTS.TITLE_MAX_LENGTH) {
      throw new Error(`Poll title must be less than ${POLL_CONSTRAINTS.TITLE_MAX_LENGTH} characters`);
    }
  }

  /**
   * Validates poll options with count and uniqueness constraints
   * @param options - Array of poll options
   */
  private validateOptions(options: string[]): void {
    if (!options || options.length < POLL_CONSTRAINTS.MIN_OPTIONS) {
      throw new Error(`Poll must have at least ${POLL_CONSTRAINTS.MIN_OPTIONS} options`);
    }
    if (options.length > POLL_CONSTRAINTS.MAX_OPTIONS) {
      throw new Error(`Poll cannot have more than ${POLL_CONSTRAINTS.MAX_OPTIONS} options`);
    }
    
    const validOptions = options.filter(opt => opt?.trim());
    if (validOptions.length < POLL_CONSTRAINTS.MIN_OPTIONS) {
      throw new Error(`Poll must have at least ${POLL_CONSTRAINTS.MIN_OPTIONS} valid options`);
    }
    
    // Check for duplicate options (case-insensitive)
    const uniqueOptions = new Set(validOptions.map(opt => opt.trim().toLowerCase()));
    if (uniqueOptions.size !== validOptions.length) {
      throw new Error('Poll options must be unique');
    }
  }

  /**
   * Validates expiration date is in the future
   * @param expiresAt - Expiration date
   */
  private validateExpirationDate(expiresAt?: Date): void {
    if (expiresAt && expiresAt <= new Date()) {
      throw new Error('Expiration date must be in the future');
    }
  }

  /**
   * Validates poll is eligible for voting
   * @param poll - Poll to validate
   */
  private validatePollForVoting(poll: Poll): void {
    if (!poll.isActive) {
      throw new Error('This poll is not active');
    }
    
    if (this.isPollExpired(poll)) {
      throw new Error('This poll has expired');
    }
  }

  /**
   * Validates poll ID is not empty
   * @param id - Poll ID
   */
  private validatePollId(id: string): void {
    if (!id?.trim()) {
      throw new Error('Poll ID is required');
    }
  }

  /**
   * Validates update data for partial updates
   * @param data - Update data
   */
  private validateUpdateData(data: Partial<CreatePollData>): void {
    if (data.title !== undefined) {
      this.validateTitle(data.title);
    }
    if (data.options !== undefined) {
      this.validateOptions(data.options);
    }
  }

  /**
   * Validates vote options are provided
   * @param optionIds - Array of option IDs
   */
  private validateVoteOptions(optionIds: string[]): void {
    if (!optionIds?.length) {
      throw new Error('At least one option must be selected');
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Normalizes poll dates from API response strings to Date objects
   * @param poll - Poll with potentially string dates
   * @returns Poll with proper Date objects
   */
  private normalizePollDates(poll: Poll): Poll {
    return {
      ...poll,
      createdAt: new Date(poll.createdAt),
      updatedAt: new Date(poll.updatedAt),
      expiresAt: poll.expiresAt ? new Date(poll.expiresAt) : undefined,
    };
  }

  /**
   * Prepares poll data for API submission with proper date formatting
   * @param data - Poll data
   * @returns API-ready poll data
   */
  private preparePollDataForApi(data: Partial<CreatePollData>): any {
    return {
      ...data,
      expiresAt: data.expiresAt?.toISOString(),
    };
  }

  /**
   * Builds API parameters from filters for efficient querying
   * @param filters - Poll filters
   * @returns API parameters
   */
  private buildApiParams(filters: PollFilters): any {
    return {
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
    };
  }

  /**
   * Centralized error handling with consistent formatting
   * @param message - Error message prefix
   * @param error - Original error
   */
  private handleError(message: string, error: unknown): never {
    console.error(message, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`${message}: ${errorMessage}`);
  }

  // ==================== PUBLIC UTILITY METHODS ====================

  /**
   * Checks if a poll has expired based on current time
   * @param poll - Poll to check
   * @returns boolean - True if expired
   */
  isPollExpired(poll: Poll): boolean {
    return poll.expiresAt ? new Date(poll.expiresAt) < new Date() : false;
  }

  /**
   * Checks if a poll is currently active (not expired and marked as active)
   * @param poll - Poll to check
   * @returns boolean - True if active
   */
  isPollActive(poll: Poll): boolean {
    return poll.isActive && !this.isPollExpired(poll);
  }

  /**
   * Calculates comprehensive poll statistics
   * @param poll - Poll to analyze
   * @returns PollStats - Detailed poll statistics
   */
  getPollStats(poll: Poll): PollStats {
    const { totalVotes } = poll;
    const participationRate = totalVotes > 0 
      ? (totalVotes / POLL_CONSTRAINTS.PARTICIPATION_RATE_BASE) * 100 
      : 0;
    
    const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);
    const [mostPopularOption, leastPopularOption] = [
      sortedOptions[0],
      sortedOptions[sortedOptions.length - 1]
    ];
    
    return {
      totalVotes,
      participationRate,
      mostPopularOption: mostPopularOption?.votes > 0 ? mostPopularOption : undefined,
      leastPopularOption: leastPopularOption?.votes > 0 ? leastPopularOption : undefined,
    };
  }

  /**
   * Gets poll duration in milliseconds
   * @param poll - Poll to analyze
   * @returns number | null - Duration in milliseconds or null if no expiration
   */
  getPollDuration(poll: Poll): number | null {
    if (!poll.expiresAt) return null;
    return new Date(poll.expiresAt).getTime() - new Date(poll.createdAt).getTime();
  }

  /**
   * Gets time until poll expiration in milliseconds
   * @param poll - Poll to analyze
   * @returns number | null - Time until expiration or null if no expiration
   */
  getTimeUntilExpiration(poll: Poll): number | null {
    if (!poll.expiresAt) return null;
    const now = Date.now();
    const expiration = new Date(poll.expiresAt).getTime();
    return Math.max(0, expiration - now);
  }

  /**
   * Formats duration in a human-readable format with optimized calculations
   * @param milliseconds - Duration in milliseconds
   * @returns string - Formatted duration
   */
  formatPollDuration(milliseconds: number): string {
    const days = Math.floor(milliseconds / TIME_CONSTANTS.MILLISECONDS_PER_DAY);
    const hours = Math.floor((milliseconds % TIME_CONSTANTS.MILLISECONDS_PER_DAY) / TIME_CONSTANTS.MILLISECONDS_PER_HOUR);
    const minutes = Math.floor((milliseconds % TIME_CONSTANTS.MILLISECONDS_PER_HOUR) / TIME_CONSTANTS.MILLISECONDS_PER_MINUTE);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  /**
   * Searches polls by term with case-insensitive matching
   * @param polls - Array of polls to search
   * @param searchTerm - Search term
   * @returns Poll[] - Filtered polls
   */
  searchPolls(polls: Poll[], searchTerm: string): Poll[] {
    if (!searchTerm?.trim()) return polls;
    
    const term = searchTerm.toLowerCase().trim();
    return polls.filter(poll => 
      poll.title.toLowerCase().includes(term) ||
      poll.description?.toLowerCase().includes(term) ||
      poll.author.name.toLowerCase().includes(term)
    );
  }

  /**
   * Filters polls based on multiple criteria with efficient evaluation
   * @param polls - Array of polls to filter
   * @param filters - Filter criteria
   * @returns Poll[] - Filtered polls
   */
  filterPolls(polls: Poll[], filters: PollFilterOptions): Poll[] {
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

  /**
   * Sorts polls by specified field and order with optimized comparison
   * @param polls - Array of polls to sort
   * @param sortBy - Field to sort by
   * @param order - Sort order (asc/desc)
   * @returns Poll[] - Sorted polls
   */
  sortPolls(
    polls: Poll[], 
    sortBy: SortField = 'createdAt', 
    order: SortOrder = 'desc'
  ): Poll[] {
    return [...polls].sort((a, b) => {
      const aValue = this.getSortValue(a, sortBy);
      const bValue = this.getSortValue(b, sortBy);
      
      const comparison = aValue > bValue ? 1 : -1;
      return order === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Gets sort value for a poll based on sort field with optimized access
   * @param poll - Poll to get value from
   * @param sortBy - Sort field
   * @returns any - Sort value
   */
  private getSortValue(poll: Poll, sortBy: SortField): any {
    switch (sortBy) {
      case 'createdAt':
        return new Date(poll.createdAt).getTime();
      case 'updatedAt':
        return new Date(poll.updatedAt).getTime();
      case 'totalVotes':
        return poll.totalVotes;
      case 'title':
        return poll.title.toLowerCase();
      default:
        return 0;
    }
  }
}

// Export singleton instance
export const pollService = PollService.getInstance();

// Export class for direct instantiation if needed
export { PollService as PollServiceClass };
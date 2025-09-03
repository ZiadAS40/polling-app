// Example usage of the PollService class
import { pollService } from './Poll';
import { CreatePollData, User } from '@/types';

// Example user (this would come from your auth context)
const exampleUser: User = {
  id: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Example usage functions
export class PollExample {
  
  // Example: Create a new poll
  static async createExamplePoll() {
    try {
      const pollData: CreatePollData = {
        title: 'What is your favorite programming language?',
        description: 'Help us understand the community preferences',
        options: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go'],
        isPublic: true,
        allowMultipleVotes: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      };

      const newPoll = await pollService.createPoll(pollData, exampleUser);
      console.log('Created poll:', newPoll);
      return newPoll;
    } catch (error) {
      console.error('Failed to create poll:', error);
      throw error;
    }
  }

  // Example: Get a specific poll
  static async getPollExample(pollId: string) {
    try {
      const poll = await pollService.getPoll(pollId);
      console.log('Retrieved poll:', poll);
      
      // Check if poll is active
      const isActive = pollService.isPollActive(poll);
      console.log('Poll is active:', isActive);
      
      // Get poll statistics
      const stats = pollService.getPollStats(poll);
      console.log('Poll stats:', stats);
      
      return poll;
    } catch (error) {
      console.error('Failed to get poll:', error);
      throw error;
    }
  }

  // Example: Get all polls with filtering
  static async getPollsExample() {
    try {
      // Get all polls
      const allPolls = await pollService.getPolls();
      console.log('All polls:', allPolls);

      // Get polls with pagination
      const paginatedPolls = await pollService.getPolls({
        page: 1,
        limit: 10,
        search: 'programming',
      });
      console.log('Paginated polls:', paginatedPolls);

      // Filter and sort polls
      const activePolls = pollService.filterPolls(allPolls, { isActive: true });
      const sortedPolls = pollService.sortPolls(activePolls, 'totalVotes', 'desc');
      console.log('Active polls sorted by votes:', sortedPolls);

      return allPolls;
    } catch (error) {
      console.error('Failed to get polls:', error);
      throw error;
    }
  }

  // Example: Update a poll
  static async updatePollExample(pollId: string) {
    try {
      const updateData = {
        title: 'Updated: What is your favorite programming language?',
        description: 'Updated description with more context',
        isPublic: false,
      };

      const updatedPoll = await pollService.updatePoll(pollId, updateData);
      console.log('Updated poll:', updatedPoll);
      return updatedPoll;
    } catch (error) {
      console.error('Failed to update poll:', error);
      throw error;
    }
  }

  // Example: Vote on a poll
  static async voteOnPollExample(pollId: string, optionIds: string[]) {
    try {
      const updatedPoll = await pollService.voteOnPoll(pollId, optionIds);
      console.log('Voted on poll, updated poll:', updatedPoll);
      return updatedPoll;
    } catch (error) {
      console.error('Failed to vote on poll:', error);
      throw error;
    }
  }

  // Example: Delete a poll
  static async deletePollExample(pollId: string) {
    try {
      await pollService.deletePoll(pollId);
      console.log('Poll deleted successfully');
    } catch (error) {
      console.error('Failed to delete poll:', error);
      throw error;
    }
  }

  // Example: Get user's polls
  static async getMyPollsExample() {
    try {
      const myPolls = await pollService.getMyPolls();
      console.log('My polls:', myPolls);
      return myPolls;
    } catch (error) {
      console.error('Failed to get my polls:', error);
      throw error;
    }
  }

  // Example: Search and filter polls
  static async searchAndFilterExample() {
    try {
      const allPolls = await pollService.getPolls();
      
      // Search polls
      const searchResults = pollService.searchPolls(allPolls, 'programming');
      console.log('Search results:', searchResults);

      // Filter polls
      const publicPolls = pollService.filterPolls(allPolls, { isPublic: true });
      const expiredPolls = pollService.filterPolls(allPolls, { expired: true });
      console.log('Public polls:', publicPolls);
      console.log('Expired polls:', expiredPolls);

      return { searchResults, publicPolls, expiredPolls };
    } catch (error) {
      console.error('Failed to search and filter polls:', error);
      throw error;
    }
  }

  // Example: Get poll utilities
  static async pollUtilitiesExample(pollId: string) {
    try {
      const poll = await pollService.getPoll(pollId);
      
      // Check if poll is expired
      const isExpired = pollService.isPollExpired(poll);
      console.log('Poll is expired:', isExpired);

      // Get poll duration
      const duration = pollService.getPollDuration(poll);
      console.log('Poll duration (ms):', duration);

      // Get time until expiration
      const timeUntilExpiration = pollService.getTimeUntilExpiration(poll);
      console.log('Time until expiration (ms):', timeUntilExpiration);

      // Format duration
      if (duration) {
        const formattedDuration = pollService.formatPollDuration(duration);
        console.log('Formatted duration:', formattedDuration);
      }

      // Get poll statistics
      const stats = pollService.getPollStats(poll);
      console.log('Poll statistics:', stats);

      return {
        isExpired,
        duration,
        timeUntilExpiration,
        stats,
      };
    } catch (error) {
      console.error('Failed to get poll utilities:', error);
      throw error;
    }
  }
}

// Example of how to use in a React component
export const usePollService = () => {
  return {
    // Create operations
    createPoll: pollService.createPoll.bind(pollService),
    
    // Read operations
    getPoll: pollService.getPoll.bind(pollService),
    getPolls: pollService.getPolls.bind(pollService),
    getMyPolls: pollService.getMyPolls.bind(pollService),
    getPollsByAuthor: pollService.getPollsByAuthor.bind(pollService),
    
    // Update operations
    updatePoll: pollService.updatePoll.bind(pollService),
    togglePollStatus: pollService.togglePollStatus.bind(pollService),
    
    // Delete operations
    deletePoll: pollService.deletePoll.bind(pollService),
    
    // Vote operations
    voteOnPoll: pollService.voteOnPoll.bind(pollService),
    
    // Utility methods
    isPollExpired: pollService.isPollExpired.bind(pollService),
    isPollActive: pollService.isPollActive.bind(pollService),
    getPollStats: pollService.getPollStats.bind(pollService),
    getPollDuration: pollService.getPollDuration.bind(pollService),
    getTimeUntilExpiration: pollService.getTimeUntilExpiration.bind(pollService),
    formatPollDuration: pollService.formatPollDuration.bind(pollService),
    searchPolls: pollService.searchPolls.bind(pollService),
    filterPolls: pollService.filterPolls.bind(pollService),
    sortPolls: pollService.sortPolls.bind(pollService),
  };
};

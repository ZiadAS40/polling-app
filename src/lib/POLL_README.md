# Poll Service Class

A comprehensive TypeScript class for managing poll CRUD operations in your polling application.

## Features

- ✅ **Complete CRUD Operations**: Create, Read, Update, Delete polls
- ✅ **Voting System**: Vote on polls with validation
- ✅ **Data Validation**: Comprehensive validation for all poll data
- ✅ **Utility Methods**: Helper methods for poll management
- ✅ **Filtering & Sorting**: Advanced filtering and sorting capabilities
- ✅ **Search Functionality**: Search polls by title, description, or author
- ✅ **Statistics**: Get detailed poll statistics
- ✅ **Time Management**: Handle expiration dates and duration calculations
- ✅ **Singleton Pattern**: Efficient memory usage with singleton instance
- ✅ **TypeScript Support**: Full type safety throughout

## Installation

The Poll service is already integrated into your project. Import it where needed:

```typescript
import { pollService } from '@/lib/Poll';
```

## Basic Usage

### Creating a Poll

```typescript
import { pollService } from '@/lib/Poll';
import { CreatePollData, User } from '@/types';

const pollData: CreatePollData = {
  title: 'What is your favorite programming language?',
  description: 'Help us understand community preferences',
  options: ['JavaScript', 'TypeScript', 'Python', 'Java'],
  isPublic: true,
  allowMultipleVotes: false,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
};

const user: User = {
  id: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const newPoll = await pollService.createPoll(pollData, user);
```

### Getting Polls

```typescript
// Get a specific poll
const poll = await pollService.getPoll('poll-id');

// Get all polls
const allPolls = await pollService.getPolls();

// Get polls with pagination and search
const filteredPolls = await pollService.getPolls({
  page: 1,
  limit: 10,
  search: 'programming',
});

// Get user's polls
const myPolls = await pollService.getMyPolls();
```

### Updating a Poll

```typescript
const updatedPoll = await pollService.updatePoll('poll-id', {
  title: 'Updated poll title',
  description: 'Updated description',
  isPublic: false,
});
```

### Voting on a Poll

```typescript
// Vote on a poll (single or multiple options)
const updatedPoll = await pollService.voteOnPoll('poll-id', ['option-1', 'option-2']);
```

### Deleting a Poll

```typescript
await pollService.deletePoll('poll-id');
```

## Advanced Features

### Filtering and Sorting

```typescript
// Filter polls
const activePolls = pollService.filterPolls(allPolls, { isActive: true });
const publicPolls = pollService.filterPolls(allPolls, { isPublic: true });
const expiredPolls = pollService.filterPolls(allPolls, { expired: true });

// Sort polls
const sortedByVotes = pollService.sortPolls(allPolls, 'totalVotes', 'desc');
const sortedByDate = pollService.sortPolls(allPolls, 'createdAt', 'desc');
```

### Search Functionality

```typescript
const searchResults = pollService.searchPolls(allPolls, 'programming language');
```

### Poll Statistics

```typescript
const stats = pollService.getPollStats(poll);
console.log(stats);
// Output:
// {
//   totalVotes: 150,
//   participationRate: 75,
//   mostPopularOption: { id: 'opt-1', text: 'JavaScript', votes: 60 },
//   leastPopularOption: { id: 'opt-4', text: 'Java', votes: 10 }
// }
```

### Time Management

```typescript
// Check if poll is expired
const isExpired = pollService.isPollExpired(poll);

// Check if poll is active
const isActive = pollService.isPollActive(poll);

// Get poll duration
const duration = pollService.getPollDuration(poll);

// Get time until expiration
const timeLeft = pollService.getTimeUntilExpiration(poll);

// Format duration
const formattedDuration = pollService.formatPollDuration(duration);
```

## Validation

The Poll service includes comprehensive validation:

### Poll Creation Validation
- Title: Required, 3-200 characters
- Options: Minimum 2, maximum 10, must be unique
- Expiration date: Must be in the future (if provided)

### Voting Validation
- Poll must be active
- Poll must not be expired
- At least one option must be selected

## Error Handling

All methods include proper error handling:

```typescript
try {
  const poll = await pollService.createPoll(pollData, user);
} catch (error) {
  console.error('Failed to create poll:', error.message);
  // Handle error appropriately
}
```

## React Hook Usage

For React components, use the provided hook:

```typescript
import { usePollService } from '@/lib/PollExample';

function MyComponent() {
  const {
    createPoll,
    getPoll,
    getPolls,
    updatePoll,
    deletePoll,
    voteOnPoll,
    isPollActive,
    getPollStats,
  } = usePollService();

  // Use the methods in your component
}
```

## API Integration

The Poll service integrates with your existing API structure:

- Uses `pollsApi` from `@/lib/api`
- Follows your existing API endpoints
- Maintains consistency with your authentication system
- Handles API errors gracefully

## Type Safety

Full TypeScript support with:
- Proper type definitions for all parameters
- Return type safety
- Interface compliance with your existing types
- Generic type support for API responses

## Performance

- Singleton pattern for efficient memory usage
- Optimized filtering and sorting algorithms
- Minimal API calls with proper caching strategies
- Efficient date handling and normalization

## Examples

See `src/lib/PollExample.ts` for comprehensive usage examples including:
- Complete CRUD operations
- Advanced filtering and sorting
- Search functionality
- Statistics and analytics
- Time management utilities
- React component integration

## Contributing

When extending the Poll service:
1. Maintain type safety
2. Add proper validation
3. Include error handling
4. Update documentation
5. Add unit tests for new functionality

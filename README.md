# Polling App

A modern, full-stack polling application built with Next.js, TypeScript, and Shadcn UI components.

## Features

- **User Authentication**: Secure login and registration system
- **Poll Creation**: Create custom polls with multiple options
- **Poll Participation**: Vote on polls with real-time results
- **Poll Management**: View and manage your created polls
- **Responsive Design**: Beautiful UI that works on all devices
- **Type Safety**: Full TypeScript support throughout the application

## Project Structure

```
src/
├── app/                          # Next.js app router pages
│   ├── auth/                     # Authentication pages
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── polls/                   # Poll-related pages
│   │   ├── create/              # Create poll page
│   │   ├── my/                  # User's polls page
│   │   └── [id]/                # Individual poll page
│   ├── profile/                 # User profile page
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Home page
├── components/                   # Reusable UI components
│   ├── ui/                      # Shadcn UI components
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx           # Navigation header
│   │   ├── Footer.tsx           # Site footer
│   │   └── MainLayout.tsx       # Main layout wrapper
│   └── shared/                  # Shared components
├── contexts/                     # React contexts
│   └── AuthContext.tsx          # Authentication context
├── features/                     # Feature-specific components
│   ├── auth/                    # Authentication feature
│   │   └── components/          # Auth-specific components
│   │       ├── LoginForm.tsx    # Login form component
│   │       └── RegisterForm.tsx # Registration form component
│   └── polls/                   # Polls feature
│       └── components/          # Poll-specific components
│           ├── PollCard.tsx     # Poll display card
│           └── CreatePollForm.tsx # Poll creation form
├── hooks/                        # Custom React hooks
│   └── useLocalStorage.ts       # Local storage hook
├── lib/                          # Utility libraries
│   ├── api.ts                   # API client functions
│   ├── constants.ts             # App constants
│   ├── utils.ts                 # General utilities
│   └── validations.ts           # Form validation functions
└── types/                        # TypeScript type definitions
    └── index.ts                 # Main type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Context API
- **Form Handling**: React Hook Form (to be added)
- **Validation**: Custom validation functions

## Key Features Implemented

### Authentication System
- Login and registration forms with validation
- User profile management
- Protected routes and authentication context
- Session management (placeholder for backend integration)

### Poll Management
- Create polls with multiple options
- Set poll privacy and voting preferences
- View poll results with visual charts
- Manage user's created polls

### UI/UX
- Responsive design with Tailwind CSS
- Modern UI components from Shadcn
- Loading states and error handling
- Intuitive navigation and user flows

## Next Steps

To complete the application, you'll need to:

1. **Backend Integration**: Connect to your authentication and polling API
2. **Database**: Set up database models for users and polls
3. **Real-time Updates**: Implement WebSocket connections for live poll results
4. **Advanced Features**: Add poll sharing, analytics, and moderation tools
5. **Testing**: Add unit and integration tests
6. **Deployment**: Configure for production deployment

## Development Notes

- All API calls are currently placeholder implementations
- Authentication context is set up but needs backend integration
- Form validation is implemented but can be enhanced with libraries like Zod
- The app is ready for backend integration with clear API interfaces defined

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
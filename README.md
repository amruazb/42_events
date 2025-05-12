# Events Management Application 

A comprehensive events management application with real-time features, admin dashboard, and MongoDB integration.

## Features

### Public Features
- **Events Listing**: Browse upcoming events with search and filter capabilities
- **Event Details**: View comprehensive information about each event
- **Export Functionality**: Export events to CSV or ICS (calendar) format
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode**: Toggle between light and dark themes

### Admin Features
- **Secure Admin Panel**: Protected by JWT authentication
- **Event Management**: Create, edit, and delete events
- **Bulk CSV Import**: Import multiple events at once via CSV upload
- **Admin Dashboard**: View statistics and manage events

### Technical Features
- **Real-time Sync**: Changes sync across tabs using BroadcastChannel API
- **Offline Support**: Service Worker caching for offline access
- **Persistent Notifications**: Notifications remain until read
- **MongoDB Integration**: Data storage with MongoDB
- **JWT Authentication**: Secure admin access

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React Hooks, Context API
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: BroadcastChannel API
- **Offline Support**: Service Workers

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or cloud)

### Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=events
JWT_SECRET=your_jwt_secret
\`\`\`

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/events-management-app.git
cd events-management-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Admin Credentials

- Username: `admin`
- Password: `admin`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username and password
- `POST /api/auth/register` - Register a new user
- `GET /api/auth/me` - Get current user information

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create a new event
- `GET /api/events/:id` - Get a specific event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event
- `POST /api/events/import` - Import events from CSV
- `GET /api/events/search` - Search events

## Project Structure

\`\`\`
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── admin/            # Admin pages
│   ├── event/            # Event detail pages
│   └── export/           # Export functionality
├── components/           # React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and libraries
│   ├── auth.ts           # Authentication utilities
│   ├── events.ts         # Event-related functions
│   ├── mongodb.ts        # MongoDB connection
│   └── types.ts          # TypeScript types
├── public/               # Static assets
│   └── sw.js             # Service Worker
└── middleware.ts         # Next.js middleware for auth protection
\`\`\`

## Authentication Flow

1. User submits login credentials
2. Server validates credentials against MongoDB
3. If valid, server generates JWT token
4. Token is stored in cookies
5. Protected routes check token validity
6. Admin routes verify user has admin role

## Offline Support

The application uses Service Workers to cache:
- Static assets
- API responses
- Application shell

This allows the application to function even when offline, displaying previously loaded events.

## Real-time Sync

When changes are made to events (create, update, delete):
1. Changes are saved to MongoDB
2. BroadcastChannel API sends messages to other open tabs
3. UI updates in real-time across all tabs

## Notifications

The application includes a notification system that:
- Shows notifications when new events are created
- Persists notifications until they are read
- Displays a badge count for unread notifications
- Allows clearing all notifications

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

Let's add the package.json dependencies for bcryptjs and jsonwebtoken:

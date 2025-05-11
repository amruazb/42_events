# Events Management Application 

A comprehensive full-stack application for managing events with real-time updates, offline support, and a secure admin dashboard. Built with Next.js, MongoDB, and modern web technologies.

![Events Management Application](https://via.placeholder.com/1200x600?text=Events+Management+Application)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Authentication System](#authentication-system)
- [Offline Support](#offline-support)
- [Real-time Features](#real-time-features)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Events Management Application is a full-featured platform designed to create, manage, and showcase events. It provides both public-facing features for event attendees and administrative tools for event organizers. The application supports real-time updates, offline functionality, and secure authentication.

## Features

### Public Features

#### Event Discovery and Browsing
- **Events Dashboard**: A responsive dashboard displaying upcoming events with filtering and sorting options
- **Featured Events**: Highlighted events displayed prominently on the homepage
- **Search Functionality**: Full-text search across event titles, descriptions, and locations
- **Filtering System**: Filter events by date range, categories, and other attributes
- **Responsive Design**: Optimized for all device sizes from mobile to desktop

#### Event Details
- **Comprehensive Event Pages**: Detailed view of each event with all relevant information
- **Date and Time Display**: Clearly formatted event schedule information
- **Location Information**: Event venue details with optional map integration
- **Tags and Categories**: Visual indicators of event types and themes

#### User Experience
- **Dark/Light Mode**: Toggle between theme preferences with persistent settings
- **Offline Support**: Access previously viewed events even without an internet connection
- **Responsive Layout**: Optimized viewing experience across all device sizes
- **Accessibility Features**: ARIA-compliant components and keyboard navigation support

#### Export Functionality
- **CSV Export**: Download event data in CSV format for use in spreadsheet applications
- **Calendar Export**: Generate ICS files for importing events into calendar applications
- **Selective Export**: Choose specific events to include in exports

### Admin Features

#### Authentication System
- **Secure Login**: JWT-based authentication system with MongoDB user storage
- **Role-Based Access**: Different permission levels for administrators and regular users
- **Session Management**: Secure cookie-based session handling with expiration

#### Event Management
- **Create Events**: Comprehensive form for adding new events with validation
- **Edit Events**: Update existing event details with change tracking
- **Delete Events**: Remove events with confirmation to prevent accidental deletion
- **Bulk Operations**: Import multiple events via CSV upload

#### Admin Dashboard
- **Event Statistics**: Overview of total, upcoming, and monthly events
- **Admin Controls**: Centralized interface for all administrative functions
- **User Management**: View and manage user accounts and permissions

#### Notifications System
- **Admin Notifications**: System alerts for important actions and events
- **Notification Center**: Centralized location to view and manage all notifications
- **Read/Unread Status**: Track which notifications have been viewed

### Technical Features

#### Real-time Synchronization
- **Cross-Tab Sync**: Changes made in one browser tab reflect immediately in others
- **BroadcastChannel API**: Efficient communication between browser contexts
- **Optimistic UI Updates**: Interface updates immediately while changes save in background

#### Offline Capabilities
- **Service Worker Caching**: Core application assets and data cached for offline use
- **Offline Indicator**: Visual feedback when working in offline mode
- **Data Persistence**: Changes made offline sync when connection is restored

#### Data Management
- **MongoDB Integration**: Robust data storage with MongoDB
- **Data Validation**: Server-side and client-side validation for data integrity
- **Error Handling**: Comprehensive error management and user feedback

## Tech Stack

### Frontend
- **Next.js**: React framework for server-rendered applications
  - *Role*: Provides the foundation for the application, handling routing, server-side rendering, and API routes
- **React**: JavaScript library for building user interfaces
  - *Role*: Powers the component-based architecture of the application
- **TypeScript**: Typed superset of JavaScript
  - *Role*: Ensures type safety and improves developer experience
- **Tailwind CSS**: Utility-first CSS framework
  - *Role*: Handles styling throughout the application with a consistent design system
- **shadcn/ui**: Component library built on Radix UI
  - *Role*: Provides accessible, customizable UI components
- **Lucide React**: Icon library
  - *Role*: Supplies consistent, high-quality icons throughout the interface

### Backend
- **Next.js API Routes**: Server-side API endpoints
  - *Role*: Handles all server-side logic and database operations
- **MongoDB**: NoSQL database
  - *Role*: Stores all application data including events, users, and settings
- **Jose**: JavaScript Object Signing and Encryption library
  - *Role*: Handles JWT token creation and verification for authentication
- **bcryptjs**: Password hashing library
  - *Role*: Securely stores user passwords with salted hashing

### State Management & Data Fetching
- **React Context API**: State management solution
  - *Role*: Manages global application state like authentication and theme
- **SWR**: React Hooks for data fetching
  - *Role*: Handles data fetching, caching, and revalidation
- **Fetch API**: Browser API for making HTTP requests
  - *Role*: Communicates with backend API endpoints

### Authentication & Security
- **JWT (JSON Web Tokens)**: Token-based authentication
  - *Role*: Secures API routes and manages user sessions
- **Cookies**: Browser storage mechanism
  - *Role*: Stores authentication tokens securely
- **Next.js Middleware**: Request interception
  - *Role*: Protects routes and validates authentication

### Offline & Real-time Features
- **Service Workers**: Browser background scripts
  - *Role*: Enables offline functionality and caching
- **BroadcastChannel API**: Browser communication API
  - *Role*: Enables real-time synchronization between tabs
- **localStorage**: Browser storage API
  - *Role*: Persists user preferences and notification data

### Development Tools
- **ESLint**: JavaScript linter
  - *Role*: Ensures code quality and consistency
- **Prettier**: Code formatter
  - *Role*: Maintains consistent code style
- **npm/pnpm**: Package managers
  - *Role*: Manages project dependencies

## Project Structure

```
events-management-app/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── events/         # Event management endpoints
│   │   └── seed-init/      # Database seeding
│   ├── admin/              # Admin dashboard
│   ├── event/              # Event detail pages
│   ├── export/             # Export functionality
│   ├── offline/            # Offline fallback page
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout component
├── components/             # Reusable React components
│   ├── ui/                 # UI components (shadcn)
│   ├── admin-*.tsx         # Admin-specific components
│   ├── events-*.tsx        # Event-related components
│   ├── site-header.tsx     # Main navigation header
│   └── theme-*.tsx         # Theming components
├── hooks/                  # Custom React hooks
│   ├── use-auth.tsx        # Authentication hook
│   ├── use-broadcast-channel.tsx # Real-time sync hook
│   └── use-notifications.tsx # Notifications hook
├── lib/                    # Utility functions and libraries
│   ├── auth.ts             # Authentication utilities
│   ├── events.ts           # Event-related functions
│   ├── mongodb.ts          # Database connection
│   ├── sample-data.ts      # Seed data
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # General utilities
├── public/                 # Static assets
│   ├── sw.js               # Service Worker
│   └── manifest.json       # PWA manifest
├── middleware.ts           # Next.js middleware for auth
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Installation

### Prerequisites
- Node.js 16.8 or later
- npm or pnpm
- MongoDB instance (local or cloud)

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/yourusername/events-management-app.git
cd events-management-app
```

2. Install dependencies:


```shellscript
npm install
# or
pnpm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)
4. Run the development server:


```shellscript
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```plaintext
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=events
JWT_SECRET=your_secure_random_string
```

- `MONGODB_URI`: Connection string for your MongoDB instance
- `MONGODB_DB`: Name of the database to use
- `JWT_SECRET`: Secret key for signing JWT tokens (should be a secure random string)


## Usage

### Public User Flow

1. **Browse Events**: Visit the homepage to see upcoming events
2. **Search & Filter**: Use the search bar and filters to find specific events
3. **View Details**: Click on an event to see its detailed information
4. **Export Events**: Use the export page to download events in CSV or ICS format


### Admin User Flow

1. **Login**: Access the admin dashboard by clicking "Login" and entering credentials

1. Default admin credentials: username: `admin`, password: `admin`



2. **Manage Events**: Create, edit, or delete events from the admin dashboard
3. **Import Events**: Bulk import events using the CSV import feature
4. **View Statistics**: See event statistics and metrics on the admin dashboard


## API Documentation

### Authentication Endpoints

- `POST /api/auth/login`: Authenticate a user

- Request: `{ username: string, password: string }`
- Response: `{ user: User, token: string }`



- `GET /api/auth/me`: Get current user information

- Headers: `Authorization: Bearer <token>`
- Response: `{ user: User }`





### Event Endpoints

- `GET /api/events`: Get all events

- Response: `Event[]`



- `POST /api/events`: Create a new event

- Request: `{ title: string, description: string, date: string, location?: string, tags?: string[] }`
- Response: `Event`



- `GET /api/events/:id`: Get a specific event

- Response: `Event`



- `PUT /api/events/:id`: Update an event

- Request: `{ title?: string, description?: string, date?: string, location?: string, tags?: string[] }`
- Response: `Event`



- `DELETE /api/events/:id`: Delete an event

- Response: `{ success: boolean }`



- `POST /api/events/import`: Import events from CSV

- Request: `Event[]`
- Response: `{ success: boolean, insertedCount: number, insertedIds: string[] }`



- `GET /api/events/search`: Search events

- Query Parameters: `q` (search term), `startDate`, `endDate`
- Response: `Event[]`





## Authentication System

The application uses a JWT-based authentication system:

1. **User Storage**: User credentials are stored in MongoDB with passwords hashed using bcryptjs
2. **Token Generation**: When a user logs in, a JWT token is generated with user information
3. **Token Storage**: The token is stored in a cookie with a 7-day expiration
4. **Route Protection**: Protected routes check for a valid token using Next.js middleware
5. **Role-Based Access**: Admin routes verify the user has the admin role


### User Roles

- **Admin**: Full access to all features including the admin dashboard
- **User**: Access to public features only (not currently used, but system supports it)


## Offline Support

The application uses Service Workers to provide offline functionality:

1. **Asset Caching**: Core application assets are cached during the first visit
2. **Data Caching**: Event data is cached for offline access
3. **Offline Detection**: The application detects when the user is offline and shows appropriate UI
4. **Offline Fallback**: A dedicated offline page is shown when trying to access uncached content


## Real-time Features

The application implements real-time updates using the BroadcastChannel API:

1. **Cross-Tab Synchronization**: Changes made in one tab are reflected in all open tabs
2. **Event Types**:

1. `event-created`: When a new event is created
2. `event-updated`: When an event is updated
3. `event-deleted`: When an event is deleted
4. `events-imported`: When events are imported via CSV

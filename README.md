# 42 Abu Dhabi Event Management Web App

A full-stack multilingual Event Management Web Application for the 42 Abu Dhabi community, with support for Arabic, English, and French, using MongoDB for data storage and OAuth2 for authentication via the 42 API.

## Features

### User Functionality
- Home page showing upcoming events with title and date
- Event detail page with full multilingual description
- Real-time search and filtering of events
- Language switcher for Arabic (RTL), English, and French
- Events remain available offline (PWA cache)

### Admin Functionality
- Login securely via 42 OAuth
- Admin dashboard at: `https://42-events-iota.vercel.app/admin`
- Admin can create, edit, and delete events
- Admin can upload multiple events via CSV
- Admin can export events as CSV or .ics (calendar)
- All actions (create, edit, delete) synchronize in real-time across tabs
- Display a toast or notification popup when a new event is added

### Multilingual
- All content (titles, descriptions, UI) supports Arabic (RTL), French, and English using i18n

## Tech Stack

- **Frontend:** Next.js with React and Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Auth:** 42 OAuth2
- **Multilingual:** Custom i18n implementation
- **Real-time sync:** Socket.IO
- **Offline support:** PWA with Workbox

## Setup & Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/42-events.git
cd 42-events
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env.local` file with the following variables:
\`\`\`
MONGODB_URI=your_mongodb_connection_string
FORTYTWO_CLIENT_ID=your_42_client_id
FORTYTWO_CLIENT_SECRET=your_42_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

## OAuth Instructions

To set up 42 OAuth:

1. Register a new application on the 42 Intranet
2. Set the redirect URI to `https://your-domain.com/api/auth/callback/42-school`
3. Add the Client ID and Client Secret to your environment variables

## Deployment

The app is deployed on Vercel at: [https://42-events-iota.vercel.app](https://42-events-iota.vercel.app)

To deploy your own version:

1. Fork this repository
2. Connect it to your Vercel account
3. Add the environment variables in the Vercel dashboard
4. Deploy!

## Screenshots

![Home Page](/screenshots/home.png)
![Events Page](/screenshots/events.png)
![Event Details](/screenshots/event-details.png)
![Admin Dashboard](/screenshots/admin.png)

## License

MIT

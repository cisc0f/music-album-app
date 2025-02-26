# Music Album Collection Application

A full-stack music application built with Next.js that allows users to browse albums, save favorites, and manage their music collection.

## Features

- User authentication (register/login)
- Browse music albums with filtering by genre and artist
- Save favorite albums to your personal collection
- Responsive design for mobile and desktop
- Protected routes for authenticated users

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, pnpm, or bun
- MongoDB database (Atlas or local)

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/music-album-app.git
   cd music-album-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI="your_mongodb_connection_string"
   MONGODB_DB_NAME="music-app"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your_generated_secret"
   ```
   
   You can generate a secure NEXTAUTH_SECRET using:
   ```bash
   openssl rand -base64 32
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

This project is configured for continuous deployment with Vercel:

1. Push changes to the GitHub repository
2. Vercel automatically builds and deploys the updated application

To set up your own deployment:

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the repository in Vercel
4. Configure the following environment variables in the Vercel dashboard:
   - `MONGODB_URI`
   - `MONGODB_DB_NAME`
   - `NEXTAUTH_URL` (set to your production URL)
   - `NEXTAUTH_SECRET`
5. Deploy

## Key Design Decisions

### Architecture

- **Next.js App Router**: Utilized for server-side rendering and API routes in a single framework
- **API Design**: RESTful endpoints for albums and favorites management
- **Authentication**: NextAuth.js with JWT strategy and credentials provider
- **Database**: MongoDB for flexible document storage of user data and album information
- **Middleware**: Route protection for authenticated-only areas

### Security

- Password hashing with bcrypt
- Protected API routes with server-side session validation
- Environment variables for sensitive configuration
- JWT-based authentication with secure cookies

### Database Schema

- **Users Collection**: Stores user accounts with hashed passwords
- **Albums Collection**: Stores album information including artist, genre, and cover art
- **Favorites Collection**: Links users to their favorite albums

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoint
- `POST /api/register` - User registration

### Albums
- `GET /api/albums` - Get all albums with optional genre and artist filters

### Favorites
- `GET /api/favorites` - Get all favorites for the current user
- `POST /api/favorites` - Add an album to favorites
- `DELETE /api/favorites` - Remove all favorites for the current user
- `DELETE /api/favorites/:id` - Remove a specific favorite by ID

## Pages

- `/` - Home page with album listings
- `/login` - User login
- `/register` - User registration
- `/favorites` - User's favorite albums (protected route)

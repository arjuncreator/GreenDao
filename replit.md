# GreenDAO Lite

## Overview

GreenDAO Lite is a full-stack web application that combines environmental consciousness with decentralized governance. It serves as a comprehensive platform for eco-friendly activities, DAO voting, token tracking, and user progress monitoring. The application integrates Solana blockchain functionality for wallet connections and voting mechanisms, while providing educational content and gamification features to encourage sustainable practices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Blockchain Integration**: Solana Web3.js with Phantom wallet support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured route organization
- **Development Server**: Custom Vite integration for seamless full-stack development
- **Error Handling**: Centralized middleware with proper HTTP status codes

### Storage Strategy
- **Database**: PostgreSQL with Drizzle ORM
- **Development Storage**: In-memory storage implementation for rapid prototyping
- **Migration System**: Drizzle Kit for database schema management
- **Connection**: Neon Database serverless PostgreSQL (configured but not yet implemented)

## Key Components

### Wallet Integration
- Phantom wallet connection and management
- Solana blockchain interaction capabilities
- User authentication through wallet addresses
- Transaction signing for voting and other blockchain operations

### Tab-Based Interface
1. **Eco Coach**: Environmental tips, challenges, and educational content
2. **DAO Voting**: Proposal creation, voting, and governance features
3. **Token Trends**: Solana token price tracking and eco-alignment information
4. **Progress**: User achievements, leaderboards, and gamification

### Database Schema
- **Users**: Wallet addresses, eco points, streaks, achievements
- **Proposals**: DAO governance proposals with voting metrics
- **Votes**: Individual vote records with blockchain integration
- **Eco Tasks**: Completed environmental activities and point awards

### UI Component System
- Comprehensive shadcn/ui component library
- Consistent design system with eco-friendly color palette
- Responsive design optimized for mobile and desktop
- Accessible components following ARIA standards

## Data Flow

### User Authentication Flow
1. User connects Phantom wallet
2. Wallet address serves as unique identifier
3. User profile creation or retrieval from database
4. Session management through wallet connection state

### Voting Flow
1. User browses active DAO proposals
2. Wallet connection verification
3. Vote submission with blockchain transaction
4. Vote recording in database with transaction hash
5. Real-time proposal statistics updates

### Eco Activities Flow
1. User completes environmental tasks or challenges
2. Task completion verification (currently mock implementation)
3. EcoPoints awarded and user profile updated
4. Progress tracking and achievement unlocks
5. Leaderboard position updates

## External Dependencies

### Blockchain Services
- **Solana Web3.js**: Core blockchain interaction library
- **Phantom Wallet**: Primary wallet provider for user authentication
- **Neon Database**: Serverless PostgreSQL for production deployment

### Development Tools
- **Drizzle**: Type-safe ORM with PostgreSQL dialect
- **TanStack Query**: Server state management and caching
- **Zod**: Runtime type validation and schema definition
- **Replit Integration**: Development environment optimizations

### UI Libraries
- **Radix UI**: Unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Consistent icon library
- **class-variance-authority**: Component variant management

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **Database**: In-memory storage for rapid iteration
- **Blockchain**: Solana devnet for testing
- **Port Configuration**: Express server on port 5000

### Production Deployment
- **Build Process**: Vite production build with Express server bundling
- **Database**: PostgreSQL with Drizzle migrations
- **Blockchain**: Solana mainnet integration
- **Static Assets**: Optimized and bundled client-side code
- **Autoscale Deployment**: Configured for Replit's autoscale infrastructure

### Environment Configuration
- Database URL through environment variables
- Blockchain network configuration
- Development vs production feature flags
- Build optimization for different deployment targets

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout the stack, and a focus on user experience in the web3 environmental space.
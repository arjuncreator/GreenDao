# GreenDAO Lite

A full-stack web application that combines environmental consciousness with decentralized governance. GreenDAO Lite serves as a comprehensive platform for eco-friendly activities, DAO voting, token tracking, and user progress monitoring, all integrated with Solana blockchain functionality.

## 🌱 Features

### 🔗 Wallet Integration
- Phantom wallet connection and authentication
- Solana blockchain interaction capabilities
- User authentication through wallet addresses
- Transaction signing for voting and blockchain operations

### 🎯 Tab-Based Interface
1. Eco Coach: Environmental tips, challenges, and educational content with AI assistant
2. DAO Voting: Proposal creation, voting, and governance features
3. Token Trends: Solana token price tracking and eco-alignment information
4. Progress: User achievements, leaderboards, and gamification

### 🤖 AI-Powered Features
- Eco Chat Assistant for sustainability questions
- Dynamic eco tips generation
- Personalized environmental recommendations

### 🏆 Gamification
- EcoPoints system for user engagement
- Achievement badges and streaks
- Community leaderboards
- Progress tracking and rewards

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and optimized builds
- Wouter for lightweight client-side routing
- shadcn/ui components built on Radix UI primitives
- Tailwind CSS with custom design system
- TanStack Query for server state management
- Solana Web3.js with Phantom wallet support

### Backend
- Node.js with Express.js framework
- TypeScript with ES modules
- RESTful API with structured route organization
- Drizzle ORM with PostgreSQL
- In-memory storage for development

### Blockchain
- Solana Web3.js for blockchain interactions
- Phantom Wallet integration
- Devnet/Mainnet support

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Phantom wallet browser extension

### Installation

1. Clone the repository:
git clone <repository-url>
cd greendao-lite
2. Install dependencies:
npm install
3. Start the development server:
npm run dev
The application will be available at http://localhost:5000

### Available Scripts

- npm run dev - Start development server with hot reload
- npm run build - Build for production
- npm run start - Start production server
- npm run check - TypeScript type checking
- npm run db:push - Push database schema changes

## 🏗️ Project Structure

├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── *.tsx       # Tab components and features
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and services
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main app component
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data persistence layer
│   └── vite.ts            # Vite integration
├── shared/                # Shared types and schemas
└── README.md


## 🔧 Configuration

### Environment Variables
Create a .env file in the root directory:

# Database (for production)
DATABASE_URL=your_postgresql_connection_string

# Sensay AI Integration
SENSAY_ORG_SECRET=your_sensay_org_secret
SENSAY_REPLICA_ID=your_replica_id
### Blockchain Configuration
The app supports both Solana devnet and mainnet. Configure in client/src/lib/solana.ts:

- Development: Uses Solana devnet
- Production: Uses Solana mainnet

## 📱 Key Components

### Wallet Provider
Manages wallet connection state and user authentication:
- Automatic wallet connection detection
- User profile creation and retrieval
- Session management through wallet state
  ### Eco Coach Tab
- Environmental tips and challenges
- AI-powered eco assistant
- Task completion and point rewards
- Educational content delivery

### DAO Voting Tab
- Proposal creation and management
- Voting mechanism with blockchain integration
- Real-time proposal statistics
- Community governance features

### Token Trends Tab
- Solana token price tracking
- Eco-alignment scoring for tokens
- Market data visualization
- Environmental impact metrics

### Progress Tab
- User achievement system
- Community leaderboards
- Streak tracking and rewards
- Progress visualization

## 🗄️ Database Schema

### Users
- Wallet addresses as unique identifiers
- EcoPoints and streak tracking
- Achievement progress
- Task completion history

### Proposals
- DAO governance proposals
- Voting metrics and results
- Author and timestamp tracking
- Category classification

### Votes
- Individual vote records
- Blockchain transaction hashes
- Proposal associations
- Voter identification

## 🚀 Deployment

### Development
The app runs on port 5000 in development with Vite's dev server providing hot module replacement.

### Production (Replit)
1. The app is configured for Replit's autoscale deployment
2. Build process: npm run build
3. Production server: npm run start
4. Database: PostgreSQL with Drizzle migrations
5. Static assets are optimized and bundled

### Deployment Configuration
The .replit file is configured for automatic deployment:
- Build command: npm run build
- Run command: npm run start
- Port forwarding: 5000 → 80/443

## 🔐 Security

- Wallet-based authentication eliminates password management
- Client-side transaction signing
- Server-side validation for all API endpoints
- Environment variable protection for sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: git checkout -b feature/amazing-feature
3. Commit changes: git commit -m 'Add amazing feature'
4. Push to branch: git push origin feature/amazing-feature
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Solana Documentation](https://docs.solana.com/)
- [Phantom Wallet](https://phantom.app/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)

## 🐛 Troubleshooting

### Common Issues

Wallet Connection Issues:
- Ensure Phantom wallet is installed and unlocked
- Check browser console for connection errors
- Verify network configuration (devnet/mainnet)

API Errors:
- Check server logs for detailed error messages
- Verify environment variables are properly set
- Ensure database connection is established

Build Issues:
- Clear node_modules and reinstall: rm -rf node_modules && npm install
- Check TypeScript errors: npm run check
- Verify all dependencies are compatible

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review the Replit console logs for error details

---

Built with 💚 for a sustainable future

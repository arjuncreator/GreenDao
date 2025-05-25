import { apiRequest } from "./queryClient";

export interface EcoTip {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  daysLeft: number;
  progress: number;
  totalDays: number;
}

export interface SolanaToken {
  instId: string;
  last: string;
  lastSz: string;
  askPx: string;
  askSz: string;
  bidPx: string;
  bidSz: string;
  open24h: string;
  high24h: string;
  low24h: string;
  volCcy24h: string;
  vol24h: string;
  sodUtc0: string;
  sodUtc8: string;
  ts: string;
}

export const api = {
  // User operations
  getUser: async (walletAddress: string) => {
    const response = await apiRequest("GET", `/api/user/${walletAddress}`);
    return response.json();
  },

  createUser: async (userData: { walletAddress: string; username?: string }) => {
    const response = await apiRequest("POST", "/api/user", userData);
    return response.json();
  },

  getLeaderboard: async (limit = 10) => {
    const response = await apiRequest("GET", `/api/leaderboard?limit=${limit}`);
    return response.json();
  },

  // Proposal operations
  getProposals: async () => {
    const response = await apiRequest("GET", "/api/proposals");
    return response.json();
  },

  createProposal: async (proposalData: {
    title: string;
    description: string;
    category: string;
    authorWallet: string;
    endDate: Date;
  }) => {
    const response = await apiRequest("POST", "/api/proposals", proposalData);
    return response.json();
  },

  // Vote operations
  vote: async (voteData: {
    proposalId: number;
    voterWallet: string;
    vote: boolean;
    transactionHash?: string;
  }) => {
    const response = await apiRequest("POST", "/api/vote", voteData);
    return response.json();
  },

  getUserVote: async (proposalId: number, walletAddress: string) => {
    const response = await apiRequest("GET", `/api/vote/${proposalId}/${walletAddress}`);
    return response.json();
  },

  // Eco task operations
  completeEcoTask: async (taskData: {
    userWallet: string;
    taskType: string;
    taskId: string;
    pointsAwarded: number;
  }) => {
    const response = await apiRequest("POST", "/api/eco-task", taskData);
    return response.json();
  },

  // External API data
  getEcoTips: async (): Promise<EcoTip[]> => {
    const response = await apiRequest("GET", "/api/eco-tips");
    return response.json();
  },

  getWeeklyChallenge: async (): Promise<WeeklyChallenge> => {
    const response = await apiRequest("GET", "/api/weekly-challenge");
    return response.json();
  },

  getSolanaTokens: async (): Promise<SolanaToken[]> => {
    const response = await apiRequest("GET", "/api/solana-tokens");
    return response.json();
  },
};

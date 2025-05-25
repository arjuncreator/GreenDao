import { users, proposals, votes, ecoTasks, type User, type InsertUser, type Proposal, type InsertProposal, type Vote, type InsertVote, type EcoTask, type InsertEcoTask } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserEcoPoints(walletAddress: string, points: number): Promise<User | undefined>;
  updateUserStreak(walletAddress: string, streak: number): Promise<User | undefined>;
  getLeaderboard(limit?: number): Promise<User[]>;

  // Proposal operations
  getProposals(): Promise<Proposal[]>;
  getProposal(id: number): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposalVotes(id: number, yesVotes: number, noVotes: number): Promise<Proposal | undefined>;

  // Vote operations
  createVote(vote: InsertVote): Promise<Vote>;
  getUserVote(proposalId: number, voterWallet: string): Promise<Vote | undefined>;
  getProposalVotes(proposalId: number): Promise<Vote[]>;

  // Eco task operations
  createEcoTask(task: InsertEcoTask): Promise<EcoTask>;
  getUserTasks(userWallet: string): Promise<EcoTask[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private proposals: Map<number, Proposal>;
  private votes: Map<string, Vote>;
  private ecoTasks: Map<string, EcoTask>;
  private currentUserId: number;
  private currentProposalId: number;
  private currentVoteId: number;
  private currentTaskId: number;

  constructor() {
    this.users = new Map();
    this.proposals = new Map();
    this.votes = new Map();
    this.ecoTasks = new Map();
    this.currentUserId = 1;
    this.currentProposalId = 1;
    this.currentVoteId = 1;
    this.currentTaskId = 1;
  }

  async getUser(walletAddress: string): Promise<User | undefined> {
    return this.users.get(walletAddress);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      ecoPoints: insertUser.ecoPoints || 0,
      streak: insertUser.streak || 0,
      completedTasks: insertUser.completedTasks || 0,
      achievements: insertUser.achievements || [],
      createdAt: new Date()
    };
    this.users.set(user.walletAddress, user);
    return user;
  }

  async updateUserEcoPoints(walletAddress: string, points: number): Promise<User | undefined> {
    const user = this.users.get(walletAddress);
    if (user) {
      user.ecoPoints = (user.ecoPoints || 0) + points;
      this.users.set(walletAddress, user);
      return user;
    }
    return undefined;
  }

  async updateUserStreak(walletAddress: string, streak: number): Promise<User | undefined> {
    const user = this.users.get(walletAddress);
    if (user) {
      user.streak = streak;
      this.users.set(walletAddress, user);
      return user;
    }
    return undefined;
  }

  async getLeaderboard(limit: number = 10): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => (b.ecoPoints || 0) - (a.ecoPoints || 0))
      .slice(0, limit);
  }

  async getProposals(): Promise<Proposal[]> {
    return Array.from(this.proposals.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getProposal(id: number): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = this.currentProposalId++;
    const proposal: Proposal = {
      ...insertProposal,
      id,
      yesVotes: 0,
      noVotes: 0,
      isActive: true,
      createdAt: new Date()
    };
    this.proposals.set(id, proposal);
    return proposal;
  }

  async updateProposalVotes(id: number, yesVotes: number, noVotes: number): Promise<Proposal | undefined> {
    const proposal = this.proposals.get(id);
    if (proposal) {
      proposal.yesVotes = yesVotes;
      proposal.noVotes = noVotes;
      this.proposals.set(id, proposal);
      return proposal;
    }
    return undefined;
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = this.currentVoteId++;
    const vote: Vote = {
      ...insertVote,
      id,
      createdAt: new Date()
    };
    const key = `${vote.proposalId}-${vote.voterWallet}`;
    this.votes.set(key, vote);
    return vote;
  }

  async getUserVote(proposalId: number, voterWallet: string): Promise<Vote | undefined> {
    const key = `${proposalId}-${voterWallet}`;
    return this.votes.get(key);
  }

  async getProposalVotes(proposalId: number): Promise<Vote[]> {
    return Array.from(this.votes.values()).filter(vote => vote.proposalId === proposalId);
  }

  async createEcoTask(insertTask: InsertEcoTask): Promise<EcoTask> {
    const id = this.currentTaskId++;
    const task: EcoTask = {
      ...insertTask,
      id,
      completedAt: new Date()
    };
    this.ecoTasks.set(id.toString(), task);
    return task;
  }

  async getUserTasks(userWallet: string): Promise<EcoTask[]> {
    return Array.from(this.ecoTasks.values()).filter(task => task.userWallet === userWallet);
  }
}

export const storage = new MemStorage();

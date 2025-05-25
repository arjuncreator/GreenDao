import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProposalSchema, insertVoteSchema, insertEcoTaskSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUser(walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/user", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUser(userData.walletAddress);
      if (existingUser) {
        return res.json(existingUser);
      }
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Proposal routes
  app.get("/api/proposals", async (req, res) => {
    try {
      const proposals = await storage.getProposals();
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/proposals", async (req, res) => {
    try {
      const proposalData = insertProposalSchema.parse(req.body);
      const proposal = await storage.createProposal(proposalData);
      res.status(201).json(proposal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid proposal data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Vote routes
  app.post("/api/vote", async (req, res) => {
    try {
      const voteData = insertVoteSchema.parse(req.body);
      
      // Check if user already voted
      const existingVote = await storage.getUserVote(voteData.proposalId, voteData.voterWallet);
      if (existingVote) {
        return res.status(400).json({ message: "User has already voted on this proposal" });
      }

      // Create vote
      const vote = await storage.createVote(voteData);

      // Update proposal vote counts
      const proposalVotes = await storage.getProposalVotes(voteData.proposalId);
      const yesVotes = proposalVotes.filter(v => v.vote === true).length;
      const noVotes = proposalVotes.filter(v => v.vote === false).length;
      
      await storage.updateProposalVotes(voteData.proposalId, yesVotes, noVotes);

      res.status(201).json(vote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vote data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/vote/:proposalId/:walletAddress", async (req, res) => {
    try {
      const { proposalId, walletAddress } = req.params;
      const vote = await storage.getUserVote(parseInt(proposalId), walletAddress);
      res.json(vote);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Eco task routes
  app.post("/api/eco-task", async (req, res) => {
    try {
      const taskData = insertEcoTaskSchema.parse(req.body);
      const task = await storage.createEcoTask(taskData);
      
      // Award points to user
      await storage.updateUserEcoPoints(taskData.userWallet, taskData.pointsAwarded);
      
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // External API proxy routes
  app.get("/api/eco-tips", async (req, res) => {
    try {
      const orgSecret = process.env.SENSAY_API_KEY || "248db721af4e0a8bbe1af1861dbf0578aa637339b77741b53b9db89a3ae7fbee";
      const replicaId = "eac2f68c-8032-4d5b-9be3-b72ea52f6106";
      
      // Generate 3 different eco tips
      const tips = [];
      const prompts = [
        "Give me a practical eco-friendly tip for reducing plastic waste at home.",
        "Share an energy-saving tip that I can implement today.",
        "Suggest a sustainable transportation option for daily commutes."
      ];

      for (let i = 0; i < prompts.length; i++) {
        const response = await fetch(`https://api.sensay.io/v1/replicas/${replicaId}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-ORGANIZATION-SECRET': orgSecret,
            'X-API-Version': '2025-03-25',
            'X-USER-ID': 'bae0fddf-43e9-4d27-96d1-2d11da93a873'
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: prompts[i]
              }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`Sensay API error: ${response.status}`);
        }

        const data = await response.json();
        tips.push({
          id: `tip-${i + 1}`,
          title: `Green Tip ${i + 1}`,
          description: data.message?.content || "Reduce your environmental impact with small daily changes.",
          category: ["Waste Reduction", "Energy", "Transportation"][i],
          points: 10
        });
      }

      res.json(tips);
    } catch (error) {
      console.error("Error fetching eco tips:", error);
      res.status(500).json({ message: "Failed to fetch eco tips" });
    }
  });

  app.get("/api/weekly-challenge", async (req, res) => {
    try {
      const orgSecret = process.env.SENSAY_API_KEY || "248db721af4e0a8bbe1af1861dbf0578aa637339b77741b53b9db89a3ae7fbee";
      const replicaId = "eac2f68c-8032-4d5b-9be3-b72ea52f6106";
      
      const response = await fetch(`https://api.sensay.io/v1/replicas/${replicaId}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-ORGANIZATION-SECRET': orgSecret,
          'X-API-Version': '2025-03-25',
          'X-USER-ID': 'bae0fddf-43e9-4d27-96d1-2d11da93a873'
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: "Create a weekly eco-challenge that encourages sustainable living. Include a title, description, and focus on actionable steps people can take."
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Sensay API error: ${response.status}`);
      }

      const data = await response.json();
      const challengeText = data.message?.content || "Zero Waste Week: Try to produce zero waste for an entire week.";
      
      res.json({
        id: "weekly-challenge",
        title: "This Week's Green Challenge",
        description: challengeText,
        reward: 500,
        daysLeft: 5,
        progress: 2,
        totalDays: 7
      });
    } catch (error) {
      console.error("Error fetching weekly challenge:", error);
      res.status(500).json({ message: "Failed to fetch weekly challenge" });
    }
  });

  // AI Chat Assistant route
  app.post("/api/eco-chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const orgSecret = process.env.SENSAY_API_KEY || "248db721af4e0a8bbe1af1861dbf0578aa637339b77741b53b9db89a3ae7fbee";
      const replicaId = "eac2f68c-8032-4d5b-9be3-b72ea52f6106";
      
      const response = await fetch(`https://api.sensay.io/v1/replicas/${replicaId}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-ORGANIZATION-SECRET': orgSecret,
          'X-API-Version': '2025-03-25',
          'X-USER-ID': 'bae0fddf-43e9-4d27-96d1-2d11da93a873'
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Sensay API error: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error in eco chat:", error);
      res.status(500).json({ message: "Failed to chat with eco-coach" });
    }
  });

  app.get("/api/solana-tokens", async (req, res) => {
    try {
      const apiKey = process.env.OKX_API_KEY || "2e470507-8ee7-48dd-b1d0-dda06e3a06a2";
      
      const response = await fetch("https://www.okx.com/api/v5/market/tickers?instType=SPOT", {
        headers: {
          'OK-ACCESS-KEY': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`OKX API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Filter for Solana-related tokens
      const solanaTokens = data.data?.filter((token: any) => 
        token.instId?.includes('SOL') || 
        token.instId?.includes('RAY') || 
        token.instId?.includes('USDC')
      ) || [];

      res.json(solanaTokens.slice(0, 10)); // Return top 10
    } catch (error) {
      console.error("Error fetching Solana tokens:", error);
      res.status(500).json({ message: "Failed to fetch token data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

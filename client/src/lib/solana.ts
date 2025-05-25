import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Solana connection configuration
const SOLANA_NETWORK = "https://api.devnet.solana.com";
const connection = new Connection(SOLANA_NETWORK, "confirmed");

export interface PhantomWallet {
  isPhantom: boolean;
  publicKey: PublicKey | null;
  isConnected: boolean;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
}

export class SolanaService {
  private wallet: PhantomWallet | null = null;

  constructor() {
    this.wallet = this.getPhantomWallet();
  }

  private getPhantomWallet(): PhantomWallet | null {
    if (typeof window !== "undefined" && window.solana?.isPhantom) {
      return window.solana as PhantomWallet;
    }
    return null;
  }

  isWalletAvailable(): boolean {
    return this.wallet !== null;
  }

  async connectWallet(): Promise<string | null> {
    if (!this.wallet) {
      throw new Error("Phantom wallet not found. Please install Phantom wallet.");
    }

    try {
      const response = await this.wallet.connect();
      return response.publicKey.toString();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw new Error("Failed to connect to Phantom wallet");
    }
  }

  async disconnectWallet(): Promise<void> {
    if (this.wallet) {
      await this.wallet.disconnect();
    }
  }

  getConnectedWallet(): string | null {
    return this.wallet?.publicKey?.toString() || null;
  }

  isConnected(): boolean {
    return this.wallet?.isConnected || false;
  }

  async getBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error("Failed to get balance:", error);
      return 0;
    }
  }

  async createVoteTransaction(proposalId: number, vote: boolean): Promise<string> {
    if (!this.wallet?.publicKey) {
      throw new Error("Wallet not connected");
    }

    try {
      // Create a simple transaction that encodes the vote in the memo
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: this.wallet.publicKey, // Self-transfer for demo
          lamports: 1, // Minimal amount
        })
      );

      // Add vote data as memo (in a real implementation, this would be a proper program call)
      const voteData = JSON.stringify({ proposalId, vote, timestamp: Date.now() });
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.wallet.publicKey;

      // Sign and send transaction
      const signedTransaction = await this.wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      // Wait for confirmation
      await connection.confirmTransaction(signature);
      
      return signature;
    } catch (error) {
      console.error("Failed to create vote transaction:", error);
      throw new Error("Failed to submit vote on blockchain");
    }
  }
}

// Global Solana service instance
export const solanaService = new SolanaService();

// Type declaration for window.solana
declare global {
  interface Window {
    solana?: {
      isPhantom: boolean;
      publicKey: PublicKey | null;
      isConnected: boolean;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
      signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
    };
  }
}


import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { solanaService } from "@/lib/solana";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface WalletContextType {
  walletAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  user: any;
}

const WalletContext = createContext<WalletContextType>({
  walletAddress: null,
  isConnected: false,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  user: null,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      if (solanaService.isConnected()) {
        const address = solanaService.getConnectedWallet();
        if (address) {
          setWalletAddress(address);
          setIsConnected(true);
          await loadUser(address);
        }
      }
    };

    checkConnection();
  }, []);

  const loadUser = async (address: string) => {
    try {
      let userData = await api.getUser(address);
      if (!userData) {
        userData = await api.createUser({ walletAddress: address });
      }
      if (!userData) {
        throw new Error("Failed to load or create user profile");
      }
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user:", error);
      toast({
        title: "Profile Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const connectWallet = async () => {
    if (!solanaService.isWalletAvailable()) {
      window.open("https://phantom.app/", "_blank");
      toast({
        title: "Phantom Wallet Required",
        description: "Please install Phantom wallet and refresh the page.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const address = await solanaService.connectWallet();
      if (!address) {
        throw new Error("No wallet address returned");
      }
      setWalletAddress(address);
      setIsConnected(true);
      await loadUser(address);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Phantom wallet.",
      });
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      setWalletAddress(null);
      setIsConnected(false);
      setUser(null);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to Phantom wallet.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await solanaService.disconnectWallet();
      setWalletAddress(null);
      setIsConnected(false);
      setUser(null);
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from wallet.",
      });
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnected,
        isConnecting,
        connectWallet,
        disconnectWallet,
        user,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

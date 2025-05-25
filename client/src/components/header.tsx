import { Button } from "@/components/ui/button";
import { useWallet } from "./wallet-provider";
import { Leaf, Wallet, Loader2 } from "lucide-react";

export function Header() {
  const { walletAddress, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Leaf className="text-white text-sm" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">GreenDAO Lite</h1>
          </div>
          
          <Button
            onClick={isConnected ? disconnectWallet : connectWallet}
            disabled={isConnecting}
            className={`font-medium transition-colors duration-200 flex items-center space-x-2 ${
              isConnected 
                ? "bg-gray-600 hover:bg-gray-700" 
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            <span>
              {isConnecting 
                ? "Connecting..." 
                : isConnected 
                  ? formatWalletAddress(walletAddress!) 
                  : "Connect Wallet"
              }
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}

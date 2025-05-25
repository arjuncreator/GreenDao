import { useState } from "react";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { EcoCoachTab } from "@/components/eco-coach-tab";
import { DAOVotingTab } from "@/components/dao-voting-tab";
import { TokenTrendsTab } from "@/components/token-trends-tab";
import { ProgressTab } from "@/components/progress-tab";
import { WalletProvider } from "@/components/wallet-provider";

export default function Home() {
  const [activeTab, setActiveTab] = useState("eco-coach");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "eco-coach":
        return <EcoCoachTab />;
      case "dao-voting":
        return <DAOVotingTab />;
      case "token-trends":
        return <TokenTrendsTab />;
      case "progress":
        return <ProgressTab />;
      default:
        return <EcoCoachTab />;
    }
  };

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
          {renderActiveTab()}
        </main>
        
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </WalletProvider>
  );
}

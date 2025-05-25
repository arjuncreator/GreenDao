import { Leaf, Vote, Coins, Trophy } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "eco-coach", label: "Eco Coach", icon: Leaf },
    { id: "dao-voting", label: "DAO Voting", icon: Vote },
    { id: "token-trends", label: "Tokens", icon: Coins },
    { id: "progress", label: "Progress", icon: Trophy },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? "text-green-500 bg-green-50" 
                    : "text-gray-500 hover:text-green-500"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

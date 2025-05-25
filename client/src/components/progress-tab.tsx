import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useWallet } from "./wallet-provider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Flame, CheckCircle, Crown, Zap } from "lucide-react";

export function ProgressTab() {
  const { user, walletAddress } = useWallet();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/leaderboard"],
    refetchInterval: 60000, // Refresh every minute
  });

  const achievements = [
    {
      id: "green_starter",
      name: "Green Starter",
      description: "Complete 5 eco tips",
      icon: "seedling",
      unlocked: (user?.completedTasks || 0) >= 5,
      color: "bg-green-100 text-green-600"
    },
    {
      id: "democracy_champion",
      name: "Democracy Champion", 
      description: "Cast 10 DAO votes",
      icon: "vote",
      unlocked: false, // Would check voting history
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: "zero_waste_hero",
      name: "Zero Waste Hero",
      description: "Complete weekly challenge",
      icon: "recycle",
      unlocked: false, // Would check challenge completion
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: "eco_master",
      name: "Eco Master",
      description: "Earn 2000 points",
      icon: "leaf",
      unlocked: (user?.ecoPoints || 0) >= 2000,
      color: "bg-amber-100 text-amber-600"
    }
  ];

  const getAchievementIcon = (icon: string, unlocked: boolean) => {
    const iconClass = unlocked ? "w-6 h-6" : "w-6 h-6 opacity-50";

    switch (icon) {
      case "seedling":
        return <Zap className={iconClass} />;
      case "vote":
        return <CheckCircle className={iconClass} />;
      case "recycle":
        return <Trophy className={iconClass} />;
      case "leaf":
        return <Medal className={iconClass} />;
      default:
        return <Medal className={iconClass} />;
    }
  };

  const formatWalletAddress = (address: string) => {
    return `@${address.slice(0, 8)}.sol`;
  };

  const getUserRank = () => {
    if (!leaderboard || !walletAddress) return null;
    const userIndex = leaderboard.findIndex((u: any) => u.walletAddress === walletAddress);
    return userIndex >= 0 ? userIndex + 1 : null;
  };

  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["user", walletAddress],
    queryFn: () => api.getUser(walletAddress || ""),
    enabled: !!walletAddress
  });

  if (userLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (userError) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          <h3 className="font-semibold">Error loading profile</h3>
          <p className="text-sm">Please try refreshing the page</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Progress</h2>
        <p className="text-gray-600">Track your EcoPoints and see how you rank in the community</p>
      </div>

      {/* User Stats Card */}
      <Card className="eco-gradient p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-1">
              {user?.ecoPoints?.toLocaleString() || 0} EcoPoints
            </h3>
            <p className="text-green-200 mb-4">
              {getUserRank() ? `Rank #${getUserRank()} in community` : "Join the leaderboard!"}
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Flame className="text-amber-300 w-4 h-4" />
                <span className="text-sm">{user?.streak || 0} day streak</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-200 w-4 h-4" />
                <span className="text-sm">{user?.completedTasks || 0} tasks completed</span>
              </div>
            </div>
          </div>
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Trophy className="text-amber-300 w-10 h-10" />
          </div>
        </div>
      </Card>

      {/* Achievement Badges */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Medal className="text-amber-500 mr-2 w-5 h-5" />
          Recent Achievements
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`p-4 text-center border ${achievement.unlocked ? '' : 'opacity-50'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${achievement.color}`}>
                {getAchievementIcon(achievement.icon, achievement.unlocked)}
              </div>
              <h4 className={`font-medium text-sm mb-1 ${achievement.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                {achievement.name}
              </h4>
              <p className={`text-xs ${achievement.unlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                {achievement.description}
              </p>
              {achievement.unlocked && (
                <Badge className="mt-2 bg-green-100 text-green-800 text-xs">
                  Unlocked
                </Badge>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Crown className="text-amber-500 mr-2 w-5 h-5" />
          Community Leaderboard
        </h3>

        <Card className="border border-gray-100">
          {isLoading ? (
            <div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : leaderboard?.length > 0 ? (
            <div>
              {leaderboard.slice(0, 10).map((user: any, index: number) => {
                const isCurrentUser = user.walletAddress === walletAddress;
                const rank = index + 1;

                return (
                  <div 
                    key={user.walletAddress}
                    className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 ${
                      isCurrentUser ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                        rank === 1 
                          ? 'bg-amber-100 text-amber-600' 
                          : isCurrentUser 
                            ? 'bg-green-200 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {rank === 1 && <Crown className="w-4 h-4" />}
                        {rank !== 1 && rank}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {isCurrentUser ? 'You' : formatWalletAddress(user.walletAddress)}
                        </h4>
                        <p className="text-sm text-gray-500">{user.streak || 0} day streak</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {(user.ecoPoints || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">EcoPoints</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No Rankings Yet</h3>
              <p className="text-gray-600">
                Complete eco tasks to appear on the leaderboard!
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
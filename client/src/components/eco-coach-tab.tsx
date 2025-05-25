import { useWallet } from "./wallet-provider";
import { EcoChatAssistant } from "./eco-chat-assistant";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Sprout, Bike, Zap, Trophy, CheckCircle, Calendar, Coins, Recycle, MessageCircle, Leaf, Globe, Heart } from "lucide-react";

export function EcoCoachTab() {
  const { walletAddress } = useWallet();
  const { toast } = useToast();

  const handleCompleteTask = async (taskName: string, points: number) => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to complete tasks.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Task Completed!",
      description: `You earned ${points} EcoPoints for completing: ${taskName}`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Eco Coach</h2>
        <p className="text-gray-600">Chat with your AI assistant for personalized environmental advice</p>
      </div>

      {/* Featured AI Chat Assistant */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-1 rounded-lg border border-green-200">
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle className="text-green-500 w-6 h-6" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Eco Assistant</h3>
              <p className="text-sm text-gray-600">Ask questions about sustainability and green living</p>
            </div>
          </div>
          <EcoChatAssistant />
        </div>
      </div>

      {/* Quick Eco Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="text-amber-500 mr-2 w-5 h-5" />
          Quick Eco Actions
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="eco-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Recycle className="text-green-600 w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">Reduce Plastic Usage</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Switch to reusable water bottles and shopping bags to reduce single-use plastic consumption.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">Waste Reduction</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCompleteTask("Reduce Plastic Usage", 10)}
                    className="text-amber-500 hover:text-amber-600 p-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="eco-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bike className="text-blue-600 w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">Use Green Transportation</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Walk, bike, or use public transport instead of driving to reduce your carbon footprint.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-600 font-medium">Transportation</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCompleteTask("Green Transportation", 15)}
                    className="text-amber-500 hover:text-amber-600 p-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="eco-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="text-yellow-600 w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">Save Energy at Home</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Turn off lights and unplug devices when not in use to conserve energy.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-yellow-600 font-medium">Energy</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCompleteTask("Save Energy", 12)}
                    className="text-amber-500 hover:text-amber-600 p-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* This Week's Challenge */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Trophy className="text-amber-500 mr-2 w-5 h-5" />
          This Week's Challenge
        </h3>
        
        <Card className="eco-gradient p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-xl font-bold mb-2">Zero Waste Week</h4>
              <p className="text-green-100 mb-4 leading-relaxed">
                Try to produce zero waste for an entire week. Focus on reusing, recycling, and choosing products with minimal packaging.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-green-200 w-4 h-4" />
                  <span className="text-sm text-green-200">5 days left</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Coins className="text-amber-300 w-4 h-4" />
                  <span className="text-sm font-medium">+500 EcoPoints</span>
                </div>
              </div>
            </div>
            <div className="ml-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Recycle className="text-white w-8 h-8" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-green-200">Progress</span>
              <span className="text-sm font-medium">2/7 days</span>
            </div>
            <div className="w-full bg-green-500 bg-opacity-30 rounded-full h-2">
              <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: "29%" }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Eco Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
            <Leaf className="text-green-600 w-6 h-6" />
          </div>
          <h4 className="font-semibold text-gray-900">Carbon Saved</h4>
          <p className="text-2xl font-bold text-green-600">2.4 kg</p>
          <p className="text-xs text-gray-500">This month</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
            <Globe className="text-blue-600 w-6 h-6" />
          </div>
          <h4 className="font-semibold text-gray-900">EcoPoints</h4>
          <p className="text-2xl font-bold text-blue-600">1,250</p>
          <p className="text-xs text-gray-500">Total earned</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
            <Heart className="text-purple-600 w-6 h-6" />
          </div>
          <h4 className="font-semibold text-gray-900">Streak</h4>
          <p className="text-2xl font-bold text-purple-600">12</p>
          <p className="text-xs text-gray-500">Days active</p>
        </Card>
      </div>
    </div>
  );
}
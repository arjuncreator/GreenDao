import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useWallet } from "./wallet-provider";
import { solanaService } from "@/lib/solana";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Vote, Plus, ThumbsUp, ThumbsDown, Calendar, Users } from "lucide-react";

export function DAOVotingTab() {
  const { walletAddress } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    category: "",
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
  });

  const { data: proposals, isLoading } = useQuery({
    queryKey: ["/api/proposals"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const createProposalMutation = useMutation({
    mutationFn: api.createProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
      setIsProposalModalOpen(false);
      setNewProposal({ title: "", description: "", category: "", endDate: "" });
      toast({
        title: "Proposal Created",
        description: "Your proposal has been submitted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create proposal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const voteMutation = useMutation({
    mutationFn: api.vote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded on the blockchain!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateProposal = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create proposals.",
        variant: "destructive",
      });
      return;
    }

    if (!newProposal.title || !newProposal.description || !newProposal.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a proposal.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createProposalMutation.mutateAsync({
        ...newProposal,
        authorWallet: walletAddress,
        endDate: new Date(newProposal.endDate),
      });
      
      setIsProposalModalOpen(false);
      setNewProposal({
        title: "",
        description: "",
        category: "",
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      
      toast({
        title: "Success",
        description: "Proposal created successfully",
      });
    } catch (error) {
      console.error("Failed to create proposal:", error);
      toast({
        title: "Error",
        description: "Failed to create proposal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVote = async (proposalId: number, vote: boolean) => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to vote.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create blockchain transaction for the vote
      const transactionHash = await solanaService.createVoteTransaction(proposalId, vote);
      
      // Submit vote to backend
      await voteMutation.mutateAsync({
        proposalId,
        voterWallet: walletAddress,
        vote,
        transactionHash,
      });
    } catch (error) {
      console.error("Vote error:", error);
      toast({
        title: "Vote Failed",
        description: "Failed to submit vote on blockchain.",
        variant: "destructive",
      });
    }
  };

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getVotePercentage = (yesVotes: number, noVotes: number) => {
    const total = yesVotes + noVotes;
    if (total === 0) return 0;
    return Math.round((yesVotes / total) * 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "energy":
        return "bg-yellow-100 text-yellow-800";
      case "waste reduction":
        return "bg-blue-100 text-blue-800";
      case "transportation":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">DAO Governance</h2>
          <p className="text-gray-600">Vote on green initiatives and submit your proposals</p>
        </div>
        
        <Dialog open={isProposalModalOpen} onOpenChange={setIsProposalModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600">
              <Plus className="w-4 h-4 mr-2" />
              New Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Proposal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  placeholder="Enter proposal title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select 
                  value={newProposal.category} 
                  onValueChange={(value) => setNewProposal({ ...newProposal, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Energy">Energy</SelectItem>
                    <SelectItem value="Waste Reduction">Waste Reduction</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Water Conservation">Water Conservation</SelectItem>
                    <SelectItem value="Carbon Offset">Carbon Offset</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  placeholder="Describe your proposal in detail"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">End Date</label>
                <Input
                  type="date"
                  value={newProposal.endDate}
                  onChange={(e) => setNewProposal({ ...newProposal, endDate: e.target.value })}
                />
              </div>
              
              <Button 
                onClick={handleCreateProposal}
                disabled={createProposalMutation.isPending}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                {createProposalMutation.isPending ? "Creating..." : "Create Proposal"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Proposals */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Vote className="text-purple-600 mr-2 w-5 h-5" />
          Active Proposals
        </h3>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <div className="flex space-x-3">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : proposals?.length > 0 ? (
          <div className="space-y-4">
            {proposals.map((proposal: any) => {
              const daysLeft = getDaysLeft(proposal.endDate);
              const votePercentage = getVotePercentage(proposal.yesVotes || 0, proposal.noVotes || 0);
              const totalVotes = (proposal.yesVotes || 0) + (proposal.noVotes || 0);
              
              return (
                <Card key={proposal.id} className="eco-card p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{proposal.title}</h4>
                          <Badge className={getCategoryColor(proposal.category)}>
                            {proposal.category}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3 leading-relaxed">
                          {proposal.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>by {proposal.authorWallet?.slice(0, 4)}...{proposal.authorWallet?.slice(-4)}</span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {daysLeft} days left
                          </span>
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {totalVotes} votes
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Voting Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Voting Progress</span>
                        <span className="text-sm text-gray-500">{votePercentage}% in favor</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${votePercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{proposal.yesVotes || 0} YES</span>
                        <span>{proposal.noVotes || 0} NO</span>
                      </div>
                    </div>

                    {/* Voting Buttons */}
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleVote(proposal.id, true)}
                        disabled={voteMutation.isPending || !walletAddress}
                        className="flex-1 bg-green-500 hover:bg-green-600"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Vote YES
                      </Button>
                      <Button
                        onClick={() => handleVote(proposal.id, false)}
                        disabled={voteMutation.isPending || !walletAddress}
                        variant="destructive"
                        className="flex-1"
                      >
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Vote NO
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No Active Proposals</h3>
            <p className="text-gray-600 mb-4">
              Be the first to create a proposal for the community to vote on.
            </p>
            <Button onClick={() => setIsProposalModalOpen(true)} className="bg-green-500 hover:bg-green-600">
              Create First Proposal
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

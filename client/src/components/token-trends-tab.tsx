import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, TrendingUp, TrendingDown, Info } from "lucide-react";

export function TokenTrendsTab() {
  const { data: tokens, isLoading, error } = useQuery({
    queryKey: ["/api/solana-tokens"],
    refetchInterval: 60000, // Refresh every minute
  });

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num < 0.01) return `$${num.toFixed(6)}`;
    if (num < 1) return `$${num.toFixed(4)}`;
    return `$${num.toFixed(2)}`;
  };

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  const formatChange = (change: string) => {
    const num = parseFloat(change);
    return num > 0 ? `+${num.toFixed(2)}%` : `${num.toFixed(2)}%`;
  };

  const getChangeColor = (change: string) => {
    const num = parseFloat(change);
    return num >= 0 ? "text-green-500" : "text-red-500";
  };

  const getTokenIcon = (symbol: string) => {
    // In a real app, you'd use actual token logos
    return <Coins className="w-6 h-6 text-purple-600" />;
  };

  const getTokenAlignment = (symbol: string) => {
    const alignments: Record<string, { status: string; description: string; color: string }> = {
      "SOL": {
        status: "Green Aligned",
        description: "Aligns with Solar Panel Installation proposal through proof-of-stake consensus.",
        color: "bg-green-100 text-green-800"
      },
      "USDC": {
        status: "Green Aligned", 
        description: "Stable funding source for green initiatives with energy-efficient minting.",
        color: "bg-green-100 text-green-800"
      },
      "RAY": {
        status: "Partial Alignment",
        description: "DEX functionality supports green token swaps but needs carbon offset integration.",
        color: "bg-yellow-100 text-yellow-800"
      }
    };

    return alignments[symbol] || {
      status: "Under Review",
      description: "Environmental impact assessment pending.",
      color: "bg-gray-100 text-gray-800"
    };
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Token Trends</h2>
          <p className="text-gray-600">Track Solana ecosystem tokens and their alignment with green proposals</p>
        </div>

        <Card className="p-6 text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <h3 className="font-semibold mb-2">Unable to load token data</h3>
          <p className="text-gray-600 text-sm">
            Please check your internet connection or try again later.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Token Trends</h2>
        <p className="text-gray-600">Track Solana ecosystem tokens and their alignment with green proposals</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : tokens?.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tokens.map((token: any) => {
            const symbol = token.instId?.split('-')[0] || "TOKEN";
            const alignment = getTokenAlignment(symbol);
            const change = token.open24h ? 
              ((parseFloat(token.last) - parseFloat(token.open24h)) / parseFloat(token.open24h) * 100).toString() : 
              "0";

            return (
              <Card key={token.instId} className="eco-card p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        {getTokenIcon(symbol)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{symbol}</h4>
                        <p className="text-sm text-gray-500">{token.instId}</p>
                      </div>
                    </div>
                    <Badge className={alignment.color}>
                      {alignment.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(token.last || "0")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">24h Change</span>
                      <span className={`font-medium flex items-center ${getChangeColor(change)}`}>
                        {parseFloat(change) >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {formatChange(change)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Volume</span>
                      <span className="text-sm text-gray-700">
                        {formatVolume(token.vol24h || "0")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-600 leading-relaxed flex items-start">
                      <Info className="w-3 h-3 text-blue-500 mr-1 mt-0.5 flex-shrink-0" />
                      {alignment.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        // Fallback content when API fails
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { symbol: "SOL", name: "Solana", price: "$23.45", change: "+5.67%", volume: "$1.2M" },
            { symbol: "RAY", name: "Raydium", price: "$0.89", change: "-2.34%", volume: "$847K" },
            { symbol: "USDC", name: "USD Coin", price: "$1.00", change: "+0.01%", volume: "$2.8M" }
          ].map((token) => {
            const alignment = getTokenAlignment(token.symbol);
            
            return (
              <Card key={token.symbol} className="eco-card p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        {getTokenIcon(token.symbol)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{token.symbol}</h4>
                        <p className="text-sm text-gray-500">{token.name}</p>
                      </div>
                    </div>
                    <Badge className={alignment.color}>
                      {alignment.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price</span>
                      <span className="font-semibold text-gray-900">{token.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">24h Change</span>
                      <span className={`font-medium flex items-center ${getChangeColor(token.change.replace('+', '').replace('%', ''))}`}>
                        {token.change.startsWith('+') ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {token.change}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Volume</span>
                      <span className="text-sm text-gray-700">{token.volume}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-600 leading-relaxed flex items-start">
                      <Info className="w-3 h-3 text-blue-500 mr-1 mt-0.5 flex-shrink-0" />
                      {alignment.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { parseEther } from "viem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import TradingViewWidget from "@/components/TradingView";
import { useParams } from "next/navigation";
import { getSymbolPrice } from "@/lib/GetSymbolPrice";
import { abi } from "@/contract/abi.json";

const CONTRACT_ADDRESS = "0x025ab6679052f0b65816eab2476af8206be486fa";

const MARKET_CONFIG = {
  BTC: {
    symbol: "BTC",
    bytes32:
      "0x4254430000000000000000000000000000000000000000000000000000000000",
  },
  ETH: {
    symbol: "ETH",
    bytes32:
      "0x4554480000000000000000000000000000000000000000000000000000000000",
  },
  SOL: {
    symbol: "SOL",
    bytes32:
      "0x534f4c0000000000000000000000000000000000000000000000000000000000",
  },
  MNT: {
    symbol: "MNT",
    bytes32:
      "0x4d4e540000000000000000000000000000000000000000000000000000000000",
  },
} as const;

type Market = keyof typeof MARKET_CONFIG;

interface Position {
  market: Market;
  size: string;
  margin: string;
  leverage: number;
  entryPrice: number;
  isLong: boolean;
  isOpen: boolean;
}

interface PriceData {
  market: string;
  price: bigint;
  timestamp: bigint;
}

export default function PerpetualTrading() {
  const [selectedMarket, setSelectedMarket] = useState<Market>("ETH");
  const [isLong, setIsLong] = useState(true);
  const [leverage, setLeverage] = useState(1);
  const [size, setSize] = useState("");
  const [positions, setPositions] = useState<Position[]>([]);
  const [prices, setPrices] = useState<Record<Market, number>>(
    {} as Record<Market, number>
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const { symbol } = useParams();
  const { address } = useAccount();
  const { toast } = useToast();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const newPrices: Record<Market, number> = {} as Record<Market, number>;
        for (const market of Object.keys(MARKET_CONFIG) as Market[]) {
          const price = await getSymbolPrice(`${market}USD`);
          newPrices[market] = price;
        }
        setPrices(newPrices);
      } catch (error) {
        console.error("Price fetch error:", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof symbol === "string") {
      const market = symbol.replace("USD", "") as Market;
      if (market in MARKET_CONFIG) {
        setSelectedMarket(market);
      }
    }
  }, [symbol]);

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!isNaN(Number(value))) {
      setSize(value);
    }
  };

  const handleOpenPosition = async () => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (!publicClient) {
        throw new Error("Public client is not available");
      }
      const chainId = await publicClient.getChainId();
      if (chainId !== 5003) {
        throw new Error(
          "Please switch to the correct network (Chain ID: 5003)"
        );
      }

      if (!size || Number(size) <= 0) {
        throw new Error("Please enter a valid position size");
      }

      const priceData: PriceData[] = [
        {
          market: MARKET_CONFIG[selectedMarket].bytes32,
          price: BigInt(Math.round(prices[selectedMarket] * 1e8)),
          timestamp: BigInt(Math.floor(Date.now() / 1000)),
        },
        {
          market: MARKET_CONFIG.MNT.bytes32,
          price: BigInt(Math.round(prices.MNT * 1e8)),
          timestamp: BigInt(Math.floor(Date.now() / 1000)),
        },
      ];

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "openPosition",
        args: [
          MARKET_CONFIG[selectedMarket].bytes32,
          parseEther(size),
          BigInt(leverage),
          isLong,
          priceData,
        ],
        value: parseEther(size),
      });

      toast({
        title: "Transaction Submitted",
        description: "Your position is being opened...",
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === "success") {
        const newPosition: Position = {
          market: selectedMarket,
          size,
          margin: size,
          leverage,
          entryPrice: prices[selectedMarket],
          isLong,
          isOpen: true,
        };
        setPositions([...positions, newPosition]);

        toast({
          title: "Position Opened",
          description: `Successfully opened ${
            isLong ? "long" : "short"
          } position`,
        });

        setSize("");
      }
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaction Failed",
        description:
          error instanceof Error ? error.message : "Failed to open position",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const calculatePnL = (position: Position) => {
    const currentPrice = prices[position.market];
    const pnl = position.isLong
      ? (currentPrice - position.entryPrice) *
        Number(position.size) *
        position.leverage
      : (position.entryPrice - currentPrice) *
        Number(position.size) *
        position.leverage;
    return pnl;
  };

  return (
    <motion.div
      className="min-h-screen py-20 lg:px-4 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-row gap-6">
        <motion.div className="flex flex-col gap-6 w-full">
          <Card className="h-[70vh] bg-white/5 backdrop-blur-sm border-white/10">
            <TradingViewWidget symbol={`PYTH:${selectedMarket}USD`} />
          </Card>

          <Card className="h-[35vh] bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <h1 className="text-2xl font-bold">Open Positions</h1>
              <div className="h-px bg-white/10 w-full my-2" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="justify-between flex flex-row font-semibold text-white/80">
                  <span>Market</span>
                  <span>Size</span>
                  <span>Entry Price</span>
                  <span>Current Price</span>
                  <span>PnL</span>
                  <span>Action</span>
                </div>
                {positions.map((position, index) => (
                  <div
                    key={index}
                    className="justify-between flex flex-row text-white"
                  >
                    <span>{position.market}</span>
                    <span>{position.size} MNT</span>
                    <span>${position.entryPrice.toFixed(2)}</span>
                    <span>${prices[position.market]?.toFixed(2)}</span>
                    <span
                      className={
                        calculatePnL(position) >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      ${calculatePnL(position).toFixed(2)}
                    </span>
                    <Button variant="destructive" size="sm">
                      Close
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="flex flex-col gap-6 w-1/3">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex border-b border-white/10 p-5">
              <span className="font-bold">Perpetual Trading</span>
              {prices[selectedMarket] && (
                <span className="ml-auto">
                  $
                  {prices[selectedMarket].toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}
            </div>

            <CardContent className="flex flex-col gap-6 p-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedMarket}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {(Object.keys(MARKET_CONFIG) as Market[]).map((market) => (
                    <DropdownMenuItem
                      key={market}
                      onClick={() => setSelectedMarket(market)}
                      className="cursor-pointer"
                    >
                      {market}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex gap-2">
                <Button
                  className={`flex-1 ${
                    isLong ? "bg-green-500" : "bg-white/10"
                  }`}
                  onClick={() => setIsLong(true)}
                >
                  Long
                </Button>
                <Button
                  className={`flex-1 ${!isLong ? "bg-red-500" : "bg-white/10"}`}
                  onClick={() => setIsLong(false)}
                >
                  Short
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-white/80">Size (MNT)</label>
                <Input
                  type="number"
                  value={size}
                  onChange={handleSizeChange}
                  className="bg-white/5 border-white/10 text-lg"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-white/80">
                  Leverage ({leverage}x)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={leverage}
                  onChange={(e) => setLeverage(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <Button
                className={`w-full h-12 text-lg font-bold ${
                  isLong
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                onClick={handleOpenPosition}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Submit"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  LineChart,
  Zap,
  Wallet,
  Shield,
  Network,
  Gem,
  Calendar,
  Rocket,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const features = [
  {
    icon: <Bot className="h-6 w-6 text-black" />,
    title: "Off-Chain Order Book",
    description:
      "Lightning-fast order placement and execution with minimal latency",
  },
  {
    icon: <Shield className="h-6 w-6 text-black" />,
    title: "On-Chain Settlement",
    description:
      "Trustless and transparent trade settlement via Mantle smart contracts",
  },
  {
    icon: <Zap className="h-6 w-6 text-black" />,
    title: "Leverage Trading",
    description:
      "Trade with up to 10x leverage on major assets like ETH, BTC, SOL, and MNT",
  },
  {
    icon: <Wallet className="h-6 w-6 text-black" />,
    title: "Low Trading Costs",
    description:
      "Minimal fees leveraging Mantle's efficient infrastructure for cost-effective trading",
  },
  {
    icon: <LineChart className="h-6 w-6 text-black" />,
    title: "Advanced Analytics",
    description:
      "Real-time price feeds, PnL tracking, and comprehensive portfolio analytics",
  },
  {
    icon: <Bot className="h-6 w-6 text-black" />,
    title: "Smart Risk Management",
    description:
      "Competitive funding rates and advanced risk controls for safer trading",
  },
];

const roadmapData = [
  {
    quarter: "Q1 2025",
    title: "Initial Launch",
    icon: <Network className="h-6 w-6 text-black" />,
    description: "Launch of core trading features and initial market pairs",
    items: [
      "ETH, BTC, SOL, MNT trading pairs",
      "Off-chain order book deployment",
      "Basic leverage trading features",
    ],
    status: "current",
  },
  {
    quarter: "Q2 2025",
    title: "Advanced Trading Features",
    icon: <Bot className="h-6 w-6 text-black" />,
    description: "Enhanced trading capabilities and improved user experience",
    items: [
      "Advanced order types",
      "Position management tools",
      "Enhanced risk controls",
    ],
  },
  {
    quarter: "Q3 2025",
    title: "Analytics and Insights",
    icon: <LineChart className="h-6 w-6 text-black" />,
    description: "Comprehensive trading analytics and portfolio insights",
    items: [
      "Advanced PnL tracking",
      "Portfolio analytics dashboard",
      "Market trend analysis",
    ],
  },
  {
    quarter: "Q4 2025",
    title: "Platform Expansion",
    icon: <Rocket className="h-6 w-6 text-black" />,
    description: "Additional features and market expansion",
    items: [
      "More trading pairs",
      "Cross-chain integration",
      "Enhanced liquidity pools",
    ],
  },
  {
    quarter: "Q1 2026",
    title: "Institutional Features",
    icon: <Gem className="h-6 w-6 text-black" />,
    description: "Professional trading tools and institutional support",
    items: [
      "API trading access",
      "Advanced risk management",
      "Institutional accounts",
    ],
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0F1117]">
      <div className="pt-20 px-4 lg:px-5 max-w-[1600px] mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col gap-10 bg-gradient-to-br from-[#d7c7ff] to-[#c5fedf] p-8 lg:p-20 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <pattern
                id="hero-pattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path d="M0 0h40v40H0z" fill="none" />
                <circle cx="20" cy="20" r="1" fill="currentColor" />
                <path
                  d="M0 20h40M20 0v40"
                  stroke="currentColor"
                  strokeWidth="0.2"
                />
              </pattern>
              <rect width="100%" height="100%" fill="url(#hero-pattern)" />
            </svg>
          </div>

          <div className="w-full text-black flex flex-col lg:flex-row gap-12 lg:gap-20 relative z-10">
            <motion.div
              className="flex flex-col gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.h1
                className="text-4xl lg:text-6xl font-bold lg:w-[45vw] leading-tight"
                variants={item}
              >
                NebulaFi: Next-Gen Perpetual Trading on Mantle
              </motion.h1>
              <motion.h2
                className="text-xl text-black/80 max-w-2xl"
                variants={item}
              >
                Experience lightning-fast perpetual trading with off-chain
                execution and on-chain settlement for maximum security and
                efficiency
              </motion.h2>
              <motion.div variants={item}>
                <Button
                  className="bg-black hover:bg-black/80 w-fit px-10 py-6 rounded-2xl text-white font-bold text-lg"
                  onClick={() => router.push("/trade/ETHUSD")}
                >
                  Start Trading <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:ml-auto flex flex-col gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Card className="bg-white/20 backdrop-blur-sm p-8 rounded-2xl text-xl font-bold text-black w-full lg:w-[400px] transform hover:scale-105 transition-all duration-300">
                Trade Major Assets
                <div className="text-base font-normal mt-2 text-black/70">
                  ETH, BTC, SOL, and MNT with up to 10x leverage
                </div>
              </Card>
              <Card className="bg-white/20 backdrop-blur-sm p-8 rounded-2xl text-xl font-bold text-black w-full lg:w-[400px] transform hover:scale-105 transition-all duration-300">
                Ultra-Low Latency
                <div className="text-base font-normal mt-2 text-black/70">
                  Off-chain order book for instant execution
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Stats Section */}
          <div className="flex flex-col lg:flex-row text-black gap-10 relative z-10">
            <motion.div
              className="flex flex-row gap-20"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.div className="flex flex-col gap-4" variants={item}>
                <span className="text-6xl font-bold">4</span>
                <span className="text-xl text-black/80">Trading Pairs</span>
              </motion.div>
              <motion.div className="flex flex-col gap-4" variants={item}>
                <span className="text-6xl font-bold">10x</span>
                <span className="text-xl text-black/80">Max Leverage</span>
              </motion.div>
              <motion.div className="flex flex-col gap-4" variants={item}>
                <span className="text-6xl font-bold">0.1%</span>
                <span className="text-xl text-black/80">Trading Fee</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Advanced Trading Features
            </h2>
            <p className="text-white/60 text-xl max-w-3xl mx-auto">
              Everything you need for professional perpetual trading in one
              platform
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="show"
            variants={container}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={item}>
                <Card className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 border-0 h-full group">
                  <motion.div
                    className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#d7c7ff] to-[#c5fedf] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Roadmap Section */}
        <section className="py-20 px-4 lg:px-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 tracking-tighter">
              Platform Roadmap
            </h2>
            <p className="text-white/60 text-xl max-w-3xl mx-auto tracking-tight">
              Our journey to build the most advanced perpetual trading platform
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#d7c7ff] via-[#e2d4ff] to-[#c5fedf] transform -translate-x-1/2" />

            <motion.div
              className="space-y-20"
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {roadmapData.map((milestone, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className={`relative flex flex-col lg:flex-row gap-8 lg:gap-16 items-start ${
                    index % 2 === 0 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <motion.div
                    className={`absolute left-8 lg:left-1/2 w-8 h-8 -translate-x-1/2 rounded-full border-2 
                      ${
                        milestone.status === "current"
                          ? "border-[#d7c7ff] bg-[#d7c7ff]/10"
                          : "border-[#d7c7ff]/30 bg-transparent"
                      }`}
                    whileHover={{ scale: 1.2 }}
                  >
                    <Calendar
                      className={`w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        ${
                          milestone.status === "current"
                            ? "text-[#d7c7ff]"
                            : "text-[#d7c7ff]/50"
                        }`}
                    />
                  </motion.div>

                  <div
                    className={`w-full lg:w-[calc(50%-3rem)] pl-20 lg:pl-0 ${
                      index % 2 === 0 ? "lg:text-right" : ""
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card
                        className={`p-8 rounded-2xl backdrop-blur-sm border-2 
                        ${
                          milestone.status === "current"
                            ? "bg-white/10 border-[#d7c7ff] hover:bg-white/20"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }
                        transition-all duration-300`}
                      >
                        <div className="flex items-start gap-6">
                          <motion.div
                            className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#d7c7ff] to-[#c5fedf] flex items-center justify-center flex-shrink-0"
                            whileHover={{ rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {milestone.icon}
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium${
                                  milestone.status === "current"
                                    ? "bg-[#d7c7ff]/20 text-[#d7c7ff]"
                                    : "bg-white/10 text-white/60"
                                }`}
                              >
                                {milestone.quarter}
                              </span>
                              {milestone.status === "current" && (
                                <span className="text-[#c5fedf] text-sm bg-[#c5fedf]/10 px-3 py-1 rounded-full flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-[#c5fedf] animate-pulse" />
                                  Current Focus
                                </span>
                              )}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                              {milestone.title}
                            </h3>
                            <p className="text-white/60 mb-4 tracking-tight">
                              {milestone.description}
                            </p>
                            <ul className="space-y-3">
                              {milestone.items.map((item, itemIndex) => (
                                <motion.li
                                  key={itemIndex}
                                  className="text-white/60 flex items-center gap-3"
                                  whileHover={{ x: 10 }}
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#d7c7ff] to-[#c5fedf]" />
                                  <span>{item}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Built With Section */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 tracking-tighter">
              Built on Mantle
            </h2>
            <p className="text-white/60 text-xl max-w-3xl mx-auto tracking-tight">
              Leveraging Mantle&apos;s high-performance infrastructure for
              optimal trading experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border-0">
              <motion.div
                className="flex flex-col items-center text-center gap-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#d7c7ff] to-[#c5fedf] flex items-center justify-center">
                  <Zap className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white">Fast Execution</h3>
                <p className="text-white/60">
                  Sub-second trade execution and settlement
                </p>
              </motion.div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border-0">
              <motion.div
                className="flex flex-col items-center text-center gap-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#d7c7ff] to-[#c5fedf] flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white">Low Costs</h3>
                <p className="text-white/60">
                  Minimal gas fees for all operations
                </p>
              </motion.div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border-0">
              <motion.div
                className="flex flex-col items-center text-center gap-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#d7c7ff] to-[#c5fedf] flex items-center justify-center">
                  <Shield className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white">Secure</h3>
                <p className="text-white/60">Trustless on-chain settlement</p>
              </motion.div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border-0">
              <motion.div
                className="flex flex-col items-center text-center gap-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#d7c7ff] to-[#c5fedf] flex items-center justify-center">
                  <Network className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white">Scalable</h3>
                <p className="text-white/60">
                  Built for growing trading volume
                </p>
              </motion.div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

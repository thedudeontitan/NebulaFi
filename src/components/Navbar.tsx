"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import { ChevronDown, Menu as MenuIcon, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Symbols } from "@/app/types";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { open, close } = useAppKit();

  useEffect(() => {
    console.log(address);
  });

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    console.log(address);
  }, [address]);

  const openModal = () => {
    open({ view: "Connect" });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`flex flex-row pt-5 pb-3 px-4 gap-5 items-center text-white font-semibold transition-colors duration-300 ${
          scrolled ? "bg-[#0F1117]" : "glass"
        }`}
      >
        <Link
          href="/"
          className="flex flex-row gap-1 text-xl items-center uppercase"
        >
          <div className="relative w-10 h-10">
            {/* <img src="/logo_white.png" alt="logo" /> */}
          </div>
          NebulaFi
        </Link>

        <div className="ml-20 hidden lg:flex flex-row items-center gap-10 text-white font-normal uppercase text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-white hover:text-white hover:bg-white/10 text-[16px] uppercase"
              >
                Trade
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/30 backdrop-blur-md border-white/20">
              {Object.keys(Symbols).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => router.push(`/trade/${key}`)}
                  className="text-white hover:bg-white/20 cursor-pointer"
                >
                  {key.replace("USD", "")} FUT
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="" target="_blank" className="hover:text-white/80">
            Documentation
          </Link>
          <Link href="#features" className="hover:text-white/80">
            Features
          </Link>
          <Link href="/whitepaper" className="hover:text-white/80">
            Whitepaper
          </Link>
        </div>

        <div className="hidden lg:block ml-auto">
          {!isConnected ? (
            <button
              className={`w-40 py-2 bg-[#0f1322] border border-white text-white hover:bg-white/10 hover:text-white truncate rounded-full
              `}
              // onClick={openModal}
            >
              {/* @ts-ignore */}
              <appkit-button />
            </button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-40 bg-[#0f1322] border-white text-white hover:bg-white/10 hover:text-white truncate rounded-full"
                >
                  <User className="h-5 w-5 mr-2" />
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/30 backdrop-blur-md border-white/20">
                <DropdownMenuItem className="text-white hover:bg-white/20 cursor-pointer">
                  <Link href="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => disconnect()}
                  className="text-white hover:bg-white/20 cursor-pointer"
                >
                  Disconnect Wallet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMenuToggle}
            className="text-2xl text-white hover:bg-white/10"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden flex flex-col items-center bg-white/10 backdrop-blur-md text-white py-4 font-bold">
          <Link href="" target="_blank" className="py-2 hover:text-white/80">
            Github
          </Link>
          <Link href="" target="_blank" className="py-2 hover:text-white/80">
            Documentation
          </Link>
          <Link href="#features" className="py-2 hover:text-white/80">
            Features
          </Link>
          <Link href="/" className="py-2 hover:text-white/80">
            Whitepaper
          </Link>
          <Button
            variant="outline"
            className="mt-4 w-3/4 bg-white text-black hover:bg-gray-200 border-none"
            onClick={openModal}
          >
            Connect Wallet
          </Button>
        </div>
      )}
    </div>
  );
}

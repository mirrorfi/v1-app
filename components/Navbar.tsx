"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export function Navbar() {
  const { publicKey } = useWallet();
  const address = publicKey?.toBase58() || "";
  const router = useRouter();

  // Truncate wallet address for display
  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const pathname = usePathname();

  // Determine the title based on the current pathname
  const title = "MirrorFi"; //pageTitles[pathname] || "MirrorFi";

  return (
    <div className="border-b border-[#1a1b29] bg-[#0a0b14] sticky top-0 z-[100]">
      <div className="flex h-16 md:h-20 justify-between items-center px-4 md:px-6">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2 md:space-x-4 clickable cursor-pointer"
            onClick={() => {
                  console.log("Logo clicked!");
                  router.push("/");
            }}
            >
          <div 
            className="cursor-pointer relative z-50" 
            onClick={() => {
              console.log("Logo clicked!");
              router.push("/");
            }}
          >
            <Image
              src="/SVG/MirrorFi-Logo-Blue.svg"
              alt="MirrorFi Logo"
              width={32}
              height={32}
              className="h-6 w-6 md:h-8 md:w-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-semibold text-white">{title}</h1>
            <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30 text-xs px-2 py-1">
              V1 Beta
            </Badge>
          </div>
        </div>

        {/* Navigation Menu - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={`text-sm font-medium ${
                      pathname === "/strategy-dashboard"
                        ? "text-primary"
                        : "text-foreground"
                    }  hover:text-primary`}
                  >
                    Mirror Vaults
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* Divider */}
              <div className="border-l border-[#3f4152] h-4 mx-4" />

              <NavigationMenuItem>
                <Link href="/create" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={`text-sm font-medium ${
                      pathname === "/create"
                        ? "text-primary"
                        : "text-foreground"
                    } hover:text-primary`}
                  >
                    Create Strategy
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <div className="border-l border-[#3f4152] h-4 mx-4" />

              <NavigationMenuItem>
                <Link href="/portfolio" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={`text-sm font-medium ${
                      pathname === "/portfolio"
                        ? "text-primary"
                        : "text-foreground"
                    }  hover:text-primary`}
                  >
                    Portfolio
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Wallet Button */}
        <div className="flex items-center relative z-[200]">
          <div className="scale-75 md:scale-100">
            <WalletMultiButtonDynamic />
          </div>
        </div>
      </div>
    </div>
  );
}
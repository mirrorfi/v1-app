"use client";

import { FC, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GridStyleBackground } from "./ui/GridStyleBackground";
import Image from "next/image"; 
import { Badge } from "./ui/badge";

interface AccessCodeGateProps {
  onAccessGranted: () => void;
}

export const AccessCodeGate: FC<AccessCodeGateProps> = ({ onAccessGranted }) => {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const CORRECT_ACCESS_CODE = "superteam";
  const ACCESS_CODE_KEY = "mirrorfi_access_granted";

  useEffect(() => {
    // Check if access has already been granted
    const accessGranted = localStorage.getItem(ACCESS_CODE_KEY);
    if (accessGranted === "true") {
      onAccessGranted();
    }
    setIsChecking(false);
  }, [onAccessGranted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (accessCode.toLowerCase() === CORRECT_ACCESS_CODE.toLowerCase()) {
      // Store access granted in localStorage
      localStorage.setItem(ACCESS_CODE_KEY, "true");
      onAccessGranted();
    } else {
      setError("Invalid access code. Please try again.");
      setAccessCode("");
    }
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <GridStyleBackground />
      <div className="w-full max-w-md space-y-4">
        <div className="text-center pb-4">
          <div className="flex h-16 md:h-20 justify-between items-center px-4 md:px-6">
            {/* Logo and Title */}
            <div className="flex w-full justify-center items-center space-x-2 md:space-x-3">
              <Image
                src="/SVG/MirrorFi-Logo-Blue.svg"
                alt="MirrorFi Logo"
                width={32}
                height={32}
                className="h-6 w-6 md:h-8 md:w-8"
              />
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-semibold">MirrorFi</h1>
                <Badge className="md:ml-2 bg-orange-600/20 text-orange-400 border-orange-500/30 text-xs px-2 py-1">
                  V1 Beta
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">
            Please enter the access code to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full text-center text-lg"
              autoFocus
            />
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-500 text-sm text-center">
                {error}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

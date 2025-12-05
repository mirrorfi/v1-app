"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Copy, Check, ExternalLink, Edit2, X as XClose, Upload } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "@/components/ui/x-icon";

interface XProfile {
  username: string;
  profileImageUrl: string;
  name: string;
  isConnected: boolean;
}

interface UserProfile {
  customName: string | null;
  customProfileImage: string | null;
}

export function ProfileCard() {
  const { publicKey } = useWallet();
  const [xProfile, setXProfile] = useState<XProfile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({ customName: null, customProfileImage: null });
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default username and profile picture
  const defaultUsername = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "Not Connected";
  const defaultPfp = "/PNG/mirrorfi-default-pfp.png";

  useEffect(() => {
    if (publicKey) {
      fetchXProfile();
    }
  }, [publicKey]);

  const fetchXProfile = async () => {
    if (!publicKey) return;

    try {
      const response = await fetch(
        `/api/users/profile?wallet=${publicKey.toBase58()}`
      );
      console.log('Profile response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Profile data:', data);
        console.log('Custom profile data:', { customName: data.customName, customProfileImage: data.customProfileImage?.substring(0, 50) + '...' });
        
        if (data.xProfile) {
          console.log('Setting X profile:', data.xProfile.username);
          setXProfile({
            username: data.xProfile.username,
            profileImageUrl: data.xProfile.profileImageUrl,
            name: data.xProfile.name,
            isConnected: true,
          });
        } else {
          console.log('No X profile found for this wallet');
          setXProfile(null);
        }

        // Set custom profile data
        console.log('Setting user profile state:', { customName: data.customName, hasImage: !!data.customProfileImage });
        setUserProfile({
          customName: data.customName || null,
          customProfileImage: data.customProfileImage || null,
        });
      } else {
        console.error('Failed to fetch profile:', await response.text());
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleConnectX = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/x/oauth-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: publicKey.toBase58() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to get OAuth URL:', errorData);
        throw new Error("Failed to get OAuth URL");
      }

      const { authUrl } = await response.json();
      console.log('Got OAuth URL:', authUrl);

      // Step 2: Open OAuth popup
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        authUrl,
        "X Authentication",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        alert('Popup was blocked. Please allow popups for this site.');
        setIsLoading(false);
        return;
      }

      const handleMessage = async (event: MessageEvent) => {
        console.log('Received message:', event.data);
        
        if (event.data.type === "X_AUTH_SUCCESS") {
          window.removeEventListener("message", handleMessage);
          popup?.close();

          // Fetch updated profile
          await fetchXProfile();
          setIsLoading(false);
        } else if (event.data.type === "X_AUTH_ERROR") {
          console.error('X Auth ERROR:', event.data.error);
          window.removeEventListener("message", handleMessage);
          popup?.close();
          setIsLoading(false);
          alert(`Failed to connect X account: ${event.data.error || 'Unknown error'}`);
        }
      };

      window.addEventListener("message", handleMessage);

      // Also check localStorage as a fallback
      const checkLocalStorage = setInterval(() => {
        const xAuthSuccess = localStorage.getItem('x_auth_success');
        if (xAuthSuccess) {
          localStorage.removeItem('x_auth_success');
          clearInterval(checkLocalStorage);
          clearInterval(checkPopupClosed);
          window.removeEventListener("message", handleMessage);
          popup?.close();
          fetchXProfile();
          setIsLoading(false);
        }
      }, 500);

      // Cleanup if popup is closed manually
      const checkPopupClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkPopupClosed);
          clearInterval(checkLocalStorage);
          window.removeEventListener("message", handleMessage);
          setIsLoading(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Error connecting X account:", error);
      setIsLoading(false);
      alert("Failed to connect X account. Please try again.");
    }
  };

  const handleDisconnectX = async () => {
    if (!publicKey) return;

    try {
      const response = await fetch("/api/auth/x/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: publicKey.toBase58() }),
      });

      if (response.ok) {
        setXProfile(null);
      }
    } catch (error) {
      console.error("Error disconnecting X account:", error);
    }
  };

  const handleEditProfile = () => {
    setEditName(userProfile.customName || "");
    setEditImage(userProfile.customProfileImage || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName("");
    setEditImage("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditImage(base64String);
        setIsUploadingImage(false);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      setIsUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!publicKey) return;

    setIsSaving(true);
    
    try {
      const response = await fetch("/api/users/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          customName: editName || null,
          customProfileImage: editImage || null,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const newProfile = {
          customName: editName || null,
          customProfileImage: editImage || null,
        };
        setUserProfile(newProfile);
        setIsEditing(false);
        
        // Verify by refetching
        await fetchXProfile();
      } else {
        console.error("Failed to update profile:", data.error);
        alert(data.error || "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const copyWalletAddress = () => {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey.toBase58());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Display logic: prioritize custom profile > X profile > defaults
  const displayUsername = userProfile.customName || xProfile?.username || defaultUsername;
  const displayName = userProfile.customName || xProfile?.name || "Anonymous User";
  const displayPfp = userProfile.customProfileImage || xProfile?.profileImageUrl || defaultPfp;



  return (
    <Card className="bg-linear-to-br from-slate-800/50 to-slate-900/50 border-slate-600/30 backdrop-blur-sm rounded-xl shadow-lg hover:border-slate-500/50 transition-all">
      <CardContent className="p-6">
        {isEditing ? (
          // Edit Mode
          <div className="space-y-4 relative">
            <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
            
            {/* Profile Picture Edit */}
            <div className="space-y-2">
              <label className="text-sm text-slate-400 block">Profile Picture</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-600 bg-slate-700 shrink-0">
                  <img
                    src={editImage || displayPfp}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultPfp;
                    }}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                    disabled={isUploadingImage || isSaving}
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploadingImage ? "Uploading..." : "Upload Image"}
                  </Button>
                  {editImage && editImage !== userProfile.customProfileImage && (
                    <Button
                      type="button"
                      onClick={() => setEditImage("")}
                      variant="outline"
                      size="sm"
                      disabled={isUploadingImage || isSaving}
                      className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      Remove Image
                    </Button>
                  )}
                  <p className="text-xs text-slate-500">
                    Accepted: JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Name Edit */}
            <div className="space-y-2">
              <label htmlFor="display-name-input" className="text-sm text-slate-400 block">Display Name</label>
              <Input
                id="display-name-input"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your display name"
                disabled={isSaving}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                autoComplete="off"
              />
              <p className="text-xs text-slate-500">This will override your X profile name if connected</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                onClick={handleCancelEdit}
                variant="outline"
                size="sm"
                disabled={isSaving}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <XClose className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveProfile}
                size="sm"
                disabled={isSaving || isUploadingImage}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        ) : (
          // Display Mode
          <div className="flex items-center gap-6">
            {/* Profile Picture */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-600 bg-slate-700">
                <img
                  src={displayPfp}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultPfp;
                  }}
                />
              </div>
              {xProfile?.isConnected && !userProfile.customProfileImage && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-slate-900">
                  <XIcon className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="">
                  {xProfile?.isConnected && !userProfile.customName ? (
                    <a
                      href={`https://twitter.com/${xProfile.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-white truncate hover:text-blue-400 transition-colors inline-flex items-center gap-1 mb-2"
                    >
                      @{xProfile.username}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="text-lg font-bold text-white truncate">
                      {userProfile.customName ? displayUsername : `Username: ${displayUsername}`}
                    </p>
                    
                  )}
                </h3>
                {xProfile?.isConnected && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                    <XIcon className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              {xProfile?.isConnected && userProfile.customName && (
                <a
                  href={`https://twitter.com/${xProfile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                >
                  @{xProfile.username}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              {/* Wallet Address */}
              {publicKey && (
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={copyWalletAddress}
                          className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 group"
                        >
                          <span className="truncate max-w-[200px]">
                            {publicKey.toBase58()}
                          </span>
                          {copied ? (
                            <Check className="h-3 w-3 text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copied ? "Copied!" : "Click to copy wallet address"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="shrink-0 flex gap-2">
              {/* Edit Profile Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleEditProfile}
                      variant="outline"
                      size="sm"
                      disabled={!publicKey}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit your profile name and picture</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Connect/Disconnect X Button */}
              {xProfile?.isConnected ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleDisconnectX}
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                      >
                        <XIcon className="h-4 w-4 mr-2" />
                        Disconnect
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Disconnect your X account</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleConnectX}
                        disabled={isLoading || !publicKey}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <XIcon className="h-4 w-4 mr-2" />
                        {isLoading ? "Connecting..." : "Connect X"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Link your X account to customize your profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

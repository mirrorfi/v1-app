import { useState, useEffect } from "react";
import type { FC } from "react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  HeartIcon,
  ShareIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Node } from "reactflow";
import { useToast } from "@/components/ui/use-toast";
import {
  LSTLogos,
  LSTMintAddresses,
  tokenLogos,
  tokenMintAddresses,
} from "@/constants/nodeOptions";

interface TokenAccountData {
  isNative: boolean;
  mint: string;
  owner: string;
  state: string;
  tokenAmount: {
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
  };
}

interface TokenBalances {
  tokens: TokenAccountData[];
  sol: number;
}

interface StrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getCategoryStyle = (category: any) => {
  switch (category) {
    case "LST":
      return "bg-blue-100 text-blue-800";
    case "DLMM":
      return "bg-purple-100 text-purple-800";
    case "Lending":
      return "bg-green-100 text-green-800";
  }
};

export const StrategyModal: FC<StrategyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { publicKey, signTransaction } = useWallet();
  //const [isLiked, setIsLiked] = useState(false);
  //const [localLikes, setLocalLikes] = useState(strategy.likes || 0);
  //const { agent } = useAgent();
  const [loading, setLoading] = useState(false);
  const [tokenBalances, setTokenBalances] = useState<TokenBalances>({
    tokens: [],
    sol: 0,
  });
  const [nodeAmounts, setNodeAmounts] = useState<{ [nodeId: string]: string }>(
    {}
  );

    const defaultStrategy = {
        "_id": "6822d965bd3c34b2c5adc4eb",
        "nodes": [
            {
                "data": {
                    "label": "Wallet",
                    "description": "Tess",
                    "nodeType": "deposit",
                    "connectionCount": 2
                },
                "position": {
                    "x": 50,
                    "y": 150
                },
                "id": "1",
                "type": "customNode",
                "_id": "6822d965bd3c34b2c5adc4ec"
            },
            {
                "data": {
                    "label": "SOL",
                    "description": "Description",
                    "nodeType": "token",
                    "connectionCount": 0
                },
                "position": {
                    "x": 450,
                    "y": 150
                },
                "id": "2-1747114303252",
                "type": "customNode",
                "_id": "6822d965bd3c34b2c5adc4ed"
            },
            {
                "data": {
                    "label": "USDC",
                    "description": "Description",
                    "nodeType": "token",
                    "connectionCount": 0
                },
                "position": {
                    "x": 450,
                    "y": -50
                },
                "id": "3-1747114308597",
                "type": "customNode",
                "_id": "6822d965bd3c34b2c5adc4ee"
            },
            {
                "data": {
                    "label": "Meteora",
                    "description": "Description",
                    "nodeType": "protocol",
                    "connectionCount": 0
                },
                "position": {
                    "x": 850,
                    "y": -50
                },
                "id": "4-1747114314544",
                "type": "customNode",
                "_id": "6822d965bd3c34b2c5adc4ef"
            }
        ],
        "edges": [
            {
                "style": {
                    "strokeDasharray": "5, 5"
                },
                "markerEnd": {
                    "type": "arrowclosed"
                },
                "id": "e1-2-1747114303252",
                "source": "1",
                "target": "2-1747114303252",
                "animated": true,
                "_id": "6822d965bd3c34b2c5adc4f0"
            },
            {
                "style": {
                    "strokeDasharray": "5, 5"
                },
                "markerEnd": {
                    "type": "arrowclosed"
                },
                "id": "e1-3-1747114308597",
                "source": "1",
                "target": "3-1747114308597",
                "animated": true,
                "_id": "6822d965bd3c34b2c5adc4f1"
            },
            {
                "style": {
                    "strokeDasharray": "5, 5"
                },
                "markerEnd": {
                    "type": "arrowclosed"
                },
                "id": "e3-1747114308597-4-1747114314544",
                "source": "3-1747114308597",
                "target": "4-1747114314544",
                "animated": true,
                "_id": "6822d965bd3c34b2c5adc4f2"
            },
            {
                "style": {
                    "strokeDasharray": "5, 5"
                },
                "markerEnd": {
                    "type": "arrowclosed"
                },
                "id": "e2-1747114303252-4-1747114314544",
                "source": "2-1747114303252",
                "target": "4-1747114314544",
                "animated": true,
                "_id": "6822d965bd3c34b2c5adc4f3"
            }
        ],
        "name": "SOL-USDC DLMM",
        "user": "BmBq8NeDva9eLgpRJCnHTwHK2qtPBfTQYHXvBYWYp97",
        "description": "Add Liquidity to SOL-USDC DLMM on Meteora",
        "categories": [
            "DLMM"
        ],
        "__v": 0,
        "copyCount": 4,
        "likeCount": 1,
        "shareCount": 0,
        "apy": 95.66642519949491
    };
    const [strategy, setStrategy] = useState(defaultStrategy);

  const getTokenMintAddress = (label: string, nodeType?: string) => {
    return label === "SOL"
      ? "So11111111111111111111111111111111111111112"
      : nodeType === "lst"
      ? LSTMintAddresses[label]
      : tokenMintAddresses[label];
  };

  // Get required input tokens from strategy graph
  const getRequiredTokens = () => {
    const sourceEdges = strategy.edges.filter((edge) => edge.source === "1");
    const requiredTokenNodes = sourceEdges
      .map((edge) => {
        const targetNode = strategy.nodes.find(
          (node) => node.id === edge.target
        );
        // Include both regular tokens and SOL nodes
        if (
          targetNode &&
          (targetNode.data.nodeType === "token" ||
            targetNode.data.label === "SOL")
        ) {
          return {
            id: targetNode.id,
            label: targetNode.data.label,
            nodeType: (targetNode.data.nodeType || "token") as
              | "token"
              | "lst"
              | "protocol",
          };
        }
        return null;
      })
      .filter((node): node is NonNullable<typeof node> => node !== null);
    return requiredTokenNodes;
  };

  // Helper to get token label from node ID
  const getTokenLabel = (nodeId: string) => {
    const node = strategy.nodes.find((n) => n.id === nodeId);
    return node?.data.label || nodeId;
  };

  const getTokenLogo = (label: string, nodeType: string) => {
    return nodeType === "lst" ? LSTLogos[label] : tokenLogos[label];
  };

  const { toast } = useToast();
  const [updatedNodes, setUpdatedNodes] = useState<Node[]>([]);

  useEffect(() => {
    // Update the nodes in the strategy with their parent labels
    const nodesWithParents = strategy.nodes.map((node) => {
      if (node.data.label === "Meteora") {
        const parentLabels = strategy.edges
          .filter((edge) => edge.target === node.id)
          .map((edge) => {
            const parentNode = strategy.nodes.find((n) => n.id === edge.source);
            return parentNode ? parentNode.data.label : null;
          })
          .filter((label): label is string => label !== null);
        return {
          ...node,
          data: {
            ...node.data,
            parentLabels,
          },
        };
      }
      return node;
    });
    setUpdatedNodes(nodesWithParents);
  }, [strategy.nodes, strategy.edges]);

  const getFormattedBalance = (label: string, nodeType?: string) => {
    // For all tokens including SOL, find the token by mint address in the tokens array
    const tokenMintAddress = getTokenMintAddress(label, nodeType);
    const token = tokenBalances.tokens.find((t) => t.mint === tokenMintAddress);
    console.log(`Balance for ${label}:`, token?.tokenAmount);
    return token?.tokenAmount.uiAmountString || "0";
  };

  const getMaxAmount = (label: string, nodeType?: string) => {
    const tokenMintAddress = getTokenMintAddress(label, nodeType);
    const token = tokenBalances.tokens.find((t) => t.mint === tokenMintAddress);
    console.log(
      `Max amount for ${label} (${tokenMintAddress}):`,
      token?.tokenAmount
    );
    return token?.tokenAmount.uiAmount || 0;
  };

  const handleMaxAmount = (nodeId: string) => {
    const node = strategy.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const tokenLabel = node.data.label;
    setNodeAmounts((prev) => ({
      ...prev,
      [nodeId]: getMaxAmount(tokenLabel, node.data.nodeType).toString(),
    }));
  };

  const handleConfirm = () => {
    const executeStrategy = async () => {
     
      toast({
        title: "Executing strategy...",
        description: `Mirroring ${strategy.name} with multiple tokens`,
        duration: 5000,
      });

      onClose();
    };

    executeStrategy();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl border-0 border-none bg-background/65 backdrop-blur-md">
        <DialogHeader className="-mt-8 w-fit">
          <DialogTitle className="text-2xl font-bold">
            Mirror Strategy
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-4">
          {/* Left side: Strategy flow visualization */}
          <div className="rounded-lg p-6 min-h-[400px] h-[500px] col-span-2 relative">
            Hello Motherfucker
            {/*<InteractiveFlow
              nodes={updatedNodes}
              edges={strategy.edges}
              className="absolute inset-6"
            />*/}
          </div>

          {/* Right side: Strategy details */}
          <div className="flex flex-col justify-between -mt-4">
            <div>
              <h3 className="text-xl font-bold mb-1">{strategy.name}</h3>
              <p className="text-muted-foreground mb-3">
                APY:{" "}
                <span className="text-emerald-400">
                  {strategy.apy ? `${strategy.apy.toFixed(2)}%` : "0%"}
                </span>{" "}
              </p>
              {strategy.description && (
                <p className="text-sm text-gray-400 mb-3">
                  {strategy.description}
                </p>
              )}
              <div className="flex gap-1 flex-wrap mb-3">
                {strategy.categories?.map((category, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(
                      category
                    )}`}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              {getRequiredTokens().map(({ id, label, nodeType }) => (
                <div
                  key={id}
                  className="rounded-lg bg-slate-900 overflow-hidden"
                >
                  <div className="p-4 pb-1">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        {/*<Image
                          src={getTokenLogo(label, nodeType)}
                          alt={`${label} logo`}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />*/}
                        <span className="font-medium">{label}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-medium text-sm text-gray-500">
                          {getFormattedBalance(label, nodeType)} {label}
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 py-0 text-xs font-medium bg-gray-700 text-gray-400"
                            onClick={() =>{}}
                          >
                            HALF
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 py-0 text-xs font-medium bg-gray-700 text-gray-400"
                            onClick={() => {}}
                          >
                            MAX
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end items-center p-1 rounded-lg mb-2">
                      <div className="flex flex-col items-end">
                        <Input
                          type="number"
                          value={nodeAmounts[id] || ""}
                          onChange={(e) =>{}}
                          placeholder="0.00"
                          className="text-right border-0 bg-transparent p-0 h-auto text-3xl font-medium w-40 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <span className="text-xs text-gray-400 font-medium mt-2">
                          ${0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                onClick={handleConfirm}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
                disabled={
                  Object.keys(nodeAmounts).length === 0 ||
                  Object.values(nodeAmounts).some((amount) => !amount) ||
                  loading
                }
              >
                Confirm Mirror
              </Button>
            </div>
          </div>
        </div>

        {/* Social interaction features */}
        {/*<div className="absolute bottom-6 left-6 flex items-center gap-6">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
              setLocalLikes((prev) => (isLiked ? prev - 1 : prev + 1));
            }}
            className={`flex items-center gap-1.5 ${
              isLiked
                ? "text-secondary hover:text-secondary/80"
                : "text-white hover:text-secondary/80"
            } transition-colors cursor-pointer`}
          >
            <HeartIcon
              className={`w-5 h-5 ${isLiked ? "fill-current" : ""} stroke-2`}
            />
            <span className="text-sm font-medium">{localLikes}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white hover:text-secondary transition-colors cursor-pointer">
            <DocumentDuplicateIcon className="w-5 h-5 stroke-2" />
            <span className="text-sm font-medium">{strategy.mirrors || 0}</span>
          </div>
          <div
            onClick={() => {
              const shareConfig = createShareConfig(
                strategy._id,
                strategy.name,
                strategy.apy || 0
              );
              shareToTwitter(shareConfig);
            }}
            className="flex items-center gap-1.5 text-white hover:text-secondary transition-colors cursor-pointer"
          >
            <ShareIcon className="w-5 h-5 stroke-2" />
            <span className="text-sm font-medium">{strategy.shares || 0}</span>
          </div>
        </div>*/}
      </DialogContent>
    </Dialog>
  );
};
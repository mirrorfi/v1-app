import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { InteractiveFlow } from "@/components/ReactflowDisplay";
import { useEffect, useState } from "react";
import type { Node } from "reactflow";
import { deposit } from "@kamino-finance/klend-sdk";

interface VaultDashboardFlowProps {
    vaultData: any;
    depositData: any;
    strategyData: any;
}

function getStrategyYCoordinate(numStrategies: number): number[] {
    if (numStrategies === 0) return [];
    if (numStrategies === 1) return [100];
    if (numStrategies === 2) return [0, 200];
    const ymin = -100
    const step = 400 / (numStrategies - 1);

    const coordinates = [];
    for (let i = 0; i < numStrategies; i++) {
        coordinates.push(Math.round(ymin + i * step));
    }
    return coordinates;
}

export function VaultDashboardFlow({ vaultData, depositData, strategyData }: VaultDashboardFlowProps) {
    const [strategy, setStrategy] = useState<any | null>(null);
    const [updatedNodes, setUpdatedNodes] = useState<Node[]>([]);

    useEffect(() => {
        if(!depositData || !strategyData) return;
        const strategy = {
            nodes: [
                {
                    data: {
                        label: "Vault",
                        icon: null
                    },
                    position: { x: 50, y: 100 },
                    id: "1",
                    type: "customNode"
                },
                {
                    data: {
                        label: depositData.tokenInfo.symbol,
                        icon: depositData.tokenInfo.icon
                    },
                    position: { x: 450, y: 100 },
                    id: "2",
                    type: "customNode"
                },
            ],
            edges: [
                {
                    "style": {
                        "strokeDasharray": "5, 5"
                    },
                    "markerEnd": {
                        "type": "arrowclosed"
                    },
                    "id": "e1-2",
                    "source": "1",
                    "target": "2",
                    "animated": true,
                    "_id": "6822d965bd3c34b2c5adc4f2"
                },
            ]
        }
        let ycoordinates = getStrategyYCoordinate(strategyData.length);
        strategyData.forEach((strat:any, i:number) => {
            // Add Nodes
            if (strat.strategyType === "jupiterSwap") {
                strategy.nodes.push(
                    {
                        data: {
                            label: `${strat.tokenInfo.symbol}`,
                            icon: strat.tokenInfo.icon,
                        },
                        position: { x: 850, y: ycoordinates[i] },
                        id: `${strategy.nodes.length + 1}`,
                        type: "customNode"
                    }
                )
            }
            strategy.edges.push(
                {
                    "style": {
                        "strokeDasharray": "5, 5"
                    },
                    "markerEnd": {
                        "type": "arrowclosed"
                    },
                    "id": `e${2}-${strategy.nodes.length}`,
                    "source": `2`,
                    "target": `${strategy.nodes.length}`,
                    "animated": true,
                    "_id": "6822d965bd3c34b2c5adc4f2"
                }
            );
        });
        setStrategy(strategy);
    }, [depositData, strategyData]);


    // useEffect(() => {
    //     // Update the nodes in the strategy with their parent labels
    //     const nodesWithParents = strategy.nodes.map((node) => {
    //     if (node.data.label === "Meteora") {
    //         const parentLabels = strategy.edges
    //         .filter((edge) => edge.target === node.id)
    //         .map((edge) => {
    //             const parentNode = strategy.nodes.find((n) => n.id === edge.source);
    //             return parentNode ? parentNode.data.label : null;
    //         })
    //         .filter((label): label is string => label !== null);
    //         return {
    //         ...node,
    //         data: {
    //             ...node.data,
    //             parentLabels,
    //         },
    //         };
    //     }
    //     return node;
    //     });
    //     setUpdatedNodes(nodesWithParents);
    // }, [strategy.nodes, strategy.edges]);

    return (
        <Card className={`h-[300px] sm:h-[425px] bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg ${/*hover:bg-blue-900/30*/""} transition-all duration-200`}>
        <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            { vaultData ? vaultData.name : <div className="h-5 w-32 bg-blue-700/30 rounded-md animate-pulse" />}
            </CardTitle>
            { vaultData ?
            <div className="text-sm text-blue-300 mt-1">{vaultData.description}</div>
            : <div className="h-4 w-full md:w-3/4 bg-blue-700/30 rounded-md mt-2 animate-pulse" />}
        </CardHeader>
        {strategy &&
            <CardContent>
                <InteractiveFlow
                nodes={strategy.nodes /*updatedNodes*/}
                edges={strategy.edges}
                className="inset-0 rounded-lg"
                />
            </CardContent>
        }
        </Card>
    )
}
import { InteractiveFlow } from "@/components/ReactflowDisplay";
import { useEffect, useState } from "react";
import type { Node } from "reactflow";
import { Skeleton } from "./ui/skeleton";

interface StrategyFlowProps {
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

export function StrategyFlow({ depositData, strategyData }: StrategyFlowProps) {
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
        strategy ?
        <InteractiveFlow
            nodes={strategy.nodes /*updatedNodes*/}
            edges={strategy.edges}
            className="inset-0 rounded-lg"
        />
        : <Skeleton className="h-[200px] w-full rounded-lg" />
    
    )
}
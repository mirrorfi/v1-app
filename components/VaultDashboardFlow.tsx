import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { InteractiveFlow } from "@/components/ReactflowDisplay";
import { useEffect, useState } from "react";
import type { Node } from "reactflow";

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

export function VaultDashboardFlow() {

    const [strategy, setStrategy] = useState<any>(defaultStrategy);
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

    return (
        <Card className="h-48 bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg hover:bg-blue-900/30 transition-all duration-200">
        <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            Vault Strategy
            </CardTitle>
        </CardHeader>
        <CardContent>
            <InteractiveFlow
              nodes={updatedNodes}
              edges={strategy.edges}
              className="absolute inset-6"
            />
        </CardContent>
        </Card>
    )
}
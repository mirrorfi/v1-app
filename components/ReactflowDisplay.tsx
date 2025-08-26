"use client";

import ReactFlow, { Node, Edge, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import { Handle, Position, type NodeProps } from "reactflow"
import Image from "next/image"
import { Wallet } from "lucide-react"
//import { APYVals } from "@/lib/plugin/sanctum/tools/apyVals"
import { useState, useEffect } from "react"
import { allAddresses, LSTLogos, tokenLogos } from "@/constants/nodeOptions"
//import { getMeteoraPoolAPY } from "@/lib/meteora"

interface InteractiveFlowProps {
  nodes: Node[];
  edges: Edge[];
  className?: string;
}

export function InteractiveFlow({
  nodes,
  edges,
  className = "",
}: InteractiveFlowProps) {
  const nodeTypes = {
    customNode: CustomNode,
  };

  return (
    <ReactFlowProvider>
      <div className={`${className} absolute inset-0`}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          proOptions={{ hideAttribution: true }}
        />
      </div>
    </ReactFlowProvider>
  );
}


export type NodeData = {
  label: string
  description?: string
  nodeType?: "protocol" | "token" | "lst"
  percentage?: string
  connectionCount: number
  parentLabels?: string[]
}

export function CustomNode({ data, isConnectable }: NodeProps<NodeData>) {
  const nodeClass = `custom-node node`

    // State to store APY values
    const [apyValues, setApyValues] = useState<Record<string, number>>({});
    const [meteoraAPY, setMeteoraAPY] = useState<number | null>(null);


  return (
    <div className={nodeClass}>
      <div className="custom-node-header" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {data.label != "Wallet" ? (<Image
        src={
          data.nodeType === "lst"
            ? LSTLogos[data.label]
            : data.nodeType === "token"
            ? tokenLogos[data.label]
            : `/PNG/${data.label.toLowerCase()}-logo.png`
        }        alt={`${data.label} logo`}
        width={24}
        height={24}
      />) : (
        <Wallet/>)}
      {data.label}
      {(data.nodeType === "lst" || data.label.toLowerCase() === "meteora") && (
        (data.nodeType === "lst") ? (
          <div className="custom-node-content text-green-300 ml-4">
            {apyValues[data.label] ? Math.round((apyValues[data.label])*10000)/100 : "N/A"}% APY
          </div>
        ) : (
          <div className="custom-node-content text-green-300 ml-4">
            {meteoraAPY ? Math.round(meteoraAPY*100)/100 : 0}% APY
          </div>
        )
      )}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
      {/* Render handle only if label of node isn't "SOL Wallet" */}
      {data.label !== "Wallet" && (
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      )}
    </div>
  )
}

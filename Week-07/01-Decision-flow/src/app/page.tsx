"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  ReactFlowProvider,
} from "@xyflow/react";
import {
  Play,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Layers,
  Sparkles,
  Cpu,
  History,
} from "lucide-react";

import DecisionNode from "@/components/flow/DecisionNode";
import { saveWorkflow, loadWorkflow, loadHistory, saveHistoryEntry } from "@/lib/storage";
import { validateWorkflow } from "@/lib/workflow";
import { WorkflowNodeData, WorkflowEdgeData } from "@/types/workflow";

const nodeTypes = {
  decision: DecisionNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 0.8 };

const initialNodes: Node<WorkflowNodeData>[] = [
  {
    id: "1",
    type: "decision",
    position: { x: 250, y: 50 },
    data: {
      label: "Is High Value Customer?",
      prompt: "Does the user account indicate VIP tier or billing tier exceeding $500/month?",
      status: "idle",
    },
  },
  {
    id: "2",
    type: "decision",
    position: { x: 80, y: 220 },
    data: {
      label: "Is Billing Issue?",
      prompt: "Is the customer requesting a refund, asking about an invoice, or complaining about pricing?",
      status: "idle",
    },
  },
  {
    id: "3",
    type: "decision",
    position: { x: 420, y: 220 },
    data: {
      label: "Is Server Down?",
      prompt: "Is the user reporting an outage, API timeout, or critical service failure?",
      status: "idle",
    },
  },
];

const initialEdges: Edge<WorkflowEdgeData>[] = [
  {
    id: "e-1-2-YES",
    source: "1",
    target: "2",
    sourceHandle: "YES",
    label: "YES",
    type: "smoothstep",
    animated: true,
    data: { branch: "YES" },
    style: { stroke: "#10b981", strokeWidth: 2 },
  },
  {
    id: "e-1-3-NO",
    source: "1",
    target: "3",
    sourceHandle: "NO",
    label: "NO",
    type: "smoothstep",
    animated: true,
    data: { branch: "NO" },
    style: { stroke: "#f43f5e", strokeWidth: 2 },
  },
];

function WorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<WorkflowEdgeData>>([]);
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null);
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<"unchecked" | "valid" | "invalid">("unchecked");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isInngestRunning, setIsInngestRunning] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"properties" | "history">("properties");
  const [groqKeyWarning, setGroqKeyWarning] = useState(false);

  // Load initial data
  useEffect(() => {
    const saved = loadWorkflow();
    if (saved && saved.nodes.length > 0) {
      setNodes(saved.nodes);
      setEdges(saved.edges);
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
    setHistory(loadHistory());

    // Check if GROQ API Key is missing in local .env (we can perform a quick check, but since we cannot read server env here directly, we will check on run)
  }, [setNodes, setEdges]);

  // Save workflow on change
  const handleSave = useCallback(() => {
    saveWorkflow(nodes, edges);
  }, [nodes, edges]);

  // Connect handles
  const onConnect = useCallback(
    (params: Connection) => {
      const branch = params.sourceHandle as "YES" | "NO";
      const newEdge: Edge<WorkflowEdgeData> = {
        id: `e-${params.source}-${params.target}-${branch}-${Math.random().toString(36).substring(2, 5)}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        label: branch,
        type: "smoothstep",
        animated: true,
        data: { branch },
        style: { stroke: branch === "YES" ? "#10b981" : "#f43f5e", strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setValidationStatus("unchecked");
      setValidationResult(null);
    },
    [setEdges]
  );

  // Auto-save when nodes/edges change
  useEffect(() => {
    if (nodes.length > 0) {
      handleSave();
    }
  }, [nodes, edges, handleSave]);

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<WorkflowNodeData>);
    setActiveTab("properties");
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Update selected node properties
  const updateNodeData = useCallback(
    (key: string, value: string) => {
      if (!selectedNode) return;

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            const updatedNode = {
              ...node,
              data: {
                ...node.data,
                [key]: value,
              },
            };
            // Keep the selected node state in sync
            setSelectedNode(updatedNode);
            return updatedNode;
          }
          return node;
        })
      );
      setValidationStatus("unchecked");
      setValidationResult(null);
    },
    [selectedNode, setNodes]
  );

  // Delete node
  const deleteNode = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
    setSelectedNode(null);
    setValidationStatus("unchecked");
    setValidationResult(null);
  }, [selectedNode, setNodes, setEdges]);

  // Add new decision node
  const addNewNode = useCallback(() => {
    const id = (nodes.length + 1).toString();
    const newNode: Node<WorkflowNodeData> = {
      id,
      type: "decision",
      position: {
        x: Math.random() * 200 + 150,
        y: Math.random() * 200 + 100,
      },
      data: {
        label: `Decision ${id}`,
        prompt: "Enter binary evaluation criteria here...",
        status: "idle",
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setValidationStatus("unchecked");
    setValidationResult(null);
  }, [nodes, setNodes]);

  // Reset workflow
  const handleReset = useCallback(() => {
    if (window.confirm("Are you sure you want to clear the canvas? All unsaved nodes will be lost.")) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      setValidationStatus("unchecked");
      setValidationResult(null);
    }
  }, [setNodes, setEdges]);

  // Load Demo Support Router Template
  const handleLoadDemo = useCallback(() => {
    const demoNodes: Node<WorkflowNodeData>[] = [
      {
        id: "root",
        type: "decision",
        position: { x: 350, y: 20 },
        data: {
          label: "1. Is technical bug?",
          prompt: "Does the user mention error codes, failure, crash, bug, code, exception, or server issue?",
          status: "idle",
        },
      },
      {
        id: "billing",
        type: "decision",
        position: { x: 100, y: 180 },
        data: {
          label: "2. Is refund request?",
          prompt: "Is the customer asking for a refund, money back, credit note, or subscription cancellation?",
          status: "idle",
        },
      },
      {
        id: "prod_outage",
        type: "decision",
        position: { x: 600, y: 180 },
        data: {
          label: "3. Is production outage?",
          prompt: "Does the user report service completely down, system unreachable, or critical failure for all users?",
          status: "idle",
        },
      },
      {
        id: "billing_escalate",
        type: "decision",
        position: { x: -20, y: 350 },
        data: {
          label: "4. Escalate to billing team?",
          prompt: "Should this billing ticket be escalated to the supervisor (involves high tier value or contract dispute)?",
          status: "idle",
        },
      },
      {
        id: "billing_auto",
        type: "decision",
        position: { x: 220, y: 350 },
        data: {
          label: "5. Auto-process credit?",
          prompt: "Is the refund amount less than $50 and customer has no previous refund history?",
          status: "idle",
        },
      },
      {
        id: "pager_duty",
        type: "decision",
        position: { x: 480, y: 350 },
        data: {
          label: "6. Trigger PagerDuty?",
          prompt: "Is this an SLA Tier 1 outage affecting core services with high severity?",
          status: "idle",
        },
      },
      {
        id: "dev_queue",
        type: "decision",
        position: { x: 730, y: 350 },
        data: {
          label: "7. Route to Dev JIRA?",
          prompt: "Is this a confirmed software bug that requires code modifications to resolve?",
          status: "idle",
        },
      },
    ];

    const demoEdges: Edge<WorkflowEdgeData>[] = [
      // Root connections
      { id: "e-root-billing-NO", source: "root", target: "billing", sourceHandle: "NO", label: "NO", type: "smoothstep", animated: true, data: { branch: "NO" }, style: { stroke: "#f43f5e", strokeWidth: 2 } },
      { id: "e-root-prod_outage-YES", source: "root", target: "prod_outage", sourceHandle: "YES", label: "YES", type: "smoothstep", animated: true, data: { branch: "YES" }, style: { stroke: "#10b981", strokeWidth: 2 } },
      
      // Billing connections
      { id: "e-billing-billing_escalate-YES", source: "billing", target: "billing_escalate", sourceHandle: "YES", label: "YES", type: "smoothstep", animated: true, data: { branch: "YES" }, style: { stroke: "#10b981", strokeWidth: 2 } },
      { id: "e-billing-billing_auto-NO", source: "billing", target: "billing_auto", sourceHandle: "NO", label: "NO", type: "smoothstep", animated: true, data: { branch: "NO" }, style: { stroke: "#f43f5e", strokeWidth: 2 } },

      // Prod outage connections
      { id: "e-prod_outage-pager_duty-YES", source: "prod_outage", target: "pager_duty", sourceHandle: "YES", label: "YES", type: "smoothstep", animated: true, data: { branch: "YES" }, style: { stroke: "#10b981", strokeWidth: 2 } },
      { id: "e-prod_outage-dev_queue-NO", source: "prod_outage", target: "dev_queue", sourceHandle: "NO", label: "NO", type: "smoothstep", animated: true, data: { branch: "NO" }, style: { stroke: "#f43f5e", strokeWidth: 2 } },
    ];

    setNodes(demoNodes);
    setEdges(demoEdges);
    setSelectedNode(null);
    setValidationStatus("unchecked");
    setValidationResult(null);
  }, [setNodes, setEdges]);

  // Validate flow locally
  const handleValidate = useCallback(() => {
    const rawNodes = nodes.map((n) => ({ id: n.id, data: n.data }));
    const rawEdges = edges.map((e) => ({ id: e.id, source: e.source, target: e.target, data: e.data }));

    const error = validateWorkflow(rawNodes, rawEdges);
    if (error) {
      setValidationResult(error);
      setValidationStatus("invalid");
      return false;
    } else {
      setValidationResult("All checks passed! The decision flow is complete and structurally sound.");
      setValidationStatus("valid");
      return true;
    }
  }, [nodes, edges]);

  // Local Playback Run Simulation in UI
  const handleSimulateRun = async () => {
    // 1. Validate first
    const isValid = handleValidate();
    if (!isValid) return;

    setIsSimulating(true);
    setGroqKeyWarning(false);

    // Reset all nodes status in UI
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, status: "idle", result: undefined, error: undefined },
      }))
    );

    try {
      const response = await fetch("/api/workflow/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodes: nodes.map((n) => ({ id: n.id, data: { label: n.data.label, prompt: n.data.prompt } })),
          edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, data: e.data })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Workflow simulation failed.");
      }

      // Playback simulation steps
      const steps = data.logs;
      for (const step of steps) {
        // Node starts executing
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === step.nodeId) {
              return { ...n, data: { ...n.data, status: "running" } };
            }
            return n;
          })
        );

        // Wait 1.2s to simulate thinking / API response
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Node completes executing
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === step.nodeId) {
              return {
                ...n,
                data: {
                  ...n.data,
                  status: step.status,
                  result: step.result,
                  error: step.error,
                },
              };
            }
            return n;
          })
        );

        // Highlight output path edge anim if there is a next step
        if (step.result) {
          setEdges((eds) =>
            eds.map((e) => {
              if (e.source === step.nodeId && e.data?.branch === step.result) {
                return {
                  ...e,
                  style: {
                    stroke: step.result === "YES" ? "#34d399" : "#fb7185",
                    strokeWidth: 4,
                    filter: `drop-shadow(0 0 8px ${step.result === "YES" ? "#10b981" : "#f43f5e"})`,
                  },
                };
              }
              return e;
            })
          );
        }

        // Delay between nodes
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // Save execution entry to history
      const historyEntry = {
        id: Math.random().toString(36).substring(7),
        status: (data.success ? "completed" : "failed") as "completed" | "failed",
        nodeCount: steps.length,
        durationMs: data.durationMs,
        timestamp: Date.now(),
      };
      saveHistoryEntry(historyEntry);
      setHistory(loadHistory());

    } catch (err: any) {
      alert(`Simulation Error: ${err.message}`);
    } finally {
      setIsSimulating(false);
      // Revert edge stroke style to normal
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          style: { stroke: e.data?.branch === "YES" ? "#10b981" : "#f43f5e", strokeWidth: 2 },
        }))
      );
    }
  };

  // Run Background Job via Inngest Dev Server
  const handleInngestRun = async () => {
    const isValid = handleValidate();
    if (!isValid) return;

    setIsInngestRunning(true);
    try {
      const response = await fetch("/api/workflow/inngest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodes: nodes.map((n) => ({ id: n.id, data: { label: n.data.label, prompt: n.data.prompt } })),
          edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, data: e.data })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to trigger Inngest workflow.");
      }

      alert(
        `SUCCESS!\nWorkflow triggered via Inngest (Job ID: ${data.executionId})\n\nOpen Inngest Dev Server Dashboard at http://localhost:8288 to watch the asynchronous job execute.`
      );
    } catch (err: any) {
      alert(`Inngest Dispatch Error: ${err.message}`);
    } finally {
      setIsInngestRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Banner Warning */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 text-indigo-400 p-2 rounded-lg border border-indigo-500/20">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
              AI Decision Flow Builder <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 px-2 py-0.5 rounded-full">v1.0</span>
            </h1>
            <p className="text-xs text-slate-400">Design, validate, and execute AI classification trees via Groq and Inngest.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLoadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-600 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Load Support Demo
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-900/30 bg-red-950/20 hover:bg-red-950/40 hover:border-red-800/40 text-red-400 text-xs font-semibold cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Canvas
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: React Flow Canvas */}
        <div className="flex-1 h-full relative bg-slate-900/40">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            defaultViewport={defaultViewport}
            fitView
            minZoom={0.2}
            maxZoom={1.5}
          >
            <Controls className="!bg-slate-800 !border-slate-700 !text-slate-200 fill-slate-200 [&_button]:border-slate-700 hover:[&_button]:!bg-slate-700" />
            <MiniMap 
              nodeColor={() => "#1e293b"} 
              maskColor="rgba(15, 23, 42, 0.6)"
              className="!bg-slate-800/80 !border-slate-700"
            />
            <Background color="#334155" gap={24} size={1} />

            {/* Custom Panel inside Canvas */}
            <Panel position="top-left" className="flex flex-col gap-2">
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-xl max-w-xs flex flex-col gap-3">
                <div className="font-bold text-xs tracking-wider text-slate-400 uppercase">Controls</div>
                <button
                  onClick={addNewNode}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Decision Node
                </button>
                <div className="h-[1px] bg-slate-800" />
                <button
                  onClick={handleValidate}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  <Layers className="w-4 h-4 text-indigo-400" /> Validate Structure
                </button>
              </div>

              {validationStatus !== "unchecked" && (
                <div className={`p-4 rounded-xl border flex gap-3 max-w-sm shadow-xl backdrop-blur-md ${
                  validationStatus === "valid" 
                    ? "bg-emerald-950/80 border-emerald-800/50 text-emerald-300"
                    : "bg-rose-950/80 border-rose-800/50 text-rose-300"
                }`}>
                  {validationStatus === "valid" ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                  )}
                  <div className="flex flex-col gap-1">
                    <div className="text-xs font-bold tracking-wider uppercase">
                      {validationStatus === "valid" ? "Structure Verified" : "Validation Error"}
                    </div>
                    <div className="text-xs leading-relaxed font-medium whitespace-pre-wrap">
                      {validationResult}
                    </div>
                  </div>
                </div>
              )}
            </Panel>

            <Panel position="bottom-right" className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 text-[10px] text-slate-400 flex items-center gap-2 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Workspace Synced to Local Storage
            </Panel>
          </ReactFlow>
        </div>

        {/* Right Side: Properties & execution panel */}
        <div className="w-96 border-l border-slate-800 bg-slate-900 flex flex-col h-full overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab("properties")}
              className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                activeTab === "properties"
                  ? "border-indigo-500 text-indigo-400 bg-slate-950/30"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              Node Editor
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                activeTab === "history"
                  ? "border-indigo-500 text-indigo-400 bg-slate-950/30"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              Run History
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === "properties" ? (
              selectedNode ? (
                <div className="flex flex-col gap-5">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Modify Node Properties</h3>
                    <p className="text-[11px] text-slate-400">Configure parameters for node classifier evaluation.</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Node ID</label>
                    <input
                      type="text"
                      value={selectedNode.id}
                      disabled
                      className="bg-slate-950 border border-slate-800 text-slate-500 px-3 py-2 rounded-lg text-xs cursor-not-allowed w-full font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Name / Label</label>
                    <input
                      type="text"
                      value={selectedNode.data.label}
                      onChange={(e) => updateNodeData("label", e.target.value)}
                      placeholder="E.g. Is payment failed?"
                      className="bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 px-3 py-2 rounded-lg text-xs w-full transition-all focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-300">Decision Question / Prompt</label>
                      <span className="text-[10px] text-slate-500 font-mono">Sent to Groq</span>
                    </div>
                    <textarea
                      value={selectedNode.data.prompt}
                      onChange={(e) => updateNodeData("prompt", e.target.value)}
                      placeholder="What question should the LLM evaluate with YES or NO?"
                      rows={5}
                      className="bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 px-3 py-2 rounded-lg text-xs w-full transition-all resize-none focus:outline-none font-sans leading-relaxed"
                    />
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Write a query that can be answered binary. E.g. <i>"Does the text request a service refund?"</i>
                    </p>
                  </div>

                  <div className="h-[1px] bg-slate-800 my-2" />

                  <button
                    onClick={deleteNode}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-rose-950/20 border border-rose-900/40 hover:bg-rose-950/50 text-rose-400 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Selected Node
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-64 border-2 border-dashed border-slate-800 rounded-xl p-6 text-slate-500">
                  <Layers className="w-10 h-10 mb-3 text-slate-700" />
                  <p className="text-xs font-medium">Select a node on the canvas to configure its properties or delete it.</p>
                </div>
              )
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider mb-2">
                  <History className="w-4 h-4 text-indigo-400" /> Recent Runs
                </div>
                {history.length > 0 ? (
                  <div className="flex flex-col gap-2.5">
                    {history.map((h) => (
                      <div
                        key={h.id}
                        className={`p-3 rounded-lg border flex flex-col gap-1.5 ${
                          h.status === "completed"
                            ? "bg-slate-950/50 border-slate-800"
                            : "bg-red-950/10 border-red-900/20"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-slate-400">ID: {h.id}</span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                            h.status === "completed"
                              ? "bg-emerald-950/80 border border-emerald-800/40 text-emerald-400"
                              : "bg-red-950/80 border border-red-900/40 text-red-400"
                          }`}>
                            {h.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Steps Evaluated:</span>
                          <span className="font-bold text-slate-200">{h.nodeCount} nodes</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Duration:</span>
                          <span className="font-bold text-indigo-300">{(h.durationMs / 1000).toFixed(2)}s</span>
                        </div>
                        <div className="text-[9px] text-slate-500 self-end">
                          {new Date(h.timestamp).toLocaleTimeString()} - {new Date(h.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                    No run logs recorded yet. Run a simulation to populate.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Execution Panel */}
          <div className="border-t border-slate-800 bg-slate-950 p-5 flex flex-col gap-3">
            <div className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1">Execution Center</div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSimulateRun}
                disabled={isSimulating || isInngestRunning}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
              >
                <Play className={`w-4 h-4 ${isSimulating ? "animate-spin" : ""}`} />
                {isSimulating ? "Running Local AI..." : "Simulate Run (UI)"}
              </button>

              <button
                onClick={handleInngestRun}
                disabled={isSimulating || isInngestRunning}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-emerald-500/20 cursor-pointer"
              >
                <Cpu className={`w-4 h-4 ${isInngestRunning ? "animate-spin" : ""}`} />
                {isInngestRunning ? "Sending to Queue..." : "Run Background Job (Inngest)"}
              </button>
            </div>

            <div className="flex items-start gap-2 text-[10px] text-slate-400 mt-2 bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
              <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <div className="leading-relaxed">
                Running locally executes decision prompts via LLM in real-time. Inngest dispatches events asynchronously. 
                <a 
                  href="http://localhost:8288" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-0.5 text-indigo-400 hover:text-indigo-300 font-bold ml-1"
                >
                  Open Inngest CLI <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <WorkflowEditor />
    </ReactFlowProvider>
  );
}

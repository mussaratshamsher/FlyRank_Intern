import type { WorkflowNodeData, WorkflowEdgeData } from "@/types/workflow";
import type { Node, Edge } from "@xyflow/react";

const STORAGE_KEY = "ai-decision-flow-workflow";
const HISTORY_KEY = "ai-decision-flow-history";

export function saveWorkflow(nodes: Node<WorkflowNodeData>[], edges: Edge<WorkflowEdgeData>[]) {
  const payload = {
    nodes,
    edges,
    meta: { name: "Support Decision Flow", version: 1, updatedAt: new Date().toISOString() },
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
}

export function loadWorkflow(): {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge<WorkflowEdgeData>[];
} | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return { nodes: parsed.nodes || [], edges: parsed.edges || [] };
  } catch {
    return null;
  }
}

export function clearWorkflow() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function loadHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistoryEntry(entry: {
  id: string;
  status: "completed" | "failed";
  nodeCount: number;
  durationMs: number;
  timestamp: number;
}) {
  const history = loadHistory();
  history.unshift(entry);
  const trimmed = history.slice(0, 50);
  if (typeof window !== "undefined") {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  }
}

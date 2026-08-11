export type NodeStatus = "idle" | "running" | "completed" | "failed";

export interface WorkflowNodeData {
  label: string;
  prompt: string;
  status: NodeStatus;
  result?: "YES" | "NO";
  error?: string;
  [key: string]: unknown;
}

export interface WorkflowEdgeData {
  branch: "YES" | "NO";
  [key: string]: unknown;
}

export interface ExecutionLog {
  id: string;
  nodeId: string;
  prompt: string;
  result?: "YES" | "NO";
  error?: string;
  status: NodeStatus;
  timestamp: number;
}

export interface WorkflowExecution {
  id: string;
  status: "running" | "completed" | "failed";
  logs: ExecutionLog[];
  startTime: number;
  endTime?: number;
  currentNodeId?: string;
  activeEdgeId?: string;
}

export interface WorkflowMeta {
  name: string;
  version: number;
  updatedAt: string;
}

export interface WorkflowState {
  nodes: import("@xyflow/react").Node<WorkflowNodeData>[];
  edges: import("@xyflow/react").Edge<WorkflowEdgeData>[];
}

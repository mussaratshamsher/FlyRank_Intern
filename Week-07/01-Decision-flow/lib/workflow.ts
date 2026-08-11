import { WorkflowNodeData, WorkflowEdgeData } from "@/types/workflow";

export function validateWorkflow(
  nodes: { id: string; data: WorkflowNodeData }[],
  edges: { id: string; source: string; target: string; data?: WorkflowEdgeData }[]
) {
  if (!nodes.length) return "Workflow is empty. Add a decision node to begin.";

  const nodeIds = new Set(nodes.map((n) => n.id));
  const incoming = new Map<string, string[]>();
  const outgoing = new Map<string, { YES?: string; NO?: string }>();

  for (const e of edges) {
    if (!nodeIds.has(e.source) || !nodeIds.has(e.target)) {
      return `Edge ${e.id} references an unknown node.`;
    }
    if (!e.data?.branch || (e.data.branch !== "YES" && e.data.branch !== "NO")) {
      return `Edge ${e.id} is missing a YES/NO label.`;
    }
    if (outgoing.has(e.source) && outgoing.get(e.source)![e.data.branch]) {
      return `Node ${e.source} has duplicate ${e.data.branch} outgoing edges.`;
    }
    incoming.set(e.target, [...(incoming.get(e.target) || []), e.id]);
    outgoing.set(e.source, { ...(outgoing.get(e.source) || {}), [e.data.branch]: e.target });
  }

  const roots = nodes.filter((n) => !incoming.has(n.id));
  if (roots.length === 0) return "Workflow has no starting node. Every node has an incoming edge.";
  if (roots.length > 1) return `Workflow has multiple starting nodes: ${roots.map((r) => r.id).join(", ")}. Connect them into a single flow.`;

  const root = roots[0].id;
  const missing = [];
  for (const node of nodes) {
    const out = outgoing.get(node.id);
    if (!out?.YES) missing.push(`${node.id}: missing YES edge`);
    if (!out?.NO) missing.push(`${node.id}: missing NO edge`);
  }
  if (missing.length) return "Validation errors:\n" + missing.join("\n");

  return null;
}

export function findRootNodeId(
  nodes: { id: string }[],
  edges: { source: string }[]
): string | null {
  const sources = new Set(edges.map((e) => e.source));
  const roots = nodes.filter((n) => !sources.has(n.id));
  return roots.length === 1 ? roots[0].id : null;
}

export function getNextNodeId(
  edges: { source: string; target: string; data?: { branch: "YES" | "NO" } }[],
  sourceId: string,
  result: "YES" | "NO"
): string | null {
  const edge = edges.find((e) => e.source === sourceId && e.data?.branch === result);
  return edge?.target || null;
}

import { Inngest } from "inngest";
import { decide } from "@/lib/groq";
import type { WorkflowNodeData, WorkflowEdgeData } from "@/types/workflow";

export const inngest = new Inngest({
  id: "ai-decision-flow",
});

type WorkflowRunEvent = {
  name: string;
  data: {
    executionId: string;
    nodes: { id: string; data: WorkflowNodeData }[];
    edges: { id: string; source: string; target: string; data?: WorkflowEdgeData }[];
  };
};

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0,
    triggers: [{ event: "workflow/run" }],
  },
  async ({ event, step }) => {
    const { executionId, nodes, edges }: WorkflowRunEvent["data"] = event.data as WorkflowRunEvent["data"];

    type Node = WorkflowRunEvent["data"]["nodes"][number];
    type Edge = WorkflowRunEvent["data"]["edges"][number];

    const nodeMap = new Map<string, Node>(nodes.map((n: Node) => [n.id, n]));
    const nextEdge = (sourceId: string, branch: "YES" | "NO") =>
      edges.find((e: Edge) => e.source === sourceId && e.data?.branch === branch);

    const root = nodes.find((n: Node) => !edges.some((e: Edge) => e.target === n.id));
    if (!root) throw new Error("No root node found");

    let currentId: string | null = root.id;

    while (currentId) {
      const node = nodeMap.get(currentId);
      if (!node) break;

      await step.run(`decision-${currentId}`, async () => {
        const result = await decide(node.data.prompt);
        return { nodeId: currentId, result };
      });

      const yesEdge = nextEdge(currentId, "YES");
      const noEdge = nextEdge(currentId, "NO");
      const lastResult = (event.data as any)?.lastResult;
      const branch: "YES" | "NO" = lastResult || "YES";
      const chosen = branch === "YES" ? yesEdge : noEdge;
      currentId = chosen?.target || null;
    }

    return { executionId, completed: true };
  }
);

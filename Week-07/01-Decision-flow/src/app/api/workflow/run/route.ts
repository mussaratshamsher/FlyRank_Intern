import { NextResponse } from "next/server";
import { decide } from "@/lib/groq";
import { validateWorkflow, getNextNodeId } from "@/lib/workflow";
import { ExecutionLog, WorkflowNodeData, WorkflowEdgeData } from "@/types/workflow";

export async function POST(request: Request) {
  try {
    const { nodes, edges } = await request.json();

    // 1. Validate the workflow first
    const validationError = validateWorkflow(nodes, edges);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const nodeMap = new Map<string, { id: string; data: WorkflowNodeData }>(nodes.map((n: any) => [n.id, n]));
    const logs: ExecutionLog[] = [];
    const startTime = Date.now();

    // 2. Find the root node
    const incomingSources = new Set(edges.map((e: any) => e.target));
    const rootNode = nodes.find((n: any) => !incomingSources.has(n.id));

    if (!rootNode) {
      return NextResponse.json({ error: "No root node found in workflow." }, { status: 400 });
    }

    let currentId: string | null = rootNode.id;
    let status: "completed" | "failed" = "completed";

    // 3. Execution loop
    while (currentId) {
      const node = nodeMap.get(currentId);
      if (!node) break;

      const logEntry: ExecutionLog = {
        id: Math.random().toString(36).substring(7),
        nodeId: currentId,
        prompt: node.data.prompt,
        status: "running",
        timestamp: Date.now(),
      };
      logs.push(logEntry);

      try {
        const result = await decide(node.data.prompt);
        logEntry.result = result;
        logEntry.status = "completed";
        logEntry.timestamp = Date.now();

        // Find next node
        const nextId = getNextNodeId(edges, currentId, result);
        currentId = nextId;
      } catch (err: any) {
        logEntry.error = err.message || "Unknown error occurred";
        logEntry.status = "failed";
        logEntry.timestamp = Date.now();
        status = "failed";
        break; // Stop execution on failure
      }
    }

    const endTime = Date.now();
    const durationMs = endTime - startTime;

    return NextResponse.json({
      success: status === "completed",
      status,
      logs,
      durationMs,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to execute workflow." }, { status: 500 });
  }
}

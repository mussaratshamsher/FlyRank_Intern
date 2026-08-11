import { NextResponse } from "next/server";
import { inngest } from "@/inngest/functions";
import { validateWorkflow } from "@/lib/workflow";

export async function POST(request: Request) {
  try {
    const { nodes, edges } = await request.json();

    // 1. Validate the workflow first
    const validationError = validateWorkflow(nodes, edges);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const executionId = crypto.randomUUID();

    // 2. Send the event to Inngest dev server
    await inngest.send({
      name: "workflow/run",
      data: {
        executionId,
        nodes: nodes.map((n: any) => ({
          id: n.id,
          data: {
            label: n.data.label,
            prompt: n.data.prompt,
            status: n.data.status,
            result: n.data.result,
            error: n.data.error,
          },
        })),
        edges: edges.map((e: any) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          data: {
            branch: e.data?.branch,
          },
        })),
      },
    });

    return NextResponse.json({
      success: true,
      executionId,
      message: "Workflow run event dispatched to Inngest background queue.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to dispatch Inngest event." },
      { status: 500 }
    );
  }
}

import { serve } from "inngest/next";
import { inngest, executeWorkflow } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [executeWorkflow],
});

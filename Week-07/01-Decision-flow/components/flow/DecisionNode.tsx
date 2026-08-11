import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Play, Check, AlertCircle, Loader2, HelpCircle } from "lucide-react";
import { WorkflowNodeData } from "@/types/workflow";

interface DecisionNodeProps {
  data: WorkflowNodeData;
  selected?: boolean;
}

export default function DecisionNode({ data, selected }: DecisionNodeProps) {
  const { label, prompt, status, result, error } = data;

  const statusStyles = {
    idle: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500",
    running: "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)] animate-pulse",
    completed: result === "YES" 
      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400" 
      : "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400",
    failed: "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
  };

  const statusIcons = {
    idle: <HelpCircle className="w-4 h-4 text-slate-400" />,
    running: <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />,
    completed: result === "YES" 
      ? <Check className="w-4 h-4 text-emerald-500" />
      : <Check className="w-4 h-4 text-rose-500" />,
    failed: <AlertCircle className="w-4 h-4 text-amber-500" />,
  };

  return (
    <div
      className={`px-4 py-3.5 rounded-xl border-2 transition-all duration-300 w-64 ${statusStyles[status]} ${
        selected ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900" : ""
      }`}
    >
      {/* Target/Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-slate-400 hover:!bg-indigo-500 dark:!bg-slate-600 transition-colors border-2 border-white dark:border-slate-900"
      />

      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="font-semibold text-sm tracking-tight text-slate-800 dark:text-slate-200 truncate">
          {label || "Decision Node"}
        </div>
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-900">
          {statusIcons[status]}
        </div>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic mb-2">
        {prompt || "No prompt configured"}
      </div>

      {status === "completed" && result && (
        <div className={`mt-2 py-1 px-2.5 rounded-lg text-xs font-bold flex items-center justify-between ${
          result === "YES" 
            ? "bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
            : "bg-rose-100/70 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
        }`}>
          <span>Decision:</span>
          <span className="tracking-wide">{result}</span>
        </div>
      )}

      {status === "failed" && error && (
        <div className="mt-2 py-1 px-2.5 rounded-lg bg-amber-100/70 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] leading-tight font-medium break-words">
          {error}
        </div>
      )}

      {/* YES Handle (Bottom-Left) */}
      <div className="absolute -bottom-[20px] left-[25%] flex flex-col items-center">
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 select-none">YES</span>
        <Handle
          type="source"
          id="YES"
          position={Position.Bottom}
          style={{ left: "25%" }}
          className="w-3.5 h-3.5 !bg-emerald-500 hover:!bg-emerald-600 border-2 border-white dark:border-slate-900 transition-colors"
        />
      </div>

      {/* NO Handle (Bottom-Right) */}
      <div className="absolute -bottom-[20px] right-[25%] flex flex-col items-center">
        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-500 select-none">NO</span>
        <Handle
          type="source"
          id="NO"
          position={Position.Bottom}
          style={{ right: "25%" }}
          className="w-3.5 h-3.5 !bg-rose-500 hover:!bg-rose-600 border-2 border-white dark:border-slate-900 transition-colors"
        />
      </div>
    </div>
  );
}

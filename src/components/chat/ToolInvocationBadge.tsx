import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

function getLabel(toolInvocation: ToolInvocation): string {
  const args = toolInvocation.args as Record<string, string> | undefined;
  const command = args?.command;
  const path = args?.path;

  if (!command || !path) {
    return toolInvocation.toolName;
  }

  switch (toolInvocation.toolName) {
    case "str_replace_editor":
      switch (command) {
        case "create":
          return `Created ${path}`;
        case "str_replace":
        case "insert":
          return `Edited ${path}`;
        case "view":
          return `Viewed ${path}`;
        default:
          return toolInvocation.toolName;
      }
    case "file_manager":
      switch (command) {
        case "rename":
          return `Renamed ${path}`;
        case "delete":
          return `Deleted ${path}`;
        default:
          return toolInvocation.toolName;
      }
    default:
      return toolInvocation.toolName;
  }
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const isComplete = toolInvocation.state === "result" && toolInvocation.result;
  const label = getLabel(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}

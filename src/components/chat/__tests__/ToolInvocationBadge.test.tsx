import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

function makeTool(
  toolName: string,
  args: Record<string, string>,
  state: "call" | "result" = "result",
  result: unknown = "Success"
) {
  if (state === "result") {
    return { toolName, toolCallId: "test-id", args, state, result };
  }
  return { toolName, toolCallId: "test-id", args, state };
}

test("shows 'Created' for str_replace_editor create command", () => {
  const tool = makeTool("str_replace_editor", {
    command: "create",
    path: "/components/Card.jsx",
  });
  render(<ToolInvocationBadge toolInvocation={tool} />);
  expect(screen.getByText("Created /components/Card.jsx")).toBeDefined();
});

test("shows 'Edited' for str_replace_editor str_replace command", () => {
  const tool = makeTool("str_replace_editor", {
    command: "str_replace",
    path: "/components/Card.jsx",
  });
  render(<ToolInvocationBadge toolInvocation={tool} />);
  expect(screen.getByText("Edited /components/Card.jsx")).toBeDefined();
});

test("shows 'Edited' for str_replace_editor insert command", () => {
  const tool = makeTool("str_replace_editor", {
    command: "insert",
    path: "/App.jsx",
  });
  render(<ToolInvocationBadge toolInvocation={tool} />);
  expect(screen.getByText("Edited /App.jsx")).toBeDefined();
});

test("shows 'Viewed' for str_replace_editor view command", () => {
  const tool = makeTool("str_replace_editor", {
    command: "view",
    path: "/App.jsx",
  });
  render(<ToolInvocationBadge toolInvocation={tool} />);
  expect(screen.getByText("Viewed /App.jsx")).toBeDefined();
});

test("shows 'Renamed' for file_manager rename command", () => {
  const tool = makeTool("file_manager", {
    command: "rename",
    path: "/old-name.jsx",
  });
  render(<ToolInvocationBadge toolInvocation={tool} />);
  expect(screen.getByText("Renamed /old-name.jsx")).toBeDefined();
});

test("shows 'Deleted' for file_manager delete command", () => {
  const tool = makeTool("file_manager", {
    command: "delete",
    path: "/unused.jsx",
  });
  render(<ToolInvocationBadge toolInvocation={tool} />);
  expect(screen.getByText("Deleted /unused.jsx")).toBeDefined();
});

test("falls back to raw tool name for unknown tool", () => {
  const tool = makeTool("some_other_tool", { command: "run", path: "/file" });
  render(<ToolInvocationBadge toolInvocation={tool} />);
  expect(screen.getByText("some_other_tool")).toBeDefined();
});

test("falls back to raw tool name when args are missing", () => {
  const tool = makeTool("str_replace_editor", {});
  render(<ToolInvocationBadge toolInvocation={tool} />);
  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

test("shows green dot when tool state is result", () => {
  const tool = makeTool("str_replace_editor", {
    command: "create",
    path: "/App.jsx",
  });
  const { container } = render(<ToolInvocationBadge toolInvocation={tool} />);
  const dot = container.querySelector(".bg-emerald-500");
  expect(dot).toBeDefined();
  expect(dot?.tagName).toBe("DIV");
});

test("shows spinner when tool is still in progress", () => {
  const tool = makeTool(
    "str_replace_editor",
    { command: "create", path: "/App.jsx" },
    "call"
  );
  const { container } = render(<ToolInvocationBadge toolInvocation={tool} />);
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

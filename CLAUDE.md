# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator. Users describe components in natural language via a chat interface, and Claude AI generates JSX code that renders in a live preview. Components exist in a virtual file system (in-memory, no disk writes).

## Commands

```bash
npm run setup        # First-time: install deps, generate Prisma client, run migrations
npm run dev          # Start dev server (Next.js + Turbopack) on localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm test             # Run all tests (Vitest)
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx  # Single test file
npm run db:reset     # Reset SQLite database
npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma migrate dev --name <name>  # Create new migration
```

## Architecture

### AI Component Generation Flow

1. User sends message → `ChatProvider` (context) calls `/api/chat` POST endpoint
2. `route.ts` reconstructs `VirtualFileSystem` from serialized state, sets up Claude with tools
3. Claude uses `str_replace_editor` and `file_manager` tools to create/modify files in the virtual FS
4. Vercel AI SDK streams responses back; file changes update React state via `FileSystemProvider`
5. `PreviewFrame` renders components in a sandboxed iframe using Babel standalone for runtime JSX compilation
6. For authenticated users, messages and file state are persisted to the Project table as JSON

### Provider System (`src/lib/provider.ts`)

- With `ANTHROPIC_API_KEY` in `.env`: uses Claude Haiku 4.5 via `@ai-sdk/anthropic`
- Without API key: falls back to `MockLanguageModel` that returns static templates (counter, form, card)

### Key Modules

- **`src/lib/file-system.ts`** — `VirtualFileSystem` class: in-memory file/directory operations with serialize/deserialize for persistence
- **`src/lib/tools/`** — AI tool definitions (`str_replace_editor` for file editing, `file_manager` for directory operations)
- **`src/lib/transform/jsx-transformer.ts`** — Converts JSX files to browser-executable HTML with import maps for the preview iframe
- **`src/lib/prompts/generation.tsx`** — System prompt that guides Claude's code generation behavior
- **`src/lib/contexts/`** — React contexts: `ChatProvider` (chat state + useChat hook), `FileSystemProvider` (virtual FS state)
- **`src/actions/`** — Next.js server actions for auth (signUp, signIn, signOut) and project CRUD

### Database

SQLite via Prisma. Schema in `prisma/schema.prisma`. Two models:
- **User**: email/password auth (bcrypt hashed, JWT sessions via jose)
- **Project**: belongs to User (optional for anon). Stores `messages` and `data` (file system state) as JSON strings.

Prisma client is generated to `src/generated/prisma/`.

### UI Layout

Split-panel interface (`react-resizable-panels`): chat on left, code editor (Monaco) + preview iframe on right. UI components use shadcn/ui (Radix + Tailwind CSS v4), configured in `components.json` with New York style.

## Tech Stack Versions

- Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS v4
- Vercel AI SDK v4.3.16, `@ai-sdk/anthropic` v1.2.12
- Prisma v6, Vitest v3, Testing Library

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Code Style

- Use comments sparingly. Only comment complex code.

## Testing

Vitest with jsdom environment. Tests live in `__tests__/` directories next to their components. Uses `@testing-library/react` and `@testing-library/user-event`.

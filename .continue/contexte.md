# Project Context

## Goal
Build a local AI coding assistant / autonomous agent using Ollama + Continue.
The agent must run 100% locally, with no external API dependencies.

## Stack
- Node.js (ESM modules)
- Ollama (local LLM runtime)
- Qwen 2.5 Coder 14B (model)
- Continue extension (VS Code IDE integration)

## Architecture
- `src/agent.js` → main ReAct loop (reason → tool call → observe → repeat)
- `src/tools/index.js` → available tools: shell, read file, write file
- `docs/skills/` → knowledge base the agent can reference per technology

## Available Skills
- `docs/skills/next.md` → Next.js patterns, commands, and project structure

## Notes
- Running locally (no cloud, no paid API)
- Focus on coding tasks
- Agent uses tool_calls format (Ollama function calling)
- Max 10 iterations per mission to avoid infinite loops
- Always check existing files before creating new ones
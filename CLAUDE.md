# Project Rules

## General
- Keep code simple and readable
- Prefer minimal dependencies
- Explain briefly when needed

## Code Style
- Use JavaScript/Node.js (ESM modules — `import/export`)
- Write modular code
- Use clear naming

## Project Structure
- `src/agent.js` → point d'entrée principal de l'agent
- `src/tools/index.js` → registre et exécution des tools
- `docs/skills/` → documentation des skills que l'agent peut apprendre
- `.continue/prompts/` → prompts pour le mode Agent dans Continue

## Behavior
- Always check existing files before creating new ones
- Do not duplicate logic
- Suggest improvements if relevant
- Read `docs/skills/*.md` before working on a related technology

## Available Skills
- `docs/skills/next.md` → patterns et commandes Next.js

## Commands
- Run agent: `npm run dev -- "ta mission ici"`
- Run tests: `npm test`
- Call API manually: `node api.js`
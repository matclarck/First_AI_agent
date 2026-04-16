import "dotenv/config";
import { Ollama } from "ollama";
import { tools, executeTool } from "./tools/index.js";

const ollama = new Ollama({ host: process.env.OLLAMA_HOST || "http://localhost:11434" });
const MODEL = process.env.OLLAMA_MODEL || "qwen2.5-coder:14b";
const AGENT_NAME = process.env.AGENT_NAME || "Agent";

// --- Boucle agent principale ---
async function runAgent(userMessage) {
  console.log(`\n[${AGENT_NAME}] Mission reçue : "${userMessage}"\n`);

  const messages = [
    {
      role: "system",
      content: `Tu es un agent IA autonome nommé ${AGENT_NAME}.
Tu as accès à des outils. Utilise-les pour accomplir la mission.
Raisonne étape par étape. Quand tu as fini, réponds avec un résumé clair.`,
    },
    { role: "user", content: userMessage },
  ];

  // Boucle ReAct : raisonnement → action → observation
  let iteration = 0;
  const MAX_ITERATIONS = 10;

  while (iteration < MAX_ITERATIONS) {
    iteration++;
    console.log(`[Tour ${iteration}]`);

    const response = await ollama.chat({
      model: MODEL,
      messages,
      tools,
      stream: false,
    });

    const msg = response.message;
    messages.push(msg);

    // Pas d'appel d'outil → réponse finale
    if (!msg.tool_calls || msg.tool_calls.length === 0) {
      console.log(`\n✅ Réponse finale :\n${msg.content}`);
      return msg.content;
    }

    // Exécution des outils appelés
    for (const call of msg.tool_calls) {
      const toolName = call.function.name;
      const toolArgs = call.function.arguments;

      console.log(`🔧 Outil appelé : ${toolName}`, toolArgs);
      const result = await executeTool(toolName, toolArgs);
      console.log(`📥 Résultat : ${result}`);

      messages.push({
        role: "tool",
        content: String(result),
      });
    }
  }

  console.warn("⚠️  Nombre maximum d'itérations atteint.");
  return null;
}

// --- Point d'entrée CLI ---
const mission = process.argv.slice(2).join(" ") || "Dis bonjour et présente-toi.";
runAgent(mission);
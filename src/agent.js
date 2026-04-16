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
      content: `Tu es un agent IA autonome nommé ${AGENT_NAME}, expert en développement JavaScript/Node.js.
Tu as accès à des outils. Utilise-les pour accomplir la mission.
Règles strictes :
1. Raisonne étape par étape.
2. Si tu dois utiliser un outil, tu DOIS utiliser la fonctionnalité d'appel d'outil. Ne réponds pas avec du JSON brut.
3. Quand tu as terminé ou que tu as la réponse, fais un résumé clair de ta réponse finale en texte clair.`,
    },
    { role: "user", content: userMessage },
  ];

  // Boucle ReAct : raisonnement → action → observation
  let iteration = 0;
  const MAX_ITERATIONS = 10;

  while (iteration < MAX_ITERATIONS) {
    iteration++;
    console.log(`\n[Tour ${iteration}] L'agent réfléchit...`);

    const response = await ollama.chat({
      model: MODEL,
      messages,
      tools,
      stream: false,
    });

    const msg = response.message;
    messages.push(msg);

    // --- SÉCURITÉ : GESTION DU JSON DANS LE TEXTE ---
    // Si Ollama n'a pas déclenché "tool_calls" mais a écrit du JSON dans "content"
    if (!msg.tool_calls || msg.tool_calls.length === 0) {
      let possibleText = msg.content.trim();
      
      // Nettoyage si le modèle a mis des balises markdown ```json
      if (possibleText.startsWith('```json')) {
        possibleText = possibleText.replace(/```json\n?/, '').replace(/```$/, '').trim();
      } else if (possibleText.startsWith('```')) {
        possibleText = possibleText.replace(/```\n?/, '').replace(/```$/, '').trim();
      }

      try {
        const parsed = JSON.parse(possibleText);
        // Si c'est bien un format d'outil
        if (parsed.name && parsed.arguments) {
          console.log("🛠️ [Correction] Le modèle a écrit du JSON dans le texte, conversion en action...");
          msg.tool_calls = [{
            function: {
              name: parsed.name,
              arguments: parsed.arguments
            }
          }];
        }
      } catch (e) {
        // Ce n'est pas du JSON valide, c'est donc vraiment la réponse finale texte
        console.log(`\n✅ Réponse finale :\n${msg.content}`);
        return msg.content;
      }
    }

    // --- EXÉCUTION DES OUTILS ---
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      for (const call of msg.tool_calls) {
        const toolName = call.function.name;
        // Parfois Ollama renvoie les arguments en string, on sécurise le parsing
        const toolArgs = typeof call.function.arguments === 'string' 
          ? JSON.parse(call.function.arguments) 
          : call.function.arguments;

        console.log(`🔧 Outil appelé : ${toolName}`, toolArgs);
        
        const result = await executeTool(toolName, toolArgs);
        console.log(`📥 Résultat de l'outil récupéré (longueur: ${String(result).length} caractères). Renvoi à l'agent...`);

        // On renvoie le résultat de l'outil au modèle pour le prochain tour
        messages.push({
          role: "tool",
          content: String(result),
        });
      }
    }
  }

  console.warn("\n⚠️ Nombre maximum d'itérations atteint.");
  return null;
}

// --- Point d'entrée CLI ---
const mission = process.argv.slice(2).join(" ") || "Dis bonjour et présente-toi.";
runAgent(mission);
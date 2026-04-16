import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";

// ─────────────────────────────────────────
//  Définition des tools (format Ollama)
// ─────────────────────────────────────────
export const tools = [
  {
    type: "function",
    function: {
      name: "run_shell",
      description: "Exécute une commande shell et retourne la sortie.",
      parameters: {
        type: "object",
        properties: {
          command: { type: "string", description: "La commande shell à exécuter." },
        },
        required: ["command"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "read_file",
      description: "Lit le contenu d'un fichier texte.",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "Chemin relatif ou absolu du fichier." },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "write_file",
      description: "Écrit du contenu dans un fichier (crée ou écrase).",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "Chemin du fichier." },
          content: { type: "string", description: "Contenu à écrire." },
        },
        required: ["path", "content"],
      },
    },
  },
];

// ─────────────────────────────────────────
//  Exécution des tools
// ─────────────────────────────────────────
export async function executeTool(name, args) {
  try {
    switch (name) {
      case "run_shell": {
        const output = execSync(args.command, { encoding: "utf8", timeout: 10000 });
        return output.trim();
      }
      case "read_file": {
        if (!existsSync(args.path)) return `Erreur : fichier introuvable → ${args.path}`;
        return readFileSync(args.path, "utf8");
      }
      case "write_file": {
        writeFileSync(args.path, args.content, "utf8");
        return `Fichier écrit : ${args.path}`;
      }
      default:
        return `Erreur : outil inconnu → ${name}`;
    }
  } catch (err) {
    return `Erreur lors de l'exécution de ${name} : ${err.message}`;
  }
}
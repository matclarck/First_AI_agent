import fs from 'fs';
import { execSync } from 'child_process';
import { read_pdf } from './pdf_reader.js'; // Importe le nouvel outil

// Définition des outils pour le modèle (Format Ollama)
export const tools = [
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Lit le contenu d’un fichier texte.',
      parameters: {
        type: 'object',
        properties: { path: { type: 'string' } },
        required: ['path'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'read_pdf',
      description: 'Extrait le texte d’un fichier PDF (utile pour les rapports scientifiques).',
      parameters: {
        type: 'object',
        properties: { path: { type: 'string' } },
        required: ['path'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'write_file',
      description: 'Écrit du contenu dans un fichier.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          content: { type: 'string' },
        },
        required: ['path', 'content'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'run_shell',
      description: 'Exécute une commande shell (ex: ls, python script.py).',
      parameters: {
        type: 'object',
        properties: { command: { type: 'string' } },
        required: ['command'],
      },
    },
  }
];

// Logique d'exécution
export async function executeTool(name, args) {
  try {
    switch (name) {
      case 'read_file':
        return fs.readFileSync(args.path, 'utf8');
      
      case 'read_pdf':
        return await read_pdf(args); // Appelle ta fonction pdf-parse
        
      case 'write_file':
        fs.writeFileSync(args.path, args.content, 'utf8');
        return `Fichier ${args.path} écrit avec succès.`;
        
      case 'run_shell':
        return execSync(args.command).toString();
        
      default:
        return `Outil inconnu : ${name}`;
    }
  } catch (error) {
    return `Erreur lors de l'exécution de ${name} : ${error.message}`;
  }
}
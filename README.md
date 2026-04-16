# First AI Agent 

Agent IA autonome 100% open source, tournant entièrement en local avec [Ollama](https://ollama.com) et [Continue](https://continue.dev).

## Stack
- **Modèle** : Qwen 2.5 Coder 14B (via Ollama)
- **Runtime** : Node.js 18+
- **IDE** : VS Code + Continue (extension)

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/matclarck/First_AI_agent.git
cd First_AI_agent

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env

# 4. S'assurer qu'Ollama tourne avec le bon modèle
ollama pull qwen2.5-coder:14b
ollama serve
```

## Utilisation

```bash
# Lancer l'agent avec une mission
npm run dev -- "Crée un fichier hello.js qui affiche Bonjour le monde"

# Sans mission (mode par défaut)
npm run dev
```

## Structure du projet

```
First_AI_agent/
├── .continue/
│   ├── config.json          # Config Continue (modèle, context providers, commandes)
    ├── contexte.md          # contexte du projet pour que l'agent conserve du contexte 
│   └── prompts/
│       └── agent.prompt     # Prompt système du mode Agent
├── docs/
│   └── skills/
│       └── next.md          # Skill Next.js appris par l'agent
├── src/
│   ├── agent.js             # Boucle agent principale (ReAct loop)
│   └── tools/
│       └── index.js         # Tools disponibles (shell, read/write fichiers)
├── .env.example
├── .gitignore
├── Rules.md                # Règles du projet lues par l'agent
├── package.json
└── README.md
```

## Ajouter un skill

1. Créer un fichier `docs/skills/mon-skill.md`
2. L'ajouter dans `Rules.md` sous "Available Skills"
3. Le mentionner dans `.continue/prompts/agent.prompt`

## Ajouter un tool

Éditer `src/tools/index.js` :
1. Ajouter la définition dans le tableau `tools`
2. Ajouter le `case` correspondant dans `executeTool`
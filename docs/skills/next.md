# Skill : Next.js

## Description
Ce skill documente les connaissances et patterns Next.js que l'agent peut utiliser
quand une mission implique de créer ou modifier une application Next.js.

## Quand utiliser ce skill
- Quand on te demande de créer une page, un composant, ou une route Next.js
- Quand on te demande d'ajouter une API route
- Quand on te parle de App Router, Pages Router, SSR, SSG, ISR

## Structure d'un projet Next.js (App Router)

```
my-app/
├── app/
│   ├── layout.js       # Layout racine (obligatoire)
│   ├── page.js         # Page d'accueil (route "/")
│   └── api/
│       └── route.js    # API route
├── public/             # Fichiers statiques
├── next.config.js      # Config Next.js
└── package.json
```

## Commandes essentielles

```bash
npx create-next-app@latest mon-app   # Créer un projet
npm run dev                           # Serveur de dev (port 3000)
npm run build                         # Build production
npm start                             # Démarrer en prod
```

## Patterns courants

### Page simple
```jsx
// app/page.js
export default function HomePage() {
  return <main><h1>Bonjour</h1></main>;
}
```

### API Route
```js
// app/api/hello/route.js
export async function GET() {
  return Response.json({ message: "Hello" });
}
```

### Fetch de données (Server Component)
```jsx
async function getData() {
  const res = await fetch("https://api.example.com/data");
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

## Notes importantes
- Toujours utiliser `"use client"` en haut d'un fichier si tu utilises useState/useEffect
- Les Server Components (défaut) ne peuvent pas utiliser les hooks React
- Les routes API dans App Router utilisent `route.js`, pas `pages/api/`
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

export async function read_pdf({ path }) {
    if (!fs.existsSync(path)) {
        return `Erreur : Le fichier ${path} est introuvable.`;
    }
    const dataBuffer = fs.readFileSync(path);
    const data = await pdf(dataBuffer);
    return data.text; // Retourne le texte extrait du PDF
}
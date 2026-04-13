# Conventions du Projet

Ce document décrit les conventions et les instructions à suivre pour le développement de ce projet.

## Objectif
Le but de ce projet est de créer un scraper LinkedIn en utilisant Playwright. Le script doit être capable de rechercher des offres d'emploi en stage.

## Environnement de Développement
- **Playwright**: Utiliser Playwright pour automatiser les interactions avec le navigateur.
- **Headless Mode**: Désactiver la mode headless (`headless=False`) afin de voir le navigateur en action.
- **Sélecteur CSS**: Utiliser le sélecteur `div.base-card` pour cibler les offres d'emploi.

## Procédure
1. **Lancement du Navigateur**:
   - Utilisez `pythonbrowser = await p.chromium.launch(headless=False)` pour lancer le navigateur en mode non headless.
   - Attendez que la page charge complètement avec `await page.wait_for_timeout(3000)`.

2. **Connexion Manuelle**:
   - Lorsque le navigateur s'ouvre, connectez-vous manuellement à LinkedIn.
   - Une fois connecté, laissez le script continuer son exécution.

3. **Débogage**:
   - Ajoutez un `print` pour afficher le HTML de la page en cas d'absence de résultats : `print(await page.content())`.

## Exemple de Code
Voici un exemple de code mis à jour :


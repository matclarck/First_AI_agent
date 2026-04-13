import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        # Ouvrir LinkedIn et attendre la connexion manuelle
        await page.goto('https://www.linkedin.com')
        print("Veuillez vous connecter à LinkedIn manuellement.")
        
        # Attendre que l'utilisateur se connecte
        input("Appuyez sur Entrée une fois connecté...")
        
        # Rechercher des offres d'emploi en stage
        await page.goto('https://www.linkedin.com/jobs/search/?f_LF=f_AL&keywords=stage')
        await page.wait_for_timeout(3000)
        
        # Extraire les offres d'emploi
        offers = await page.querySelectorAll('div.base-card')
        for offer in offers:
            content = await offer.innerHTML()
            print(content)
        
        # Fermer le navigateur
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())

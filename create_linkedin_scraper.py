import asyncio
from playwright.async_api import async_playwright

async def search_stage_offers():
    keyword = "stage recherche statistique"
    location = "Paris"

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()

        # Navigate to LinkedIn jobs search page
        url = f"https://www.linkedin.com/jobs/search/?keywords={keyword}&location={location}"
        await page.goto(url)

        # Wait for job listings to load
        await page.wait_for_selector('div.base-card relative w-full hover:no-underline')

        # Extract job listings
        job_listings = await page.query_selector_all('div.base-card relative w-full hover:no-underline')
        
        for job in job_listings:
            title = await job.query_selector('h3.base-search-card__title').text_content()
            company = await job.query_selector('h4.base-search-card__subtitle').text_content()
            link = await job.query_selector('a')['href']
            
            print(f"Title: {title}")
            print(f"Company: {company}")
            print(f"Link: https://www.linkedin.com{link}\n")

        # Close browser
        await browser.close()

if __name__ == '__main__':
    asyncio.run(search_stage_offers())

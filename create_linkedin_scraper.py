import requests
from bs4 import BeautifulSoup

def search_stage_offers(keyword, location):
    url = f"https://www.linkedin.com/jobs/search/?keywords={keyword}&location={location}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        job_listings = soup.find_all('div', class_='base-card relative w-full hover:no-underline')
        
        for job in job_listings:
            title = job.find('h3', class_='base-search-card__title').text.strip()
            company = job.find('h4', class_='base-search-card__subtitle').text.strip()
            link = job.find('a')['href']
            
            print(f"Title: {title}")
            print(f"Company: {company}")
            print(f"Link: https://www.linkedin.com{link}\n")
    else:
        print("Failed to retrieve data")

if __name__ == '__main__':
    keyword = input("Enter the job keyword: ")
    location = input("Enter the location: ")
    search_stage_offers(keyword, location)

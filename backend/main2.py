from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import feedparser
from datetime import datetime
import re
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# FastAPI app instance
app = FastAPI()

# Add CORS middleware with specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5177"],  # Add your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# RSS Feed URLs
FEED_MAP = {
    "Inc42": "https://inc42.com/feed",
    "The Economic Times Startups": "https://economictimes.indiatimes.com/small-biz/startups/rssfeeds/11993050.cms",
}

# Pydantic model for News Article
class NewsArticle(BaseModel):
    title: str
    link: str
    published: str
    summary: str
    image: str

def clean_html(raw_html):
    """Remove HTML tags from text."""
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext

# Helper function to fetch news articles
def fetch_news(feed_url):
    """Fetch news articles from an RSS feed."""
    try:
        logger.info(f"Fetching news from: {feed_url}")
        feed = feedparser.parse(feed_url)
        
        if feed.bozo:  # Check if there was an error parsing the feed
            logger.error(f"Error parsing feed: {feed.bozo_exception}")
            return []
            
        if not feed.entries:
            logger.warning("No entries found in feed")
            return []

        articles = []
        for entry in feed.entries[:7]:  # Get latest 7 articles
            try:
                # Clean the summary text
                summary = clean_html(entry.get('summary', ''))
                
                article = {
                    'title': entry.get('title', 'No Title'),
                    'link': entry.get('link', '#'),
                    'published': entry.get('published', datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')),
                    'summary': summary,
                    'image': extract_image(entry)
                }
                articles.append(article)
            except Exception as e:
                logger.error(f"Error processing entry: {str(e)}")
                continue

        return articles
    except Exception as e:
        logger.error(f"Error fetching news: {str(e)}")
        return []

# Helper function to extract image from RSS entry
def extract_image(entry):
    """Extract images from RSS feed entries."""
    try:
        if hasattr(entry, 'media_content') and entry.media_content:
            return entry.media_content[0]['url']
        elif hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
            return entry.media_thumbnail[0]['url']
        elif hasattr(entry, 'enclosures') and entry.enclosures:
            return entry.enclosures[0].href
        elif hasattr(entry, 'content') and entry.content:
            img_pattern = r'<img[^>]+src=["\'](.*?)["\']'
            matches = re.findall(img_pattern, entry.content[0].value)
            if matches:
                return matches[0]
        return 'https://via.placeholder.com/300x200.png?text=No+Image+Available'
    except Exception as e:
        logger.error(f"Error extracting image: {str(e)}")
        return 'https://via.placeholder.com/300x200.png?text=No+Image+Available'

# FastAPI endpoint to get news
@app.get("/news/")
async def get_news(source: str = "Inc42"):
    """Fetch news articles from a specified news source."""
    try:
        if source not in FEED_MAP:
            raise HTTPException(
                status_code=400,
                detail="Invalid news source. Please choose from Inc42 or The Economic Times Startups."
            )

        feed_url = FEED_MAP[source]
        articles = fetch_news(feed_url)

        if not articles:
            raise HTTPException(
                status_code=404,
                detail="No articles found. Please try again later."
            )

        # Return the articles in a structured format
        return {"news": articles}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in get_news: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while fetching news."
        )

# Root endpoint (health check)
@app.get("/")
async def home():
    return {"status": "healthy", "message": "FastAPI News App is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
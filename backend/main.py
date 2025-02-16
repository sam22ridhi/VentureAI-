from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from crewai import Agent, Task, LLM, Crew
from crewai_tools import SerperDevTool,ScrapeWebsiteTool,SeleniumScrapingTool,FileReadTool
from crewai_tools import SerperDevTool
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Initialize tools and LLM
SERPER_API_KEY = os.getenv("SERPER_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
search_internet = SerperDevTool()
file_read_tool = FileReadTool("/Users/sam22ridhi/Downloads/project 7/backend/ideas.md")
file_read_tool2 = FileReadTool("/Users/sam22ridhi/Downloads/project 7/backend/market.md")
file_read_tool3 = FileReadTool("/Users/sam22ridhi/Downloads/project 7/backend/company.md")
scrape_tool = ScrapeWebsiteTool()
llm = LLM(model="gemini/gemini-1.5-flash-latest")

# FastAPI app instance
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This allows all origins; adjust as needed for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model to accept the user's startup idea
class StartupIdea(BaseModel):
    idea: str

def funding_agent(user_idea: str):
    fund_distribution_agent = Agent(
        role="Fund Distribution Specialist",
        goal=f"Provide an optimal fund distribution strategy for the user's startup {user_idea}, considering market insights and current investor trends.",
        backstory="""You are an expert in startup funding and financial planning. Your role is to allocate funds effectively 
                    across key business areas and provide insights into investors currently active in relevant sectors.""",
        allow_delegation=False,
        llm=llm,
        verbose=True,
        memory=True,
    )

# Fund Distribution Task
    fund_distribution_task = Task(
        description=f"""Analyze the user's startup idea and provide a detailed fund distribution strategy based on insights 
                        from `market.md`. Include the following:

                        **Instructions**:
                        1. **Fund Allocation**:
                        - Distribute funds across key business areas, such as product development, marketing, operations, 
                            hiring, and contingency reserves.
                        - Provide percentages or specific amounts (if total funding is provided) for each area.
                        - Justify the allocation based on market trends, competitive analysis, and growth priorities.

                        2. **Investor Insights**:
                            - Identify investors currently active in the relevant sector(s) based on recent funding trends.
                            - Provide details such as investor names, investment focus (e.g., SaaS, fintech), and funding rounds.
                            - Include any available contact information (email, LinkedIn profiles, or websites).

                            3. **Additional Recommendations**:
                            - Suggest strategies for optimizing fund usage to maximize ROI.
                            - Highlight potential risks in fund allocation and how to mitigate them.

                            **Output Format**:
                            - A structured table or list showing fund distribution percentages or amounts.
                            - A section listing relevant investors with their details.
                            - Additional recommendations for efficient fund utilization.""",
            expected_output="""Comprehensive fund distribution strategy including:

                1. **Fund Allocation**:
                    - Breakdown of fund distribution across key areas (e.g., product development, marketing).
                    - Justifications for each allocation.

                2. **Investor Insights**:
                    - List of investors currently active in relevant sectors with details (e.g., names, focus areas).
                    - Contact information if available.

                3. **Additional Recommendations**:
                    - Suggestions for optimizing fund usage and mitigating risks.""",
                tools=[file_read_tool2, search_internet],
                output_file="fund_distribution.md",
                memory=True,
                agent=fund_distribution_agent,
        )
    crew = Crew(
            agents=[fund_distribution_agent],
            tasks=[fund_distribution_task],
            process="sequential"
        )

    funding_result = crew.kickoff(inputs={"question": user_idea})
    return funding_result.raw.strip()


def create_market_analysis_agent(user_idea: str):
    """Create and execute a Market Analysis Agent to analyze market trends and competitors."""
    
    market_analyzer = Agent(
        role="Market Analysis Specialist",
        goal=f"Perform a thorough market analysis for the user's startup idea {user_idea} using data from ideas.md.",
        backstory="""You are an expert in market research with the ability to assess customer demographics, 
                    competitor products, market demand, and trends in the AI startup space. 
                    You should focus on analyzing AI-powered products, the competitive landscape, 
                    and the target audience for these products.""",
        tools=[search_internet, file_read_tool, scrape_tool],
        allow_delegation=False,
        llm=llm,
        verbose=True,
        memory=True,
        output_file="market.md"
    )

    market_analysis_task = Task(
        description="""Conduct a comprehensive market analysis for the startup idea in ideas.md.

        **1. Competitor Analysis**
        - Identify top competitors in the AI startup industry
        - Compare pricing, market positioning, USPs, and customer base

        **2. Product Insights**
        - Analyze best-selling AI-powered products
        - Key features, pricing, and customer feedback

        **3. Target Audience Analysis**
        - Customer demographics, psychographics, and buying patterns

        **4. Marketing Strategy Analysis**
        - Advertising channels, brand messaging, and customer acquisition tactics

        **5. Pricing & Promotions**
        - Competitor pricing structures and discount strategies

        **6. Customer Feedback & Sentiment**
        - Online reviews, satisfaction metrics, and complaints

        **7. Strategic Recommendations**
        - Market opportunities and competitive advantages""",
        
        expected_output="""A structured market report (market.md) containing below and (ATTACH LINKS TO WEBSITE IF POSSIBLE):
        - Competitor landscape (
        - Product insights
        - Target audience breakdown
        - Marketing strategy insights
        - Pricing & promotional strategies
        - Customer feedback trends
        - Strategic recommendations""",
        
        tools=[search_internet, file_read_tool, scrape_tool],
        output_file="market.md",
        memory=True,
        agent=market_analyzer,
    )

    crew = Crew(
        agents=[market_analyzer],
        tasks=[market_analysis_task],
        process="sequential"
    )

    market_result = crew.kickoff(inputs={"question": user_idea})
    return market_result.raw.strip()

# Function to create and execute the idea validation agent
def create_validation_agent(user_idea: str):
    """Create and execute an Idea Validation Agent to validate startup ideas."""
    idea_validator = Agent(
        role="Idea Validation Specialist",
        goal="Analyze and validate startup ideas by searching the internet for existing solutions.",
        backstory="""You are an expert in market research and startup innovation. You can search 
                    the web to determine if an idea is already out there and, if so, how impactful it is.""",
        tools=[search_internet],
        allow_delegation=False,
        llm=llm,
        verbose=True,
        memory=True
    )
    

    # Update the validation_task description
    validation_task = Task(
            description=f"""Validate the user's startup idea: {user_idea}
                
                Steps:
                1. Search the internet for similar ideas or existing products.
                2. Determine if the idea exists or is unique.
                3. If the idea exists:
                a. List 3-5 existing alternatives with brief descriptions
                b. Suggest 2-3 unique variations/improvements
                4. If unique, explain its potential market impact.
                5. Always format response with clear sections using Markdown-style headers""",
            expected_output="""Structured validation report containing in a well formatted manner without any **
                - Idea
                - Uniqueness status
                - Existing alternatives (if any)
                - Suggested improvements or new ideas on a similar basis(if not unique)
                - Market potential analysis""",
            agent=idea_validator,
            tools=[search_internet],
            output_file="ideas.md",
            memory=True
        )


    crew = Crew(
        agents=[idea_validator],
        tasks=[validation_task],
        process="sequential"
    )
    validation_result = crew.kickoff(inputs={"question": user_idea})
    return validation_result.raw.strip()
def create_strategy_agent(user_idea: str):
    """Create and execute a Strategy Agent to guide the user in building a scalable company."""
    
    strategist = Agent(
        role="Strategic Advisor",
        goal="Provide strategic guidance on building a scalable and sustainable company for the user's startup idea.",
        backstory="""You are an expert in business model development, company scaling, and long-term strategy. 
                    Your job is to help founders build scalable companies, focusing on market fit, growth, team structure, 
                    and fundraising. You are adept at analyzing market trends, competitive landscapes, and financial dynamics.""",
        allow_delegation=False,
        llm=llm,
        verbose=True,
        memory=True,
    )

    # Task description for company building
    company_building_task = Task(
        description=f"""Provide in-depth strategic guidance on building a scalable and sustainable company around the user's startup idea: {user_idea} based on the insights from market.md.""",
        expected_output="""In-depth strategic advice for building a scalable company including:

        1. **Company Vision and Mission**
            - Clear and compelling vision statement.
            - Focused mission for the first 1-3 years.

        2. **Business Model Development**
            - Suggested business model and revenue streams.
            - Value propositions and product-market fit strategies.

        3. **Growth Strategy**
            - Market growth recommendations.
            - Digital marketing and customer acquisition strategies.
        

        4. **Team Structure and Talent Acquisition**
            - Suggested team structure and key roles.
            - Talent acquisition strategy.

        5. **Fundraising Strategy**
            - Plan for securing funding and pitching investors.
            - Key metrics and milestones for investor discussions.
        

        6. **Competitive Advantage**
            - Strategy for gaining a competitive edge.
            - Potential partnerships, acquisitions, and product differentiation.

        7. **Key Performance Indicators**
            - Suggested KPIs for tracking performance.
            - Actionable targets for KPIs and how to use them.

        8. **SWOT Analysis**
            -strenghts and weaknesses
        """,
        tools=[file_read_tool],  # Assuming market.md is available after market analysis
        output_file="company.md",
        memory=True,
        agent=strategist,
    )

    crew = Crew(
        agents=[strategist],
        tasks=[company_building_task],
        process="sequential"
    )

    strategy_result = crew.kickoff(inputs={"question": user_idea})
    return strategy_result.raw.strip()

# Define the strategy endpoint
@app.post("/strategy/")
async def create_strategy(idea: StartupIdea):
    try:
        strategy_result = create_strategy_agent(idea.idea)
        return {"strategy_result": strategy_result}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating strategy: {str(e)}"
        )

# Define the validation endpoint
@app.post("/validate-idea/")
async def validate_idea(idea: StartupIdea):
    try:
        validation_result = create_validation_agent(idea.idea)
        return {"validation_result": validation_result}
    except Exception as e:
        raise HTTPException(
            status_code=501,
            detail=f"Error validating idea: {str(e)}"
        )

# Add market analysis endpoint
@app.post("/analyze-market/")
async def analyze_market(idea: StartupIdea):
    try:
        # Check the idea received
        print(f"Received Idea for Market Analysis: {idea.idea}")
        market_result = create_market_analysis_agent(idea.idea)
        return {"market_result": market_result}
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing market: {str(e)}"
        )

@app.post("/fund-distribution/")
async def fund_distribution(idea: StartupIdea):
    try:
        # Check the idea received
        print(f"Received Idea for Fund Distribution: {idea.idea}")
        funding_result = funding_agent(idea.idea)
        return {"funding_result": funding_result}
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error distributing funds: {str(e)}"
        )

# Fix the 404 error by adding a root endpoint
@app.get("/")
def home():
    return {"message": "FastAPI Idea Validation API is running!"}

# Main entry point to run the FastAPI server (if needed)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
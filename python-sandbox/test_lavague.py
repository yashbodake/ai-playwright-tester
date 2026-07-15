import os
from llama_index.llms.openai import OpenAI
from lavague.core import ActionEngine, WorldModel
from lavague.core.agents import WebAgent
from lavague.drivers.selenium import SeleniumDriver

def main():
    # 1. Retrieve the Cerebras API key
    api_key = os.getenv("CEREBRAS_API_KEY")
    if not api_key:
        print("ERROR: CEREBRAS_API_KEY environment variable is not set.")
        print("Please set it in your environment: export CEREBRAS_API_KEY='your-key'")
        return

    print("[LaVague Sandbox] Initializing custom LlamaIndex OpenAI client pointing to Cerebras...")
    
    # Configure Cerebras as the LLM engine (OpenAI compatible)
    llm = OpenAI(
        api_base="https://api.cerebras.ai/v1",
        api_key=api_key,
        model="llama3.1-70b",
        temperature=0.1
    )

    # 2. Build the Selenium driver and action engine
    print("[LaVague Sandbox] Setting up Selenium driver and Action Engine...")
    driver = SeleniumDriver()
    action_engine = ActionEngine(driver=driver, llm=llm)
    world_model = WorldModel(llm=llm)

    # 3. Assemble the Web Agent
    agent = WebAgent(world_model, action_engine)

    # 4. Open the local analytics dashboard
    dashboard_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../src/app/index.html"))
    dashboard_url = f"file://{dashboard_path}"
    
    print(f"[LaVague Sandbox] Navigating to: {dashboard_url}")
    agent.get(dashboard_url)

    # 5. Run the automation instruction
    instruction = "Click on the match card with the highest home win probability"
    print(f"[LaVague Sandbox] Running instruction: '{instruction}'")
    agent.run(instruction)

if __name__ == "__main__":
    main()

import os
from llama_index.llms.openai import OpenAI
from lavague.core import ActionEngine, WorldModel
from lavague.core.agents import WebAgent
from lavague.drivers.selenium import SeleniumDriver

def main():
    # 1. Retrieve OpenAI-compatible credentials
    # Works with OpenAI, Ollama, or any OpenAI-compatible provider.
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("ERROR: OPENAI_API_KEY environment variable is not set.")
        print("For OpenAI: export OPENAI_API_KEY='sk-...'")
        print("For Ollama: export OPENAI_API_KEY='ollama' OPENAI_BASE_URL='http://localhost:11434/v1' OPENAI_MODEL='llama3.1'")
        return

    base_url = os.getenv("OPENAI_BASE_URL")  # None → OpenAI default
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    endpoint_label = base_url or "https://api.openai.com/v1"
    print(f"[LaVague Sandbox] Initializing OpenAI-compatible client at {endpoint_label} (model={model})...")

    llm_kwargs = {
        "api_key": api_key,
        "model": model,
        "temperature": 0.1,
    }
    if base_url:
        llm_kwargs["api_base"] = base_url

    llm = OpenAI(**llm_kwargs)

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

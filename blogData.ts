export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  content: string;
  resources?: { title: string; url: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'building-ai-copilot-accounts-receivable',
    title: 'Building an AI Copilot for Accounts Receivable: A Technical Deep Dive',
    excerpt: 'How we built an AI copilot at Delfyn that transforms how finance teams manage accounts receivable, using Python, FastAPI, LangChain, Gemini 3, and assistant-ui for the React frontend.',
    date: 'January 2026',
    readTime: '20 min read',
    tags: ['Python', 'FastAPI', 'LangChain', 'AI', 'Gemini', 'React', 'FinTech'],
    featured: true,
    resources: [
      { title: 'LangChain Documentation', url: 'https://python.langchain.com/' },
      { title: 'assistant-ui', url: 'https://www.assistant-ui.com/' },
      { title: 'Google Vertex AI', url: 'https://cloud.google.com/vertex-ai' },
      { title: 'FastAPI', url: 'https://fastapi.tiangolo.com/' },
    ],
    content: `
<h2>The Problem: Finance Teams Drowning in Manual Work</h2>

<p>Here's a scenario that plays out in finance departments everywhere: a collections specialist spends 20 minutes hunting down a customer's payment history across three different systems, manually drafting a reminder email, and then waiting for approval before they can even click send. Multiply that by 200 overdue invoices, and you've got a team that's constantly underwater.</p>

<p>At <a href="https://delfyn.co" target="_blank">Delfyn</a>, we asked ourselves: <strong>what if an AI could handle the tedious coordination work while keeping humans in control of the decisions that matter?</strong></p>

<p>This post is a deep dive into how we built that AI copilot—the architecture decisions, the hard-won lessons, and the patterns that made it all work. If you're building AI agents for enterprise workflows, you'll find battle-tested approaches you can steal.</p>

<p><strong>Our stack:</strong> Python, FastAPI, LangChain, Google Vertex AI (Gemini 3), Redis, SQLAlchemy, and <a href="https://www.assistant-ui.com/" target="_blank">assistant-ui</a> for the React frontend.</p>

<h2>Architecture Overview: Teaching an AI to Think and Act</h2>

<p>We didn't just build a chatbot—we built a <strong>reasoning agent</strong> that can orchestrate complex workflows. Think of it as giving the LLM a Swiss Army knife of 25+ specialized tools and teaching it when to use each one.</p>

<p>The secret sauce? A pattern called <strong>ReAct</strong> (Reasoning + Acting) that lets the agent think through problems step-by-step while pulling real data from our backend.</p>

<h3>Why We Bet on ReAct</h3>

<p>Before ReAct, we faced an impossible choice: use chain-of-thought prompting (great reasoning, but the AI hallucinates numbers) or use function-calling (accurate data, but no nuanced judgment). <strong>ReAct gave us both.</strong></p>

<p>The framework, introduced by Yao et al. in 2022, has the model alternate between thinking and doing:</p>

<ol>
  <li><strong>Reasoning traces</strong> — The model explains its thinking out loud. "The user wants overdue invoices for Acme Corp. I should first check if that company exists in our system..." This makes debugging a dream and builds trust with finance teams who can see exactly why the AI made each recommendation.</li>
  <li><strong>Grounded actions</strong> — Instead of guessing, the agent calls our APIs to get real numbers. No more hallucinated invoice amounts or made-up customer emails.</li>
</ol>

<p>This combination is <em>essential</em> for financial operations. When someone asks "Should we offer Acme Corp a discount?", the agent needs both <strong>judgment</strong> (understanding the business context) and <strong>accuracy</strong> (knowing their exact outstanding balance is $47,832.50, not "around $50k").</p>

<p><strong>The payoff:</strong> Finance teams can see the agent's reasoning chain. When it suggests sending a payment reminder, they know <em>why</em>—building the kind of trust that enterprise customers demand.</p>

<pre><code>┌─────────────────────────────────────────────────────────────────────────────┐
│                         HIGH-LEVEL ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────┘

                                ┌─────────────┐
                                │   Client    │
                                │  (Frontend) │
                                └──────┬──────┘
                                       │
                                       ▼
                          ┌────────────────────────┐
                          │      FastAPI Server    │
                          │  /chatbot/invoke       │
                          │  /chatbot/invoke_stream│
                          └───────────┬────────────┘
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
                ▼                     ▼                     ▼
        ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
        │    Gemini 3   │    │     Redis     │    │  Backend API  │
        │  (Vertex AI)  │    │   (Memory)    │    │   (Tools)     │
        │               │    │               │    │               │
        │  - Reasoning  │    │  - Chat Hist  │    │  - Invoices   │
        │  - Planning   │    │  - Tool Hist  │    │  - Buyers     │
        │  - Response   │    │  - Sessions   │    │  - Payments   │
        └───────────────┘    └───────────────┘    └───────────────┘</code></pre>

<h2>1. The Agent Core: Where the Magic Happens</h2>

<p>At the heart of our copilot is an agent class that wires together the LLM, memory, and tools. Here's the skeleton:</p>

<h3>Agent Initialization</h3>

<pre><code class="language-python">class AccountReceivableAgent:
    def __init__(self, access_token, uuid, model_choice="vertex"):
        self.access_token = access_token
        self.uuid = uuid
        self.memory_config = {"configurable": {"session_id": uuid}}
        
        self.prompt_template = InvoiceTemplate().generate_prompt()
        self.follow_up_suggestion_prompt_template = FollowUpSuggestionTemplate().generate_prompt()
        
        self.model = ChatVertexAI(
            project=GOOGLE_PROJECT, 
            api_endpoint="europe-west1-aiplatform.googleapis.com", 
            location="europe-west1", 
            temperature=0.3,
            streaming=True,
            model="gemini-3",
            response_mime_type="application/json",
            callbacks=[FinalStreamingStdOutCallbackHandler()],
        )
    
    def memory(self):
        return DelfynChatMemory(session_id=self.uuid)
    
    def wrapper_config(self):
        return {"access_token": self.access_token}</code></pre>

<p><strong>Why these specific choices?</strong></p>

<ul>
  <li><strong>Temperature 0.3</strong> — This is our "Goldilocks zone." Too low (0.1) and the agent sounds robotic, repeating canned phrases. Too high (0.7+) and it starts getting creative with numbers—terrifying for financial data. 0.3 keeps responses natural while ensuring invoice amounts aren't hallucinated.</li>
  <li><strong>Streaming enabled</strong> — Nobody wants to stare at a spinner for 15 seconds. Streaming lets users see the agent "thinking" in real-time, which dramatically improves perceived performance.</li>
  <li><strong>JSON response format</strong> — Forces structured outputs that our tool orchestration can reliably parse. No more regex gymnastics to extract function calls.</li>
  <li><strong>Session-based memory</strong> — Every user conversation is isolated. When CFO Alice asks about overdue invoices, she won't accidentally see collections data from CFO Bob's session.</li>
</ul>

<h3>ReAct Reasoning Loop</h3>

<pre><code>     User: "Send a payment reminder to Acme Corp"
                          │
                          ▼
               ┌─────────────────────┐
               │      THOUGHT        │
               │  "I need to get     │
               │   buyer info first" │
               └──────────┬──────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │       ACTION        │
               │  Get Buyer Info     │
               │  Input: "Acme Corp" │
               └──────────┬──────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │    OBSERVATION      │
               │  email: acme@...    │
               │  iban: NL12...      │
               └──────────┬──────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │      THOUGHT        │◄─────────┐
               │  "Now I need to     │          │
               │   create payment    │          │
               │   link"             │          │
               └──────────┬──────────┘          │
                          │                     │
                          ▼                     │
               ┌─────────────────────┐          │
               │       ACTION        │          │
               │  Create Payment Link│    LOOP  │
               └──────────┬──────────┘    UNTIL │
                          │               DONE  │
                          ▼                     │
               ┌─────────────────────┐          │
               │    OBSERVATION      │          │
               │  link: https://...  │──────────┘
               └──────────┬──────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │    FINAL ANSWER     │
               │  "I've drafted an   │
               │   email with the    │
               │   payment link..."  │
               └─────────────────────┘</code></pre>

<h2>2. Tool Architecture: The Agent's Swiss Army Knife</h2>

<p>We empowered our agent with 25+ specialized tools—each one a surgical instrument for a specific AR task. The goal: let the agent handle <em>any</em> workflow a collections specialist might need, from gentle payment reminders to escalated dunning sequences.</p>

<pre><code class="language-python">def get_tools(self):
    tools = [
        Tool(
            name="Get buyer information",
            func=wrap_get_buyer_information(self.wrapper_config()),
            description="Get buyer information according to the company name...",
            metadata={"visual_explainer": "Getting customer information"}
        ),
        Tool(
            name="Add / Offer discount",
            func=wrap_add_discount_to_invoice(self.wrapper_config()),
            description="Add/Offer discount to a specified invoice to mitigate risk.",
            metadata={"visual_explainer": "Offering a discount to a customer"}
        ),
        Tool(
            name="Get account receivable reporting prioritization",
            func=wrap_get_account_receivable_prioritization(self.wrapper_config()),
            description="Get a prioritized AR report for the finance team.",
            metadata={"visual_explainer": "Gathering the accounts receivable information"}
        ),
        Tool(
            name="Send Email with email address, subject and body",
            func=wrap_send_email(self.wrapper_config()),
            description="Send Email with email address, subject and body",
            metadata={"visual_explainer": "Sending an email"}
        ),
        Tool(
            name="Create payment link",
            func=wrap_create_payment_link(self.wrapper_config()),
            description="Create payment link for one or more invoices...",
            metadata={"visual_explainer": "Creating a payment link"}
        ),
        # ... 20+ more tools
    ]
    return tools</code></pre>

<p><strong>We organized tools into six capability domains:</strong></p>

<ul>
  <li><strong>Buyer management</strong> — The agent's "CRM brain": fetch customer details, update records, list accounts</li>
  <li><strong>Invoice operations</strong> — Core AR functionality: retrieve invoices, apply discounts, track statuses</li>
  <li><strong>Communication</strong> — The agent's voice: draft emails, send messages, review correspondence history</li>
  <li><strong>Reporting</strong> — Instant insights: AR prioritization, payment trends, overdue analysis (no more Excel gymnastics)</li>
  <li><strong>Payment operations</strong> — Close the loop: generate payment links, adjust terms, track collections</li>
  <li><strong>Dunning sequences</strong> — Automated escalation: add customers to reminder flows, pause sequences, track progress</li>
</ul>

<pre><code>┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│     BUYERS      │  │    INVOICES     │  │  COMMUNICATION  │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ • Get Info      │  │ • Get Invoice   │  │ • Draft Email   │
│ • Update Buyer  │  │ • List Invoices │  │ • Send Email    │
│ • List Buyers   │  │ • Add Discount  │  │ • List Emails   │
│ • Get Invoices  │  │ • Remove Disc.  │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    REPORTING    │  │    PAYMENTS     │  │     DUNNING     │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ • AR Priority   │  │ • Payment Link  │  │ • Add Sequence  │
│ • Top Overdue   │  │ • Adjust Terms  │  │ • Remove Seq.   │
│ • Payment Trend │  │ • Get Orders    │  │ • Activate      │
│ • Collection    │  │ • Reportings    │  │ • Deactivate    │
└─────────────────┘  └─────────────────┘  └─────────────────┘</code></pre>

<h2>3. Tool Wrapper Pattern: Clean Dependency Injection</h2>

<p>Here's a pattern we're particularly proud of. <strong>The problem:</strong> LangChain inspects function signatures to understand what parameters a tool accepts. But we also need to inject authentication tokens, API endpoints, and other config that the LLM shouldn't see or control.</p>

<p><strong>Our solution:</strong> A wrapper function that creates a closure around the config, returning a clean tool function that LangChain can introspect.</p>

<pre><code class="language-python">def wrap_get_account_receivable_prioritization(wrapper_config: Dict[str, Any]):
    @tool('get-account-receivable-prioritization')
    def get_account_receivable_prioritization(input_str: str = "") -> str:
        """
        Get a prioritized account receivable report for the finance team.
        This tool provides a focused report that helps the finance team 
        identify which accounts to prioritize for collection efforts.
        """
        # Parse input - either a simple string or a JSON object
        buyer_company_name = 'all'
        start_date = None
        end_date = None
        
        if input_str:
            try:
                params = json.loads(input_str)
                if isinstance(params, dict):
                    buyer_company_name = params.get('buyer_company_name', 'all')
                    start_date = params.get('start_date')
                    end_date = params.get('end_date')
            except json.JSONDecodeError:
                buyer_company_name = input_str
        
        headers = {
            'Content-Type': 'application/json', 
            'Authorization': 'Bearer ' + wrapper_config['access_token']
        }
        
        url = f'{HOST}/api/v1/invoices/ar_prioritization'
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code == 200:
            return json.dumps(response.json())
        else:
            return json.dumps({"error": f"Failed to fetch data: {response.status_code}"})
            
    return get_account_receivable_prioritization</code></pre>

<p><strong>Why this matters:</strong></p>

<ul>
  <li><strong>Security</strong> — Auth tokens are injected at runtime, never exposed to the LLM or logged in tool descriptions</li>
  <li><strong>Testability</strong> — Tools are pure functions; mock the config and test in isolation</li>
  <li><strong>Clean introspection</strong> — LangChain sees only the parameters the LLM should control (like <code>buyer_company_name</code>)</li>
  <li><strong>Flexibility</strong> — Same tool works with different auth contexts for different users/tenants</li>
</ul>

<h2>4. Prompt Engineering: Teaching Financial Fluency</h2>

<p>Here's where we spent <em>weeks</em> iterating. The prompt isn't just instructions—it's the agent's training manual, guardrails, and personality all in one. Get it wrong, and you have an agent that confuses "overdue" with "outstanding" (a $100K mistake waiting to happen).</p>

<pre><code class="language-python">class InvoiceTemplate:
    def generate_prompt(self):
        prompt = ChatPromptTemplate.from_template("""
            You are an AI financial assistant built by Delfyn designed to help 
            an Account Receivable Specialist. 
            The user you are interacting with is {first_name} who works at {company_name}.
            The current datetime is {time}.
            
            Chat history: {chat_history}
            Tool history: {tool_history}

            You can answer questions using the following tools:
            {tools}

            To use a tool, ALWAYS use the following format:
            1. Thought: Think about the necessary action based on the information provided.
            2. Action: Choose one tool from [{tool_names}] to perform the task.
            3. Action Input: Provide the necessary input for the tool.
            4. Observation: Report the result of the action.

            When you have a response, you MUST ALWAYS use the format:
            1. Final Thought: Conclude your reasoning.
            2. Final Answer: Provide the final answer.

            Critical Rules:
            - Do not provide a final answer if there are more steps required to complete 
              the task. Keep gathering information until all steps are completed.
            - Final Answer must be readable. Not a JSON format.
            - Display final answers in table format as much as possible.
            - Do not misconfuse the terms:
                - Overdue invoice: Invoice not paid after due date.
                - Outstanding invoice: Invoice not yet due.
                - Late payments: Invoice paid after due date.
            
            IMPORTANT EMAIL HANDLING:
            - Before using 'Draft Email', get the buyer's email using 'Get Buyer Information'.
            - Before using 'Draft Email', use 'Create payment link' and include it in the body.
            - Never include placeholder text like "[Link to invoice]" in emails.
            - Before sending an email, ask the user for confirmation.
            
            Question: {input}
            Thought: {agent_scratchpad}
        """)
        return prompt</code></pre>

<p><strong>The non-obvious lessons we learned:</strong></p>

<ul>
  <li><strong>Terminology is treacherous</strong> — We explicitly define "overdue" vs "outstanding" vs "late payment" because these mean different things in AR, and LLMs love to conflate them. One wrong term in a customer email destroys credibility.</li>
  <li><strong>Workflow enforcement prevents disasters</strong> — "Get buyer info BEFORE drafting emails" seems obvious, but without explicit guardrails, the agent would happily draft emails with [PLACEHOLDER] where the payment link should be.</li>
  <li><strong>Confirmation gates build trust</strong> — The agent asks for human approval before sending emails. This isn't just safety—it's what enterprise buyers demand. Nobody wants an AI sending collections emails autonomously.</li>
  <li><strong>Table formatting isn't vanity</strong> — Finance people think in tables. When we switched from paragraph-style answers to tabular data, user satisfaction jumped noticeably.</li>
</ul>

<h2>5. Agent Executor: Orchestrating the Symphony</h2>

<p>All the pieces come together in the executor—the conductor that coordinates reasoning, tool calls, memory, and error handling into a coherent workflow.</p>

<pre><code class="language-python">def handle_chatbot_input(input: Input) -> Tuple[Output, AgentExecutor, Dict]:
    last_message = input.messages[-1]
    content = last_message["content"]
    input_message = content[-1]["text"]
    
    ai_assistant = AccountReceivableAgent(input.access_token, input.uuid)
    tools = ai_assistant.get_tools()

    processed_input = {
        "input": input_message,
        "tools": tools,
        "agent_scratchpad": "This is the agent's internal thought process.",
        "tool_names": [tool.name for tool in tools],
        "chat_history": generate_chat_history_string(input.chat_history),
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "first_name": input.first_name,
        "company_name": input.company_name,
    }

    prompt = ai_assistant.generate_prompt()
    agent = create_react_agent(
        ai_assistant.model, 
        tools=tools, 
        prompt=prompt, 
        output_parser=FinancialOutputParser()
    )
    
    agent_executor = AgentExecutor(
        agent=agent, 
        tools=tools,
        verbose=verbose(), 
        return_intermediate_steps=True,
        memory=ai_assistant.memory()
    )
    
    agent_response = agent_executor.invoke(processed_input)
    
    return Output(
        output=agent_response['output'], 
        intermediate_steps=agent_response['intermediate_steps']
    )</code></pre>

<p><strong>What the executor handles for us:</strong></p>

<ul>
  <li><strong>Tool orchestration</strong> — Parses the agent's "Action" outputs, calls the right tool, feeds results back</li>
  <li><strong>Graceful error recovery</strong> — When a tool fails (API timeout, invalid input), the agent gets a chance to reason about the error and try a different approach</li>
  <li><strong>Memory persistence</strong> — Automatically saves conversation state after each turn</li>
  <li><strong>Debugging gold</strong> — <code>return_intermediate_steps=True</code> gives us the full reasoning trace. When something goes wrong, we can see exactly where the agent's logic derailed.</li>
</ul>

<h2>6. Memory Architecture: The Agent's Recall System</h2>

<p>Here's a problem that bit us early: naive conversation memory bloats the prompt with raw API responses. Ask about invoices twice? The agent now has 50KB of JSON clogging its context window.</p>

<p><strong>Our solution:</strong> Dual-stream memory that separates <em>what was said</em> from <em>what data was fetched</em>.</p>

<pre><code class="language-python">class DelfynChatMemory(BaseMemory, BaseModel):
    BASE_KEY: ClassVar[str] = "delfyn_conversation_history"
    
    @property
    def memory_variables(self) -> List[str]:
        return ["chat_history", "tool_history"]
    
    def load_memory_variables(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        session_id = inputs.get("uuid", "")
        memory_data = self.redis_cache().get(self.key(session_id))
        
        if not memory_data:
            return {"chat_history": "", "tool_history": ""}
        
        buffer = json.loads(memory_data)
        buffer.sort(key=lambda entry: entry.get("timestamp", ""))
        
        # Keep last 20 messages
        buffer = buffer[-20:]
        
        # Separate chat and tool outputs
        chat_buffer = [e for e in buffer if e.get("type") == "chat"]
        tool_buffer = [e for e in buffer if e.get("type") == "tool"]
        
        return {
            "chat_history": self._format_buffer_as_string(chat_buffer),
            "tool_history": self._format_tool_buffer_as_string(tool_buffer)
        }
    
    def save_context(self, inputs: Dict[str, Any], outputs: Dict[str, str]) -> None:
        session_id = inputs.get("uuid", "")
        memory_data = self.redis_cache().get(self.key(session_id))
        buffer = json.loads(memory_data) if memory_data else []
        
        # Store user input
        if inputs.get("input"):
            buffer.append({
                "role": "User",
                "timestamp": datetime.now().isoformat(),
                "message": inputs["input"],
                "type": "chat"
            })
        
        # Store tool usage from intermediate steps
        for step in outputs.get("intermediate_steps", []):
            if len(step) >= 2:
                action, result = step
                buffer.append({
                    "tool_name": action.tool,
                    "timestamp": datetime.now().isoformat(),
                    "input": action.tool_input,
                    "output": result,
                    "type": "tool"
                })
        
        # Store AI response
        if outputs.get("output"):
            buffer.append({
                "role": "Assistant",
                "timestamp": datetime.now().isoformat(),
                "message": outputs["output"],
                "type": "chat"
            })
        
        # 24-hour expiration
        self.redis_cache().set(self.key(session_id), json.dumps(buffer), ex=86400)</code></pre>

<p><strong>Why this split architecture matters:</strong></p>

<ul>
  <li><strong>Chat history</strong> — Lightweight conversational context. "User asked about Acme Corp's overdue invoices. I showed them a table..."</li>
  <li><strong>Tool history</strong> — The actual data, available for reference without cluttering the dialogue. The agent can say "As I showed you earlier, Acme has 3 overdue invoices totaling $47K" without re-fetching.</li>
  <li><strong>24-hour TTL</strong> — Sessions expire automatically. No stale data, no privacy leaks between days.</li>
</ul>

<p>Think of it like human memory: you remember the <em>gist</em> of conversations (chat history) but can pull up specific documents when needed (tool history).</p>

<pre><code>┌──────────────────────────────────────────────────────────────────┐
│                         REDIS STORE                              │
│                  Key: delfyn_conversation_history:{uuid}         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │   ┌─────────────────┐        ┌─────────────────┐           │ │
│  │   │  CHAT HISTORY   │        │  TOOL HISTORY   │           │ │
│  │   ├─────────────────┤        ├─────────────────┤           │ │
│  │   │ User: "Show me  │        │ Tool: Get AR    │           │ │
│  │   │  overdue..."    │        │ Input: "all"    │           │ │
│  │   │                 │        │ Output: {...}   │           │ │
│  │   │ Assistant: "Here│        │                 │           │ │
│  │   │  are the top 5..│        │ Tool: Get Buyer │           │ │
│  │   │                 │        │ Input: "Acme"   │           │ │
│  │   │ User: "Send     │        │ Output: {...}   │           │ │
│  │   │  reminder..."   │        │                 │           │ │
│  │   └─────────────────┘        └─────────────────┘           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           TTL: 24 hours                          │
└──────────────────────────────────────────────────────────────────┘</code></pre>

<h2>7. Streaming Responses: The "Thinking Out Loud" UX</h2>

<p>Nobody wants to stare at a loading spinner for 10 seconds wondering if the app crashed. <strong>Streaming transforms the experience</strong>—users see the agent working in real-time, building trust and reducing perceived latency.</p>

<p>But here's the twist: we don't just stream text. We stream <em>what the agent is doing</em>.</p>

<pre><code class="language-python">@app.post("/chatbot/invoke_stream")
async def invoke_chatbot_stream(input: Input):
    chain, processed_input = handle_chatbot_input_stream(input)
    
    async def get_final_output():
        async for chunk in chain.astream_events(processed_input, version="v2"):
            kind = chunk["event"]
            
            if kind == "on_tool_end":
                # Stream visual feedback when tools complete
                visual_explainer = chunk.get('metadata', {}).get('visual_explainer')
                if visual_explainer:
                    yield f'\\n{{"visual_explainer": "{visual_explainer}"}}\\n'
            
            elif kind == "on_chat_model_stream":
                # Stream LLM tokens as they arrive
                content = chunk['data']['chunk'].content
                yield f'{content}'
            
            elif kind == "on_chain_end":
                # Stream follow-up suggestions at the end
                if 'follow_up_suggestions' in chunk['data'].get('output', {}):
                    suggestions = chunk['data']['output']['follow_up_suggestions']
                    yield f"\\n{json.dumps(suggestions)}\\n"
    
    return StreamingResponse(get_final_output(), media_type="text/event-stream")</code></pre>

<p><strong>The secret sauce:</strong> <code>visual_explainer</code> metadata on each tool.</p>

<pre><code class="language-python">Tool(
    name="Get buyer information",
    func=wrap_get_buyer_information(self.wrapper_config()),
    description="Get buyer information according to the company name...",
    metadata={"visual_explainer": "Getting customer information"}  # UI shows this
)</code></pre>

<p>While the API fetches data, users see <em>"Getting customer information..."</em> instead of nothing. When the agent creates a payment link, they see <em>"Creating payment link..."</em> It's like watching someone work—you know things are happening.</p>

<p><strong>The impact:</strong> Complaints about "slow responses" dropped dramatically, even though the actual latency didn't change. Perception is reality in UX.</p>

<pre><code>Client                          Server                           Gemini 3
   │                               │                                │
   │  POST /chatbot/invoke_stream  │                                │
   │──────────────────────────────►│                                │
   │                               │                                │
   │   ◄─── on_tool_end ───────────│◄── Tool: Get Buyer ────────────│
   │   {"visual_explainer":        │                                │
   │    "Getting customer info"}   │                                │
   │                               │                                │
   │   ◄─── on_tool_end ───────────│◄── Tool: Create Link ──────────│
   │   {"visual_explainer":        │                                │
   │    "Creating payment link"}   │                                │
   │                               │                                │
   │   ◄─── on_chat_model_stream ──│◄── Token: "I" ─────────────────│
   │   "I"                         │                                │
   │   ◄─── on_chat_model_stream ──│◄── Token: "'ve" ───────────────│
   │   "'ve"                       │                                │
   │   ◄─── on_chat_model_stream ──│◄── Token: " drafted" ──────────│
   │   " drafted"                  │                                │
   │        ...                    │        ...                     │
   │                               │                                │
   │   ◄─── on_chain_end ──────────│◄── Complete ───────────────────│
   │   {"follow_up_suggestions":   │                                │
   │    ["Send to more customers", │                                │
   │     "Check payment status"]}  │                                │</code></pre>

<h2>8. Follow-Up Suggestions: Guiding the Conversation</h2>

<p>Here's a UX insight that surprised us: <strong>users often don't know what to ask next.</strong> They see a list of overdue invoices and think "Now what?" We solved this with contextual follow-up suggestions that anticipate the logical next steps.</p>

<pre><code class="language-python">def handle_chatbot_input_stream(input: Input) -> Tuple[AgentExecutor, Dict]:
    ai_assistant = AccountReceivableAgent(input.access_token, input.uuid)
    tools = ai_assistant.get_tools()
    
    # Main agent
    prompt = ai_assistant.generate_prompt()
    agent = create_react_agent(ai_assistant.model, tools=tools, prompt=prompt)
    
    # Follow-up suggestion chain
    follow_up_chat_prompt = ai_assistant.follow_up_suggestion_prompt_template
    follow_up_chain = LLMChain(
        llm=ai_assistant.model,
        prompt=follow_up_chat_prompt
    )
    
    def process_tool_responses(agent_response):
        tool_responses = []
        
        for step in agent_response.get('intermediate_steps', []):
            if len(step) >= 2:
                action, response = step
                tool_responses.append({
                    "tool_name": action.tool,
                    "tool_input": action.tool_input,
                    "tool_output": response
                })
        
        return {
            "output": agent_response.get("output", ""),
            "agent_response": agent_response,
            "tool_responses": tool_responses,
            "follow_up_suggestions": follow_up_chain.run(
                **processed_input, 
                last_message=agent_response, 
                latest_tools_response=tool_responses
            )
        }
    
    # Chain: Agent -> Process responses -> Add suggestions
    chain = RunnableSequence(
        main_agent_executor,
        RunnableLambda(process_tool_responses)
    )
    
    return chain, processed_input</code></pre>

<p><strong>The suggestions are smart, not random.</strong> After showing overdue invoices, the agent might suggest:</p>

<ul>
  <li><em>"Send reminder emails to these customers"</em> — The obvious action</li>
  <li><em>"Apply a 2% early payment discount"</em> — A strategic option for high-value accounts</li>
  <li><em>"Show me payment trends for last quarter"</em> — Context for decision-making</li>
</ul>

<p>This turns the agent from a Q&A bot into a <strong>workflow guide</strong> that helps users discover capabilities they didn't know existed.</p>

<h2>9. API Design: Two Flavors of Invocation</h2>

<p>We expose two endpoints to serve different client needs—because sometimes you want the whole response at once, and sometimes you want to show progress.</p>

<pre><code class="language-python">@app.post("/chatbot/invoke", response_model=Output)
async def invoke_chatbot(input: Input):
    """Synchronous invocation - returns complete response"""
    if not get_unique_token_info(input.access_token):
        raise ValueError("Invalid access token")
    
    output, agent_executor, processed_input = handle_chatbot_input(input)
    return output

@app.post("/chatbot/invoke_stream", response_model=Output)
async def invoke_chatbot_stream(input: Input):
    """Streaming invocation - returns tokens as they're generated"""
    if not get_unique_token_info(input.access_token):
        raise ValueError("Invalid access token")
    
    chain, processed_input = handle_chatbot_input_stream(input)
    return StreamingResponse(get_final_output(), media_type="text/event-stream")</code></pre>

<p><strong>When to use which:</strong></p>

<ul>
  <li><code>/invoke</code> — Background automations, webhooks, anywhere you just need the final answer</li>
  <li><code>/invoke_stream</code> — Interactive UI, where users are watching and waiting</li>
</ul>

<pre><code class="language-python">class Input(BaseModel):
    messages: List[Message]
    chat_history: Optional[List[Message]] = []
    tools: List[Any]
    access_token: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company_name: Optional[str] = None
    uuid: Optional[str] = None</code></pre>

<p><strong>Design note:</strong> We include user context (<code>first_name</code>, <code>company_name</code>) in every request. This lets the agent personalize responses and maintain appropriate data isolation between tenants.</p>

<h2>10. Frontend: Standing on the Shoulders of assistant-ui</h2>

<p>We could have built the chat UI from scratch. We didn't. <strong>Life's too short to reinvent message threading, streaming state management, and scroll-to-bottom logic.</strong></p>

<p><a href="https://www.assistant-ui.com/" target="_blank">assistant-ui</a> gave us a production-ready React chat interface in an afternoon. It's open-source, handles all the fiddly bits (typing indicators, message grouping, attachment handling), and integrates cleanly with LangChain backends.</p>

<pre><code>┌─────────────────────────────────────────┐
│              React App                  │
│  ┌───────────────────────────────────┐  │
│  │         assistant-ui              │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   Thread / Messages         │  │  │
│  │  │   Composer / Attachments    │  │  │
│  │  │   Streaming / State Mgmt    │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└──────────────────┬──────────────────────┘
                   │
                   │ SSE Stream
                   ▼
┌─────────────────────────────────────────┐
│     FastAPI /chatbot/invoke_stream      │
└─────────────────────────────────────────┘</code></pre>

<p>Installation:</p>

<pre><code class="language-bash">npx assistant-ui init</code></pre>

<p>Setting up the runtime to connect to our FastAPI backend:</p>

<pre><code class="language-typescript">import { useExternalStoreRuntime } from "@assistant-ui/react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";

const useARCopilotRuntime = () => {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const onNew = async (message: AppendMessage) => {
    if (message.content[0]?.type !== "text") return;
    
    const userMessage = message.content[0].text;
    setIsRunning(true);
    
    // Add user message to thread
    setMessages(prev => [...prev, {
      id: generateId(),
      role: "user",
      content: [{ type: "text", text: userMessage }]
    }]);
    
    // Stream from our FastAPI backend
    const response = await fetch("/chatbot/invoke_stream", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": \`Bearer \${accessToken}\`
      },
      body: JSON.stringify({
        messages: [...messages, { role: "user", content: [{ type: "text", text: userMessage }] }],
        chat_history: messages,
        access_token: accessToken,
        first_name: user.firstName,
        company_name: user.companyName,
        uuid: sessionId
      })
    });
    
    // Handle streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let assistantMessage = "";
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      
      // Handle visual explainers for tool execution
      if (chunk.includes("visual_explainer")) {
        const parsed = JSON.parse(chunk);
        setToolStatus(parsed.visual_explainer);
        continue;
      }
      
      // Handle follow-up suggestions
      if (chunk.includes("follow_up_suggestions")) {
        const parsed = JSON.parse(chunk);
        setSuggestions(parsed.follow_up_suggestions);
        continue;
      }
      
      // Accumulate assistant response
      assistantMessage += chunk;
      
      // Update message in real-time
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx]?.role === "assistant") {
          updated[lastIdx] = {
            ...updated[lastIdx],
            content: [{ type: "text", text: assistantMessage }]
          };
        } else {
          updated.push({
            id: generateId(),
            role: "assistant",
            content: [{ type: "text", text: assistantMessage }]
          });
        }
        return updated;
      });
    }
    
    setIsRunning(false);
  };
  
  return useExternalStoreRuntime({
    messages,
    isRunning,
    onNew,
  });
};</code></pre>

<p>The main chat component:</p>

<pre><code class="language-tsx">import { Thread } from "@assistant-ui/react";

export const ARCopilotChat = () => {
  const runtime = useARCopilotRuntime();
  
  return (
    &lt;AssistantRuntimeProvider runtime={runtime}&gt;
      &lt;div className="h-full flex flex-col"&gt;
        {/* Tool execution status */}
        {toolStatus && (
          &lt;div className="px-4 py-2 bg-blue-50 text-blue-700 text-sm"&gt;
            &lt;Spinner /&gt; {toolStatus}...
          &lt;/div&gt;
        )}
        
        {/* Main chat thread */}
        &lt;Thread 
          welcome={{
            message: "Hello! I'm your AR assistant. How can I help you today?",
            suggestions: [
              { text: "Show me overdue invoices" },
              { text: "Who are my top debtors?" },
              { text: "Draft a payment reminder" }
            ]
          }}
        /&gt;
        
        {/* Follow-up suggestions */}
        {suggestions.length &gt; 0 && (
          &lt;div className="px-4 py-2 flex gap-2 flex-wrap"&gt;
            {suggestions.map((suggestion, idx) =&gt; (
              &lt;button 
                key={idx}
                onClick={() =&gt; sendMessage(suggestion)}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
              &gt;
                {suggestion}
              &lt;/button&gt;
            ))}
          &lt;/div&gt;
        )}
      &lt;/div&gt;
    &lt;/AssistantRuntimeProvider&gt;
  );
};</code></pre>

<p><strong>Why we chose assistant-ui over building custom:</strong></p>

<ul>
  <li><strong>Time to market</strong> — Chat UI in hours, not weeks. We focused our engineering time on the agent logic that actually differentiates our product.</li>
  <li><strong>Streaming "just works"</strong> — SSE handling, progressive rendering, all the edge cases around interrupted streams—handled.</li>
  <li><strong>Battle-tested state management</strong> — Multi-turn conversations, message editing, retries. The edge cases you don't think about until they bite you.</li>
  <li><strong>LangChain-native</strong> — Designed for exactly our use case. The integration was trivial.</li>
</ul>

<p>We wired up our <code>visual_explainer</code> metadata to show tool execution status, and the follow-up suggestions render as clickable chips below each response. <strong>The result:</strong> a polished, ChatGPT-quality UX that our enterprise customers expected.</p>

<h2>Lessons from the Trenches</h2>

<p>After months of iteration, here's what we wish we'd known from day one:</p>

<ol>
  <li><strong>Tool descriptions are prompts in disguise</strong> — We spent more time refining tool descriptions than almost any other part of the system. A vague description like "Get invoice data" led to constant misuse. "Get invoice details by invoice number. Returns amount, due date, payment status, and buyer info. Use when user asks about a specific invoice" worked far better.</li>
  <li><strong>Dual-stream memory is non-negotiable</strong> — Separating chat history from tool outputs sounds like over-engineering until your context window fills up with JSON and the agent starts forgetting the conversation.</li>
  <li><strong>Visual feedback is a force multiplier</strong> — "Getting customer information..." costs nothing to implement but transforms perceived performance. Users wait happily when they can see progress.</li>
  <li><strong>Domain terminology will burn you</strong> — "Overdue" vs "outstanding" vs "late payment" mean specific things in AR. We learned this the hard way when an early version sent dunning emails to customers who weren't actually late.</li>
  <li><strong>Workflow guardrails prevent disasters</strong> — Without explicit rules like "get buyer email before drafting," the agent would confidently generate emails with [PLACEHOLDER] links. Embarrassing.</li>
  <li><strong>Temperature 0.3 is the sweet spot</strong> — For financial data, you need consistency. But go too low and responses feel robotic. 0.3 threads the needle.</li>
</ol>

<h2>Wrapping Up</h2>

<p>Building an AI copilot for accounts receivable wasn't about bolting ChatGPT onto a dashboard. It required <strong>deep integration</strong>—understanding the domain, respecting the workflows, and building trust with finance teams who (rightfully) don't want AI making autonomous decisions about money.</p>

<p><strong>The architecture that made it work:</strong></p>

<ul>
  <li>ReAct pattern for transparent reasoning</li>
  <li>25+ domain-specific tools (the agent's Swiss Army knife)</li>
  <li>Wrapper pattern for clean dependency injection</li>
  <li>Dual-stream memory (chat + tools)</li>
  <li>Streaming with visual explainers</li>
  <li>assistant-ui for production-ready frontend</li>
</ul>

<p><strong>The result:</strong> Finance teams can now ask "Who are my top 5 overdue customers?" and get an answer in seconds—complete with the option to draft reminder emails, create payment links, or add them to a dunning sequence. All through natural conversation.</p>

<p>That's the promise of AI copilots: not replacing humans, but giving them superpowers.</p>

<hr />

<p><em>These patterns aren't AR-specific. If you're building AI agents for any domain—legal, healthcare, logistics—the architecture translates.</em></p>

<p>Building something similar? I'd love to hear about it. Reach out on LinkedIn or check out <a href="https://delfyn.co" target="_blank">delfyn.co</a>.</p>
    `.trim(),
  },
  {
    slug: 'building-flexible-sso-authentication-system',
    title: 'Building a Flexible SSO Authentication System: OAuth2 & SAML2 in Rails',
    excerpt: 'How we built a multi-tenant SSO system supporting both OAuth2 and SAML2 protocols, enabling seamless integration with enterprise identity providers like Azure AD, Okta, and OneLogin.',
    date: 'January 2026',
    readTime: '15 min read',
    tags: ['Ruby on Rails', 'OAuth2', 'SAML2', 'Authentication', 'Enterprise', 'Security'],
    featured: true,
    resources: [
      { title: 'OAuth 2.0 RFC 6749', url: 'https://tools.ietf.org/html/rfc6749' },
      { title: 'PKCE RFC 7636', url: 'https://tools.ietf.org/html/rfc7636' },
      { title: 'SAML 2.0 Specification', url: 'http://docs.oasis-open.org/security/saml/v2.0/' },
      { title: 'OpenID Connect', url: 'https://openid.net/connect/' },
    ],
    content: `
<h2>The Enterprise Barrier: Why SSO Breaks Sales Deals</h2>

<p>Here's a conversation that happens in every B2B sales cycle: <em>"We love your product, but our IT policy requires SSO. Do you support Azure AD?"</em></p>

<p>If your answer is "not yet," you just lost the deal. Enterprise companies don't compromise on identity management—it's the foundation of their security posture. <strong>No SSO, no contract.</strong></p>

<p>We faced this reality head-on. Our multi-tenant platform needed to support whatever identity provider each customer used—Azure AD, Okta, OneLogin, Google Workspace, custom SAML setups—without building bespoke integrations for each one.</p>

<p>This post breaks down how we built a flexible SSO system that handles both OAuth2 and SAML2 protocols, enabling us to say "yes" to every enterprise prospect regardless of their IdP.</p>

<h2>The Challenge: Enterprise IdP Chaos</h2>

<p>If you've never dealt with enterprise SSO, here's the reality check:</p>

<ul>
  <li><strong>Protocol wars</strong> — Half your customers use OAuth2/OIDC (Azure AD, Google), half use SAML2 (Okta, OneLogin, ADFS). You need both.</li>
  <li><strong>Security requirements vary</strong> — Some demand PKCE (Proof Key for Code Exchange), others have legacy flows you have to support.</li>
  <li><strong>Platform fragmentation</strong> — Mobile apps need custom URL schemes (<code>myapp://callback</code>), web apps need HTTPS redirects. Same customer, different flows.</li>
  <li><strong>Environment sprawl</strong> — "Can we test SSO in staging before enabling production?" Yes, you need that.</li>
</ul>

<p>We needed architecture that could absorb all this complexity without becoming unmaintainable.</p>

<h2>Architecture Overview: One Model to Rule Them All</h2>

<p>The insight that made everything click: <strong>treat SSO configurations as data, not code.</strong> Instead of building separate OAuth2 and SAML2 modules, we created a single <code>SsoInformation</code> model that stores everything needed for any protocol.</p>

<pre><code>+------------------+          +-------------------+
|     Company      |  1----*  |  SsoInformation   |
+------------------+          +-------------------+
| - name           |          | - kind (oauth2/saml2)
| - code           |          | - oauth2_issuer
| - enabled        |          | - oauth2_client_id
+------------------+          | - saml_idp_metadata
                              | - enabled
                              | - environment
                              +-------------------+
                                       |
                                       | 1
                                       |
                                       * 
                                +-------------+
                                |    User     |
                                +-------------+</code></pre>

<p>Each company can have multiple SSO configurations (staging vs production, web vs mobile). The relationship is intentionally flexible.</p>

<h2>The Four Design Pillars</h2>

<h3>1. Protocol Agnosticism</h3>

<p>A single <code>kind</code> attribute switches between protocols:</p>

<ul>
  <li><strong>oauth2</strong> — For OIDC providers (Azure AD, Google, Auth0). Modern, well-documented, what you want if you have a choice.</li>
  <li><strong>saml2</strong> — For enterprise SAML (Okta, OneLogin, ADFS). Legacy but ubiquitous in enterprises. You will encounter it.</li>
</ul>

<p><strong>Why this matters:</strong> When a customer says "We use Okta," we don't care whether they've configured it for OIDC or SAML. Either works.</p>

<h3>2. Environment Isolation</h3>

<p>Every SSO config is scoped to an environment:</p>

<ul>
  <li><code>production</code> — The real deal. Locked down.</li>
  <li><code>staging</code> — Customer IT tests their IdP integration here first.</li>
  <li><code>development</code> / <code>test</code> — Internal use and CI pipelines.</li>
</ul>

<p><strong>The lesson we learned the hard way:</strong> Customers <em>will</em> misconfigure SSO on their first attempt. Giving them a safe sandbox to experiment in prevents embarrassing production lockouts.</p>

<h3>3. Layered Security (Opt-In)</h3>

<p>Not every IdP supports every security feature. We made them configurable:</p>

<ul>
  <li><strong>PKCE</strong> — Prevents authorization code theft. Essential for mobile, recommended everywhere. Toggle it on if the IdP supports it.</li>
  <li><strong>State parameter</strong> — CSRF protection. Always enabled in production, but useful to disable during debugging.</li>
  <li><strong>Response mode</strong> — Some IdPs return tokens in the URL fragment, others in query params. We adapt.</li>
</ul>

<h3>4. Platform-Aware Redirects</h3>

<p>Web and mobile apps live in different worlds:</p>

<pre><code>oauth2_web_redirect_url: https://app.example.com/oauth/callback
oauth2_mobile_redirect_url: myapp://oauth/callback</code></pre>

<p>The same SSO config works for both platforms. We route to the correct callback based on the request origin.</p>

<h2>OAuth2 Implementation: The Modern Path</h2>

<p>OAuth2 (specifically OpenID Connect) is what you want when you have a choice. It's well-documented, widely supported, and the security model makes sense.</p>

<h3>Authorization Code Flow (The Right Way)</h3>

<p>This is the flow you should use for anything server-side:</p>

<pre><code>User -> App -> IdP (authorize) -> App (with code) -> IdP (token) -> App</code></pre>

<p><strong>The key insight:</strong> The authorization code is useless without the client secret (which stays on your server). Even if someone intercepts the code, they can't exchange it for tokens.</p>

<p>With PKCE, we add another layer—a cryptographic proof that the token request comes from the same client that started the flow:</p>

<pre><code class="language-ruby">def self.generate_pkce
  pkce_challenge = PkceChallenge.challenge(char_length: 58)
  {
    code_verifier: pkce_challenge.code_verifier, 
    code_challenge: pkce_challenge.code_challenge
  }
end</code></pre>

<p><strong>Why PKCE matters:</strong> Mobile apps can't keep secrets (the binary is on the user's device). PKCE provides security even when the client can't be trusted to protect a secret.</p>

<h3>Implicit Flow (Legacy, Avoid If Possible)</h3>

<p>Some older SPAs still require tokens directly in the URL fragment. We support it because enterprise customers have legacy systems, but we flag it in our UI as "not recommended" and nudge toward authorization code + PKCE.</p>

<h2>SAML2 Implementation: The Enterprise Reality</h2>

<p>SAML2 is older, more complex, and relies on XML (yes, XML). But if you're selling to enterprises, you'll encounter it. A lot of Okta and OneLogin deployments still prefer SAML.</p>

<p><strong>What we store for each SAML integration:</strong></p>

<ul>
  <li><code>saml_idp_metadata</code> — The full XML metadata blob from the IdP. Everything we need is in here.</li>
  <li><code>saml_idp_entity_id</code> — The IdP's unique identifier. Used to verify assertions came from the right source.</li>
  <li><code>saml_sso_url</code> — Where we redirect users to authenticate.</li>
  <li><code>saml_certificate</code> — Public cert for signature verification. <strong>Critical:</strong> Never trust an unsigned assertion.</li>
  <li><code>saml_consumer_service_url</code> — Our ACS endpoint. Where the IdP posts the assertion after auth.</li>
  <li><code>saml_name_identifier_format</code> — How user IDs are formatted (email, persistent ID, etc.).</li>
</ul>

<p>The flow kicks off from a simple endpoint:</p>

<pre><code>/api/v3/saml/init?company_code=ACME&sso_uuid=abc-123</code></pre>

<p>We look up the config, build a SAML AuthnRequest, and redirect to the IdP. After authentication, they POST back to our ACS URL with a signed assertion.</p>

<h2>User Attribute Mapping: Taming IdP Chaos</h2>

<p>Here's a fun fact that will save you hours of debugging: <strong>every IdP returns user data differently.</strong></p>

<p>Azure AD returns <code>given_name</code>. Okta returns <code>firstName</code>. Some legacy ADFS setups return <code>givenName</code>. Your code needs to handle all of them.</p>

<p><strong>Our solution:</strong> Configurable attribute keys per integration.</p>

<ul>
  <li><code>oauth2_email_key</code> — Where to find the email. Could be <code>email</code>, <code>mail</code>, <code>upn</code>, or <code>preferred_username</code>.</li>
  <li><code>oauth2_firstname_key</code> — First name location: <code>given_name</code>, <code>firstName</code>, <code>first_name</code>...</li>
  <li><code>oauth2_last_name_key</code> — Same story: <code>family_name</code>, <code>lastName</code>, <code>surname</code>...</li>
  <li><code>oauth2_user_division_key</code> — Optional org unit mapping for customers who want role assignment based on department.</li>
</ul>

<p><strong>The payoff:</strong> When a customer says "Our IdP returns the email in a custom field called <code>corporate_email</code>," we update one config value. No code changes, no deployments.</p>

<h2>Domain-Based SSO Discovery: The Magic Login Experience</h2>

<p>Ever notice how Google Workspace just <em>knows</em> to redirect you to your company's login page when you type your work email? We built the same thing.</p>

<pre><code class="language-ruby">sso_config.sign_in_domains = ["acme.com", "acme.co.uk"]</code></pre>

<p>When a user enters <code>sarah@acme.com</code>, we:</p>
<ol>
  <li>Extract the domain (<code>acme.com</code>)</li>
  <li>Look up matching SSO configs</li>
  <li>Automatically redirect to Acme's IdP</li>
</ol>

<p>No "Select your company" dropdown. No hunting for the "Login with SSO" button. Just type your email and go.</p>

<p><strong>The UX impact:</strong> Support tickets about "How do I log in with SSO?" dropped to near zero.</p>

<h2>Security: The Non-Negotiables</h2>

<p>SSO is literally your authentication layer. If you get security wrong here, everything else is compromised. Here's what we don't cut corners on:</p>

<h3>1. Secrets Are Sacred</h3>

<p>OAuth2 client secrets never touch the database in plaintext. They're encrypted at rest using application-level encryption:</p>

<pre><code class="language-ruby">def encrypted_oauth2_client_secret
  Base64.urlsafe_encode64($encryptor.encrypt(oauth2_client_secret))
end</code></pre>

<p><strong>Why this matters:</strong> Database breaches happen. When they do, attackers shouldn't get working credentials to impersonate your customers' identity providers.</p>

<h3>2. No Enumerable IDs</h3>

<p>Every SSO config gets a UUID, not an auto-incrementing integer. This prevents attackers from guessing valid config IDs by incrementing numbers.</p>

<p>Bad: <code>/sso/config/42</code> → Try 43, 44, 45...</p>
<p>Good: <code>/sso/config/a3f8b2c1-9d4e-4a7b-...</code> → Good luck guessing.</p>

<h3>3. Certificate Pinning for SAML</h3>

<p>We validate SAML certificate fingerprints, not just signatures. This prevents MITM attacks where an attacker with a valid cert could forge assertions.</p>

<h3>4. Input Sanitization Everywhere</h3>

<p>OAuth2 scopes are validated and sanitized to prevent injection attacks:</p>

<pre><code class="language-ruby">def oauth2_scopes=(arr)
  self[:oauth2_scopes] = arr&.reject(&:empty?)
end</code></pre>

<p>Never trust input from customers, even in admin configuration forms.</p>

<h2>Putting It Together: A Real Example</h2>

<p>Here's a complete Azure AD OAuth2 configuration. This is close to what we'd create for a real customer:</p>

<pre><code class="language-ruby">SsoInformation.create!(
  company: company,
  enabled: true,
  kind: 'oauth2',
  flow: 'authorization_code',
  token_key: 'access_token',
  environment: :development,
  sso_provider: 'azure_ad',
  oauth2_issuer: 'https://login.microsoftonline.com/tenant-id/v2.0',
  oauth2_client_id: 'your-client-id',
  oauth2_client_secret: 'your-client-secret',
  oauth2_web_redirect_url: 'https://app.joanis.co/oauth/callback',
  oauth2_mobile_redirect_url: 'joanis://oauth/callback',
  oauth2_authorize_url: '/oauth2/v2.0/authorize',
  oauth2_token_url: '/oauth2/v2.0/token',
  oauth2_scopes: ['openid', 'email', 'profile'],
  oauth2_email_key: 'email',
  pkce_layer: true,
  state_parameter: true
)</code></pre>

<p><strong>Note the key decisions:</strong></p>
<ul>
  <li><code>pkce_layer: true</code> — Azure AD supports it, so we enable it. Extra security at no cost.</li>
  <li><code>environment: :development</code> — Customer tests here first, then we clone to production.</li>
  <li>Separate web and mobile redirect URLs — Same IdP config, different callback handling.</li>
</ul>

<h2>Lessons from the Trenches</h2>

<p>After implementing SSO for dozens of enterprise customers, here's what we wish we'd known upfront:</p>

<h3>1. Configuration > Code</h3>
<p>Every "quick hack" for a specific IdP becomes technical debt. When we made everything configurable, customer onboarding went from "custom development sprint" to "fill out this form." <strong>Invest in flexibility early.</strong></p>

<h3>2. Staging Environments Save Careers</h3>
<p>A customer will misconfigure SSO. When they do, you want them locked out of <em>staging</em>, not production. The environment enum paid for itself after the first prevented incident.</p>

<h3>3. Mobile SSO is a Different Beast</h3>
<p>Custom URL schemes, deep linking, secure storage for tokens—mobile has its own rules. Plan for separate redirect URIs from day one, or you'll be refactoring later.</p>

<h3>4. Documentation is Customer Success</h3>
<p>We wrote step-by-step guides for Azure AD, Okta, Google Workspace, and OneLogin. Result: most customers configure SSO themselves. Support load dropped, sales velocity increased.</p>

<h3>5. Always Have a Backdoor</h3>
<p><strong>Never</strong> let SSO be the only login method. When (not if) an IdP has an outage or a customer misconfigures something, users need a fallback. We maintain email/password as an escape hatch for admins.</p>

<h2>The Payoff</h2>

<p>Six months after shipping this SSO architecture, here's where we landed:</p>

<ul>
  <li><strong>Onboarding time:</strong> From 2-week custom integrations to same-day setup for most IdPs</li>
  <li><strong>Support tickets:</strong> SSO-related issues dropped 80% after adding staging environments</li>
  <li><strong>Sales:</strong> "Do you support SSO?" is now always "Yes." No more lost deals.</li>
</ul>

<p>The irony of enterprise SSO is that the better you build it, the more invisible it becomes. Users just log in. IT admins configure it once and forget it. That's the goal.</p>

<h2>Key Takeaways</h2>

<ul>
  <li><strong>Support both protocols</strong> — OAuth2/OIDC for modern IdPs, SAML2 for enterprise legacy. You'll need both.</li>
  <li><strong>Make everything configurable</strong> — Attribute mapping, redirect URLs, security toggles. If you hardcode it, a customer will need it different.</li>
  <li><strong>Environment isolation is not optional</strong> — Customers will misconfigure SSO. Give them a safe place to experiment.</li>
  <li><strong>Mobile and web are different worlds</strong> — Plan for separate redirect URIs from the start.</li>
  <li><strong>Security layers should be toggleable</strong> — PKCE, state parameters, response modes. Support them all, enable what each IdP can handle.</li>
</ul>

<p>SSO is table stakes for enterprise sales. Build it once, build it right, and stop losing deals to a checkbox on procurement checklists.</p>
    `.trim(),
  },
];


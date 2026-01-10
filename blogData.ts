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
<h2>Introduction</h2>

<p>At <a href="https://delfyn.co" target="_blank">Delfyn</a>, we built an AI copilot that transforms how finance teams manage accounts receivable. This post walks through our architecture decisions, implementation patterns, and the techniques that power our conversational agent.</p>

<p>Our stack: Python, FastAPI, LangChain, Google Vertex AI (Gemini 3), Redis, SQLAlchemy, and <a href="https://www.assistant-ui.com/" target="_blank">assistant-ui</a> for the React frontend.</p>

<h2>Architecture Overview</h2>

<p>The conversational AI agent uses a ReAct (Reasoning + Acting) pattern with 25+ domain-specific tools. The agent reasons about user intent, selects appropriate tools, executes them, and synthesizes responses—all while maintaining conversation context.</p>

<h3>Why ReAct?</h3>

<p>The ReAct framework, introduced by Yao et al. in 2022, fundamentally changed how we build LLM-powered agents. The key insight is deceptively simple: instead of having the model either <em>think</em> or <em>act</em>, have it do both in an interleaved fashion.</p>

<p>Traditional approaches had LLMs generate a complete reasoning chain before taking action (chain-of-thought), or jump straight to actions without explicit reasoning. ReAct combines these by having the model:</p>

<ol>
  <li><strong>Generate reasoning traces</strong> — The model explains its thinking, tracks progress toward the goal, updates its plan when new information arrives, and handles edge cases gracefully</li>
  <li><strong>Execute actions</strong> — The model interfaces with external systems (APIs, databases, tools) to gather real information rather than relying solely on its training data</li>
</ol>

<p>This matters for accounts receivable because financial operations require both <em>judgment</em> (should we offer a discount to this customer?) and <em>accuracy</em> (what's their exact outstanding balance?). ReAct lets us combine the LLM's reasoning capabilities with ground-truth data from our backend APIs.</p>

<p>The research showed ReAct outperforms pure reasoning or pure action approaches on complex tasks. More importantly for enterprise use cases, the explicit reasoning traces make the agent's decisions interpretable—when our AI suggests sending a payment reminder, finance teams can see exactly why it made that recommendation.</p>

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

<h2>1. The Agent Core</h2>

<p>We built our agent using LangChain with Gemini 3 via Vertex AI for reasoning and action selection.</p>

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

<p>Key design decisions:</p>

<ul>
  <li><strong>Temperature 0.3</strong>: Low enough for consistent financial operations, high enough for natural responses</li>
  <li><strong>Streaming enabled</strong>: Real-time feedback during complex multi-step operations</li>
  <li><strong>JSON response format</strong>: Structured outputs for tool orchestration</li>
  <li><strong>Session-based memory</strong>: Each user gets isolated conversation context</li>
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

<h2>2. Tool Architecture</h2>

<p>We register 25+ tools covering the full accounts receivable workflow:</p>

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

<p>Tool categories:</p>

<ul>
  <li><strong>Buyer management</strong>: get info, update, list</li>
  <li><strong>Invoice operations</strong>: get, list, add discount, remove discount</li>
  <li><strong>Communication</strong>: draft email, send email, list emails</li>
  <li><strong>Reporting</strong>: AR prioritization, payment trends, overdue analysis</li>
  <li><strong>Payment operations</strong>: create payment link, adjust payment terms</li>
  <li><strong>Dunning sequences</strong>: add, remove, activate, deactivate</li>
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

<h2>3. Tool Wrapper Pattern</h2>

<p>We use a wrapper pattern for dependency injection. Each tool receives authentication context without polluting the function signature that LangChain inspects.</p>

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

<p>This pattern:</p>

<ul>
  <li>Keeps tools stateless and testable</li>
  <li>Enables runtime configuration injection</li>
  <li>Preserves clean function signatures for LLM introspection</li>
  <li>Handles both simple string inputs and complex JSON parameters</li>
</ul>

<h2>4. Prompt Engineering for Financial Domain</h2>

<p>Our prompt template enforces strict ReAct reasoning with financial domain guardrails:</p>

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

<p>Key elements:</p>

<ul>
  <li>Domain-specific terminology enforcement (overdue vs outstanding vs late)</li>
  <li>Multi-step operation guardrails (email confirmation before sending)</li>
  <li>Output formatting guidance (tables for financial data)</li>
  <li>Workflow enforcement (get buyer info before drafting emails)</li>
</ul>

<h2>5. Agent Executor and Chain</h2>

<p>We wire everything together with LangChain's AgentExecutor:</p>

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

<p>The executor handles:</p>

<ul>
  <li>Tool selection and execution</li>
  <li>Error recovery (automatic retries)</li>
  <li>Memory persistence</li>
  <li>Intermediate step tracking for debugging</li>
</ul>

<h2>6. Conversation Memory with Redis</h2>

<p>We persist conversation history in Redis, separating chat messages from tool outputs:</p>

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

<p>Why separate <code>chat_history</code> and <code>tool_history</code>?</p>

<ul>
  <li>Chat history provides conversational context</li>
  <li>Tool history lets the agent reference previous API responses without bloating the conversation</li>
  <li>Enables the agent to say "As I showed you earlier..." when re-referencing data</li>
</ul>

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

<h2>7. Streaming Responses</h2>

<p>For real-time UX, we stream agent responses with visual explainers:</p>

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

<p>The <code>visual_explainer</code> metadata provides UI feedback during tool execution:</p>

<pre><code class="language-python">Tool(
    name="Get buyer information",
    func=wrap_get_buyer_information(self.wrapper_config()),
    description="Get buyer information according to the company name...",
    metadata={"visual_explainer": "Getting customer information"}  # UI shows this
)</code></pre>

<p>This creates a responsive UX where users see "Getting customer information..." while the API call executes.</p>

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

<h2>8. Follow-Up Suggestions</h2>

<p>We generate contextual follow-up suggestions after each response:</p>

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

<p>Follow-ups are contextual. If the user asked about overdue invoices, suggestions might be:</p>

<ul>
  <li>"Send reminder emails to these customers"</li>
  <li>"Apply a 2% early payment discount"</li>
  <li>"Show me payment trends for last quarter"</li>
</ul>

<h2>9. API Endpoints</h2>

<p>The FastAPI application exposes two main endpoints:</p>

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

<p>Input schema:</p>

<pre><code class="language-python">class Input(BaseModel):
    messages: List[Message]
    chat_history: Optional[List[Message]] = []
    tools: List[Any]
    access_token: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company_name: Optional[str] = None
    uuid: Optional[str] = None</code></pre>

<h2>10. Frontend with assistant-ui</h2>

<p>For the frontend, we used <a href="https://www.assistant-ui.com/" target="_blank">assistant-ui</a>, an open-source React toolkit for building production AI chat experiences. It provides ChatGPT-style UX out of the box with built-in support for streaming, state management, and LangChain integration.</p>

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

<p>Why assistant-ui?</p>

<ul>
  <li><strong>Instant Chat UI</strong>: ChatGPT-style UX with theming out of the box</li>
  <li><strong>Streaming Support</strong>: Built-in handling for SSE streams from our backend</li>
  <li><strong>State Management</strong>: Handles multi-turn conversations, interruptions, and retries</li>
  <li><strong>LangChain Compatible</strong>: Designed to work with LangChain backends</li>
  <li><strong>High Performance</strong>: Optimized rendering for responsive streaming</li>
</ul>

<p>The <code>visual_explainer</code> metadata from our backend displays tool execution status in real-time, and follow-up suggestions appear after each response—creating a polished, production-ready UX.</p>

<h2>Lessons Learned</h2>

<ol>
  <li><strong>Tool descriptions are prompts</strong>: The quality of tool descriptions directly impacts agent accuracy. Be explicit about input formats, expected outputs, and when to use each tool.</li>
  <li><strong>Separate memory streams</strong>: Keeping tool outputs separate from chat history gives the agent better context for multi-step operations without bloating the prompt.</li>
  <li><strong>Visual feedback matters</strong>: Streaming "Getting customer information..." while APIs execute dramatically improves perceived performance.</li>
  <li><strong>Domain terminology in prompts</strong>: Explicitly defining "overdue" vs "outstanding" vs "late payment" in the prompt prevents costly misinterpretations.</li>
  <li><strong>Workflow enforcement</strong>: Prompting the agent to "get buyer info before drafting emails" prevents incomplete tool chains.</li>
  <li><strong>Temperature tuning</strong>: 0.3 works well for financial operations—consistent enough for accuracy, flexible enough for natural conversation.</li>
</ol>

<h2>Conclusion</h2>

<p>Building an AI copilot for accounts receivable required careful orchestration of LLM reasoning, tool execution, and conversation management. The ReAct pattern with domain-specific tools provides the flexibility of conversational AI while maintaining the precision required for financial operations.</p>

<p>Key architectural decisions:</p>

<ul>
  <li>Wrapper pattern for tool dependency injection</li>
  <li>Separated chat/tool memory streams</li>
  <li>Streaming responses with visual feedback</li>
  <li>Explicit domain terminology in prompts</li>
  <li>assistant-ui for production-ready React frontend</li>
</ul>

<p>The result: finance teams interact naturally with their AR data, execute complex workflows through conversation, and get intelligent follow-up suggestions—all while maintaining the accuracy required for financial operations.</p>

<hr />

<p><em>Code samples from production. Architecture decisions applicable to any domain-specific AI assistant.</em></p>

<p>Questions? Reach out on LinkedIn or check out <a href="https://delfyn.co" target="_blank">delfyn.co</a>.</p>
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
<h2>Introduction</h2>

<p>Single Sign-On (SSO) has become an essential feature for enterprise applications. It allows employees to access multiple services using a single set of credentials, improving security and user experience while reducing password fatigue.</p>

<p>In this post, we'll walk through how we built a flexible, multi-tenant SSO system that supports both OAuth2 and SAML2 protocols, allowing each company to configure their preferred identity provider.</p>

<h2>The Challenge</h2>

<p>Our platform serves multiple companies, each with different identity management requirements:</p>

<ul>
  <li>Some companies use <strong>Microsoft Azure AD</strong> (OAuth2)</li>
  <li>Others use <strong>Okta</strong> or <strong>OneLogin</strong> (SAML2)</li>
  <li>Many require <strong>PKCE</strong> (Proof Key for Code Exchange) for enhanced security</li>
  <li>Mobile and web applications need different redirect URIs</li>
  <li>Each company may have multiple SSO configurations for different environments</li>
</ul>

<p>We needed a solution that could handle all these scenarios while remaining maintainable and secure.</p>

<h2>Architecture Overview</h2>

<p>At the heart of our implementation is the <code>SsoInformation</code> model, which stores all configuration details for each SSO integration:</p>

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

<h2>Key Design Decisions</h2>

<h3>1. Protocol Flexibility</h3>

<p>We support two main protocols through a <code>kind</code> attribute:</p>

<ul>
  <li><strong>oauth2</strong>: For OpenID Connect providers (Azure AD, Google, etc.)</li>
  <li><strong>saml2</strong>: For SAML 2.0 providers (Okta, OneLogin, ADFS, etc.)</li>
</ul>

<p>This allows companies to use whichever protocol their IdP supports best.</p>

<h3>2. Multi-Environment Support</h3>

<p>Each SSO configuration has an environment setting:</p>

<ul>
  <li>production</li>
  <li>staging</li>
  <li>development</li>
  <li>test</li>
</ul>

<p>This enables companies to test SSO integrations before going live.</p>

<h3>3. Security Layers</h3>

<p>We implemented optional security enhancements:</p>

<ul>
  <li><strong>PKCE Layer</strong>: Prevents authorization code interception attacks</li>
  <li><strong>State Parameter</strong>: Prevents CSRF attacks during OAuth flow</li>
  <li><strong>Response Mode</strong>: Configurable token delivery method</li>
</ul>

<h3>4. Platform-Specific Redirects</h3>

<p>Separate redirect URLs for web and mobile applications ensure deep linking works correctly across platforms:</p>

<pre><code>oauth2_web_redirect_url: https://app.example.com/oauth/callback
oauth2_mobile_redirect_url: myapp://oauth/callback</code></pre>

<h2>OAuth2 Implementation</h2>

<p>For OAuth2, we support two grant flows:</p>

<h3>1. Authorization Code Flow (Recommended)</h3>

<p>The most secure option for server-side applications:</p>

<pre><code>User -> App -> IdP (authorize) -> App (with code) -> IdP (token) -> App</code></pre>

<p>With PKCE enabled, an additional <code>code_verifier</code>/<code>code_challenge</code> pair is generated to prevent code interception:</p>

<pre><code class="language-ruby">def self.generate_pkce
  pkce_challenge = PkceChallenge.challenge(char_length: 58)
  {
    code_verifier: pkce_challenge.code_verifier, 
    code_challenge: pkce_challenge.code_challenge
  }
end</code></pre>

<h3>2. Implicit Grant Flow (Legacy)</h3>

<p>Used for legacy single-page applications where tokens are returned directly in the URL fragment. Less secure, but sometimes required for compatibility.</p>

<h2>SAML2 Implementation</h2>

<p>For SAML2, we store the IdP configuration including:</p>

<ul>
  <li><code>saml_idp_metadata</code>: Full XML metadata from the identity provider</li>
  <li><code>saml_idp_entity_id</code>: Unique identifier for the IdP</li>
  <li><code>saml_sso_url</code>: Where to send authentication requests</li>
  <li><code>saml_certificate</code>: Public certificate for signature verification</li>
  <li><code>saml_consumer_service_url</code>: Where the IdP sends responses (ACS URL)</li>
  <li><code>saml_name_identifier_format</code>: How user identifiers are formatted</li>
</ul>

<p>The SAML flow initiates through a dedicated endpoint:</p>

<pre><code>/api/v3/saml/init?company_code=ACME&sso_uuid=abc-123</code></pre>

<h2>User Attribute Mapping</h2>

<p>Different IdPs return user data in different formats. We handle this through configurable attribute keys:</p>

<ul>
  <li><code>oauth2_email_key</code>: Where to find the email (e.g., "email", "mail", "upn")</li>
  <li><code>oauth2_firstname_key</code>: First name location (e.g., "given_name", "firstName")</li>
  <li><code>oauth2_last_name_key</code>: Last name location (e.g., "family_name", "lastName")</li>
  <li><code>oauth2_user_division_key</code>: Optional organizational unit mapping</li>
</ul>

<p>This flexibility means we can integrate with any IdP without code changes.</p>

<h2>Domain-Based SSO Discovery</h2>

<p>To simplify the login experience, we support domain-based SSO discovery through the <code>sign_in_domains</code> array:</p>

<pre><code class="language-ruby">sso_config.sign_in_domains = ["acme.com", "acme.co.uk"]</code></pre>

<p>When a user enters their email, we can automatically detect if SSO is available and redirect them to the appropriate identity provider.</p>

<h2>Security Considerations</h2>

<h3>1. Secret Management</h3>

<p>Sensitive values like <code>client_secret</code> are encrypted at rest using our application-level encryptor:</p>

<pre><code class="language-ruby">def encrypted_oauth2_client_secret
  Base64.urlsafe_encode64($encryptor.encrypt(oauth2_client_secret))
end</code></pre>

<h3>2. UUID-Based Identification</h3>

<p>Each SSO configuration has a unique UUID, preventing enumeration attacks and allowing safe public references in URLs.</p>

<h3>3. Certificate Fingerprint Validation</h3>

<p>For SAML, we validate certificate fingerprints to prevent man-in-the-middle attacks during assertion verification.</p>

<h3>4. Scope Validation</h3>

<p>OAuth2 scopes are validated and sanitized to prevent injection:</p>

<pre><code class="language-ruby">def oauth2_scopes=(arr)
  self[:oauth2_scopes] = arr&.reject(&:empty?)
end</code></pre>

<h2>Example Configuration</h2>

<p>Here's how to set up a demo OAuth2 SSO configuration:</p>

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

<h2>Lessons Learned</h2>

<h3>1. Flexibility is Key</h3>
<p>Enterprise IdPs vary wildly in their implementations. Building in configurability from the start saved countless hours of custom development.</p>

<h3>2. Test Environments Matter</h3>
<p>The environment enum prevented many production incidents by allowing companies to fully test their SSO setup before enabling it for all users.</p>

<h3>3. Mobile is Different</h3>
<p>Deep linking and custom URL schemes require separate handling from web redirects. Plan for this from the beginning.</p>

<h3>4. Documentation is Essential</h3>
<p>SSO setup is complex. We created detailed guides for each major IdP (Azure AD, Okta, Google Workspace) to help companies self-service.</p>

<h3>5. Graceful Degradation</h3>
<p>Always have a fallback authentication method. If SSO fails, users should still be able to access their accounts through email/password.</p>

<h2>Conclusion</h2>

<p>Building a flexible SSO system requires careful planning and an understanding of both OAuth2 and SAML2 protocols. By creating a configurable, multi-tenant architecture, we've enabled seamless integration with virtually any enterprise identity provider.</p>

<p>The key takeaways:</p>

<ul>
  <li>Support multiple protocols (OAuth2 and SAML2)</li>
  <li>Make everything configurable (attribute mapping, URLs, security options)</li>
  <li>Plan for different environments (production, staging, development)</li>
  <li>Consider both web and mobile platforms</li>
  <li>Prioritize security (PKCE, state validation, encryption)</li>
</ul>

<p>This approach has allowed us to onboard enterprise customers quickly while maintaining the security standards they require.</p>
    `.trim(),
  },
];


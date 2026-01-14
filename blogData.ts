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
    slug: 'github-history-trap-deleted-secrets',
    title: 'The "History" Trap: Why Your Deleted GitHub Secrets Aren\'t Actually Gone',
    excerpt: 'You pushed an API key by mistake, deleted it in the next commit, and thought you were safe. Wrong. Your secrets live forever in Git history, and attackers know exactly where to look.',
    date: 'January 2026',
    readTime: '8 min read',
    tags: ['Security', 'GitHub', 'Git', 'DevOps', 'Best Practices'],
    featured: true,
    resources: [
      { title: 'GitHub Push Protection', url: 'https://docs.github.com/en/code-security/concepts/secret-security/about-push-protection' },
      { title: 'AWS Secrets Manager', url: 'https://aws.amazon.com/secrets-manager/' },
      { title: 'Google Cloud Secret Manager', url: 'https://cloud.google.com/secret-manager' },
      { title: 'git-filter-repo', url: 'https://github.com/newren/git-filter-repo' },
    ],
    content: `
<h2>We've All Been There</h2>

<p>You're in a flow, you hardcode an API key for a quick test, and—oops—you push it to GitHub. You realize the mistake, delete the key from your code, and push a second commit. Problem solved, right?</p>

<p><strong>Wrong.</strong></p>

<p>On GitHub, your "mistakes" are preserved in amber. Even if the current version of your code is clean, that sensitive key is just a few clicks away for anyone who knows where to look. In fact, I've recently had to contact several developers on GitHub after spotting their private credentials sitting right there in their commit history.</p>

<p>It's a surprisingly easy mistake to make, but a dangerous one that can lead to <strong>compromised accounts</strong> and <strong>drained budgets</strong>.</p>

<h2>How the "History" Button Becomes a Security Leak</h2>

<p>GitHub is built on Git, a version control system designed <em>never to lose anything</em>. When someone clicks the <strong>"History"</strong> button on one of your files, they aren't just looking at past versions—they're looking at <strong>every state that file has ever existed in</strong>.</p>

<p>An attacker doesn't need to find the key in your current code. They just look for commits with messages like:</p>

<ul>
  <li><code>"fixed config"</code></li>
  <li><code>"remove test key"</code></li>
  <li><code>"oops"</code></li>
  <li><code>"cleanup credentials"</code></li>
</ul>

<p>By viewing the <strong>"Diff"</strong> of that commit, the deleted secret appears in <span style="color: #e74c3c; font-weight: bold;">bright red text</span>, plain as day.</p>

<pre><code class="language-diff">- const API_KEY = "sk_fakelive_1234567890";
+ const API_KEY = process.env.STRIPE_API_KEY;</code></pre>

<p>That "deleted" secret? It's still right there. Forever. Unless you take specific action to remove it.</p>

<h2>How to Avoid the "Secret Leak" Forever</h2>

<p>The best way to handle secrets is to make sure they <strong>never enter your Git history in the first place</strong>. Here is the modern workflow for staying safe:</p>

<h3>1. Enable GitHub's Push Protection</h3>

<p>GitHub has a powerful built-in feature that acts as a proactive safety net. <a href="https://docs.github.com/en/code-security/concepts/secret-security/about-push-protection" target="_blank"><strong>Push Protection</strong></a> scans your code for high-confidence secrets <em>before</em> they are even accepted by the repository.</p>

<p><strong>How it works:</strong></p>
<ul>
  <li>When you push code, GitHub scans it for patterns matching known secret formats (API keys, tokens, passwords)</li>
  <li>If it detects a key, it <strong>blocks the push</strong> and prompts you to remove the secret first</li>
  <li>You get immediate feedback before the damage is done</li>
</ul>

<p><strong>Why it matters:</strong> It stops the leak before it ever touches the cloud, meaning you don't have to worry about rewriting history later. Prevention is infinitely easier than remediation.</p>

<p>To enable it, go to your repository's <strong>Settings → Code security and analysis → Push protection</strong> and toggle it on.</p>

<h3>2. Master the .gitignore</h3>

<p>Before you write your first line of code, create a <code>.gitignore</code> file. This is your first line of defense—it tells Git to completely ignore sensitive files.</p>

<pre><code class="language-bash"># Environment files
.env
.env.local
.env.*.local

# Secret configuration
config/secrets.json
config/credentials.yml

# Private keys
*.pem
*.key
*.p12

# IDE and OS files (bonus cleanup)
.DS_Store
.idea/
.vscode/settings.json</code></pre>

<p><strong>Pro tip:</strong> Use <a href="https://gitignore.io" target="_blank">gitignore.io</a> to generate comprehensive <code>.gitignore</code> files for your stack. Better to ignore too much than too little.</p>

<h3>3. Use Environment Variables</h3>

<p>Never hardcode secrets. Ever. Use a library like <code>dotenv</code> to load your keys from the local environment:</p>

<pre><code class="language-javascript">// Do this:
const apiKey = process.env.STRIPE_API_KEY;

// NOT this:
const apiKey = "sk_fake_1234567890";</code></pre>

<p>This pattern works across every language:</p>

<pre><code class="language-python"># Python
import os
api_key = os.environ.get('STRIPE_API_KEY')</code></pre>

<pre><code class="language-ruby"># Ruby
api_key = ENV['STRIPE_API_KEY']</code></pre>

<pre><code class="language-go">// Go
apiKey := os.Getenv("STRIPE_API_KEY")</code></pre>

<p>Your <code>.env</code> file stays local (and gitignored), while your code stays clean and shareable.</p>

<h2>Leveling Up: Use a Managed Secret Manager</h2>

<p>Environment variables are a solid foundation, but they still have a weakness: <strong>the secret exists as a file on your machine or server</strong>. Someone with access to that machine can read it. For production-level applications, the gold standard is to use a <strong>managed secret manager</strong> from your cloud provider.</p>

<p>The key insight: instead of storing secrets in files, your application <em>asks</em> for the secret at runtime. The secret never touches disk, never appears in logs, and can be rotated without redeploying your app.</p>

<h3>AWS Secrets Manager</h3>

<p><a href="https://aws.amazon.com/secrets-manager/" target="_blank">AWS Secrets Manager</a> stores your secrets encrypted and provides fine-grained access control via IAM policies. Your application retrieves secrets programmatically:</p>

<pre><code class="language-python"># Python with boto3
import boto3
import json

def get_secret(secret_name: str) -> dict:
    client = boto3.client('secretsmanager', region_name='us-east-1')
    response = client.get_secret_value(SecretId=secret_name)
    return json.loads(response['SecretString'])

# Usage
secrets = get_secret('prod/my-app/api-keys')
stripe_key = secrets['STRIPE_API_KEY']</code></pre>

<pre><code class="language-javascript">// Node.js with AWS SDK v3
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

async function getSecret(secretName) {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secretName })
  );
  return JSON.parse(response.SecretString);
}

// Usage
const secrets = await getSecret('prod/my-app/api-keys');
const stripeKey = secrets.STRIPE_API_KEY;</code></pre>

<h3>Google Cloud Secret Manager</h3>

<p><a href="https://cloud.google.com/secret-manager" target="_blank">Google Cloud Secret Manager</a> offers similar functionality with tight integration into GCP's IAM system:</p>

<pre><code class="language-python"># Python with google-cloud-secret-manager
from google.cloud import secretmanager

def get_secret(project_id: str, secret_id: str, version: str = "latest") -> str:
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version}"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

# Usage
stripe_key = get_secret('my-gcp-project', 'stripe-api-key')</code></pre>

<pre><code class="language-javascript">// Node.js with @google-cloud/secret-manager
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

async function getSecret(projectId, secretId, version = 'latest') {
  const client = new SecretManagerServiceClient();
  const name = \`projects/\${projectId}/secrets/\${secretId}/versions/\${version}\`;
  const [response] = await client.accessSecretVersion({ name });
  return response.payload.data.toString();
}

// Usage
const stripeKey = await getSecret('my-gcp-project', 'stripe-api-key');</code></pre>

<h3>Why Managed Secrets Beat Environment Variables</h3>

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Environment Variables</th>
      <th>Managed Secret Manager</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Secret stored on disk</td>
      <td>Yes (.env file)</td>
      <td>No (fetched at runtime)</td>
    </tr>
    <tr>
      <td>Automatic rotation</td>
      <td>Manual process</td>
      <td>Built-in support</td>
    </tr>
    <tr>
      <td>Audit trail</td>
      <td>None</td>
      <td>Full access logs</td>
    </tr>
    <tr>
      <td>Access control</td>
      <td>File permissions</td>
      <td>IAM policies</td>
    </tr>
    <tr>
      <td>Works locally</td>
      <td>Simple</td>
      <td>Requires cloud auth</td>
    </tr>
  </tbody>
</table>

<p><strong>Pro tip:</strong> Use environment variables for local development and managed secrets for staging/production. Most SDKs support falling back gracefully:</p>

<pre><code class="language-python"># Hybrid approach: local dev uses .env, production uses Secrets Manager
import os

def get_api_key():
    # Check environment first (local dev)
    if api_key := os.environ.get('STRIPE_API_KEY'):
        return api_key
    # Fall back to Secrets Manager (production)
    return get_secret('prod/stripe')['api_key']</code></pre>

<h2>Too Late? How to Fix It</h2>

<p>If a secret is already in your history, simply deleting it in a new commit is <strong>not enough</strong>. The old commit with the secret still exists. Here's the remediation playbook:</p>

<h3>Step 1: Rotate the Secret Immediately</h3>

<p>This is the <strong>most important step</strong>. Assume the key is compromised and deactivate it at the source:</p>

<ul>
  <li><strong>AWS:</strong> IAM → Security credentials → Deactivate/Delete access key</li>
  <li><strong>Stripe:</strong> Developers → API keys → Roll keys</li>
  <li><strong>Google Cloud:</strong> APIs and Services → Credentials → Delete and recreate</li>
</ul>

<p>Do this <em>before</em> anything else. An attacker may have already scraped your repo.</p>

<h3>Step 2: Rewrite History</h3>

<p>Use a tool like <a href="https://github.com/newren/git-filter-repo" target="_blank"><strong>git-filter-repo</strong></a> to scrub the secret from every past commit:</p>

<pre><code class="language-bash"># Install git-filter-repo
pip install git-filter-repo

# Remove a specific file from all history
git filter-repo --path config/secrets.json --invert-paths

# Or replace a specific string across all history
git filter-repo --replace-text expressions.txt</code></pre>

<p>Where <code>expressions.txt</code> contains:</p>

<pre><code class="language-text">sk_live==>***REMOVED***</code></pre>

<h3>Step 3: Force Push</h3>

<p>After rewriting history locally, you need to force-push the cleaned history to GitHub to overwrite the old, "leaky" version:</p>

<pre><code class="language-bash">git push origin --force --all
git push origin --force --tags</code></pre>

<p><strong>Warning:</strong> Force pushing rewrites history for everyone. If you're working on a team, coordinate first—they'll need to re-clone or carefully rebase their local copies.</p>

<h3>Step 4: Clear GitHub's Caches</h3>

<p>Even after force pushing, GitHub may cache old commits. Contact <a href="https://support.github.com" target="_blank">GitHub Support</a> to request a garbage collection on your repository if the secret was particularly sensitive.</p>

<h2>The Quick Checklist</h2>

<p>Here's your security checklist to prevent and handle leaked secrets:</p>

<table>
  <thead>
    <tr>
      <th>Prevention</th>
      <th>Remediation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Enable Push Protection</td>
      <td>Rotate the secret immediately</td>
    </tr>
    <tr>
      <td>Use .gitignore for sensitive files</td>
      <td>Rewrite history with git-filter-repo</td>
    </tr>
    <tr>
      <td>Use environment variables</td>
      <td>Force push cleaned history</td>
    </tr>
    <tr>
      <td>Use secret managers in production</td>
      <td>Contact GitHub Support if needed</td>
    </tr>
    <tr>
      <td>Review commits before pushing</td>
      <td>Notify your team</td>
    </tr>
  </tbody>
</table>

<h2>Tools That Have Your Back</h2>

<p>Beyond GitHub's built-in features, consider these additional layers of protection:</p>

<ul>
  <li><strong><a href="https://github.com/trufflesecurity/trufflehog" target="_blank">TruffleHog</a></strong> — Scans your entire Git history for secrets. Great for auditing existing repos.</li>
  <li><strong><a href="https://github.com/gitleaks/gitleaks" target="_blank">Gitleaks</a></strong> — Fast secret scanner that integrates with CI/CD pipelines.</li>
  <li><strong><a href="https://pre-commit.com/" target="_blank">pre-commit hooks</a></strong> — Block commits containing secrets before they even reach your local history.</li>
</ul>

<p>Example pre-commit configuration:</p>

<pre><code class="language-yaml"># .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks</code></pre>

<h2>The Bottom Line</h2>

<p>Git never forgets. What feels like a quick delete is really just hiding your secret in plain sight. Every commit, every diff, every branch—they're all permanent records that anyone can browse.</p>

<p>The solution isn't paranoia—it's process:</p>

<ol>
  <li><strong>Enable <a href="https://docs.github.com/en/code-security/concepts/secret-security/about-push-protection" target="_blank">Push Protection</a></strong> — Let GitHub catch mistakes before they become incidents</li>
  <li><strong>Configure .gitignore properly</strong> — Keep sensitive files out of version control entirely</li>
  <li><strong>Use environment variables</strong> — Separate secrets from code by design</li>
  <li><strong>Audit existing repos</strong> — You might be surprised what's lurking in your history</li>
</ol>

<p>Don't let your commit history become a roadmap for hackers. Check your history, turn on push protection, and keep your secrets where they belong: <strong>out of your code</strong>.</p>

<hr />

<p><em>Have you found secrets in someone's public repo? Or had to clean up a leak yourself? The experience is more common than people admit—and sharing these stories helps the community learn.</em></p>
    `.trim(),
  },
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
            model="gemini-3-pro-preview",
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

<p>I was inspired by <a href="https://github.com/langchain-ai/langserve/discussions/534" target="_blank">this LangServe discussion</a> on passing authorization tokens to tools without exposing them to the LLM.</p>

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
    featured: false,
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
  {
    slug: 'building-ensemble-forecasting-models-ruby-rails',
    title: 'Building a Financial Safety Net: Implementing Finance Forecasting in Ruby on Rails',
    excerpt: 'How we built a financial forecasting system that combines 5 statistical models for accurate cash flow predictions, using weighted linear regression, exponential smoothing, moving averages, seasonal decomposition, and ARIMA.',
    date: 'January 2026',
    readTime: '18 min read',
    tags: ['Ruby', 'Rails', 'Forecasting', 'Time Series', 'Statistics', 'FinTech'],
    featured: false,
    resources: [
      { title: 'Holt-Winters Exponential Smoothing', url: 'https://otexts.com/fpp2/holt-winters.html' },
      { title: 'ARIMA Models', url: 'https://otexts.com/fpp2/arima.html' },
      { title: 'Time Series Decomposition', url: 'https://otexts.com/fpp2/decomposition.html' },
    ],
    content: `
<h2>Introduction</h2>

<p>Predicting future revenue and expenses is critical for any B2B business. But single-model forecasting approaches often fail when faced with real-world data irregularities—seasonal spikes, outliers, and missing data points.</p>

<p>In this post, I'll walk you through how we built an <strong>ensemble forecasting system</strong> in Ruby on Rails that combines five different statistical models to generate more accurate and reliable predictions. This system powers our cash flow forecasting feature, helping businesses anticipate their financial future.</p>

<h2>The Problem with Single-Model Forecasting</h2>

<p>Most tutorials show you how to implement a simple moving average or linear regression. But in production, you'll quickly discover:</p>

<ul>
  <li><strong>Linear trends miss seasonality</strong> — Q4 revenue spikes won't be captured</li>
  <li><strong>Moving averages lag behind</strong> — They react slowly to trend changes</li>
  <li><strong>Seasonal models fail with short data</strong> — You need 12+ months of history</li>
  <li><strong>All models struggle with outliers</strong> — One bad month skews everything</li>
</ul>

<p>Our solution? <strong>Combine them all</strong> and let each model vote on the forecast, weighted by its confidence.</p>

<h2>Architecture Overview</h2>

<pre><code class="language-ruby">class FinanceReporting::ForecastService
  def initialize(merchant:, start_date: 1.year.ago, end_date: Date.today, forecast_periods: 6)
    @merchant = merchant
    @start_date = start_date
    @end_date = end_date
    @forecast_periods = forecast_periods
  end

  def call
    {
      cash_flow: generate_cash_flow_forecast,
      revenue: generate_revenue_forecast,
      expenses: generate_expense_forecast,
      pnl: generate_pnl_forecast,
      confidence_metrics: calculate_overall_confidence,
      generated_at: Time.current
    }
  end
end</code></pre>

<p>The service generates four interconnected forecasts, each powered by the same ensemble engine.</p>

<h2>Step 1: Data Preparation</h2>

<p>Before any forecasting, we need clean, consistent time series data.</p>

<h3>Converting Raw Data to Time Series</h3>

<pre><code class="language-ruby">def prepare_time_series(data)
  return [] if data.empty?
  
  # Convert to consistent format: [[date, value], ...]
  series = if data.is_a?(Hash)
             data.sort_by { |date, _| date }
                 .map { |date, value| [date, value.to_f] }
           elsif data.is_a?(Array) && data.first.is_a?(Array)
             data.sort_by { |item| item[0] }
                 .map { |item| [item[0], item[1].to_f] }
           else
             []
           end
  
  # Fill missing periods with interpolated values
  fill_missing_periods(series)
end</code></pre>

<h3>Filling Missing Months</h3>

<p>Real-world data has gaps. A customer might have invoices in January and March, but nothing in February. We use linear interpolation to fill these gaps:</p>

<pre><code class="language-ruby">def fill_missing_periods(series)
  return series if series.empty? || series.size < 2
  
  filled_series = []
  sorted_series = series.sort_by { |item| item[0] }
  
  (0...sorted_series.size - 1).each do |i|
    current_date, current_value = sorted_series[i]
    next_date, next_value = sorted_series[i + 1]
    
    filled_series << [current_date, current_value]
    
    # Check if there's a gap
    months_between = ((next_date - current_date) / 1.month).to_i
    
    if months_between > 1
      # Linear interpolation for missing months
      (1...months_between).each do |month_offset|
        interpolated_date = current_date + month_offset.months
        weight = month_offset.to_f / months_between
        interpolated_value = current_value + weight * (next_value - current_value)
        filled_series << [interpolated_date, interpolated_value]
      end
    end
  end
  
  filled_series << sorted_series.last
  filled_series
end</code></pre>

<h3>Outlier Detection with IQR Method</h3>

<p>One unusually large invoice shouldn't destroy your forecast. We use the <strong>Interquartile Range (IQR)</strong> method to detect and replace outliers:</p>

<pre><code class="language-ruby">def remove_outliers(series)
  return series if series.empty? || series.size < 4
  
  values = series.map { |_, value| value }
  q1, q3 = calculate_quartiles(values)
  iqr = q3 - q1
  
  lower_bound = q1 - 1.5 * iqr
  upper_bound = q3 + 1.5 * iqr
  
  # Replace outliers with interpolated values from neighbors
  series.map.with_index do |(date, value), index|
    if value < lower_bound || value > upper_bound
      interpolated_value = interpolate_outlier(series, index)
      [date, interpolated_value]
    else
      [date, value]
    end
  end
end

def interpolate_outlier(series, index)
  # Use median of 2 points before and after
  values = []
  (-2..2).each do |offset|
    next if offset == 0
    check_index = index + offset
    if check_index >= 0 && check_index < series.size
      values << series[check_index][1]
    end
  end
  
  values.sort[values.size / 2]  # Return median
end</code></pre>

<h2>Step 2: The Five Forecasting Models</h2>

<p>Here's where the magic happens. We implement five distinct models, each with different strengths:</p>

<h3>Model 1: Weighted Linear Regression (25% weight)</h3>

<p>Standard linear regression treats all data points equally. But in business forecasting, <strong>recent data matters more</strong>. We apply linear weights that favor recent observations:</p>

<pre><code class="language-ruby">def forecast_linear_trend_enhanced(series, period)
  return 0 if series.empty? || series.size < 2
  
  n = series.size
  # Linear weights: [0.1, 0.2, 0.3, ... 1.0] favoring recent data
  weights = (1..n).map { |i| i.to_f / n }
  
  values = series.map { |_, value| value }
  x_values = (1..n).to_a
  
  # Weighted means
  weighted_sum = weights.sum
  weighted_x_mean = x_values.zip(weights).sum { |x, w| x * w } / weighted_sum
  weighted_y_mean = values.zip(weights).sum { |y, w| y * w } / weighted_sum
  
  # Weighted slope calculation
  numerator = x_values.zip(values, weights)
                      .sum { |x, y, w| w * (x - weighted_x_mean) * (y - weighted_y_mean) }
  denominator = x_values.zip(weights)
                        .sum { |x, w| w * (x - weighted_x_mean) ** 2 }
  
  return 0 if denominator == 0
  
  slope = numerator / denominator
  intercept = weighted_y_mean - slope * weighted_x_mean
  
  # Forecast for target period
  target_x = n + period
  slope * target_x + intercept
end</code></pre>

<h3>Model 2: Double Exponential Smoothing (20% weight)</h3>

<p>Exponential smoothing captures both <strong>level</strong> (where we are) and <strong>trend</strong> (where we're going):</p>

<pre><code class="language-ruby">def forecast_exponential_smoothing(series, period, alpha: 0.3, beta: 0.1)
  return 0 if series.empty?
  
  values = series.map { |_, value| value }
  return values.last if values.size < 2
  
  # Initialize level and trend
  level = values.first
  trend = values[1] - values[0]
  
  # Holt's double exponential smoothing
  values.each_with_index do |value, i|
    next if i == 0
    
    prev_level = level
    level = alpha * value + (1 - alpha) * (level + trend)
    trend = beta * (level - prev_level) + (1 - beta) * trend
  end
  
  # Forecast h periods ahead
  level + period * trend
end</code></pre>

<p><strong>Why alpha = 0.3?</strong> Lower values (0.1-0.3) give more weight to historical data, making the model stable. Higher values (0.7-0.9) react quickly to changes but can be noisy.</p>

<h3>Model 3: Multi-Window Moving Average (15% weight)</h3>

<p>Instead of a single window, we combine multiple windows and weight them:</p>

<pre><code class="language-ruby">def forecast_moving_average(series, period)
  return 0 if series.empty?
  
  values = series.map { |_, value| value }
  
  # Use 3, 6, and 12-month windows
  windows = [3, 6, 12].select { |w| w <= values.size }
  return values.last if windows.empty?
  
  weighted_forecast = 0
  total_weight = 0
  
  windows.each do |window|
    window_values = values.last(window)
    window_average = window_values.sum / window_values.size
    
    # Weight by window size (larger windows = more stable)
    weight = window.to_f / windows.sum
    weighted_forecast += window_average * weight
    total_weight += weight
  end
  
  total_weight > 0 ? weighted_forecast / total_weight : values.last
end</code></pre>

<h3>Model 4: Seasonal Decomposition (20% weight)</h3>

<p>Decompose the series into trend + seasonal + residual, then forecast each:</p>

<pre><code class="language-ruby">def forecast_seasonal_decomposition(series, period)
  return 0 if series.empty? || series.size < 12
  
  decomposition = decompose_time_series(series)
  
  trend_forecast = forecast_trend_component(decomposition[:trend], period)
  seasonal_forecast = forecast_seasonal_component(decomposition[:seasonal], period)
  
  trend_forecast + seasonal_forecast
end

def decompose_time_series(series)
  values = series.map { |_, value| value }
  
  # Calculate trend using 12-month centered moving average
  trend = calculate_trend_component_series(values)
  
  # Seasonal = Original - Trend (then average by month)
  seasonal = calculate_seasonal_component_series(values, trend)
  
  # Residual = Original - Trend - Seasonal
  residual = values.zip(trend, seasonal).map { |v, t, s| v - t - s }
  
  { trend: trend, seasonal: seasonal, residual: residual }
end</code></pre>

<h3>Model 5: Simplified ARIMA (20% weight)</h3>

<p>ARIMA (AutoRegressive Integrated Moving Average) is powerful but complex. We implement a simplified version using differencing:</p>

<pre><code class="language-ruby">def forecast_arima_like(series, period)
  return 0 if series.empty? || series.size < 3
  
  values = series.map { |_, value| value }
  
  # First difference: removes linear trend
  diff1 = values.each_cons(2).map { |a, b| b - a }
  return forecast_moving_average(series, period) if diff1.empty?
  
  # Second difference: removes quadratic trend
  diff2 = diff1.each_cons(2).map { |a, b| b - a }
  
  # Use whichever series is more stable (closer to zero mean)
  working_series = diff2.size > 3 && diff2.sum.abs < diff1.sum.abs ? diff2 : diff1
  
  # Forecast the difference
  forecasted_diff = working_series.last(3).sum / 3.0
  
  # Convert back to original scale
  last_value = values.last
  last_diff = diff1.last
  
  if working_series == diff2
    last_value + (last_diff + forecasted_diff) * period
  else
    last_value + forecasted_diff * period
  end
end</code></pre>

<h2>Step 3: The Ensemble Engine</h2>

<p>Now we combine all five models using <strong>confidence-weighted voting</strong>:</p>

<pre><code class="language-ruby">def forecast_with_ensemble(series, period, type)
  return { forecast: 0, confidence: 0.1, models: {} } if series.empty?
  
  models = {}
  
  # Each model contributes its forecast, weight, and confidence
  models[:linear_trend] = {
    forecast: forecast_linear_trend_enhanced(series, period),
    weight: 0.25,
    confidence: calculate_linear_trend_confidence(series, period)
  }
  
  models[:exponential_smoothing] = {
    forecast: forecast_exponential_smoothing(series, period),
    weight: 0.20,
    confidence: calculate_exponential_smoothing_confidence(series, period)
  }
  
  models[:moving_average] = {
    forecast: forecast_moving_average(series, period),
    weight: 0.15,
    confidence: calculate_moving_average_confidence(series, period)
  }
  
  models[:seasonal_decomposition] = {
    forecast: forecast_seasonal_decomposition(series, period),
    weight: 0.20,
    confidence: calculate_seasonal_confidence(series, period)
  }
  
  models[:arima_like] = {
    forecast: forecast_arima_like(series, period),
    weight: 0.20,
    confidence: calculate_arima_confidence(series, period)
  }
  
  # Weighted ensemble: forecast * weight * confidence
  total_weight = models.values.sum { |m| m[:weight] * m[:confidence] }
  
  if total_weight > 0
    ensemble_forecast = models.values.sum { |m| 
      m[:forecast] * m[:weight] * m[:confidence] 
    } / total_weight
    
    ensemble_confidence = models.values.sum { |m| 
      m[:confidence] * m[:weight] 
    } / models.values.sum { |m| m[:weight] }
  else
    ensemble_forecast = 0
    ensemble_confidence = 0.1
  end
  
  {
    forecast: ensemble_forecast,
    confidence: ensemble_confidence,
    models: models  # Expose individual model predictions for debugging
  }
end</code></pre>

<h3>Why This Works</h3>

<p>The formula <code>forecast * weight * confidence</code> means:</p>
<ul>
  <li>Models with <strong>higher base weights</strong> contribute more (linear regression at 25%)</li>
  <li>Models with <strong>higher confidence</strong> for this specific data contribute more</li>
  <li>A model that's uncertain about its prediction naturally gets down-weighted</li>
</ul>

<h2>Step 4: Confidence Calculation</h2>

<p>Each model calculates its own confidence based on how well it fits the historical data:</p>

<pre><code class="language-ruby">def calculate_linear_trend_confidence(series, period)
  return 0.1 if series.empty? || series.size < 3
  
  values = series.map { |_, value| value }
  n = values.size
  
  # Calculate R-squared (coefficient of determination)
  x_values = (1..n).to_a
  x_mean = x_values.sum.to_f / n
  y_mean = values.sum.to_f / n
  
  # Fit line and calculate residuals
  numerator = x_values.zip(values).sum { |x, y| (x - x_mean) * (y - y_mean) }
  denominator = x_values.sum { |x| (x - x_mean) ** 2 }
  
  return 0.1 if denominator == 0
  
  slope = numerator / denominator
  intercept = y_mean - slope * x_mean
  
  # R-squared calculation
  ss_res = 0
  ss_tot = 0
  
  x_values.zip(values).each do |x, y|
    predicted = slope * x + intercept
    ss_res += (y - predicted) ** 2
    ss_tot += (y - y_mean) ** 2
  end
  
  r_squared = ss_tot > 0 ? 1 - (ss_res / ss_tot) : 0
  
  # Adjust for forecast horizon (farther = less confident)
  base_confidence = [r_squared, 0.1].max
  period_penalty = (period - 1) * 0.05
  data_quality_bonus = series.size > 12 ? 0.1 : 0
  
  [[base_confidence - period_penalty + data_quality_bonus, 0.1].max, 0.95].min
end</code></pre>

<h2>Step 5: Monte Carlo Simulation for Risk Assessment</h2>

<p>For P&L forecasting, we add Monte Carlo simulation to quantify uncertainty:</p>

<pre><code class="language-ruby">def run_monte_carlo_simulation(revenue_period, expense_total, period, simulations: 1000)
  return {} unless revenue_period
  
  results = []
  
  # Uncertainty increases with forecast horizon
  revenue_mean = revenue_period[:forecasted_amount]
  revenue_std = revenue_mean * 0.15 * period
  
  expense_mean = expense_total
  expense_std = expense_total * 0.1 * period
  
  simulations.times do
    # Sample from distributions
    revenue_sim = revenue_mean + (rand - 0.5) * 2 * revenue_std
    expense_sim = expense_mean + (rand - 0.5) * 2 * expense_std
    
    revenue_sim = [revenue_sim, 0].max
    expense_sim = [expense_sim, 0].max
    
    net_income = revenue_sim - expense_sim
    results << { net_income: net_income }
  end
  
  net_incomes = results.map { |r| r[:net_income] }
  
  {
    mean_net_income: (net_incomes.sum / simulations).round(2),
    percentile_5: net_incomes.sort[(simulations * 0.05).to_i].round(2),
    percentile_95: net_incomes.sort[(simulations * 0.95).to_i].round(2),
    probability_positive: (results.count { |r| r[:net_income] > 0 } / simulations.to_f).round(3)
  }
end</code></pre>

<p>This gives us:</p>
<ul>
  <li><strong>90% confidence interval</strong> (5th to 95th percentile)</li>
  <li><strong>Probability of profitability</strong> (% of simulations with positive net income)</li>
  <li><strong>Value at Risk</strong> (worst-case 5th percentile)</li>
</ul>

<h2>Step 6: Applying Constraints</h2>

<p>Raw forecasts can produce impossible values. We apply sanity checks:</p>

<pre><code class="language-ruby">def apply_forecast_constraints(forecast, series, period)
  return 0 if series.empty?
  
  values = series.map { |_, value| value }
  
  # Calculate reasonable bounds from history
  mean = values.sum / values.size
  std_dev = Math.sqrt(values.sum { |v| (v - mean) ** 2 } / values.size)
  
  # Allow 3 standard deviations from mean
  lower_bound = [mean - 3 * std_dev, 0].max  # Revenue can't be negative
  upper_bound = mean + 3 * std_dev
  
  # Apply bounds
  constrained = [[forecast, lower_bound].max, upper_bound].min
  
  # Limit change rate (max 50% change per period)
  recent_average = values.last(3).sum / [values.last(3).size, 1].max
  max_change = recent_average * 0.5 * period
  
  if (constrained - recent_average).abs > max_change
    constrained = constrained > recent_average ? 
      recent_average + max_change : 
      recent_average - max_change
  end
  
  constrained
end</code></pre>

<h2>The Final Output</h2>

<p>When you call <code>ForecastService.new(merchant: merchant).call</code>, you get:</p>

<pre><code class="language-ruby">{
  cash_flow: {
    periods: [
      {
        period: "2026-02",
        expected_inflow: 125000.00,
        expected_outflow: 98000.00,
        net_cash_flow: 27000.00,
        confidence: 0.78,
        risk_level: "low",
        prediction_intervals: {
          revenue_lower: 112500.00,
          revenue_upper: 137500.00
        },
        model_components: {
          revenue: {
            forecast: 125000.00,
            confidence: 0.82,
            models: {
              linear_trend: { forecast: 128000, confidence: 0.85 },
              exponential_smoothing: { forecast: 122000, confidence: 0.79 },
              # ... other models
            }
          }
        }
      }
      # ... more periods
    ],
    summary: {
      total_expected_inflow: 750000.00,
      net_monthly_average: 27000.00,
      forecast_accuracy: { revenue_accuracy: 0.75 }
    },
    confidence_metrics: {
      forecast_reliability: 0.76,
      seasonal_factor_strength: 0.45,
      trend_strength: 0.62
    }
  },
  revenue: { /* detailed revenue forecast */ },
  expenses: { /* by category */ },
  pnl: { /* with Monte Carlo results */ }
}</code></pre>

<h2>Technical Limitations & Future Evolutions</h2>

<p>While this "Pure Ruby" ensemble approach allowed us to ship a sophisticated feature without adding infrastructure complexity, it's important to acknowledge its trade-offs:</p>

<h3>1. The "Math in Ruby" Bottleneck</h3>

<p>Ruby is excellent for business logic but isn't optimized for heavy numerical computation.</p>

<p><strong>The Limitation:</strong> As datasets grow, the ~2200 lines of manual statistical loops can become a performance bottleneck during background processing.</p>

<p><strong>The Evolution:</strong> For massive scale, we may move the "math" layer to C-optimized libraries like Numo::NArray or offload the computation to a Python-based microservice leveraging pandas and scikit-learn.</p>

<h3>2. Statistical Simplicity vs. Deep Learning</h3>

<p>Our models are robust but lack the depth of modern "AI" forecasting frameworks.</p>

<p><strong>The Limitation:</strong> The system may struggle with complex, non-linear patterns or overlapping cycles that tools like Facebook Prophet handle automatically.</p>

<p><strong>The Evolution:</strong> We view this engine as a "baseline." Our next phase involves Backtesting: running historical data through this engine versus ML models to see where the extra complexity actually improves accuracy.</p>

<h2>Key Takeaways</h2>

<ol>
  <li><strong>No single model is best</strong> — Ensemble approaches consistently outperform individual models in production</li>
  <li><strong>Weight by confidence</strong> — Let models that fit your data better have more influence</li>
  <li><strong>Clean your data first</strong> — Outlier removal and gap filling are crucial</li>
  <li><strong>Quantify uncertainty</strong> — Monte Carlo simulation gives you probability distributions, not just point estimates</li>
  <li><strong>Apply constraints</strong> — Business logic should prevent impossible forecasts</li>
  <li><strong>Expose the internals</strong> — Returning individual model predictions helps with debugging and trust</li>
</ol>

<h2>Performance Considerations</h2>

<p>This service processes ~2200 lines of Ruby for a single forecast. For production:</p>

<ul>
  <li><strong>Cache results</strong> — Forecasts don't change minute-to-minute</li>
  <li><strong>Background jobs</strong> — Generate forecasts async with Sidekiq</li>
  <li><strong>Limit history</strong> — 2-3 years of data is usually sufficient</li>
  <li><strong>Index your queries</strong> — The <code>get_historical_*_data</code> methods hit the database</li>
</ul>

<h2>What's Next?</h2>

<p>In future posts, we'll cover:</p>
<ul>
  <li>Adding <strong>external factors</strong> (economic indicators, seasonality events)</li>
  <li><strong>Backtesting</strong> to measure real forecast accuracy</li>
  <li><strong>Auto-tuning</strong> hyperparameters (alpha, beta, weights)</li>
  <li>Integrating with <strong>machine learning models</strong> for hybrid forecasting</li>
</ul>

<hr />

<p><em>This forecasting engine is part of our accounts receivable platform, helping businesses predict cash flow and make better financial decisions.</em></p>
    `.trim(),
  },
];


import { ExperienceItem, ProjectItem, SkillCategory, SocialLink, ServiceItem, TestimonialItem, CaseStudyItem, ProcessStep, PainPoint } from './types';
import { getEmailMailtoLink } from './utils/email';

export const BIO = {
  name: "Junior Joanis",
  tagline: "I help founders and CTOs ship MVPs, fix legacy, and deliver production AI, fast.",
  avatarUrl: "/junior-joanis.jpg",
  shortBio: "CTO and hands-on engineer with 12+ years shipping real products. I build MVPs, stabilize legacy codebases, and integrate AI into workflows in a way that actually reduces cycle time, not adds complexity.",
  fullBio: `I've spent over a decade building and scaling software products, often under real constraints: legacy systems, enterprise clients, tight timelines, and high stakes.

  I've been a CTO, a co-founder, and a hands-on builder. I have shipped platforms to 100k+ users, built fintech infrastructure, and deployed AI agents in production.

  Today I work with founders and CTOs across Europe who need to ship faster. I help you get the MVP live, clean up the parts of the stack that keep breaking, and add AI where it creates leverage. No agency overhead. No junior devs. Just a senior operator who cares about outcomes and delivery.`
};

export const HERO = {
  headline: "Ship the product. Fix the bottlenecks.",
  subheadline: "I help founders and CTOs deliver MVPs, rescue legacy systems, and ship AI features that make the roadmap move again. Weeks to momentum, not months of refactors.",
  primaryCta: "Book a Discovery Call",
  secondaryCta: "See How I Help",
  ctaUrl: "https://calendly.com/junior-joanis/intro-call",
  stats: [
    { value: "12+", label: "Years Building Products" },
    { value: "100k+", label: "Users on Platforms I've Built" },
    { value: "< 6 weeks", label: "Typical Time to First Delivery" },
  ]
};

export const SOCIAL_PROOF_LOGOS = [
  {
    name: "AXA",
    logoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/AXA_Logo.svg?width=200",
  },
  {
    name: "BNP Paribas",
    logoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/BNP_Paribas_logo.svg?width=200",
  },
  {
    name: "Deutsche Bank",
    logoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Deutsche_Bank_logo_without_wordmark.svg?width=200",
  },
  {
    name: "ENGIE",
    logoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Engie_logo.png?width=200",
  },
  {
    name: "Deloitte",
    logoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Deloitte.svg?width=200",
  },
];

export const PAIN_POINTS: PainPoint[] = [
  {
    id: 1,
    title: "Shipping Is Slow and Nobody Trusts the Timeline",
    description: "Scope creeps, priorities change, and the team is stuck in meetings. You need smaller bets, tighter feedback loops, and a builder who can turn ambiguity into working software.",
    icon: "file-spreadsheet",
  },
  {
    id: 2,
    title: "Legacy Code and Infra Turn Every Change Into a Risk",
    description: "Incidents, brittle workflows, missing tests, and outdated dependencies keep the team in firefighting mode. The roadmap stalls because the platform is fragile.",
    icon: "clock",
  },
  {
    id: 3,
    title: "Your Systems Don't Talk to Each Other",
    description: "Payments, CRMs, ERPs, data warehouses, internal tools. Integrations break, data quality drifts, and manual patches become the process. You need reliable flows and clear ownership.",
    icon: "unplug",
  },
  {
    id: 4,
    title: "You Want AI, But Not a Science Project",
    description: "You need features that ship and work in production: guardrails, evals, monitoring, and clean integrations with your product and ops. Not another demo that never leaves staging.",
    icon: "brain",
  },
];

export const SOLUTION = {
  title: "A senior builder who unblocks delivery",
  subtitle: "Not an agency. Not a ticket factory. A hands-on technical partner who can build the MVP, fix the platform, and ship AI features with production discipline.",
  points: [
    {
      title: "What you get",
      description: "Working product shipped to production: MVP scope, core workflows, integrations, and the engineering foundations that let you move faster next month than this month.",
    },
    {
      title: "How we ship",
      description: "Small, high-leverage sprints with weekly deliverables. Direct communication, clear tradeoffs, and ruthless prioritization. You see progress in the product, not in slides.",
    },
    {
      title: "Why it works",
      description: "I have been a CTO, a co-founder, and the person on call. I know how to balance speed with reliability, and how to integrate AI so it improves operations and UX instead of slowing teams down.",
    },
  ]
};

export const SERVICES: ServiceItem[] = [
  {
    id: "mvp",
    title: "MVP Delivery",
    outcome: "Get to production fast, with the right scope.",
    description: "Turn your product idea into a real, working MVP. I help you pick the smallest build that proves the business, then ship it with clean architecture so you can iterate without rewriting everything.",
    forWhom: "Founders and CTOs who need a credible MVP to win customers, fundraising, or internal alignment.",
    deliverables: [
      "MVP scope, milestones, and delivery plan",
      "Full-stack implementation and production deployment",
      "Core workflows, auth, permissions, and payments where needed",
      "CI/CD, environments, and observability basics",
      "Handoff docs so your team can keep shipping",
    ],
    icon: "rocket",
  },
  {
    id: "ai-automation",
    title: "Production AI and Agentic Workflows",
    outcome: "Ship AI features that reduce cycle time.",
    description: "I design and build AI agents that do real work inside your product and ops: document processing, analysis, triage, support drafting, and internal automation. Built with guardrails and monitoring so it holds up in production.",
    forWhom: "Teams that want AI in the roadmap, without creating a reliability or security nightmare.",
    deliverables: [
      "Agent and workflow design, including risk and failure modes",
      "LLM integration with product and internal systems",
      "Evaluations, prompt testing, and regression checks",
      "Human-in-the-loop controls and auditability where needed",
      "Monitoring, cost controls, and rollout plan",
    ],
    icon: "bot",
  },
  {
    id: "fintech",
    title: "Fintech & Payments Systems",
    outcome: "Reliable billing, reconciliation, and AR workflows.",
    description: "I build the financial infrastructure that keeps cash flowing. Payment orchestration, automated reconciliation, accounts receivable systems, and BNPL integrations. Built by someone who's lived in the AR trenches.",
    forWhom: "Finance teams, fintech startups, and SMEs who need robust payment and collection systems.",
    deliverables: [
      "Payment gateway integrations (Stripe, Mollie, PSPs)",
      "Automated reconciliation algorithms",
      "Accounts receivable automation and dunning workflows",
      "Financial dashboards and reporting",
      "ERP and banking API integrations",
    ],
    icon: "banknote",
  },
  {
    id: "internal-tools",
    title: "Legacy Rescue and Modernization",
    outcome: "Stabilize the platform, then speed up delivery.",
    description: "When your codebase slows the team down, you do not need a rewrite. You need a focused rescue: reduce incidents, simplify the hardest paths, and modernize incrementally so you can ship again.",
    forWhom: "CTOs and product teams stuck with a fragile platform, recurring incidents, or a roadmap blocked by technical debt.",
    deliverables: [
      "Technical audit with a prioritized rescue plan",
      "Stability work: monitoring, alerting, and incident reduction",
      "Incremental refactors, dependency upgrades, and test strategy",
      "Performance improvements and reliability fixes on key workflows",
      "CI/CD and deployment hardening",
    ],
    icon: "wrench",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 1,
    title: "Discover",
    description: "We start with a 30-minute call. I learn your business, your pain points, and what 'done' looks like. No questionnaires, just a real conversation.",
  },
  {
    id: 2,
    title: "Scope & Plan",
    description: "I deliver a clear proposal: what we build, how long it takes, and what it costs. No surprise invoices, no scope creep.",
  },
  {
    id: 3,
    title: "Build & Ship",
    description: "I work in focused sprints with weekly deliverables. You see real progress every week, not just status updates.",
  },
  {
    id: 4,
    title: "Iterate & Handoff",
    description: "We refine based on real feedback, then I hand off clean code, documentation, and a system your team can maintain and grow.",
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    quote: "Junior built our entire AR automation platform from scratch. Payment collection went from 45 days to 28 days average. He doesn't just write code, he understands the finance operations behind it.",
    author: "Finance Director",
    role: "Finance Director",
    company: "B2B SaaS Company, Amsterdam",
  },
  {
    id: 2,
    quote: "We needed AI agents that could actually handle our document processing pipeline, not a demo. Junior delivered a production system in 5 weeks that replaced 3 full-time manual processes.",
    author: "CEO",
    role: "CEO",
    company: "Fintech Startup, Paris",
  },
  {
    id: 3,
    quote: "He shipped our MVP in 4 weeks. What would have taken an agency 3 months and 3x the budget, Junior delivered solo with better code quality and full documentation.",
    author: "Founder",
    role: "Founder",
    company: "Early-stage Startup, Brussels",
  },
];

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: 1,
    title: "AI-Powered Accounts Receivable Automation",
    client: "B2B Fintech Platform",
    challenge: "Finance teams spending 15+ hours per week on manual payment reconciliation and collection follow-ups. Cash conversion cycle averaging 45+ days.",
    outcome: "Built a complete AR automation platform with AI copilots, automated dunning workflows, payment orchestration, and real-time reconciliation.",
    metrics: [
      "Cash conversion reduced from 45 to 28 days",
      "Manual reconciliation time cut by 80%",
      "Payment orchestration across 4 PSPs + BNPL providers",
      "AI copilot handling 60% of routine AR queries",
    ],
    tags: ["Fintech", "AI Agents", "Payments", "Reconciliation"],
  },
  {
    id: 2,
    title: "AI Document Processing for Wealth Management",
    client: "WealthTech Advisory Platform",
    challenge: "Financial advisors manually processing hundreds of client documents per week, leading to slow onboarding and errors in financial planning.",
    outcome: "Designed AI-powered document extraction and analysis pipeline that automatically processes financial documents and feeds insights into the advisory platform.",
    metrics: [
      "Document processing time reduced by 70%",
      "Advisor onboarding time cut from days to hours",
      "99.2% extraction accuracy on financial documents",
    ],
    tags: ["AI Agents", "Document Processing", "WealthTech"],
  },
  {
    id: 3,
    title: "Startup MVP: From Idea to Launch in 4 Weeks",
    client: "Early-stage B2B Startup",
    challenge: "Founding team had a validated concept but no technical co-founder. Needed a working product to close first enterprise clients and raise a seed round.",
    outcome: "Built and deployed a complete web platform with user management, core business logic, Stripe integration, and admin dashboard in under 30 days.",
    metrics: [
      "Live product in 4 weeks from kickoff",
      "3 enterprise clients signed within first month",
      "Seed round closed with working product demo",
    ],
    tags: ["MVP", "Full-Stack", "Startup"],
  },
  {
    id: 4,
    title: "Internal Ops Platform for Scale",
    client: "Enterprise SaaS Company (100k+ Users)",
    challenge: "Engineering and operations teams using 8+ disconnected tools. Data silos, manual reporting, and no single view of system health across multi-cloud infrastructure.",
    outcome: "Built unified internal operations platform with data pipelines, analytics dashboards, automated alerting, and API integrations across all core systems.",
    metrics: [
      "99.9% uptime SLA maintained across multi-cloud",
      "Reporting time reduced from 2 days to real-time",
      "Engineering team productivity increased by 40%",
    ],
    tags: ["Internal Tools", "Infrastructure", "Analytics"],
  },
];

export const ABOUT = {
  headline: "Built by an operator, not an outsourcer.",
  points: [
    "12+ years shipping products at scale, from early-stage startups in San Francisco to enterprise platforms in Paris and Amsterdam.",
    "Co-founded and built an AI-driven AR automation platform with ERP integrations, payment orchestration, and reconciliation algorithms.",
    "Scaled a SaaS platform to 100k+ active users serving BNP Paribas, AXA, ENGIE, and LVMH as CTO.",
    "Deep expertise in fintech compliance, payments infrastructure, and AI systems in production.",
  ],
  industries: ["Fintech & Payments", "SaaS & B2B", "WealthTech", "InsurTech", "HR Tech"],
  companies: ["Startups (pre-seed to Series A)", "SMEs scaling operations", "Enterprise teams with specific technical needs"],
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 1,
    role: "Co-Founder & CTO",
    company: "Delfyn (B2B SaaS, Finance AI)",
    period: "Dec 2023 – Oct 2025",
    location: "Amsterdam, Netherlands",
    description: [
      "Built an AI-driven AR automation platform with ERP integrations and payment orchestration.",
      "Integrated BNPLs (PragmaGo, Mondu) and developed complex reconciliation algorithms.",
      "Developed financial dashboards & AI copilots for accounts receivable specialists.",
      "Designed resilient IT infrastructure using GCP, Docker, Redis, and PostgreSQL."
    ],
    techStack: ["Ruby on Rails", "React Native Web", "LangChain", "GCP", "PostgreSQL"]
  },
  {
    id: 2,
    role: "CTO",
    company: "Moodwork (Employee Wellbeing SaaS)",
    period: "Dec 2016 – Nov 2023",
    location: "Paris, France",
    description: [
      "Scaled SaaS platform to 100K+ active users (Clients: BNP Paribas, ENGIE, AXA, LVMH).",
      "Led a team of 10+ engineers across backend, frontend, mobile, data science, and devops.",
      "Migrated platform to multi-cloud infra (AWS, OVH, Scaleway) maintaining 99.9% SLA.",
      "Built data lake & analytics pipelines for HR/wellbeing insights and acted as DPO for GDPR.",
      "Balanced hands-on coding with strategic leadership and board relations."
    ],
    techStack: ["Rails", "React", "Kubernetes", "Docker", "ArgoCD", "AWS"]
  },
  {
    id: 3,
    role: "Fullstack Developer",
    company: "Augment (Augmented Reality SaaS)",
    period: "2016",
    location: "Paris, France",
    description: [
      "Built new features & APIs for an AR platform used in e-commerce & retail.",
      "Optimized background job processing (Sidekiq, AWS EC2) improving throughput by 30%."
    ],
    techStack: ["Ruby on Rails", "Sidekiq", "AWS EC2"]
  },
  {
    id: 4,
    role: "Software Engineer",
    company: "Total Immersion (AR/VR)",
    period: "2013 – 2016",
    location: "Paris, France",
    description: [
      "Built SaaS product for augmented reality media (trylive.com) and developer API documentation.",
      "Developed Scaling and High Availability strategy with AWS (ELB, Auto Scaling, CloudFront).",
      "Deployed infrastructure of 30 servers in China in partnership with Yihaodian (YHD)."
    ],
    techStack: ["Ruby on Rails", "Redis", "MongoDB", "ElasticSearch", "Jenkins"]
  }
];

export const SKILLS: SkillCategory[] = [
  {
    category: "Engineering & Architecture",
    skills: ["Ruby on Rails", "Python (Flask)", "Node.js", "React", "GCP", "AWS", "Docker", "Kubernetes", "Redis", "PostgreSQL"]
  },
  {
    category: "AI & Machine Learning",
    skills: ["LangChain", "Vertex AI", "HuggingFace", "LLM Orchestration", "AI Copilots"]
  },
  {
    category: "Leadership",
    skills: ["Team Building (10+)", "Fundraising", "Roadmap Strategy", "Investor Relations", "GDPR Compliance", "Agile/Scrum"]
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: "Delfyn",
    description: "AI-driven Accounts Receivable automation platform. Built with Payment Orchestration and Reconciliation algorithms to help finance teams automate cash collection.",
    tags: ["Fintech", "AI Agent", "Rails", "React", "GCP"],
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7350493448266772480",
    metric: "AR Automation",
    about: "This project represents a key milestone in my career, leveraging advanced technologies to solve complex problems in the Fintech space. It involved not only the development of the product, but also founding the company and talking to customers and partners to understand their needs and how to best serve them.",
    features: [
      "AI Copilots for accounts receivable specialists.",
      "Seamless Integration with third-party APIs, ERPs, PSPs, BNPLs, Open Banking APIs, etc.",
      "Advanced Analytics and Reporting Dashboards.",
      "Payment Orchestration and Reconciliation algorithms."
    ],
    role: "Co-Founder & CTO"
  },
  {
    id: 2,
    title: "Moodwork",
    description: "Employee Wellbeing SaaS platform scaling to 100k+ users. Features include advanced HR analytics, data lakes, and multi-cloud infrastructure.",
    tags: ["HealthTech", "SaaS", "Big Data", "AWS", "Kubernetes"],
    link: "https://www.moodwork.com",
    metric: "100k+ Users",
    about: "Led the technical vision and execution of a comprehensive employee wellbeing platform serving major enterprises. This project involved scaling infrastructure to handle 100k+ active users, building complex data analytics pipelines, and ensuring GDPR compliance as Data Protection Officer.",
    features: [
      "Scalable multi-cloud infrastructure (AWS, OVH, Scaleway) with 99.9% SLA.",
      "Data lake & analytics pipelines for HR/wellbeing insights.",
      "GDPR-compliant data processing and privacy controls.",
      "Advanced HR analytics dashboards for enterprise clients."
    ],
    role: "CTO"
  },
  {
    id: 3,
    title: "TryLive (Total Immersion)",
    description: "Augmented Reality SaaS for retail. Developed high-availability infrastructure serving millions of requests for clients like Yihaodian.",
    tags: ["AR/VR", "High Availability", "Infrastructure", "Ruby"],
    link: "http://www.trylive.com",
    metric: "Scale Strategy",
    about: "Built a SaaS product for augmented reality media used in retail and e-commerce. This project involved developing high-availability infrastructure strategies and deploying infrastructure across multiple regions, including a significant deployment in China.",
    features: [
      "High-availability infrastructure serving millions of requests.",
      "Multi-region deployment including 30 servers in China.",
      "Developer API documentation and SDK.",
      "Scaling strategy with AWS (ELB, Auto Scaling, CloudFront)."
    ],
    role: "Software Engineer"
  },
   {
    id: 4,
    title: "Augment",
    description: "Leading AR platform for e-commerce. Optimized background job processing improving throughput by 30% for 3D model rendering pipelines.",
    tags: ["E-commerce", "Performance", "AWS EC2", "Sidekiq"],
    link: "https://www.augment.com",
    metric: "+30% Performance",
    about: "Developed new features and APIs for an augmented reality platform used in e-commerce and retail. Focused on performance optimization, particularly improving background job processing throughput for 3D model rendering pipelines.",
    features: [
      "Optimized background job processing (Sidekiq, AWS EC2) improving throughput by 30%.",
      "New features and APIs for AR platform in e-commerce.",
      "3D model rendering pipeline optimization.",
      "Performance improvements for high-volume processing."
    ],
    role: "Fullstack Developer"
  }
];

export const SOCIALS: SocialLink[] = [
  { platform: "GitHub", url: "https://github.com/JuniorJoanis", icon: "github" },
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/juniorjoanis/", icon: "linkedin" },
  { platform: "Twitter/X", url: "https://x.com/juniorjoanis", icon: "twitter" },
  { platform: "Email", url: getEmailMailtoLink(), icon: "mail" },
  { platform: "Calendar", url: "https://calendly.com/junior-joanis/intro-call", icon: "calendar"}
];

export const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const CHART_DATA = [
  { subject: 'Engineering', A: 100, fullMark: 150 },
  { subject: 'Leadership', A: 90, fullMark: 150 },
  { subject: 'AI/ML', A: 85, fullMark: 150 },
  { subject: 'Product', A: 95, fullMark: 150 },
  { subject: 'DevOps', A: 80, fullMark: 150 },
  { subject: 'Strategy', A: 85, fullMark: 150 },
];

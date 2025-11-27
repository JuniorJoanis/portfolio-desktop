import { ExperienceItem, ProjectItem, SkillCategory, SocialLink } from './types';

export const BIO = {
  name: "Junior Joanis",
  tagline: "Building Scalable SaaS & AI-First Financial Tools",
  shortBio: "CTO and Full-stack Engineer with 12+ years of experience. I build and grow SaaS platforms that serve 100k+ users for companies like AXA and BNP Paribas. Focused on LLMs, Fintech, and scaling engineering teams.",
  fullBio: `I am a CTO and Full-stack Engineer with over 12 years of experience building and scaling SaaS platforms. My background spans from early-stage startups in San Francisco to leading engineering teams in Paris and Amsterdam.
  
  I have founded and led products serving over 100k+ active users, managed teams of 10+ engineers, and navigated complex compliance landscapes (GDPR, Fintech). My recent work focuses on bridging the gap between traditional SaaS architecture and the new wave of AI/LLM capabilities.`
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
    link: "https://delfyn.co",
    metric: "AR Automation"
  },
  {
    id: 2,
    title: "Moodwork",
    description: "Employee Wellbeing SaaS platform scaling to 100k+ users. Features include advanced HR analytics, data lakes, and multi-cloud infrastructure.",
    tags: ["HealthTech", "SaaS", "Big Data", "AWS", "Kubernetes"],
    link: "https://www.moodwork.com",
    metric: "100k+ Users"
  },
  {
    id: 3,
    title: "TryLive (Total Immersion)",
    description: "Augmented Reality SaaS for retail. Developed high-availability infrastructure serving millions of requests for clients like Yihaodian.",
    tags: ["AR/VR", "High Availability", "Infrastructure", "Ruby"],
    link: "http://www.trylive.com",
    metric: "Scale Strategy"
  },
   {
    id: 4,
    title: "Augment",
    description: "Leading AR platform for e-commerce. Optimized background job processing improving throughput by 30% for 3D model rendering pipelines.",
    tags: ["E-commerce", "Performance", "AWS EC2", "Sidekiq"],
    link: "https://www.augment.com",
    metric: "+30% Performance"
  }
];

export const SOCIALS: SocialLink[] = [
  { platform: "GitHub", url: "https://github.com/JuniorJoanis", icon: "github" },
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/juniorjoanis/", icon: "linkedin" },
  { platform: "Twitter/X", url: "https://x.com/juniorjoanis", icon: "twitter" },
  { platform: "Email", url: "mailto:junior.joanis@gmail.com", icon: "mail" }
];

export const CHART_DATA = [
  { subject: 'Engineering', A: 100, fullMark: 150 },
  { subject: 'Leadership', A: 90, fullMark: 150 },
  { subject: 'AI/ML', A: 85, fullMark: 150 },
  { subject: 'Product', A: 95, fullMark: 150 },
  { subject: 'DevOps', A: 80, fullMark: 150 },
  { subject: 'Strategy', A: 85, fullMark: 150 },
];
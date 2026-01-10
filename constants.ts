import { ExperienceItem, ProjectItem, SkillCategory, SocialLink } from './types';
import { getEmailMailtoLink } from './utils/email';

export const BIO = {
  name: "Junior Joanis",
  tagline: "Building Scalable SaaS & AI-First Financial Tools",
  avatarUrl: "https://github.com/JuniorJoanis.png",
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
  { platform: "Email", url: getEmailMailtoLink(), icon: "mail" }
];

export const CHART_DATA = [
  { subject: 'Engineering', A: 100, fullMark: 150 },
  { subject: 'Leadership', A: 90, fullMark: 150 },
  { subject: 'AI/ML', A: 85, fullMark: 150 },
  { subject: 'Product', A: 95, fullMark: 150 },
  { subject: 'DevOps', A: 80, fullMark: 150 },
  { subject: 'Strategy', A: 85, fullMark: 150 },
];
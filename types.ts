
export interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  techStack: string[];
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  metric?: string;
  about?: string;
  features?: string[];
  role?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

// Service Business Types
export interface ServiceItem {
  id: string;
  title: string;
  outcome: string;
  description: string;
  forWhom: string;
  deliverables: string[];
  icon: string; // icon name for lucide
}

export interface TestimonialItem {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

export interface CaseStudyItem {
  id: number;
  title: string;
  client: string;
  challenge: string;
  outcome: string;
  metrics: string[];
  tags: string[];
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
}

export interface PainPoint {
  id: number;
  title: string;
  description: string;
  icon: string;
}

// OS Types
export type AppId = 'terminal' | 'resume' | 'projects' | 'contact' | 'browser' | 'game' | 'slack';

export interface WindowState {
  id: AppId;
  title: string;
  icon: any; // Lucide Icon
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size?: { w: number; h: number };
}

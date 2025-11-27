
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

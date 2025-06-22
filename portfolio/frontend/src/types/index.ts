// Core data types
export interface Profile {
  name: string;
  title: string;
  bio: string;
  location: string;
  photo: string;
}

export interface Status {
  enabled: boolean;
  text: string;
  color: StatusColor;
}

export interface Link {
  name: string;
  url: string;
  icon: IconName;
}

export interface Project {
  name: string;
  description: string;
  techStack: readonly string[];
  demoUrl?: string;
  githubUrl?: string;
}

// UI types
export type StatusColor = 'green' | 'orange' | 'yellow' | 'red' | 'blue' | 'purple';

export type IconName = 'Mail' | 'Linkedin' | 'Github' | 'FileText' | 'ExternalLink';

export type ThemeKey = 'default' | 'minimal';

// Interaction types
export interface Toast {
  id: string;
  message: string;
}

export interface ContextMenu {
  x: number;
  y: number;
}

export type ContextAction = 'email' | 'url' | 'linkedin';

// Analytics types
export type AnalyticsEvent = 
  | 'page_view'
  | 'profile_photo_click'
  | 'profile_interaction'
  | 'link_click'
  | 'project_click'
  | 'context_menu_open'
  | 'context_menu_action'
  | 'copy_action'
  | 'keyboard_shortcut'
  | 'page_load_performance';

export interface AnalyticsData {
  event: AnalyticsEvent;
  data?: Record<string, unknown>;
}

// Component prop types
export interface HeaderProps {
  profile: Profile;
  links: readonly Link[];
  isVisible: boolean;
}

export interface ProfileSectionProps {
  profile: Profile;
  status?: Status;
  links: readonly Link[];
}

export interface ProjectsSectionProps {
  projects: readonly Project[];
}

export interface ContactLinkProps {
  link: Link;
  compact?: boolean;
  iconOnly?: boolean;
}

export interface ProfilePhotoProps {
  src: string;
  alt: string;
  size: 'sm' | 'md' | 'lg';
}

export interface StatusBadgeProps {
  text: string;
  color: StatusColor;
}

export interface ProjectCardProps {
  project: Project;
}

export interface ContextMenuProps {
  position: ContextMenu;
  onAction: (action: ContextAction) => void;
  onClose: () => void;
}

export interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

// Hook return types
export interface UseInteractionsReturn {
  toasts: Toast[];
  contextMenu: ContextMenu | null;
  showToast: (message: string) => void;
  showContextMenu: (e: React.MouseEvent) => void;
  hideContextMenu: () => void;
  handleContextAction: (action: ContextAction) => void;
  removeToast: (id: string) => void;
  copyToClipboard: (text: string, message?: string) => Promise<void>;
}

export interface UseScrollReturn {
  scrollY: number;
  isScrolled: boolean;
}

// Utility types
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Global declarations for analytics
declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
  }
}
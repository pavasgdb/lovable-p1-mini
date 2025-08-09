export interface AppPrompt {
  id: string;
  prompt: string;
  timestamp: number;
  images?: string[];
  themeColors?: string[];
  mode: 'mock' | 'ai';
}

export interface GeneratedApp {
  id: string;
  name: string;
  description: string;
  prompt: string;
  mockup: string;
  themeColors: string[];
  files: AppFile[];
  timestamp: number;
  mode: 'mock' | 'ai';
}

export interface AppFile {
  name: string;
  path: string;
  content: string;
  type: 'component' | 'page' | 'style' | 'config';
}

export type ViewType = 'home' | 'preview' | 'editor';

export type GenerationMode = 'mock' | 'ai';
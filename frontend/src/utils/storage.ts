import { AppPrompt, GeneratedApp } from '../types';

const PROMPTS_KEY = 'textToApp_prompts';
const APPS_KEY = 'textToApp_generatedApps';

export const savePrompt = (prompt: AppPrompt): void => {
  const prompts = getPrompts();
  const updated = [prompt, ...prompts.filter(p => p.id !== prompt.id)].slice(0, 10);
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(updated));
};

export const getPrompts = (): AppPrompt[] => {
  try {
    const stored = localStorage.getItem(PROMPTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveGeneratedApp = (app: GeneratedApp): void => {
  const apps = getGeneratedApps();
  const updated = [app, ...apps.filter(a => a.id !== app.id)].slice(0, 10);
  localStorage.setItem(APPS_KEY, JSON.stringify(updated));
};

export const getGeneratedApps = (): GeneratedApp[] => {
  try {
    const stored = localStorage.getItem(APPS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
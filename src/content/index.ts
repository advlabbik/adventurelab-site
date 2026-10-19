import type { Lang, SiteContent } from './types';
import { it } from './it';
import { en } from './en';

const byLang: Record<Lang, SiteContent> = { it, en };

export const getContent = (lang: Lang): SiteContent => byLang[lang];
export type { Lang, SiteContent };

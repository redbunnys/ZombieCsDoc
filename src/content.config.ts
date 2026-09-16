import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	// Starlight 界面文案的本地化覆盖（src/content/i18n/*.yml）
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};

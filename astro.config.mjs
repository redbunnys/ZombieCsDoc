// @ts-check

import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import starlightThemeFlexoki from 'starlight-theme-flexoki';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [
		starlight({
			plugins: [starlightThemeFlexoki()],
			title: 'ZombieCs 文档',
			description: 'ZombieCs — CS2 社区生化模式插件使用文档',
			// 站点根 `/` 留给宣传落地页，文档站左上角标题指向文档介绍页
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
				// 顶栏右侧「返回首页」入口
				SocialIcons: './src/components/SocialIcons.astro',
				// 页面最顶端「正在开发中」提示条
				PageFrame: './src/components/PageFrame.astro',
			},
			// 文档导航中提供返回宣传页的入口
			social: [{ icon: 'external', label: '宣传页', href: '/' }],
			// 国际化：中文为默认语言（无路径前缀），英文位于 /en/
			defaultLocale: 'root',
			locales: {
				root: {
					label: '简体中文',
					lang: 'zh-CN',
				},
				en: {
					label: 'English',
					lang: 'en',
				},
			},
			sidebar: [
				{
					label: '开始',
					translations: { en: 'Getting Started' },
					items: [
						{
							label: '插件介绍',
							translations: { en: 'Introduction' },
							slug: 'overview',
						},
						{
							label: '安装指南',
							translations: { en: 'Installation' },
							slug: 'guides/installation',
						},
					],
				},
				{
					label: '游戏模式',
					translations: { en: 'Game Modes' },
					items: [{ autogenerate: { directory: 'modes' } }],
				},
			],
		}),
		sitemap(),
	],

	// Cloudflare Workers 部署适配器（配置见 wrangler.jsonc）
	// 注意：启用后必须确保 satteri 的 WASM 绑定已安装，
	// 见 scripts/ensure-satteri-wasm.mjs 与 README「已知问题」。
	adapter: cloudflare(),
});

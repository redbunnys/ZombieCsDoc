// @ts-check

import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import starlightThemeFlexoki from 'starlight-theme-flexoki';

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
			locales: {
				root: {
					label: '简体中文',
					lang: 'zh-CN',
				},
			},
			sidebar: [
				{
					label: '开始',
					items: [
						{ label: '插件介绍', slug: 'overview' },
						{ label: '安装指南', slug: 'guides/installation' },
					],
				},
				{
					label: '游戏模式',
					items: [{ autogenerate: { directory: 'modes' } }],
				},
			],
		}),
		sitemap(),
	],
});

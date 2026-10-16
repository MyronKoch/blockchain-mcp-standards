import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'BMCPS v3.0',
  tagline: 'A 2025 standard for blockchain MCP tool interfaces, frozen as a reference',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // Set the production url of your site here
  url: 'https://bmcps.dev',
  baseUrl: '/',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/MyronKoch/blockchain-mcp-standards/tree/master/website/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false, // Disable blog for now
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    announcementBar: {
      id: 'frozen-2026-10',
      content:
        'BMCPS v3.0 is frozen as a 2025 reference and no longer actively developed. <a href="/docs/STATUS">Status, known limits, and what I\'d change today</a>',
      isCloseable: false,
    },
    image: 'img/bmcps-social-card.jpg',
    navbar: {
      title: 'BMCPS v3.0',
      logo: {
        alt: 'BMCPS Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/MyronKoch/blockchain-mcp-standards',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Core Standard',
              to: '/docs/Blockchain-MCP-Standard-v3.0',
            },
            {
              label: 'Quick Start Guide',
              to: '/docs/QUICK-START-GUIDE',
            },
            {
              label: 'Tool Naming Registry',
              to: '/docs/UNIVERSAL-TOOL-NAMING-REGISTRY',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Testing Standard',
              to: '/docs/TESTING-STANDARD',
            },
            {
              label: 'Troubleshooting',
              to: '/docs/TROUBLESHOOTING',
            },
            {
              label: 'API Key Cycling',
              to: '/docs/API-KEY-CYCLING',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/MyronKoch/blockchain-mcp-standards',
            },
            {
              label: 'License (MIT)',
              href: 'https://github.com/MyronKoch/blockchain-mcp-standards/blob/master/LICENSE',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Myron Koch. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'typescript', 'javascript', 'json', 'markdown'],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    algolia: {
      // This is disabled for now - enable after deployment
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'bmcps',
      contextualSearch: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'BMCPS v3.0',
  tagline: 'The unified standard for blockchain MCP servers',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // Set the production url of your site here
  url: 'https://myronkoch.github.io',
  // For GitHub pages deployment
  baseUrl: '/blockchain-mcp-standards/',

  // GitHub pages deployment config
  organizationName: 'MyronKoch',
  projectName: 'blockchain-mcp-standards',
  deploymentBranch: 'gh-pages',
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
          editUrl: 'https://github.com/MyronKoch/blockchain-mcp-standards/tree/main/',
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
              to: '/docs/01-Blockchain-MCP-Standard-v3.0',
            },
            {
              label: 'Quick Start Guide',
              to: '/docs/03-QUICK-START-GUIDE',
            },
            {
              label: 'Tool Naming Registry',
              to: '/docs/02-UNIVERSAL-TOOL-NAMING-REGISTRY',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Testing Standard',
              to: '/docs/05-TESTING-STANDARD',
            },
            {
              label: 'Troubleshooting',
              to: '/docs/09-TROUBLESHOOTING',
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
              href: 'https://github.com/MyronKoch/blockchain-mcp-standards/blob/main/LICENSE',
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
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
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

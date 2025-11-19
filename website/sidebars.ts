import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '📖 Getting Started',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: '01-Blockchain-MCP-Standard-v3.0',
          label: '⭐ Main Standard (v3.0)',
        },
        {
          type: 'doc',
          id: '03-QUICK-START-GUIDE',
          label: '🚀 Quick Start Guide',
        },
        {
          type: 'doc',
          id: '02-UNIVERSAL-TOOL-NAMING-REGISTRY',
          label: '📖 Tool Naming Registry',
        },
      ],
    },
    {
      type: 'category',
      label: '⚙️ Implementation',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: '04-NETWORK-CONFIGURATIONS',
          label: '🌐 Network Configurations',
        },
        {
          type: 'doc',
          id: '06-ERROR-HANDLING-PATTERNS',
          label: '🛡️ Error Handling',
        },
        {
          type: 'doc',
          id: '07-HELP-SYSTEM-IMPLEMENTATION',
          label: '❓ Help System',
        },
        {
          type: 'doc',
          id: '05-TESTING-STANDARD',
          label: '🧪 Testing Standard',
        },
      ],
    },
    {
      type: 'category',
      label: '📚 Documentation & Security',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: '08-README-TEMPLATE',
          label: '📝 README Template',
        },
        {
          type: 'doc',
          id: 'API-KEY-CYCLING',
          label: '🔒 API Key Cycling',
        },
      ],
    },
    {
      type: 'category',
      label: '🔧 Support',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: '09-TROUBLESHOOTING',
          label: '🔧 Troubleshooting',
        },
        {
          type: 'doc',
          id: '10-CONSOLIDATION-PLAN',
          label: '📋 Consolidation History',
        },
      ],
    },
  ],
};

export default sidebars;

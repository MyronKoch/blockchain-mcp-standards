# BMCPS v3.0 Documentation Website

This directory contains the Docusaurus-based documentation website for the Blockchain MCP Standard v3.0.

## Local Development

```bash
cd website
npm install
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `master` branch.

**Live URL**: https://myronkoch.github.io/blockchain-mcp-standards/

### Manual Deployment Trigger

You can manually trigger a deployment from the GitHub Actions tab:
1. Go to Actions → "Deploy to GitHub Pages"
2. Click "Run workflow" → Select branch: `master` → Click "Run workflow"

## Documentation Structure

The documentation files are located in the `docs/` directory and are organized according to the BMCPS v3.0 standard:

- **Getting Started**: Core standard, quick start guide, tool naming registry
- **Implementation**: Network configs, error handling, help system, testing
- **Documentation & Security**: README template, API key cycling
- **Support**: Troubleshooting, consolidation history

## Customization

- `docusaurus.config.ts` - Site configuration
- `sidebars.ts` - Sidebar navigation structure
- `src/pages/index.tsx` - Landing page
- `src/components/HomepageFeatures/` - Homepage feature cards
- `src/css/custom.css` - Custom styling

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

The site is deployed to **Cloudflare Pages** for fast global delivery with support for private repositories.

**Live URL**: https://bmcps.dev

### Cloudflare Pages Setup (One-Time)

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Navigate to "Workers & Pages" → "Pages"

2. **Connect Your Repository**
   - Click "Create a project" → "Connect to Git"
   - Select your GitHub repository: `blockchain-mcp-standards`
   - Authorize Cloudflare Pages to access your repo

3. **Configure Build Settings**
   ```
   Framework preset: Docusaurus
   Build command: cd website && npm ci && npm run build
   Build output directory: website/build
   Root directory: /
   Node version: 22
   ```

4. **Environment Variables** (Optional)
   - None required for basic deployment

5. **Deploy**
   - Click "Save and Deploy"
   - Your site will be available at: `https://bmcps.dev`
   - You can add a custom domain later in Project Settings

### Automatic Deployments

Cloudflare Pages automatically deploys:
- **Production**: Every push to `master` branch
- **Preview**: Every pull request (preview URLs for testing)

### Manual Deployment via CLI (Optional)

Install Wrangler CLI:
```bash
npm install -g wrangler
```

Deploy manually:
```bash
cd website
npm run build
npx wrangler pages deploy build --project-name blockchain-mcp-standards
```

## Documentation Structure

The documentation files are located in the `docs/` directory and are organized according to the BMCPS v3.0 standard:

- **Getting Started**: Core standard, quick start guide, tool naming registry
- **Implementation**: Network configs, error handling, help system, testing
- **Documentation & Security**: README template, API key cycling
- **Support**: Troubleshooting, consolidation history

## Customization

- `docusaurus.config.ts` - Site configuration (Defaults to Dark Mode)
- `sidebars.ts` - Sidebar navigation structure
- `src/pages/index.tsx` - Landing page (Splash screen)
- `src/components/HomepageFeatures/` - Bento Grid feature cards
- `src/components/SpaceFidget/` - 3D Interactive "Dyson Sphere" background
- `src/css/custom.css` - "Neon Glass" design system & variables

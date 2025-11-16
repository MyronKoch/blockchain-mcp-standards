# Common Configuration Templates

## 🎯 Complete Configuration Files for All Blockchain Types

This document provides ready-to-use configuration files for different blockchain ecosystems. Copy these templates directly into your project.

---

## 1. package.json Templates

### EVM Chains (Ethereum, Polygon, BSC, etc.)
```json
{
  "name": "{blockchain}-testnet-mcp-server",
  "version": "1.0.0",
  "description": "tool requirements (v2.1) compliant MCP server for {Blockchain} testnet integration",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "inspect": "npx @modelcontextprotocol/inspector node dist/index.js",
    "test-tools": "node test-tools.js",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  },
  "keywords": [
    "mcp",
    "blockchain",
    "{blockchain}",
    "testnet",
    "mbps",
    "ai-integration",
    "ethereum",
    "polygon",
    "bsc",
    "arbitrum",
    "base"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0",
    "axios": "^1.6.0",
    "ethers": "^6.9.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.6.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/{blockchain}-testnet-mcp-server.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/{blockchain}-testnet-mcp-server/issues"
  },
  "homepage": "https://github.com/your-username/{blockchain}-testnet-mcp-server#readme"
}
```

### Solana
```json
{
  "name": "solana-devnet-mcp-server",
  "version": "1.0.0",
  "description": "tool requirements (v2.1) compliant MCP server for Solana devnet integration",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "inspect": "npx @modelcontextprotocol/inspector node dist/index.js",
    "test-tools": "node test-tools.js",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  },
  "keywords": [
    "mcp",
    "blockchain",
    "solana",
    "devnet",
    "mbps",
    "ai-integration",
    "spl",
    "solana-program"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0",
    "axios": "^1.6.0",
    "@solana/web3.js": "^1.87.0",
    "@solana/spl-token": "^0.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.6.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/solana-devnet-mcp-server.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/solana-devnet-mcp-server/issues"
  },
  "homepage": "https://github.com/your-username/solana-devnet-mcp-server#readme"
}
```

### Bitcoin
```json
{
  "name": "bitcoin-testnet-mcp-server",
  "version": "1.0.0",
  "description": "tool requirements (v2.1) compliant MCP server for Bitcoin testnet integration",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "inspect": "npx @modelcontextprotocol/inspector node dist/index.js",
    "test-tools": "node test-tools.js",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  },
  "keywords": [
    "mcp",
    "blockchain",
    "bitcoin",
    "testnet",
    "mbps",
    "ai-integration",
    "bitcoinjs",
    "btc"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0",
    "axios": "^1.6.0",
    "bitcoinjs-lib": "^6.1.0",
    "tiny-secp256k1": "^2.2.0",
    "ecpair": "^2.1.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.6.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/bitcoin-testnet-mcp-server.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/bitcoin-testnet-mcp-server/issues"
  },
  "homepage": "https://github.com/your-username/bitcoin-testnet-mcp-server#readme"
}
```

### Cosmos SDK (Osmosis, Cosmos Hub)
```json
{
  "name": "osmosis-testnet-mcp-server",
  "version": "1.0.0",
  "description": "tool requirements (v2.1) compliant MCP server for Osmosis testnet integration",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "inspect": "npx @modelcontextprotocol/inspector node dist/index.js",
    "test-tools": "node test-tools.js",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  },
  "keywords": [
    "mcp",
    "blockchain",
    "osmosis",
    "cosmos",
    "testnet",
    "mbps",
    "ai-integration",
    "cosmjs",
    "ibc"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0",
    "axios": "^1.6.0",
    "@cosmjs/stargate": "^0.32.0",
    "@cosmjs/proto-signing": "^0.32.0",
    "@cosmjs/amino": "^0.32.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.6.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/osmosis-testnet-mcp-server.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/osmosis-testnet-mcp-server/issues"
  },
  "homepage": "https://github.com/your-username/osmosis-testnet-mcp-server#readme"
}
```

### XRP Ledger
```json
{
  "name": "xrp-testnet-mcp-server",
  "version": "1.0.0",
  "description": "tool requirements (v2.1) compliant MCP server for XRP Ledger testnet integration",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "inspect": "npx @modelcontextprotocol/inspector node dist/index.js",
    "test-tools": "node test-tools.js",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  },
  "keywords": [
    "mcp",
    "blockchain",
    "xrp",
    "xrpl",
    "testnet",
    "mbps",
    "ai-integration",
    "ripple"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0",
    "axios": "^1.6.0",
    "xrpl": "^2.12.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.6.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/xrp-testnet-mcp-server.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/xrp-testnet-mcp-server/issues"
  },
  "homepage": "https://github.com/your-username/xrp-testnet-mcp-server#readme"
}
```

## 2. TypeScript Configuration

### Standard tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  },
  "include": [
    "src/**/*",
    "tests/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "coverage"
  ]
}
```

### Alternative tsconfig.json (for older Node.js versions)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "src/**/*",
    "tests/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

## 3. ESLint Configuration

### .eslintrc.js
```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended'
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-function': 'off'
  },
  env: {
    node: true,
    es2022: true
  },
  ignorePatterns: ['dist/', 'node_modules/', 'coverage/']
};
```

### Alternative .eslintrc.json
```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended"
  ],
  "plugins": ["@typescript-eslint"],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-empty-function": "off"
  },
  "env": {
    "node": true,
    "es2022": true
  },
  "ignorePatterns": ["dist/", "node_modules/", "coverage/"]
}
```

## 4. Environment Configuration

### .env.example
```env
# Network Configuration
NETWORK=testnet
RPC_URL=https://rpc.testnet.{blockchain}.com
CHAIN_ID=12345

# Optional: Custom RPC endpoint
CUSTOM_RPC_URL=https://your-custom-rpc-endpoint.com

# API Keys (if needed)
API_KEY=your_api_key_here
PRIVATE_KEY=your_private_key_here  # For testing only

# Development
DEBUG=false
LOG_LEVEL=info

# MCP Configuration
MCP_SERVER_NAME={blockchain}-testnet-mcp-server
MCP_SERVER_VERSION=1.0.0
```

### .env.development
```env
# Development Environment
NETWORK=devnet
RPC_URL=http://localhost:8545
CHAIN_ID=1337

# Development Keys
PRIVATE_KEY=0x1234567890123456789012345678901234567890123456789012345678901234

# Debug Settings
DEBUG=true
LOG_LEVEL=debug
```

### .env.production
```env
# Production Environment
NETWORK=mainnet
RPC_URL=https://rpc.{blockchain}.com
CHAIN_ID=1

# Production Keys (use environment variables or secure key management)
PRIVATE_KEY=${PRODUCTION_PRIVATE_KEY}

# Production Settings
DEBUG=false
LOG_LEVEL=error
```

## 5. Jest Configuration

### jest.config.js
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000
};
```

### jest.config.cjs
```javascript
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000
};
```

## 6. Git Configuration

### .gitignore
```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build output
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out
storybook-static

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
!.vscode/extensions.json
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

### .gitattributes
```
# Auto detect text files and perform LF normalization
* text=auto

# JavaScript/TypeScript files
*.js text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.jsx text eol=lf

# JSON files
*.json text eol=lf

# Documentation
*.md text eol=lf
*.txt text eol=lf

# Configuration files
*.yml text eol=lf
*.yaml text eol=lf
```

## 7. Docker Configuration (Optional)

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY dist/ ./dist/
COPY src/ ./src/

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port (if needed)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Health check passed')"

CMD ["node", "dist/index.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  {blockchain}-mcp-server:
    build: .
    container_name: {blockchain}-mcp-server
    environment:
      - NETWORK=testnet
      - RPC_URL=https://rpc.testnet.{blockchain}.com
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 8. GitHub Actions CI/CD (Optional)

### .github/workflows/ci.yml
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v4

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm run test:coverage

    - name: Build
      run: npm run build

    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        token: ${{ secrets.CODECOV_TOKEN }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v4

    - name: Build
      run: |
        npm ci
        npm run build

    - name: Deploy to npm
      run: |
        npm config set //registry.npmjs.org/:_authToken=${{ secrets.NPM_TOKEN }}
        npm publish
```

## 9. VS Code Configuration

### .vscode/settings.json
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.associations": {
    "*.ts": "typescript",
    "*.js": "javascript"
  },
  "typescript.preferences.quoteMark": "double",
  "typescript.preferences.semiColons": "always"
}
```

### .vscode/extensions.json
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-playwright.playwright"
  ]
}
```

## 10. Prettier Configuration

### .prettierrc
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### .prettierignore
```
node_modules/
dist/
coverage/
*.log
*.lock
package-lock.json
tsconfig.json
jest.config.js
```

---

**Next:** See STEP-BY-STEP-GUIDE.md for a complete walkthrough from zero to working server.

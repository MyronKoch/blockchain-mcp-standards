# Quick Start Guide: Multi-Protocol Blockchain AI Integration

## 🚀 From Zero to Production in 5 Minutes

BMCPS v3.0 can generate blockchain AI integrations in **4 different formats** — all from one command. Choose the protocol that fits your use case.

---

## Prerequisites

- Node.js 18+
- Clone the BMCPS repository:
  ```bash
  git clone https://github.com/MyronKoch/blockchain-mcp-standards.git
  cd blockchain-mcp-standards
  ```

---

## Option A: Using the Multi-Format Generator (Recommended)

### Step 1: Choose Your Format

| Format | Context Overhead | Best For | Command Flag |
|--------|-----------------|----------|--------------|
| REST API | 0 tokens | Production apps, high-scale | `--format rest-api` |
| OpenAI Functions | ~500 tokens | Long conversations | `--format openai` |
| MCP Server | ~5k tokens | Claude Desktop, feature-rich | `--format mcp` |
| JSON Schema | N/A | Custom protocols | `--format json-schema` |

Not sure? Use `--format all` to generate everything!

### Step 2: Generate Your Integration

#### Example 1: Generate OpenAI Functions for Ethereum

```bash
node bmcps-generator.js --blockchain eth --format openai --network mainnet
```

**Output:**
```
eth-mainnet-openai/
├── functions.json    # 25 OpenAI function definitions
├── example.js        # Usage example
└── README.md         # Documentation
```

**Usage:**
```javascript
const OpenAI = require('openai');
const functions = require('./functions.json').functions;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "Get balance for 0x742d35Cc..." }],
  functions: functions,
  function_call: "auto"
});
```

**Context Overhead:** ~500 tokens (10x less than MCP!)

---

#### Example 2: Generate MCP Server for Solana

```bash
node bmcps-generator.js --blockchain sol --format mcp --network mainnet
```

**Output:**
```
sol-mainnet-mcp-server/
├── src/
│   ├── index.ts                # MCP server
│   ├── tool-definitions.ts     # Tool registry
│   └── tools/                  # 25 implementations
│       ├── core/
│       ├── wallet/
│       ├── network/
│       └── tokens/
├── tests/                      # Jest tests
├── package.json
└── README.md
```

**Next Steps:**
```bash
cd sol-mainnet-mcp-server
npm install
npm run build
npm start
```

**Context Overhead:** ~5k tokens (full MCP features)

---

#### Example 3: Generate REST API for Bitcoin

```bash
node bmcps-generator.js --blockchain btc --format rest-api --network mainnet
```

**Output:**
```
btc-mainnet-rest-api/
├── openapi.json      # OpenAPI 3.0 spec
├── server.js         # Express server (25 endpoints)
├── package.json      # Dependencies
└── README.md         # Deployment guide
```

**Start the API:**
```bash
cd btc-mainnet-rest-api
npm install
npm start

# Server running at http://localhost:3000
# Health: http://localhost:3000/health
# OpenAPI: http://localhost:3000/api/v1/openapi.json
```

**Example Request:**
```bash
curl -H "X-API-Key: your-key" \
  "http://localhost:3000/api/v1/btc/get-balance?address=bc1q..."
```

**Context Overhead:** 0 tokens (AI just needs endpoint URLs!)

---

#### Example 4: Generate All Formats

```bash
node bmcps-generator.js --blockchain avax --format all --network mainnet
```

**Output:**
```
avax-mainnet-openai/         # OpenAI Functions
avax-mainnet-mcp-server/     # MCP Server
avax-mainnet-rest-api/       # REST API
avax-mainnet-json-schema/    # JSON Schema
```

Test each format and choose what works best!

---

### Step 3: Implement Blockchain Logic

All generators create TODO comments where you need to add blockchain-specific code:

```typescript
// TODO: Implement get_balance functionality for eth
// Example:
// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
// const balance = await provider.getBalance(parsed.address);
```

Add your RPC integration, and you're done!

---

### Supported Blockchains

17 blockchains supported out of the box:

`eth`, `btc`, `sol`, `xrp`, `avax`, `poly`, `bnb`, `arb`, `base`, `near`, `sui`, `cosmos`, `osmo`, `tron`, `world`, `ada`, `dot`

---

## Option B: Building Manually from Scratch

### Prerequisites
- Node.js 18+ and npm 9+
- TypeScript knowledge
- RPC endpoint for your blockchain
- Choose your blockchain prefix: `eth_`, `sol_`, `btc_`, `poly_`, `cosmos_`, `osmo_`, `arb_`, `avax_`, `bnb_`, `base_`, `near_`, `sui_`, `tron_`, `xrp_`, `world_`

### Step 1: Project Setup (10 min)

```bash
# Create project
mkdir \{blockchain\}-testnet-mcp-server
cd \{blockchain\}-testnet-mcp-server

# Initialize with Blockchain MCP Standard v3.0 (BMCPS v3.0) template
npm init -y
npm pkg set name="\{blockchain\}-testnet-mcp-server"
npm pkg set version="1.0.0"
npm pkg set type="module"
npm pkg set main="dist/index.js"

# Install core dependencies (vary by blockchain)
npm install @modelcontextprotocol/sdk zod axios

# For Ethereum-based chains
npm install ethers

# For Solana
npm install @solana/web3.js @solana/spl-token

# For Cosmos chains
npm install @cosmjs/stargate @cosmjs/proto-signing

# Install dev dependencies
npm install -D typescript @types/node tsx jest @types/jest ts-jest

# Setup scripts
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/index.js"
npm pkg set scripts.dev="tsx src/index.ts"
npm pkg set scripts.inspect="npx @modelcontextprotocol/inspector node dist/index.js"
npm pkg set scripts.test="jest"
```

### Step 2: Create BMCPS v3.0 Directory Structure (5 min)

```bash
# Create modular structure
mkdir -p src/tools/\{core,wallet,network,tokens,help,account,nft,defi,staking,governance,contracts,bridge,analytics,security,events,advanced\}
mkdir -p src/\{types,utils,config\}
mkdir -p tests/\{unit,integration,smoke\}

# Create core files
touch src/index.ts
touch src/client.ts
touch src/constants.ts
touch src/logger.ts
touch src/types.ts
touch src/config/network.ts
touch src/tools/index.ts
touch tsconfig.json
touch README.md
```

### Step 3: Configure TypeScript

```typescript
// tsconfig.json
\{
  "compilerOptions": \{
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  \},
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
\}
```

### Step 4: Create Client Wrapper

```typescript
// src/client.ts
import \{ ethers \} from 'ethers'; // Or appropriate client for your blockchain
import logger from './logger.js';

export class \{Chain\}Client \{
  public provider: ethers.JsonRpcProvider;
  private apiUrl: string;

  constructor() \{
    this.apiUrl = process.env.RPC_URL || 'https://testnet-rpc.\{blockchain\}.com';
    this.provider = new ethers.JsonRpcProvider(this.apiUrl);
    logger.info('[Blockchain MCP Standard v3.0 (BMCPS v3.0)] Client initialized', \{ url: this.apiUrl \});
  \}

  async isHealthy(): Promise<boolean> \{
    try \{
      await this.provider.getBlockNumber();
      return true;
    \} catch (error) \{
      logger.error('Health check failed', error);
      return false;
    \}
  \}
\}
```

### Step 5: Implement Core Tools (25 mandatory)

Create individual tool files following the pattern:

```typescript
// src/tools/core/\{prefix\}-get-balance.ts
import \{ ErrorCode, McpError \} from '@modelcontextprotocol/sdk/types.js';
import type \{ \{Chain\}Client \} from '../../client.js';
import logger from '../../logger.js';

export async function handleGetBalance(
  args: any,
  client: \{Chain\}Client
): Promise<\{ content: Array<\{ type: string; text: string \}> \}> \{
  const \{ address \} = args;
  
  try \{
    const balance = await client.provider.getBalance(address);
    const result = \{
      address,
      balance: balance.toString(),
      formatted: ethers.formatEther(balance)
    \};
    
    logger.info('Balance retrieved', \{ address \});
    
    return \{
      content: [\{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      \}]
    \};
  \} catch (error) \{
    logger.error('Get balance failed', error);
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to get balance: $\{error instanceof Error ? error.message : 'Unknown error'\}`
    );
  \}
\}
```

### Step 6: Setup Main Server

```typescript
// src/index.ts
#!/usr/bin/env node

import \{ Server \} from '@modelcontextprotocol/sdk/server/index.js';
import \{ StdioServerTransport \} from '@modelcontextprotocol/sdk/server/stdio.js';
import \{ CallToolRequestSchema, ListToolsRequestSchema \} from '@modelcontextprotocol/sdk/types.js';
import \{ \{Chain\}Client \} from './client.js';
import logger from './logger.js';

// Import tool handlers
import \{ handleGetBalance \} from './tools/core/\{prefix\}-get-balance.js';
import \{ handleGetChainInfo \} from './tools/core/\{prefix\}-get-chain-info.js';
// ... import all 25 core tools

const client = new \{Chain\}Client();

const server = new Server(
  \{
    name: '\{prefix\}-mcp-server',
    version: '1.0.0',
  \},
  \{
    capabilities: \{ tools: \{\} \},
  \}
);

// Tool definitions (25 BMCPS v3.0 core tools)
const tools = [
  \{
    name: '\{prefix\}_get_chain_info',
    description: 'Get comprehensive blockchain information',
    inputSchema: \{
      type: 'object',
      properties: \{\},
      required: []
    \}
  \},
  \{
    name: '\{prefix\}_get_balance',
    description: 'Get native token balance for an address',
    inputSchema: \{
      type: 'object',
      properties: \{
        address: \{ type: 'string', description: 'Wallet address' \}
      \},
      required: ['address']
    \}
  \},
  // ... add all 25 tool definitions
];

// Register list tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => \{
  return \{ tools \};
\});

// Register tool execution handler
server.setRequestHandler(CallToolRequestSchema, async (request) => \{
  const \{ name, arguments: args \} = request.params;
  
  logger.info(`[Blockchain MCP Standard v3.0 (BMCPS v3.0)] Executing tool: $\{name\}`);
  
  try \{
    switch (name) \{
      case '\{prefix\}_get_chain_info':
        return await handleGetChainInfo(args, client);
      case '\{prefix\}_get_balance':
        return await handleGetBalance(args, client);
      // ... add all 25 tool cases
      default:
        throw new Error(`Unknown tool: $\{name\}`);
    \}
  \} catch (error) \{
    logger.error(`Tool execution failed: $\{name\}`, error);
    throw error;
  \}
\});

async function main() \{
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  logger.info(`[Blockchain MCP Standard v3.0 (BMCPS v3.0)] \{Blockchain\} MCP server started`);
  logger.info(`[Blockchain MCP Standard v3.0 (BMCPS v3.0)] Tools available: $\{tools.length\}`);
\}

main().catch((error) => \{
  logger.error('Server startup failed', error);
  process.exit(1);
\});
```

---

## Option B: Converting Existing Server

### Step 1: Assess Current State (5 min)

```bash
# Count current tools
grep -c '"name"' src/index.ts

# Check file size
wc -l src/index.ts

# Identify structure
ls -la src/

# Document findings:
# - Current architecture: [ ] Monolithic  [ ] Partially modular  [ ] Modular
# - Tool count: ___
# - File size: ___ lines
# - Missing BMCPS v3.0 tools: ___
```

### Step 2: Backup and Prepare

```bash
# Create backup
cp -r . ../backup-$(date +%Y%m%d)

# Create new structure alongside existing
mkdir -p src/tools/\{core,wallet,network,tokens,help,account,nft,defi,staking,governance,contracts,bridge,analytics,security,events,advanced\}
mkdir -p src/\{types,utils,config\}
```

### Step 3: Extract Tools to Modules

Use this extraction script:

```python
#!/usr/bin/env python3
# extract-tools.py

import re
import os

def extract_tools(input_file, output_dir):
    """Extract tools from monolithic file to modular structure"""
    
    with open(input_file, 'r') as f:
        content = f.read()
    
    # Pattern to find tool implementations
    tool_pattern = r"case ['\"]([^'\"]+)['\"]:\s*\{([^\}]+)\}"
    matches = re.findall(tool_pattern, content, re.DOTALL)
    
    for tool_name, implementation in matches:
        # Determine category
        category = determine_category(tool_name)
        
        # Convert tool name to file name
        file_name = tool_name.replace('_', '-') + '.ts'
        file_path = f"\{output_dir\}/tools/\{category\}/\{file_name\}"
        
        # Generate modular tool file
        tool_content = generate_tool_file(tool_name, implementation)
        
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as f:
            f.write(tool_content)
        
        print(f"✅ Extracted \{tool_name\} → \{file_path\}")

def determine_category(tool_name):
    """Map tool to BMCPS v3.0 category"""
    if any(x in tool_name for x in ['balance', 'chain_info', 'block', 'transaction', 'gas']):
        return 'core'
    elif any(x in tool_name for x in ['wallet', 'create', 'import', 'validate']):
        return 'wallet'
    elif any(x in tool_name for x in ['token', 'approve', 'allowance']):
        return 'tokens'
    elif any(x in tool_name for x in ['nft', 'mint']):
        return 'nft'
    elif any(x in tool_name for x in ['swap', 'liquidity', 'pool']):
        return 'defi'
    elif any(x in tool_name for x in ['stake', 'unstake', 'delegate']):
        return 'staking'
    else:
        return 'analytics'

def generate_tool_file(tool_name, implementation):
    """Generate BMCPS v3.0 compliant tool file"""
    handler_name = 'handle' + ''.join(word.capitalize() for word in tool_name.split('_')[1:])
    
    return f'''import \{\{ ErrorCode, McpError \}\} from '@modelcontextprotocol/sdk/types.js';
import type \{\{ Client \}\} from '../../client.js';
import logger from '../../logger.js';

export async function \{handler_name\}(
  args: any,
  client: Client
): Promise<\{\{ content: Array<\{\{ type: string; text: string \}\}> \}\}> \{\{
  try \{\{
    \{implementation.strip()\}
  \}\} catch (error) \{\{
    logger.error('\{tool_name\} failed', error);
    throw new McpError(
      ErrorCode.InternalError,
      `\{tool_name\} failed: $\{\{error instanceof Error ? error.message : 'Unknown error'\}\}`
    );
  \}\}
\}\}
'''

if __name__ == "__main__":
    extract_tools('src/index.ts', 'src')
```

### Step 4: Create Tool Registry

```typescript
// src/tools/index.ts
// Import all tool handlers
import \{ handleGetChainInfo \} from './core/\{prefix\}-get-chain-info.js';
import \{ handleGetBalance \} from './core/\{prefix\}-get-balance.js';
// ... import all tools

// Export tool handler map
export const TOOL_HANDLERS: Record<string, (args: any, client: any) => Promise<any>> = \{
  '\{prefix\}_get_chain_info': handleGetChainInfo,
  '\{prefix\}_get_balance': handleGetBalance,
  // ... map all tools
\};

// Export tool definitions
export const TOOL_DEFINITIONS = [
  // ... all 25 BMCPS v3.0 tool definitions
];
```

### Step 5: Refactor Main Index

```typescript
// src/index.ts - Simplified after extraction
#!/usr/bin/env node

import \{ Server \} from '@modelcontextprotocol/sdk/server/index.js';
import \{ StdioServerTransport \} from '@modelcontextprotocol/sdk/server/stdio.js';
import \{ CallToolRequestSchema, ListToolsRequestSchema \} from '@modelcontextprotocol/sdk/types.js';
import \{ Client \} from './client.js';
import \{ TOOL_HANDLERS, TOOL_DEFINITIONS \} from './tools/index.js';
import logger from './logger.js';

const client = new Client();
const server = new Server(
  \{ name: '\{prefix\}-mcp-server', version: '1.0.0' \},
  \{ capabilities: \{ tools: \{\} \} \}
);

server.setRequestHandler(ListToolsRequestSchema, async () => \{
  return \{ tools: TOOL_DEFINITIONS \};
\});

server.setRequestHandler(CallToolRequestSchema, async (request) => \{
  const \{ name, arguments: args \} = request.params;
  const handler = TOOL_HANDLERS[name];
  
  if (!handler) \{
    throw new Error(`Unknown tool: $\{name\}`);
  \}
  
  return await handler(args, client);
\});

async function main() \{
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info(`[Blockchain MCP Standard v3.0 (BMCPS v3.0)] Server started with $\{Object.keys(TOOL_HANDLERS).length\} tools`);
\}

main().catch(console.error);
```

---

## Testing & Validation

### Step 1: Build and Test

```bash
# Build
npm run build

# Test with MCP Inspector
npm run inspect

# Run tests
npm test
```

### Step 2: Validate BMCPS v3.0 Compliance

Run this validation checklist:

```bash
#!/bin/bash
# validate-mbss.sh

echo "Blockchain MCP Standard v3.0 (BMCPS v3.0) Compliance Check"
echo "=========================="

# Check structure
echo "✓ Checking directory structure..."
for dir in core wallet tokens nft defi staking contracts analytics; do
  if [ -d "src/tools/$dir" ]; then
    echo "  ✓ src/tools/$dir exists"
  else
    echo "  ✗ Missing src/tools/$dir"
  fi
done

# Check core tools
echo "✓ Checking 25 mandatory tools..."
tools=("get_chain_info" "get_balance" "get_transaction" "get_block" "validate_address")
for tool in "$\{tools[@]\}"; do
  if grep -q "$\{PREFIX\}_$tool" src/tools/index.ts; then
    echo "  ✓ $\{PREFIX\}_$tool implemented"
  else
    echo "  ✗ Missing $\{PREFIX\}_$tool"
  fi
done

# Check TypeScript build
echo "✓ Building TypeScript..."
npm run build

echo "=========================="
echo "Compliance check complete!"
```

### Step 3: Performance Testing

```bash
# Test startup time
time npm run start

# Test with MCP Inspector
npm run inspect

# Test each tool category
for tool in $(grep '"name"' src/tools/index.ts | cut -d'"' -f4); do
  echo "Testing $tool..."
  # Run tool test
done
```

---

## Common Issues & Solutions

### Issue: TypeScript compilation fails
```bash
# Solution: Fix module resolution
npm install --save-dev @types/node
# Update tsconfig.json moduleResolution
```

### Issue: Tools not appearing in MCP Inspector
```bash
# Solution: Check tool registration
grep "name:" src/index.ts | wc -l  # Should be 25+
```

### Issue: Import path errors after modularization
```bash
# Solution: Use .js extensions in imports
# Wrong: import \{ handler \} from './tools/core/tool'
# Right: import \{ handler \} from './tools/core/tool.js'
```

---

## Next Steps

1. **Add Extended Tools**: Beyond the 25 core tools, add blockchain-specific features
2. **Implement Caching**: Add response caching for frequently accessed data
3. **Add Rate Limiting**: Implement rate limiting for RPC calls
4. **Create Documentation**: Generate comprehensive README with all tools
5. **Setup CI/CD**: Add GitHub Actions for automated testing

---

## Resources

- Blockchain MCP Standard v3.0 (BMCPS v3.0) Standard: `./01-Blockchain-MCP-Standard-v3.0.md`
- Testing Standard: `./05-TESTING-STANDARD.md`
- Error Handling: `./06-ERROR-HANDLING-PATTERNS.md`
- Network Configs: `./04-NETWORK-CONFIGURATIONS.md`
- Troubleshooting: `./09-TROUBLESHOOTING.md`

---

**Build modular. Scale infinitely. Ship fast.**
#!/usr/bin/env node
/**
 * BMCPS v3.0 Multi-Format Generator
 *
 * Generates blockchain AI integration code in multiple formats:
 * - MCP (Model Context Protocol) servers
 * - OpenAI Function schemas
 * - REST API with OpenAPI specs
 * - Pure JSON schemas
 *
 * Usage:
 *   node bmcps-generator.js --blockchain eth --format mcp
 *   node bmcps-generator.js --blockchain btc --format openai
 *   node bmcps-generator.js --blockchain sol --format rest-api
 *   node bmcps-generator.js --blockchain eth --format all
 */

const fs = require('fs');
const path = require('path');

// Load tools schema
const TOOLS_SCHEMA = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'tools-schema.json'), 'utf8')
);

// Blockchain prefix registry
const BLOCKCHAIN_PREFIXES = {
  eth: 'eth',
  btc: 'btc',
  sol: 'sol',
  xrp: 'xrp',
  avax: 'avax',
  poly: 'poly',
  bnb: 'bnb',
  arb: 'arb',
  base: 'base',
  near: 'near',
  sui: 'sui',
  cosmos: 'cosmos',
  osmo: 'osmo',
  tron: 'tron',
  world: 'world',
  ada: 'ada',
  dot: 'dot'
};

// Supported output formats
const SUPPORTED_FORMATS = ['mcp', 'openai', 'rest-api', 'json-schema', 'all'];

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    blockchain: null,
    format: 'mcp', // default to MCP
    output: null,
    network: 'mainnet'
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }

    if (arg === '--blockchain' || arg === '-b') {
      config.blockchain = args[++i];
    } else if (arg === '--format' || arg === '-f') {
      config.format = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      config.output = args[++i];
    } else if (arg === '--network' || arg === '-n') {
      config.network = args[++i];
    }
  }

  return config;
}

/**
 * Print help information
 */
function printHelp() {
  console.log(`
BMCPS v3.0 Multi-Format Generator
==================================

Generate blockchain AI integration code in multiple formats.

Usage:
  node bmcps-generator.js --blockchain <chain> --format <format> [options]

Required Arguments:
  --blockchain, -b    Blockchain identifier (eth, btc, sol, etc.)
  --format, -f        Output format: mcp, openai, rest-api, json-schema, all

Optional Arguments:
  --output, -o        Output directory (default: ./<blockchain>-<format>-server)
  --network, -n       Network name (default: mainnet)
  --help, -h          Show this help message

Supported Blockchains:
  ${Object.keys(BLOCKCHAIN_PREFIXES).join(', ')}

Supported Formats:
  mcp         - MCP server (Anthropic's Model Context Protocol)
  openai      - OpenAI function calling schemas
  rest-api    - REST API with OpenAPI specification
  json-schema - Pure JSON schemas (format-agnostic)
  all         - Generate all formats

Examples:
  # Generate MCP server for Ethereum
  node bmcps-generator.js --blockchain eth --format mcp

  # Generate OpenAI functions for Bitcoin
  node bmcps-generator.js --blockchain btc --format openai

  # Generate REST API for Solana testnet
  node bmcps-generator.js --blockchain sol --format rest-api --network testnet

  # Generate all formats for Avalanche
  node bmcps-generator.js --blockchain avax --format all

Context Management:
  MCP format: High context overhead (~5k tokens) - best for feature-rich interactions
  OpenAI format: Low context overhead (~500 tokens) - best for long conversations
  REST API format: Zero context overhead - best for high-scale applications

Learn more: https://bmcps.dev/docs/protocol-comparison
  `);
}

/**
 * Validate configuration
 */
function validateConfig(config) {
  if (!config.blockchain) {
    console.error('❌ Error: --blockchain is required');
    console.log('Run with --help for usage information');
    process.exit(1);
  }

  if (!BLOCKCHAIN_PREFIXES[config.blockchain]) {
    console.error(`❌ Error: Unsupported blockchain "${config.blockchain}"`);
    console.log(`Supported: ${Object.keys(BLOCKCHAIN_PREFIXES).join(', ')}`);
    process.exit(1);
  }

  if (!SUPPORTED_FORMATS.includes(config.format)) {
    console.error(`❌ Error: Unsupported format "${config.format}"`);
    console.log(`Supported: ${SUPPORTED_FORMATS.join(', ')}`);
    process.exit(1);
  }

  return true;
}

/**
 * Generate prefixed tool name
 */
function getToolName(toolName, prefix) {
  return `${prefix}_${toolName}`;
}

/**
 * Get default output directory
 */
function getOutputDir(blockchain, format, network) {
  if (format === 'all') {
    return `${blockchain}-${network}-bmcps-multi`;
  }
  return `${blockchain}-${network}-${format}`;
}

/**
 * Generate OpenAI function schema for a tool
 */
function generateOpenAIFunction(tool, prefix) {
  const toolName = getToolName(tool.name, prefix);

  const functionDef = {
    name: toolName,
    description: tool.description,
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  };

  // Add input parameters
  if (tool.inputs && Object.keys(tool.inputs).length > 0) {
    for (const [paramName, paramDef] of Object.entries(tool.inputs)) {
      functionDef.parameters.properties[paramName] = {
        type: paramDef.type,
        description: paramDef.description
      };

      if (paramDef.enum) {
        functionDef.parameters.properties[paramName].enum = paramDef.enum;
      }

      if (paramDef.required) {
        functionDef.parameters.required.push(paramName);
      }
    }
  }

  return functionDef;
}

/**
 * Generate OpenAI format
 */
function generateOpenAI(config) {
  const prefix = BLOCKCHAIN_PREFIXES[config.blockchain];
  const outputDir = config.output || getOutputDir(config.blockchain, 'openai', config.network);

  console.log(`\n🔧 Generating OpenAI Functions for ${config.blockchain}...`);
  console.log(`📁 Output directory: ${outputDir}`);

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate function definitions
  const functions = TOOLS_SCHEMA.tools.map(tool => generateOpenAIFunction(tool, prefix));

  // Create functions.json
  const functionsFile = {
    version: TOOLS_SCHEMA.version,
    blockchain: config.blockchain,
    network: config.network,
    prefix: prefix,
    generated_at: new Date().toISOString(),
    format: "openai",
    functions: functions
  };

  fs.writeFileSync(
    path.join(outputDir, 'functions.json'),
    JSON.stringify(functionsFile, null, 2)
  );

  // Create example usage file
  const exampleCode = `/**
 * OpenAI Function Calling Example for ${config.blockchain.toUpperCase()}
 * Generated by BMCPS v3.0
 */

const OpenAI = require('openai');
const functions = require('./functions.json').functions;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: "What's the balance of ${config.blockchain === 'eth' ? '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' : 'example_address'}?"
      }
    ],
    functions: functions,
    function_call: "auto"
  });

  const message = completion.choices[0].message;

  if (message.function_call) {
    console.log('Function called:', message.function_call.name);
    console.log('Arguments:', message.function_call.arguments);

    // Implement your function handlers here
    const functionName = message.function_call.name;
    const functionArgs = JSON.parse(message.function_call.arguments);

    // Call your blockchain integration
    const result = await handleFunction(functionName, functionArgs);
    console.log('Result:', result);
  }
}

async function handleFunction(name, args) {
  // TODO: Implement blockchain calls here
  switch(name) {
    case '${prefix}_get_balance':
      // Implement balance checking
      return { balance: "1.5 ${config.blockchain.toUpperCase()}" };

    // Add other function handlers...

    default:
      throw new Error(\`Unknown function: \${name}\`);
  }
}

main();
`;

  fs.writeFileSync(
    path.join(outputDir, 'example.js'),
    exampleCode
  );

  // Create README
  const readme = `# ${config.blockchain.toUpperCase()} OpenAI Functions

Generated by BMCPS v3.0 - Blockchain Multi-Protocol Standard

## Installation

\`\`\`bash
npm install openai
\`\`\`

## Usage

\`\`\`javascript
const functions = require('./functions.json').functions;

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "Get balance for address..." }],
  functions: functions,
  function_call: "auto"
});
\`\`\`

## Available Functions

${TOOLS_SCHEMA.tools.map((tool, i) => `${i + 1}. \`${prefix}_${tool.name}\` - ${tool.description}`).join('\n')}

## Context Overhead

✅ **Low context usage** (~500 tokens)
- Better for long conversations
- Only function calls appear in context
- Ideal for extended AI agent sessions

## Learn More

- Full documentation: https://bmcps.dev
- OpenAI Functions Guide: https://bmcps.dev/docs/using-bmcps-with-openai
- Protocol Comparison: https://bmcps.dev/docs/protocol-comparison
`;

  fs.writeFileSync(
    path.join(outputDir, 'README.md'),
    readme
  );

  console.log(`✅ Generated ${functions.length} OpenAI function definitions`);
  console.log(`📄 functions.json - Function definitions`);
  console.log(`📄 example.js - Usage example`);
  console.log(`📄 README.md - Documentation`);
  console.log(`\n💡 Low context overhead (~500 tokens) - great for long conversations!`);
}

/**
 * Generate MCP format - Full TypeScript MCP server
 */
function generateMCP(config) {
  const prefix = BLOCKCHAIN_PREFIXES[config.blockchain];
  const outputDir = config.output || getOutputDir(config.blockchain, 'mcp-server', config.network);

  console.log(`\n🔧 Generating MCP Server for ${config.blockchain}...`);
  console.log(`📁 Output directory: ${outputDir}`);

  // Create directory structure
  createMCPDirectoryStructure(outputDir);

  // Generate configuration files
  generateMCPConfiguration(config, outputDir, prefix);

  // Generate tool implementations
  generateMCPTools(config, outputDir, prefix);

  // Generate tests
  generateMCPTests(config, outputDir, prefix);

  console.log(`✅ Generated MCP server with ${TOOLS_SCHEMA.tools.length} tools`);
  console.log(`📄 src/index.ts - Main server entry point`);
  console.log(`📄 src/tool-definitions.ts - Tool registry`);
  console.log(`📄 src/tools/ - ${TOOLS_SCHEMA.tools.length} tool implementations`);
  console.log(`📄 tests/ - Test suite`);
  console.log(`\n💡 High context overhead (~5k tokens) - feature-rich MCP integration!`);
  console.log(`\n📋 Next steps:`);
  console.log(`   cd ${outputDir}`);
  console.log(`   npm install`);
  console.log(`   npm run build`);
  console.log(`   npm start`);
}

/**
 * Create MCP directory structure
 */
function createMCPDirectoryStructure(outputDir) {
  console.log('🏗️  Creating directory structure...');

  const categories = [...new Set(TOOLS_SCHEMA.tools.map(t => t.category))];

  const dirs = [
    'src',
    'src/tools',
    'tests/unit',
    'tests/integration',
    'scripts',
    'docs'
  ];

  // Add category directories
  categories.forEach(category => {
    dirs.push(`src/tools/${category}`);
  });

  // Create all directories
  dirs.forEach(dir => {
    const dirPath = path.join(outputDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  console.log(`  ✅ Created ${dirs.length} directories`);
}

/**
 * Generate MCP configuration files
 */
function generateMCPConfiguration(config, outputDir, prefix) {
  console.log('⚙️  Generating configuration files...');

  // package.json
  const packageJson = {
    name: `${config.blockchain}-${config.network}-mcp-server`,
    version: '3.0.0',
    description: `BMCPS v3.0 compliant ${config.blockchain} MCP server for ${config.network}`,
    main: 'dist/index.js',
    type: 'module',
    scripts: {
      build: 'tsc',
      start: 'node dist/index.js',
      dev: 'tsx src/index.ts',
      test: 'jest',
      'test:watch': 'jest --watch',
      lint: 'eslint src/**/*.ts',
      format: 'prettier --write src/**/*.ts'
    },
    dependencies: {
      '@modelcontextprotocol/sdk': '^0.5.0',
      'zod': '^3.22.0',
      'axios': '^1.6.0',
      'dotenv': '^16.3.0'
    },
    devDependencies: {
      '@types/node': '^20.0.0',
      '@types/jest': '^29.0.0',
      'typescript': '^5.0.0',
      'tsx': '^4.7.0',
      'jest': '^29.0.0',
      'ts-jest': '^29.0.0',
      '@typescript-eslint/eslint-plugin': '^6.0.0',
      '@typescript-eslint/parser': '^6.0.0',
      'eslint': '^8.0.0',
      'prettier': '^3.0.0'
    },
    keywords: ['mcp', 'blockchain', config.blockchain, 'bmcps', 'v3.0'],
    author: 'BMCPS Generator',
    license: 'MIT'
  };

  fs.writeFileSync(
    path.join(outputDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  console.log('  ✅ package.json');

  // tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      declaration: true,
      declarationMap: true
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist', 'tests']
  };

  fs.writeFileSync(
    path.join(outputDir, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2)
  );
  console.log('  ✅ tsconfig.json');

  // .env.example
  const envExample = `# BMCPS v3.0 MCP Server Configuration
BLOCKCHAIN=${config.blockchain.toUpperCase()}
NETWORK=${config.network.toUpperCase()}
LOG_LEVEL=info

# RPC Endpoints
RPC_URL=https://your-rpc-endpoint.com
WS_URL=wss://your-websocket-endpoint.com

# API Keys (if needed)
INFURA_API_KEY=
ALCHEMY_API_KEY=
QUICKNODE_API_KEY=

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
`;

  fs.writeFileSync(
    path.join(outputDir, '.env.example'),
    envExample
  );
  console.log('  ✅ .env.example');

  // README.md
  const readme = `# ${config.blockchain.toUpperCase()} MCP Server

BMCPS v3.0 compliant MCP server for ${config.blockchain} blockchain.

## Installation

\`\`\`bash
npm install
\`\`\`

## Configuration

1. Copy \`.env.example\` to \`.env\`
2. Configure your RPC endpoints and API keys

## Build

\`\`\`bash
npm run build
\`\`\`

## Run

\`\`\`bash
npm start
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Testing

\`\`\`bash
npm test
\`\`\`

## Available Tools

${TOOLS_SCHEMA.tools.map((tool, i) => `${i + 1}. \`${prefix}_${tool.name}\` - ${tool.description}`).join('\n')}

## Learn More

- BMCPS Documentation: https://bmcps.dev
- Quick Start Guide: https://bmcps.dev/docs/QUICK-START-GUIDE
- MCP Protocol: https://modelcontextprotocol.io
`;

  fs.writeFileSync(
    path.join(outputDir, 'README.md'),
    readme
  );
  console.log('  ✅ README.md');
}

/**
 * Generate MCP tool implementations
 */
function generateMCPTools(config, outputDir, prefix) {
  console.log('🛠️  Generating tool implementations...');

  // Generate individual tool files
  TOOLS_SCHEMA.tools.forEach(tool => {
    const fileName = `${prefix}-${tool.name}.ts`;
    const filePath = path.join(outputDir, 'src/tools', tool.category, fileName);

    const toolCode = generateMCPToolStub(tool, prefix, config.blockchain);
    fs.writeFileSync(filePath, toolCode);
  });

  console.log(`  ✅ Generated ${TOOLS_SCHEMA.tools.length} tool files`);

  // Generate tool-definitions.ts
  generateMCPToolDefinitions(config, outputDir, prefix);

  // Generate main index.ts
  generateMCPMainIndex(config, outputDir, prefix);
}

/**
 * Generate individual tool stub
 */
function generateMCPToolStub(tool, prefix, blockchain) {
  const handlerName = `handle${tool.name.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('')}`;

  // Build Zod schema from tool inputs
  let schemaProperties = '';
  if (tool.inputs && Object.keys(tool.inputs).length > 0) {
    schemaProperties = Object.entries(tool.inputs).map(([name, def]) => {
      let zodType = 'z.string()';

      if (def.type === 'number') zodType = 'z.number()';
      else if (def.type === 'boolean') zodType = 'z.boolean()';
      else if (def.type === 'object') zodType = 'z.object({})';
      else if (def.type === 'array') zodType = 'z.array(z.any())';

      if (def.enum) {
        zodType = `z.enum([${def.enum.map(v => `'${v}'`).join(', ')}])`;
      }

      if (!def.required) {
        zodType += '.optional()';
      }

      return `  ${name}: ${zodType}.describe('${def.description}')`;
    }).join(',\n');
  }

  const stub = `import { z } from 'zod';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * ${tool.description}
 *
 * ${tool.longDescription || ''}
 *
 * Category: ${tool.category}
 * BMCPS v3.0 Standard Tool
 */

const schema = z.object({
${schemaProperties || '  // No input parameters required'}
});

export async function ${handlerName}(args: any) {
  try {
    // Validate inputs
    const parsed = schema.parse(args);

    // TODO: Implement ${tool.name} functionality for ${blockchain}
    // Example:
    // const client = getBlockchainClient();
    // const result = await client.${tool.name}(parsed);

    // Placeholder response
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          error: 'Not implemented',
          message: '${tool.name} functionality not yet implemented',
          tool: '${prefix}_${tool.name}',
          category: '${tool.category}',
          bmcps_version: '${TOOLS_SCHEMA.version}'
        }, null, 2)
      }]
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new McpError(
        ErrorCode.InvalidParams,
        \`Invalid parameters: \${error.errors.map(e => e.message).join(', ')}\`
      );
    }
    throw new McpError(
      ErrorCode.InternalError,
      \`Operation failed: \${error instanceof Error ? error.message : 'Unknown error'}\`
    );
  }
}
`;

  return stub;
}

/**
 * Generate tool-definitions.ts
 */
function generateMCPToolDefinitions(config, outputDir, prefix) {
  const imports = TOOLS_SCHEMA.tools.map(tool => {
    const handlerName = `handle${tool.name.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')}`;
    return `import { ${handlerName} } from './tools/${tool.category}/${prefix}-${tool.name}.js';`;
  }).join('\n');

  const toolDefinitions = TOOLS_SCHEMA.tools.map(tool => {
    const inputSchema = {
      type: 'object',
      properties: tool.inputs || {},
      required: tool.inputs ? Object.keys(tool.inputs).filter(key => tool.inputs[key].required) : []
    };

    return `  {
    name: '${prefix}_${tool.name}',
    description: '${tool.description}',
    inputSchema: ${JSON.stringify(inputSchema, null, 6).split('\n').join('\n    ')}
  }`;
  }).join(',\n');

  const toolHandlers = TOOLS_SCHEMA.tools.map(tool => {
    const handlerName = `handle${tool.name.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')}`;
    return `  '${prefix}_${tool.name}': ${handlerName}`;
  }).join(',\n');

  const content = `/**
 * BMCPS v3.0 Tool Definitions
 * Auto-generated by BMCPS Multi-Format Generator
 *
 * Blockchain: ${config.blockchain}
 * Network: ${config.network}
 * Total tools: ${TOOLS_SCHEMA.tools.length}
 */

${imports}

export const TOOL_DEFINITIONS = [
${toolDefinitions}
];

export const TOOL_HANDLERS = {
${toolHandlers}
};
`;

  fs.writeFileSync(
    path.join(outputDir, 'src', 'tool-definitions.ts'),
    content
  );
  console.log('  ✅ src/tool-definitions.ts');
}

/**
 * Generate main index.ts
 */
function generateMCPMainIndex(config, outputDir, prefix) {
  const content = `#!/usr/bin/env node
/**
 * BMCPS v3.0 ${config.blockchain.toUpperCase()} MCP Server
 * Auto-generated by BMCPS Multi-Format Generator
 *
 * Blockchain: ${config.blockchain}
 * Network: ${config.network}
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode
} from '@modelcontextprotocol/sdk/types.js';

// Import tool definitions and handlers
import { TOOL_DEFINITIONS, TOOL_HANDLERS } from './tool-definitions.js';

// Initialize server
const server = new Server(
  {
    name: '${config.blockchain}-${config.network}-mcp-server',
    version: '${TOOLS_SCHEMA.version}', // BMCPS v3.0 compliant
  },
  {
    capabilities: { tools: {} },
  }
);

// Register tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOL_DEFINITIONS };
});

// Route tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const handler = TOOL_HANDLERS[name];
    if (!handler) {
      throw new McpError(
        ErrorCode.MethodNotFound,
        \`Unknown tool: \${name}\`
      );
    }

    return await handler(args);
  } catch (error) {
    if (error instanceof McpError) throw error;
    throw new McpError(
      ErrorCode.InternalError,
      \`Tool execution failed: \${error}\`
    );
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[BMCPS v3.0] ${config.blockchain.toUpperCase()} MCP Server running');
  console.error(\`[BMCPS v3.0] Blockchain: ${config.blockchain}\`);
  console.error(\`[BMCPS v3.0] Network: ${config.network}\`);
  console.error(\`[BMCPS v3.0] Total tools: \${TOOL_DEFINITIONS.length}\`);
  console.error(\`[BMCPS v3.0] Context overhead: ~5k tokens\`);
}

main().catch(console.error);
`;

  fs.writeFileSync(
    path.join(outputDir, 'src', 'index.ts'),
    content
  );
  console.log('  ✅ src/index.ts');
}

/**
 * Generate MCP tests
 */
function generateMCPTests(config, outputDir, prefix) {
  console.log('🧪 Generating tests...');

  // Smoke test
  const smokeTest = `/**
 * Smoke Tests - Basic functionality verification
 * BMCPS v3.0 Compliance Tests
 */

import { TOOL_DEFINITIONS } from '../src/tool-definitions';

describe('BMCPS v3.0 Smoke Tests', () => {
  test('should have required tools defined', () => {
    expect(TOOL_DEFINITIONS).toBeDefined();
    expect(TOOL_DEFINITIONS.length).toBe(${TOOLS_SCHEMA.tools.length});
  });

  test('should have valid tool structure', () => {
    TOOL_DEFINITIONS.forEach(tool => {
      expect(tool.name).toBeDefined();
      expect(tool.description).toBeDefined();
      expect(tool.inputSchema).toBeDefined();
    });
  });

  test('should follow naming convention', () => {
    TOOL_DEFINITIONS.forEach(tool => {
      expect(tool.name).toMatch(/^${prefix}_\\w+$/);
    });
  });

  test('should have all 25 mandatory tools', () => {
    const requiredTools = [
      'get_chain_info', 'get_balance', 'get_transaction', 'get_block', 'validate_address',
      'get_transaction_history', 'send_transaction',
      'create_wallet', 'import_wallet', 'generate_address',
      'get_network_info', 'set_network', 'get_gas_price',
      'estimate_fees', 'get_mempool_info',
      'get_wallet_info', 'get_account_info',
      'get_token_balance', 'get_token_info', 'transfer_token', 'approve_token', 'get_token_allowance',
      'help', 'search_tools', 'list_tools_by_category'
    ];

    const toolNames = TOOL_DEFINITIONS.map(t => t.name.replace('${prefix}_', ''));
    requiredTools.forEach(required => {
      expect(toolNames).toContain(required);
    });
  });
});
`;

  fs.writeFileSync(
    path.join(outputDir, 'tests', 'smoke.test.ts'),
    smokeTest
  );

  // Jest config
  const jestConfig = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/index.ts',
      '!src/**/*.d.ts'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html']
  };

  fs.writeFileSync(
    path.join(outputDir, 'jest.config.js'),
    `module.exports = ${JSON.stringify(jestConfig, null, 2)};`
  );

  console.log('  ✅ tests/smoke.test.ts');
  console.log('  ✅ jest.config.js');
}

/**
 * Generate REST API format with OpenAPI spec
 */
function generateRESTAPI(config) {
  const prefix = BLOCKCHAIN_PREFIXES[config.blockchain];
  const outputDir = config.output || getOutputDir(config.blockchain, 'rest-api', config.network);

  console.log(`\n🔧 Generating REST API for ${config.blockchain}...`);
  console.log(`📁 Output directory: ${outputDir}`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate OpenAPI 3.0 specification
  const openapiSpec = {
    openapi: '3.0.0',
    info: {
      title: `${config.blockchain.toUpperCase()} BMCPS REST API`,
      version: TOOLS_SCHEMA.version,
      description: `REST API implementation of BMCPS v3.0 for ${config.blockchain} blockchain. Zero context overhead for AI agents.`,
      contact: {
        name: 'BMCPS Documentation',
        url: 'https://bmcps.dev'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://api.yourdomain.com/api/v1',
        description: 'Production server'
      }
    ],
    paths: {},
    components: {
      schemas: {},
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key'
        }
      }
    },
    security: [
      { ApiKeyAuth: [] }
    ]
  };

  // Generate paths for each tool
  TOOLS_SCHEMA.tools.forEach(tool => {
    const toolName = getToolName(tool.name, prefix);
    const path = `/${prefix}/${tool.name.replace(/_/g, '-')}`;

    // Determine HTTP method based on tool type
    const method = tool.name.includes('create') || tool.name.includes('send') ||
                   tool.name.includes('transfer') || tool.name.includes('approve') ||
                   tool.name.includes('set') || tool.name.includes('import')
      ? 'post' : 'get';

    const operation = {
      summary: tool.description,
      description: tool.longDescription || tool.description,
      operationId: toolName,
      tags: [tool.category],
      parameters: [],
      responses: {
        '200': {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: tool.outputs || {}
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: {
                    type: 'object',
                    properties: {
                      code: { type: 'string' },
                      message: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        },
        '500': {
          description: 'Server error'
        }
      }
    };

    // Add request body for POST requests
    if (method === 'post' && tool.inputs && Object.keys(tool.inputs).length > 0) {
      operation.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: tool.inputs,
              required: Object.keys(tool.inputs).filter(key => tool.inputs[key].required)
            }
          }
        }
      };
    } else if (method === 'get' && tool.inputs && Object.keys(tool.inputs).length > 0) {
      // Add query parameters for GET requests
      operation.parameters = Object.entries(tool.inputs).map(([name, def]) => ({
        name: name,
        in: 'query',
        description: def.description,
        required: def.required || false,
        schema: {
          type: def.type,
          enum: def.enum,
          default: def.default
        }
      }));
    }

    openapiSpec.paths[path] = { [method]: operation };
  });

  // Write OpenAPI spec as YAML
  const yaml = `# ${config.blockchain.toUpperCase()} BMCPS REST API - OpenAPI 3.0 Specification
# Generated by BMCPS v3.0
#
# This specification defines a REST API for blockchain operations following
# the Blockchain Multi-Protocol Standard (BMCPS) v3.0.
#
# Zero context overhead - perfect for AI agents and high-scale applications.

${JSON.stringify(openapiSpec, null, 2)}
`;

  fs.writeFileSync(
    path.join(outputDir, 'openapi.json'),
    JSON.stringify(openapiSpec, null, 2)
  );

  // Generate Express.js server template
  const serverCode = `/**
 * ${config.blockchain.toUpperCase()} BMCPS REST API Server
 * Generated by BMCPS v3.0
 *
 * Zero context overhead REST API for blockchain operations
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// API Key authentication middleware
function requireApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or missing API key'
      }
    });
  }

  next();
}

// Apply API key auth to all routes
app.use('/api/v1', requireApiKey);

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', blockchain: '${config.blockchain}', network: '${config.network}' });
});

// OpenAPI spec endpoint
app.get('/api/v1/openapi.json', (req, res) => {
  res.sendFile(__dirname + '/openapi.json');
});

${TOOLS_SCHEMA.tools.map(tool => {
  const path = `/${prefix}/${tool.name.replace(/_/g, '-')}`;
  const method = tool.name.includes('create') || tool.name.includes('send') ||
                 tool.name.includes('transfer') || tool.name.includes('approve') ||
                 tool.name.includes('set') || tool.name.includes('import') ? 'post' : 'get';

  return `// ${tool.description}
app.${method}('/api/v1${path}', async (req, res) => {
  try {
    const params = req.${method === 'post' ? 'body' : 'query'};

    // TODO: Implement blockchain logic here
    // Example:
    // const result = await blockchainClient.${tool.name}(params);

    res.json({
      success: true,
      data: {
        // TODO: Return actual data
        message: 'Not implemented - add your ${config.blockchain} blockchain integration here'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
});
`;
}).join('\n')}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\`${config.blockchain.toUpperCase()} BMCPS REST API listening on port \${PORT}\`);
  console.log(\`Health: http://localhost:\${PORT}/health\`);
  console.log(\`OpenAPI Spec: http://localhost:\${PORT}/api/v1/openapi.json\`);
  console.log(\`Docs: https://bmcps.dev\`);
});

module.exports = app;
`;

  fs.writeFileSync(
    path.join(outputDir, 'server.js'),
    serverCode
  );

  // Generate package.json
  const packageJson = {
    name: `${config.blockchain}-bmcps-rest-api`,
    version: '1.0.0',
    description: `REST API for ${config.blockchain} blockchain following BMCPS v3.0`,
    main: 'server.js',
    scripts: {
      start: 'node server.js',
      dev: 'nodemon server.js',
      test: 'jest'
    },
    dependencies: {
      express: '^4.18.2',
      cors: '^2.8.5',
      helmet: '^7.1.0',
      dotenv: '^16.3.1'
    },
    devDependencies: {
      nodemon: '^3.0.2',
      jest: '^29.7.0',
      supertest: '^6.3.3'
    }
  };

  fs.writeFileSync(
    path.join(outputDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Generate .env.example
  const envExample = `# ${config.blockchain.toUpperCase()} BMCPS REST API Configuration

# Server
PORT=3000
NODE_ENV=development

# Security
API_KEY=your-secret-api-key-here

# Blockchain RPC
RPC_URL=https://your-rpc-endpoint.com
NETWORK=${config.network}

# Optional: Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

  fs.writeFileSync(
    path.join(outputDir, '.env.example'),
    envExample
  );

  // Generate README
  const readme = `# ${config.blockchain.toUpperCase()} BMCPS REST API

Generated by BMCPS v3.0 - Blockchain Multi-Protocol Standard

## Installation

\`\`\`bash
npm install
\`\`\`

## Configuration

1. Copy \`.env.example\` to \`.env\`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Update environment variables in \`.env\`

## Running the Server

\`\`\`bash
# Development (with auto-reload)
npm run dev

# Production
npm start
\`\`\`

## API Documentation

- **OpenAPI Spec**: \`http://localhost:3000/api/v1/openapi.json\`
- **Health Check**: \`http://localhost:3000/health\`

View the OpenAPI spec in Swagger Editor: https://editor.swagger.io/

## Available Endpoints

${TOOLS_SCHEMA.tools.map((tool, i) => {
  const path = `/${prefix}/${tool.name.replace(/_/g, '-')}`;
  const method = tool.name.includes('create') || tool.name.includes('send') ||
                 tool.name.includes('transfer') || tool.name.includes('approve') ||
                 tool.name.includes('set') || tool.name.includes('import') ? 'POST' : 'GET';
  return `${i + 1}. **${method}** \`/api/v1${path}\` - ${tool.description}`;
}).join('\n')}

## Authentication

All API endpoints (except \`/health\`) require an API key in the header:

\`\`\`bash
curl -H "X-API-Key: your-api-key" http://localhost:3000/api/v1/${prefix}/get-balance?address=0x...
\`\`\`

## Example Usage

\`\`\`bash
# Get blockchain info
curl -H "X-API-Key: your-api-key" \\
  http://localhost:3000/api/v1/${prefix}/get-chain-info

# Get balance
curl -H "X-API-Key: your-api-key" \\
  "http://localhost:3000/api/v1/${prefix}/get-balance?address=0x..."

# Send transaction (POST)
curl -X POST \\
  -H "X-API-Key: your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"from": "0x...", "to": "0x...", "amount": "1000000"}' \\
  http://localhost:3000/api/v1/${prefix}/send-transaction
\`\`\`

## Context Overhead

✅ **Zero context overhead**
- No tool schemas in AI context
- Perfect for high-scale applications
- AI just needs to know the endpoint URLs
- Discovery via OpenAPI spec

## Deployment

### Docker

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

### Build and run:

\`\`\`bash
docker build -t ${config.blockchain}-bmcps-api .
docker run -p 3000:3000 --env-file .env ${config.blockchain}-bmcps-api
\`\`\`

## Learn More

- Full documentation: https://bmcps.dev
- REST API Guide: https://bmcps.dev/docs/building-rest-api-from-bmcps
- Protocol Comparison: https://bmcps.dev/docs/protocol-comparison
- OpenAPI Specification: https://spec.openapis.org/oas/v3.0.0

## TODO

⚠️ **Implementation Required**

This is a template - you need to add your blockchain integration:

1. Install blockchain SDK (\`ethers\`, \`@solana/web3.js\`, etc.)
2. Implement handlers in \`server.js\`
3. Add proper error handling
4. Add rate limiting
5. Add request validation
6. Add tests

See https://bmcps.dev/docs/QUICK-START-GUIDE for examples.
`;

  fs.writeFileSync(
    path.join(outputDir, 'README.md'),
    readme
  );

  console.log(`✅ Generated REST API with ${TOOLS_SCHEMA.tools.length} endpoints`);
  console.log(`📄 openapi.json - OpenAPI 3.0 specification`);
  console.log(`📄 server.js - Express.js server`);
  console.log(`📄 package.json - Dependencies`);
  console.log(`📄 .env.example - Configuration template`);
  console.log(`📄 README.md - Documentation`);
  console.log(`\n💡 Zero context overhead - perfect for high-scale AI applications!`);
}

/**
 * Generate JSON Schema format
 */
function generateJSONSchema(config) {
  const prefix = BLOCKCHAIN_PREFIXES[config.blockchain];
  const outputDir = config.output || getOutputDir(config.blockchain, 'json-schema', config.network);

  console.log(`\n🔧 Generating JSON Schemas for ${config.blockchain}...`);
  console.log(`📁 Output directory: ${outputDir}`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Create prefixed schema
  const prefixedSchema = {
    ...TOOLS_SCHEMA,
    blockchain: config.blockchain,
    network: config.network,
    prefix: prefix,
    tools: TOOLS_SCHEMA.tools.map(tool => ({
      ...tool,
      prefixed_name: getToolName(tool.name, prefix)
    }))
  };

  fs.writeFileSync(
    path.join(outputDir, 'schema.json'),
    JSON.stringify(prefixedSchema, null, 2)
  );

  console.log(`✅ Generated JSON schema with ${prefix}_ prefix`);
}

/**
 * Main execution
 */
function main() {
  const config = parseArgs();
  validateConfig(config);

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              BMCPS v3.0 Multi-Format Generator                ║
║          Blockchain Multi-Protocol Standard                   ║
╚═══════════════════════════════════════════════════════════════╝

Configuration:
  Blockchain: ${config.blockchain}
  Format: ${config.format}
  Network: ${config.network}
  Prefix: ${BLOCKCHAIN_PREFIXES[config.blockchain]}_
  `);

  if (config.format === 'all') {
    generateOpenAI(config);
    generateMCP(config);
    generateRESTAPI(config);
    generateJSONSchema(config);
  } else if (config.format === 'openai') {
    generateOpenAI(config);
  } else if (config.format === 'mcp') {
    generateMCP(config);
  } else if (config.format === 'rest-api') {
    generateRESTAPI(config);
  } else if (config.format === 'json-schema') {
    generateJSONSchema(config);
  }

  console.log(`\n✨ Generation complete!\n`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateOpenAI,
  generateMCP,
  generateRESTAPI,
  generateJSONSchema,
  getToolName,
  TOOLS_SCHEMA,
  BLOCKCHAIN_PREFIXES
};

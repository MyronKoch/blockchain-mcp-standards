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
 * Generate MCP format (placeholder - to be implemented)
 */
function generateMCP(config) {
  console.log(`\n🔧 Generating MCP Server for ${config.blockchain}...`);
  console.log(`⏳ MCP generator coming soon - use existing bmcps-factory.js for now`);
}

/**
 * Generate REST API format (placeholder - to be implemented)
 */
function generateRESTAPI(config) {
  console.log(`\n🔧 Generating REST API for ${config.blockchain}...`);
  console.log(`⏳ REST API generator coming soon`);
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

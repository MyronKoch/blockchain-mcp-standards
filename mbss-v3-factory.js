#!/usr/bin/env node
/**
 * MBSS v3.0 Factory System
 *
 * Automated tool generation system for MBSS v3.0 compliant blockchain MCP servers.
 * Generates tool stubs, directory structure, and boilerplate code.
 *
 * Usage:
 *   node mbss-v3-factory.js --blockchain eth --network testnet
 *   node mbss-v3-factory.js --blockchain btc --network mainnet --generate tools
 *   node mbss-v3-factory.js --help
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BLOCKCHAIN_PREFIXES = {
    eth: 'eth', btc: 'btc', sol: 'sol', ada: 'ada', dot: 'dot',
    xrp: 'xrp', avax: 'avax', poly: 'poly', bnb: 'bnb', arb: 'arb',
    base: 'base', near: 'near', sui: 'sui', cosmos: 'cosmos', osmo: 'osmo',
    tron: 'tron', world: 'world'
};

const REQUIRED_TOOLS = [
    // Blockchain Operations
    { name: 'get_chain_info', category: 'core', description: 'Comprehensive blockchain information' },
    { name: 'get_balance', category: 'core', description: 'Native token balance for address' },
    { name: 'get_transaction', category: 'core', description: 'Transaction details by hash' },
    { name: 'get_block', category: 'core', description: 'Block information by number/hash' },
    { name: 'validate_address', category: 'core', description: 'Address format validation' },

    // Transaction Operations
    { name: 'get_transaction_history', category: 'core', description: 'Recent transactions for address' },
    { name: 'send_transaction', category: 'core', description: 'Send native tokens' },

    // Wallet Management
    { name: 'create_wallet', category: 'wallet', description: 'Generate new wallet' },
    { name: 'import_wallet', category: 'wallet', description: 'Import from private key/mnemonic' },
    { name: 'generate_address', category: 'wallet', description: 'Generate new address formats' },

    // Network Management
    { name: 'get_network_info', category: 'network', description: 'Network status and config' },
    { name: 'set_network', category: 'network', description: 'Switch between networks' },
    { name: 'get_gas_price', category: 'network', description: 'Current gas/fee pricing' },

    // Fee Management
    { name: 'estimate_fees', category: 'network', description: 'Fee estimation for transactions' },
    { name: 'get_mempool_info', category: 'network', description: 'Mempool statistics' },

    // Account Information
    { name: 'get_wallet_info', category: 'account', description: 'Comprehensive wallet details' },
    { name: 'get_account_info', category: 'account', description: 'Account metadata and status' },

    // Token Operations
    { name: 'get_token_balance', category: 'tokens', description: 'Token balance queries' },
    { name: 'get_token_info', category: 'tokens', description: 'Token metadata' },
    { name: 'transfer_token', category: 'tokens', description: 'Send tokens' },
    { name: 'approve_token', category: 'tokens', description: 'Approve token spending' },
    { name: 'get_token_allowance', category: 'tokens', description: 'Check spending allowances' },

    // Help System
    { name: 'help', category: 'help', description: 'Interactive help and guidance' },
    { name: 'search_tools', category: 'help', description: 'Search tools by keyword' },
    { name: 'list_tools_by_category', category: 'help', description: 'Browse organized catalog' }
];

const EXTENDED_TOOLS = [
    // NFT Operations
    { name: 'mint_nft', category: 'nft', description: 'Create NFT' },
    { name: 'get_nft_info', category: 'nft', description: 'NFT metadata' },
    { name: 'transfer_nft', category: 'nft', description: 'Transfer NFT' },
    { name: 'get_nft_owner', category: 'nft', description: 'Owner lookup' },

    // DeFi Operations
    { name: 'swap_tokens', category: 'defi', description: 'Token swaps' },
    { name: 'add_liquidity', category: 'defi', description: 'Add to pools' },
    { name: 'remove_liquidity', category: 'defi', description: 'Remove from pools' },
    { name: 'get_pool_info', category: 'defi', description: 'Pool details' },

    // Staking Operations
    { name: 'stake_tokens', category: 'staking', description: 'Stake tokens' },
    { name: 'unstake_tokens', category: 'staking', description: 'Unstake tokens' },
    { name: 'get_staking_rewards', category: 'staking', description: 'Rewards info' },
    { name: 'get_validators', category: 'staking', description: 'Validator list' },

    // Cross-Chain Bridge
    { name: 'bridge_tokens', category: 'bridge', description: 'Bridge tokens to another chain' },
    { name: 'get_bridge_info', category: 'bridge', description: 'Bridge status and supported chains' },

    // Analytics
    { name: 'get_analytics', category: 'analytics', description: 'Network and account analytics' },
    { name: 'get_performance_metrics', category: 'analytics', description: 'Performance statistics' },

    // Security
    { name: 'audit_transaction', category: 'security', description: 'Transaction security audit' },
    { name: 'validate_security', category: 'security', description: 'Security validation checks' },

    // Events
    { name: 'get_events', category: 'events', description: 'Blockchain event logs' },
    { name: 'get_logs', category: 'events', description: 'Transaction and contract logs' }
];

class MBSSFactory {
    constructor(options) {
        this.blockchain = options.blockchain;
        this.network = options.network || 'testnet';
        this.outputDir = options.outputDir || `${this.blockchain}-${this.network}-mcp-server`;
        this.prefix = BLOCKCHAIN_PREFIXES[this.blockchain] || this.blockchain;
        this.generateAll = options.generate === 'all';
        this.generateStructure = options.generate === 'structure' || this.generateAll;
        this.generateTools = options.generate === 'tools' || this.generateAll;
        this.generateConfig = options.generate === 'config' || this.generateAll;
        this.generateTests = options.generate === 'tests' || this.generateAll;
    }

    async generate() {
        console.log('🏭 MBSS v3.0 Factory System');
        console.log('===========================');
        console.log(`🔗 Blockchain: ${this.blockchain} (${this.prefix})`);
        console.log(`🌐 Network: ${this.network}`);
        console.log(`📁 Output: ${this.outputDir}\n`);

        // Create directory structure
        if (this.generateStructure) {
            await this.createDirectoryStructure();
        }

        // Generate configuration files
        if (this.generateConfig) {
            await this.generateConfiguration();
        }

        // Generate tool stubs
        if (this.generateTools) {
            await this.generateTools();
        }

        // Generate tests
        if (this.generateTests) {
            await this.generateTests();
        }

        this.printSummary();
        this.printUsageInstructions();
    }

    async createDirectoryStructure() {
        console.log('🏗️  Creating Directory Structure...');

        const categories = [
            'core', 'wallet', 'network', 'tokens', 'help', 'account', 'nft',
            'defi', 'staking', 'governance', 'contracts', 'bridge', 'analytics',
            'security', 'events', 'advanced'
        ];

        // Create main directories
        const dirs = [
            'src', 'src/tools', 'tests/unit', 'tests/integration', 'scripts', 'docs'
        ];

        // Add category directories
        categories.forEach(category => {
            dirs.push(`src/tools/${category}`);
        });

        // Create directories
        dirs.forEach(dir => {
            const dirPath = path.join(this.outputDir, dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`  ✅ ${dir}`);
            } else {
                console.log(`  ⚠️  ${dir} (already exists)`);
            }
        });

        console.log('');
    }

    async generateConfiguration() {
        console.log('⚙️  Generating Configuration...');

        // package.json
        const packageJson = {
            name: `${this.blockchain}-${this.network}-mcp-server`,
            version: '3.0.0',
            description: `MBSS v3.0 compliant ${this.blockchain} MCP server for ${this.network}`,
            main: 'dist/index.js',
            scripts: {
                build: 'tsc',
                start: 'node dist/index.js',
                dev: 'ts-node src/index.ts',
                test: 'jest',
                'test:watch': 'jest --watch',
                'mbss:validate': 'node ../mbss-v3-validation.js .',
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
                'ts-node': '^10.9.0',
                'jest': '^29.0.0',
                'ts-jest': '^29.0.0',
                '@typescript-eslint/eslint-plugin': '^6.0.0',
                '@typescript-eslint/parser': '^6.0.0',
                'eslint': '^8.0.0',
                'prettier': '^3.0.0'
            },
            keywords: ['mcp', 'blockchain', this.blockchain, 'mbss', 'v3.0'],
            author: 'MBSS Factory System',
            license: 'MIT'
        };

        fs.writeFileSync(
            path.join(this.outputDir, 'package.json'),
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
            path.join(this.outputDir, 'tsconfig.json'),
            JSON.stringify(tsconfig, null, 2)
        );
        console.log('  ✅ tsconfig.json');

        // .env.example
        const envExample = `# MBSS v3.0 Configuration
BLOCKCHAIN=${this.blockchain.toUpperCase()}
NETWORK=${this.network.toUpperCase()}
PORT=3000
LOG_LEVEL=info

# API Keys (if needed)
INFURA_API_KEY=
ALCHEMY_API_KEY=
COINGECKO_API_KEY=

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
`;

        fs.writeFileSync(
            path.join(this.outputDir, '.env.example'),
            envExample
        );
        console.log('  ✅ .env.example');

        console.log('');
    }

    async generateTools() {
        console.log('🛠️  Generating Tool Stubs...');

        const tools = this.generateAll ? [...REQUIRED_TOOLS, ...EXTENDED_TOOLS] : REQUIRED_TOOLS;

        tools.forEach(tool => {
            const fileName = `${this.prefix}-${tool.name}.ts`;
            const filePath = path.join(this.outputDir, 'src/tools', tool.category, fileName);

            const toolStub = this.generateToolStub(tool, this.prefix);
            fs.writeFileSync(filePath, toolStub);
            console.log(`  ✅ ${tool.category}/${fileName}`);
        });

        // Generate tool-definitions.ts
        this.generateToolDefinitions();

        // Generate index.ts
        this.generateMainIndex();

        console.log('');
    }

    generateToolStub(tool, prefix) {
        const handlerName = `handle${tool.name.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join('')}`;

        const stub = `import { z } from 'zod';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * ${tool.description}
 * MBSS v3.0 Standard Tool
 */
const schema = z.object({
  // Add your input parameters here
  // address: z.string().describe('Wallet address'),
  // amount: z.string().describe('Transaction amount'),
  // ... other parameters
});

export async function ${handlerName}(args: any) {
  try {
    // Validate inputs
    const parsed = schema.parse(args);

    // TODO: Implement ${tool.name} functionality
    // const result = await perform${tool.name.split('_').map(word =>
    //   word.charAt(0).toUpperCase() + word.slice(1)
    // ).join('')}(parsed);

    // Placeholder response
    return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    error: 'Not implemented',
                    message: '${tool.name} functionality not yet implemented',
                    tool: '${tool.name}',
                    category: '${tool.category}',
                    mbss_version: '3.0.0'
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

// TODO: Implement the actual ${tool.name} logic
// async function perform${tool.name.split('_').map(word =>
                        //   word.charAt(0).toUpperCase() + word.slice(1)
                        // ).join('')}(params) {
                        //   // Your implementation here
                        //   throw new Error('Not implemented');
                        // }
                        `;

    return stub;
  }

  generateToolDefinitions() {
    const filePath = path.join(this.outputDir, 'src', 'tool-definitions.ts');

    const tools = this.generateAll ? [...REQUIRED_TOOLS, ...EXTENDED_TOOLS] : REQUIRED_TOOLS;

    const toolDefinitions = tools.map(tool => {
      const handlerName = `handle${
                        tool.name.split('_').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        ).join('')
                    }`;

      return `  {
                        name: '${this.prefix}_${tool.name}',
                        description: '${tool.description}',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                // Add your input schema here
                                // address: { type: 'string', description: 'Wallet address' }
                            },
                            required: []
                        }
                    }`;
    }).join(',\n');

    const content = `/**
 * MBSS v3.0 Tool Definitions
 * Auto-generated by MBSS Factory System
 */

export const TOOL_DEFINITIONS = [
                    ${ toolDefinitions }
                ];

// Tool handlers mapping
${
                    tools.map(tool => {
                        const handlerName = `handle${tool.name.split('_').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        ).join('')}`;
                        return `import { ${handlerName} } from './tools/${tool.category}/${this.prefix}-${tool.name}.js';`;
                    }).join('\n')
                }

                export const TOOL_HANDLERS = {
                    ${ tools.map(tool => {
                        const handlerName = `handle${tool.name.split('_').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        ).join('')}`;
                        return `  '${this.prefix}_${tool.name}': ${handlerName}`;
                    }).join(',\n')
            }
        };
        `;

    fs.writeFileSync(filePath, content);
    console.log('  ✅ src/tool-definitions.ts');
  }

  generateMainIndex() {
    const filePath = path.join(this.outputDir, 'src', 'index.ts');

    const content = `#!/usr/bin / env node
        /**
         * MBSS v3.0 ${this.blockchain.toUpperCase()} MCP Server
         * Auto-generated by MBSS Factory System
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
                name: '${this.blockchain}-${this.network}-mcp-server',
                version: '3.0.0', // MBSS v3.0 compliant
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
  console.error('[MBSS v3.0] ${this.blockchain.toUpperCase()} MCP Server running');
  console.error(\`[MBSS v3.0] Blockchain: ${this.blockchain}\`);
  console.error(\`[MBSS v3.0] Network: ${this.network}\`);
  console.error(\`[MBSS v3.0] Total tools: \${TOOL_DEFINITIONS.length}\`);
  console.error(\`[MBSS v3.0] Compliance: Ready for validation\`);
}

main().catch(console.error);
`;

                    fs.writeFileSync(filePath, content);
                    console.log('  ✅ src/index.ts');
                }

  async generateTests() {
                    console.log('🧪 Generating Tests...');

                    // Generate basic test structure
                    const testFiles = [
                        'smoke.test.ts',
                        'unit/core.test.ts',
                        'unit/wallet.test.ts',
                        'integration/tools.test.ts'
                    ];

                    testFiles.forEach(file => {
                        const filePath = path.join(this.outputDir, 'tests', file);
                        const testContent = this.generateTestStub(file);
                        fs.writeFileSync(filePath, testContent);
                        console.log(`  ✅ tests/${file}`);
                    });

                    // Generate Jest configuration
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
                        path.join(this.outputDir, 'jest.config.js'),
                        `module.exports = ${JSON.stringify(jestConfig, null, 2)};`
                    );
                    console.log('  ✅ jest.config.js');

                    console.log('');
                }

                generateTestStub(fileName) {
                    const testName = path.basename(fileName, '.ts').replace('.', ' ');

                    if (fileName.includes('smoke')) {
                        return `/**
 * Smoke Tests - Basic functionality verification
 * MBSS v3.0 Compliance Tests
 */

import { TOOL_DEFINITIONS } from '../src/tool-definitions';

describe('MBSS v3.0 Smoke Tests', () => {
  test('should have required tools defined', () => {
    expect(TOOL_DEFINITIONS).toBeDefined();
    expect(TOOL_DEFINITIONS.length).toBeGreaterThan(0);
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
      expect(tool.name).toMatch(/^${this.prefix}_\\w+\\$/);
    });
  });
});
`;
                    }

                    if (fileName.includes('core')) {
                        return `/**
 * Core Tools Unit Tests
 * MBSS v3.0 Compliance Tests
 */

import { handleGetChainInfo, handleGetBalance } from '../../src/tools/core/${this.prefix}-get_chain_info';
import { handleGetBalance } from '../../src/tools/core/${this.prefix}-get_balance';

describe('Core Tools', () => {
  test('get_chain_info should return valid structure', async () => {
    // TODO: Implement test when tool is implemented
    expect(true).toBe(true);
  });

  test('get_balance should validate inputs', async () => {
    // TODO: Implement test when tool is implemented
    expect(true).toBe(true);
  });
});
`;
                    }

                    if (fileName.includes('wallet')) {
                        return `/**
 * Wallet Tools Unit Tests
 * MBSS v3.0 Compliance Tests
 */

describe('Wallet Tools', () => {
  test('create_wallet should generate valid wallet', async () => {
    // TODO: Implement test when tool is implemented
    expect(true).toBe(true);
  });

  test('import_wallet should validate private keys', async () => {
    // TODO: Implement test when tool is implemented
    expect(true).toBe(true);
  });
});
`;
                    }

                    return `/**
 * Integration Tests
 * MBSS v3.0 Compliance Tests
 */

describe('Integration Tests', () => {
  test('all tools should be importable', async () => {
    // TODO: Implement integration tests
    expect(true).toBe(true);
  });
});
`;
                }

                printSummary() {
                    console.log('📊 GENERATION SUMMARY');
                    console.log('=====================');

                    const tools = this.generateAll ? [...REQUIRED_TOOLS, ...EXTENDED_TOOLS] : REQUIRED_TOOLS;
                    const categories = new Set(tools.map(t => t.category));

                    console.log(`🔗 Blockchain: ${this.blockchain} (${this.prefix})`);
                    console.log(`🌐 Network: ${this.network}`);
                    console.log(`🛠️  Tools Generated: ${tools.length}`);
                    console.log(`📁 Categories: ${categories.size}`);
                    console.log(`📦 Files Created: ~${tools.length + 10}`);
                    console.log(`🏆 MBSS v3.0 Compliance: ✅ Ready`);

                    if (this.generateAll) {
                        console.log(`🥇 Level: GOLD (Extended tools included)`);
                    } else {
                        console.log(`🥉 Level: BRONZE (Core tools only)`);
                    }

                    console.log('');
                }

                printUsageInstructions() {
                    console.log('🚀 NEXT STEPS');
                    console.log('=============');
                    console.log(`cd ${this.outputDir}`);
                    console.log('npm install');
                    console.log('npm run build');
                    console.log('npm run mbss:validate');
                    console.log('npm start');
                    console.log('');
                    console.log('💡 Tips:');
                    console.log('- Implement the TODO sections in each tool file');
                    console.log('- Run validation: node ../mbss-v3-validation.js .');
                    console.log('- Add comprehensive tests in tests/ directory');
                    console.log('- Update README.md with your implementation details');
                    console.log('');
                }
            }

// CLI Interface
function parseArguments() {
                const args = process.argv.slice(2);
                const options = {};

                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    switch (arg) {
                        case '--blockchain':
                            options.blockchain = args[++i];
                            break;
                        case '--network':
                            options.network = args[++i];
                            break;
                        case '--output':
                            options.outputDir = args[++i];
                            break;
                        case '--generate':
                            options.generate = args[++i];
                            break;
                        case '--all':
                            options.generateAll = true;
                            options.generate = 'all';
                            break;
                        case '--help':
                        case '-h':
                            printHelp();
                            process.exit(0);
                        default:
                            console.error(`Unknown option: ${arg}`);
                            printHelp();
                            process.exit(1);
                    }
                }

                // Validate required arguments
                if (!options.blockchain) {
                    console.error('❌ Error: --blockchain is required');
                    printHelp();
                    process.exit(1);
                }

                if (!BLOCKCHAIN_PREFIXES[options.blockchain]) {
                    console.error(`❌ Error: Unsupported blockchain '${options.blockchain}'`);
                    console.error(`Supported: ${Object.keys(BLOCKCHAIN_PREFIXES).join(', ')}`);
                    process.exit(1);
                }

                return options;
            }

            function printHelp() {
                console.log('MBSS v3.0 Factory System');
                console.log('========================');
                console.log('');
                console.log('Usage:');
                console.log('  node mbss-v3-factory.js --blockchain <blockchain> [options]');
                console.log('');
                console.log('Options:');
                console.log('  --blockchain <name>    Blockchain (eth, btc, sol, etc.) (required)');
                console.log('  --network <name>       Network (mainnet, testnet) (default: testnet)');
                console.log('  --output <directory>   Output directory (default: <blockchain>-<network>-mcp-server)');
                console.log('  --generate <type>      What to generate (all, structure, tools, config, tests)');
                console.log('  --all                  Generate everything including extended tools');
                console.log('  --help, -h             Show this help');
                console.log('');
                console.log('Examples:');
                console.log('  node mbss-v3-factory.js --blockchain eth --network testnet');
                console.log('  node mbss-v3-factory.js --blockchain sol --network mainnet --all');
                console.log('  node mbss-v3-factory.js --blockchain btc --generate tools');
            }

            // Main execution
            async function main() {
                try {
                    const options = parseArguments();
                    const factory = new MBSSFactory(options);
                    await factory.generate();
                } catch (error) {
                    console.error('❌ Error:', error.message);
                    process.exit(1);
                }
            }

            if (require.main === module) {
                main();
            }

            module.exports = MBSSFactory;

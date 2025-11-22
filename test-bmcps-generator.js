#!/usr/bin/env node
/**
 * Comprehensive Test Suite for BMCPS Multi-Format Generator
 *
 * Tests all 4 generators: OpenAI, MCP, REST API, JSON Schema
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test configuration
const TEST_BLOCKCHAINS = ['eth', 'btc', 'sol'];
const TEST_FORMATS = ['openai', 'mcp', 'rest-api', 'json-schema', 'all'];
const TEST_OUTPUT_DIR = './test-output';

// Test results
let passed = 0;
let failed = 0;
const failures = [];

/**
 * Cleanup test outputs
 */
function cleanup() {
  console.log('🧹 Cleaning up test outputs...');
  if (fs.existsSync(TEST_OUTPUT_DIR)) {
    fs.rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
  }

  // Remove any generated directories
  const patterns = [
    /^eth-.*-(openai|mcp-server|rest-api|json-schema|bmcps-multi)$/,
    /^btc-.*-(openai|mcp-server|rest-api|json-schema|bmcps-multi)$/,
    /^sol-.*-(openai|mcp-server|rest-api|json-schema|bmcps-multi)$/
  ];

  const files = fs.readdirSync('.');
  files.forEach(file => {
    if (patterns.some(pattern => pattern.test(file))) {
      fs.rmSync(file, { recursive: true, force: true });
      console.log(`  Removed: ${file}`);
    }
  });
}

/**
 * Assert helper
 */
function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    failures.push(message);
    console.log(`  ❌ ${message}`);
  }
}

/**
 * Test: Generator Help
 */
function testGeneratorHelp() {
  console.log('\n📋 Test: Generator Help');
  try {
    const output = execSync('node bmcps-generator.js --help', { encoding: 'utf8' });
    assert(output.includes('BMCPS v3.0 Multi-Format Generator'), 'Help text includes title');
    assert(output.includes('--blockchain'), 'Help text includes --blockchain flag');
    assert(output.includes('--format'), 'Help text includes --format flag');
    assert(output.includes('mcp'), 'Help text mentions MCP format');
    assert(output.includes('openai'), 'Help text mentions OpenAI format');
    assert(output.includes('rest-api'), 'Help text mentions REST API format');
  } catch (error) {
    assert(false, 'Generator help command failed');
  }
}

/**
 * Test: OpenAI Generator
 */
function testOpenAIGenerator() {
  console.log('\n🔧 Test: OpenAI Functions Generator');
  const blockchain = 'eth';
  const outputDir = `${blockchain}-testnet-openai`;

  try {
    // Clean previous test
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }

    // Run generator
    execSync(`node bmcps-generator.js --blockchain ${blockchain} --format openai --network testnet`, { encoding: 'utf8' });

    // Verify directory exists
    assert(fs.existsSync(outputDir), 'Output directory created');

    // Verify files exist
    assert(fs.existsSync(path.join(outputDir, 'functions.json')), 'functions.json created');
    assert(fs.existsSync(path.join(outputDir, 'example.js')), 'example.js created');
    assert(fs.existsSync(path.join(outputDir, 'README.md')), 'README.md created');

    // Verify functions.json content
    const functionsData = JSON.parse(fs.readFileSync(path.join(outputDir, 'functions.json'), 'utf8'));
    assert(functionsData.version === '3.0.0', 'Correct BMCPS version');
    assert(functionsData.blockchain === blockchain, 'Correct blockchain');
    assert(functionsData.format === 'openai', 'Correct format');
    assert(functionsData.functions.length === 25, 'All 25 tools generated');

    // Verify function structure
    const firstFunc = functionsData.functions[0];
    assert(firstFunc.name.startsWith('eth_'), 'Function has correct prefix');
    assert(firstFunc.description, 'Function has description');
    assert(firstFunc.parameters, 'Function has parameters schema');
    assert(firstFunc.parameters.type === 'object', 'Parameters is object type');

    // Cleanup
    fs.rmSync(outputDir, { recursive: true });

  } catch (error) {
    assert(false, `OpenAI generator failed: ${error.message}`);
  }
}

/**
 * Test: MCP Generator
 */
function testMCPGenerator() {
  console.log('\n🔧 Test: MCP Server Generator');
  const blockchain = 'sol';
  const outputDir = `${blockchain}-mainnet-mcp-server`;

  try {
    // Clean previous test
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }

    // Run generator
    execSync(`node bmcps-generator.js --blockchain ${blockchain} --format mcp --network mainnet`, { encoding: 'utf8' });

    // Verify directory structure
    assert(fs.existsSync(outputDir), 'Output directory created');
    assert(fs.existsSync(path.join(outputDir, 'src')), 'src directory created');
    assert(fs.existsSync(path.join(outputDir, 'src/tools')), 'tools directory created');
    assert(fs.existsSync(path.join(outputDir, 'tests')), 'tests directory created');

    // Verify configuration files
    assert(fs.existsSync(path.join(outputDir, 'package.json')), 'package.json created');
    assert(fs.existsSync(path.join(outputDir, 'tsconfig.json')), 'tsconfig.json created');
    assert(fs.existsSync(path.join(outputDir, '.env.example')), '.env.example created');
    assert(fs.existsSync(path.join(outputDir, 'README.md')), 'README.md created');

    // Verify tool files
    assert(fs.existsSync(path.join(outputDir, 'src/index.ts')), 'index.ts created');
    assert(fs.existsSync(path.join(outputDir, 'src/tool-definitions.ts')), 'tool-definitions.ts created');

    // Verify category directories
    const categories = ['core', 'wallet', 'network', 'tokens', 'help', 'account'];
    categories.forEach(category => {
      assert(fs.existsSync(path.join(outputDir, 'src/tools', category)), `${category} directory created`);
    });

    // Verify tool files generated
    const coreTools = fs.readdirSync(path.join(outputDir, 'src/tools/core'));
    assert(coreTools.length === 7, 'Core category has 7 tools (chain_info, balance, transaction, block, validate_address, tx_history, send_tx)');
    assert(coreTools.some(f => f === 'sol-get_balance.ts'), 'get_balance tool exists');

    // Verify package.json content
    const packageData = JSON.parse(fs.readFileSync(path.join(outputDir, 'package.json'), 'utf8'));
    assert(packageData.name === `${blockchain}-mainnet-mcp-server`, 'Correct package name');
    assert(packageData.version === '3.0.0', 'Correct version');
    assert(packageData.type === 'module', 'ES module type');
    assert(packageData.dependencies['@modelcontextprotocol/sdk'], 'MCP SDK dependency');
    assert(packageData.dependencies['zod'], 'Zod dependency');

    // Verify test files
    assert(fs.existsSync(path.join(outputDir, 'tests/smoke.test.ts')), 'Smoke tests created');
    assert(fs.existsSync(path.join(outputDir, 'jest.config.js')), 'Jest config created');

    // Verify a tool file structure
    const toolContent = fs.readFileSync(path.join(outputDir, 'src/tools/core/sol-get_balance.ts'), 'utf8');
    assert(toolContent.includes('import { z }'), 'Tool imports Zod');
    assert(toolContent.includes('import { McpError'), 'Tool imports McpError');
    assert(toolContent.includes('export async function handleGetBalance'), 'Tool exports handler');
    assert(toolContent.includes('schema.parse(args)'), 'Tool validates inputs');

    // Cleanup
    fs.rmSync(outputDir, { recursive: true });

  } catch (error) {
    assert(false, `MCP generator failed: ${error.message}`);
  }
}

/**
 * Test: REST API Generator
 */
function testRESTAPIGenerator() {
  console.log('\n🔧 Test: REST API Generator');
  const blockchain = 'btc';
  const outputDir = `${blockchain}-mainnet-rest-api`;

  try {
    // Clean previous test
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }

    // Run generator
    execSync(`node bmcps-generator.js --blockchain ${blockchain} --format rest-api --network mainnet`, { encoding: 'utf8' });

    // Verify directory exists
    assert(fs.existsSync(outputDir), 'Output directory created');

    // Verify files exist
    assert(fs.existsSync(path.join(outputDir, 'openapi.json')), 'openapi.json created');
    assert(fs.existsSync(path.join(outputDir, 'server.js')), 'server.js created');
    assert(fs.existsSync(path.join(outputDir, 'package.json')), 'package.json created');
    assert(fs.existsSync(path.join(outputDir, '.env.example')), '.env.example created');
    assert(fs.existsSync(path.join(outputDir, 'README.md')), 'README.md created');

    // Verify OpenAPI spec
    const openapiData = JSON.parse(fs.readFileSync(path.join(outputDir, 'openapi.json'), 'utf8'));
    assert(openapiData.openapi === '3.0.0', 'Correct OpenAPI version');
    assert(openapiData.info.title.includes('BTC'), 'Correct blockchain in title');
    assert(openapiData.info.version === '3.0.0', 'Correct BMCPS version');
    assert(Object.keys(openapiData.paths).length === 25, 'All 25 endpoints defined');

    // Verify endpoint structure
    const balanceEndpoint = openapiData.paths['/btc/get-balance'];
    assert(balanceEndpoint, 'get-balance endpoint exists');
    assert(balanceEndpoint.get, 'get-balance uses GET method');
    assert(balanceEndpoint.get.summary, 'Endpoint has summary');
    assert(balanceEndpoint.get.responses, 'Endpoint has responses');

    // Verify package.json
    const packageData = JSON.parse(fs.readFileSync(path.join(outputDir, 'package.json'), 'utf8'));
    assert(packageData.dependencies.express, 'Express dependency');
    assert(packageData.dependencies.cors, 'CORS dependency');
    assert(packageData.dependencies.helmet, 'Helmet dependency');

    // Verify server.js structure
    const serverContent = fs.readFileSync(path.join(outputDir, 'server.js'), 'utf8');
    assert(serverContent.includes('const express = require'), 'Server imports Express');
    assert(serverContent.includes('app.use(helmet())'), 'Server uses Helmet');
    assert(serverContent.includes('requireApiKey'), 'Server has API key auth');
    assert(serverContent.includes('/health'), 'Server has health endpoint');

    // Cleanup
    fs.rmSync(outputDir, { recursive: true });

  } catch (error) {
    assert(false, `REST API generator failed: ${error.message}`);
  }
}

/**
 * Test: JSON Schema Generator
 */
function testJSONSchemaGenerator() {
  console.log('\n🔧 Test: JSON Schema Generator');
  const blockchain = 'eth';
  const outputDir = `${blockchain}-testnet-json-schema`;

  try {
    // Clean previous test
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }

    // Run generator
    execSync(`node bmcps-generator.js --blockchain ${blockchain} --format json-schema --network testnet`, { encoding: 'utf8' });

    // Verify directory exists
    assert(fs.existsSync(outputDir), 'Output directory created');

    // Verify file exists
    assert(fs.existsSync(path.join(outputDir, 'schema.json')), 'schema.json created');

    // Verify schema content
    const schemaData = JSON.parse(fs.readFileSync(path.join(outputDir, 'schema.json'), 'utf8'));
    assert(schemaData.version === '3.0.0', 'Correct BMCPS version');
    assert(schemaData.blockchain === blockchain, 'Correct blockchain');
    assert(schemaData.network === 'testnet', 'Correct network');
    assert(schemaData.prefix === 'eth', 'Correct prefix');
    assert(schemaData.tools.length === 25, 'All 25 tools included');

    // Verify tool has prefixed name
    const firstTool = schemaData.tools[0];
    assert(firstTool.prefixed_name.startsWith('eth_'), 'Tool has prefixed name');
    assert(firstTool.name, 'Tool has base name');
    assert(firstTool.description, 'Tool has description');

    // Cleanup
    fs.rmSync(outputDir, { recursive: true });

  } catch (error) {
    assert(false, `JSON Schema generator failed: ${error.message}`);
  }
}

/**
 * Test: All Formats Generator
 */
function testAllFormatsGenerator() {
  console.log('\n🔧 Test: All Formats Generator');
  const blockchain = 'eth';
  const network = 'testnet';

  try {
    // Run generator for all formats
    execSync(`node bmcps-generator.js --blockchain ${blockchain} --format all --network ${network}`, { encoding: 'utf8' });

    // Verify all output directories exist
    assert(fs.existsSync(`${blockchain}-${network}-openai`), 'OpenAI directory created');
    assert(fs.existsSync(`${blockchain}-${network}-mcp-server`), 'MCP directory created');
    assert(fs.existsSync(`${blockchain}-${network}-rest-api`), 'REST API directory created');
    assert(fs.existsSync(`${blockchain}-${network}-json-schema`), 'JSON Schema directory created');

    // Cleanup
    fs.rmSync(`${blockchain}-${network}-openai`, { recursive: true });
    fs.rmSync(`${blockchain}-${network}-mcp-server`, { recursive: true });
    fs.rmSync(`${blockchain}-${network}-rest-api`, { recursive: true });
    fs.rmSync(`${blockchain}-${network}-json-schema`, { recursive: true });

  } catch (error) {
    assert(false, `All formats generator failed: ${error.message}`);
  }
}

/**
 * Test: Error Handling
 */
function testErrorHandling() {
  console.log('\n🔧 Test: Error Handling');

  // Test missing blockchain argument
  try {
    execSync('node bmcps-generator.js --format mcp', { encoding: 'utf8', stdio: 'pipe' });
    assert(false, 'Should fail without blockchain argument');
  } catch (error) {
    assert(error.status === 1, 'Fails with exit code 1 when blockchain missing');
  }

  // Test unsupported blockchain
  try {
    execSync('node bmcps-generator.js --blockchain xyz --format mcp', { encoding: 'utf8', stdio: 'pipe' });
    assert(false, 'Should fail with unsupported blockchain');
  } catch (error) {
    assert(error.status === 1, 'Fails with exit code 1 for unsupported blockchain');
  }

  // Test unsupported format
  try {
    execSync('node bmcps-generator.js --blockchain eth --format invalid', { encoding: 'utf8', stdio: 'pipe' });
    assert(false, 'Should fail with unsupported format');
  } catch (error) {
    assert(error.status === 1, 'Fails with exit code 1 for unsupported format');
  }
}

/**
 * Test: tools-schema.json Validation
 */
function testToolsSchema() {
  console.log('\n🔧 Test: tools-schema.json Validation');

  try {
    const schema = JSON.parse(fs.readFileSync('tools-schema.json', 'utf8'));

    assert(schema.version === '3.0.0', 'Schema has correct version');
    assert(schema.title === 'BMCPS v3.0 Universal Tool Schema', 'Schema has correct title');
    assert(Array.isArray(schema.tools), 'Schema has tools array');
    assert(schema.tools.length === 25, 'Schema has exactly 25 tools');

    // Validate each tool structure
    schema.tools.forEach((tool, index) => {
      assert(tool.name, `Tool ${index} has name`);
      assert(tool.category, `Tool ${index} has category`);
      assert(tool.description, `Tool ${index} has description`);
      assert(tool.inputs !== undefined, `Tool ${index} has inputs (can be empty object)`);
      assert(tool.outputs !== undefined, `Tool ${index} has outputs`);
    });

    // Verify mandatory tool categories
    const categories = [...new Set(schema.tools.map(t => t.category))];
    assert(categories.includes('core'), 'Has core category');
    assert(categories.includes('wallet'), 'Has wallet category');
    assert(categories.includes('network'), 'Has network category');
    assert(categories.includes('tokens'), 'Has tokens category');
    assert(categories.includes('help'), 'Has help category');

    // Verify specific mandatory tools exist
    const toolNames = schema.tools.map(t => t.name);
    assert(toolNames.includes('get_balance'), 'Has get_balance tool');
    assert(toolNames.includes('send_transaction'), 'Has send_transaction tool');
    assert(toolNames.includes('create_wallet'), 'Has create_wallet tool');
    assert(toolNames.includes('help'), 'Has help tool');

  } catch (error) {
    assert(false, `tools-schema.json validation failed: ${error.message}`);
  }
}

/**
 * Test: Multiple Blockchain Support
 */
function testMultipleBlockchains() {
  console.log('\n🔧 Test: Multiple Blockchain Support');

  const blockchains = ['eth', 'btc', 'sol', 'xrp', 'avax'];

  blockchains.forEach(blockchain => {
    try {
      const outputDir = `${blockchain}-testnet-openai`;

      // Clean previous
      if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true });
      }

      execSync(`node bmcps-generator.js --blockchain ${blockchain} --format openai --network testnet`, { encoding: 'utf8' });

      assert(fs.existsSync(outputDir), `${blockchain} generation successful`);

      const functionsData = JSON.parse(fs.readFileSync(path.join(outputDir, 'functions.json'), 'utf8'));
      assert(functionsData.blockchain === blockchain, `${blockchain} has correct blockchain identifier`);

      // Verify prefix
      const expectedPrefixes = { eth: 'eth', btc: 'btc', sol: 'sol', xrp: 'xrp', avax: 'avax' };
      const firstFunc = functionsData.functions[0];
      assert(firstFunc.name.startsWith(expectedPrefixes[blockchain] + '_'), `${blockchain} uses correct prefix`);

      // Cleanup
      fs.rmSync(outputDir, { recursive: true });

    } catch (error) {
      assert(false, `${blockchain} generation failed: ${error.message}`);
    }
  });
}

/**
 * Main test runner
 */
function runTests() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║     BMCPS v3.0 Multi-Format Generator - Test Suite           ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // Run cleanup first
  cleanup();

  // Run all tests
  testGeneratorHelp();
  testToolsSchema();
  testOpenAIGenerator();
  testMCPGenerator();
  testRESTAPIGenerator();
  testJSONSchemaGenerator();
  testAllFormatsGenerator();
  testMultipleBlockchains();
  testErrorHandling();

  // Final cleanup
  cleanup();

  // Print results
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                      Test Results                             ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${passed + failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

  if (failed > 0) {
    console.log('Failed Tests:');
    failures.forEach(failure => {
      console.log(`  ❌ ${failure}`);
    });
    process.exit(1);
  } else {
    console.log('🎉 All tests passed!\n');
    process.exit(0);
  }
}

// Run tests
runTests();

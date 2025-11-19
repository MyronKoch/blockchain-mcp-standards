# Testing Standard for Blockchain MCP Servers

## 🎯 Comprehensive Testing & Validation Guide

This consolidated standard covers all testing requirements, validation procedures, and quality assurance for Blockchain MCP Standard v3.0 (BMCPS v3.0) compliant blockchain MCP servers.

---

## 🔴 RIGOROUS TESTING REQUIREMENTS

**CRITICAL**: Every blockchain MCP server MUST pass ALL tests at 95%+ coverage before production deployment. No exceptions.

## Testing Framework Setup

### Core Dependencies

```json
\{
  "devDependencies": \{
    "jest": "^29.7.0",
    "ts-jest": "^29.1.5",
    "@types/jest": "^29.5.12",
    "ts-node": "^10.9.2",
    "@modelcontextprotocol/inspector": "^1.0.0"
  \}
\}
```

### Jest Configuration

```javascript
// jest.config.cjs
module.exports = \{
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.test.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: \{
    global: \{
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    \}
  \},
  transform: \{
    '^.+\\.ts$': ['ts-jest', \{
      tsconfig: \{
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: 'node'
      \}
    \}]
  \},
  moduleNameMapper: \{
    '^(\\.\{1,2\}/.*)\\.js$': '$1'
  \}
\};
```

---

## Test Directory Structure

```
tests/
├── unit/                    # Unit tests for individual functions
│   ├── core/               # Core tool tests
│   │   ├── get-balance.test.ts
│   │   ├── get-chain-info.test.ts
│   │   └── validate-address.test.ts
│   ├── utils/              # Utility function tests
│   │   ├── validation.test.ts
│   │   └── formatting.test.ts
│   └── types/              # Type validation tests
│       └── schemas.test.ts
├── integration/            # Integration tests
│   ├── tools.test.ts      # Tool registration and execution
│   ├── client.test.ts     # Blockchain client tests
│   └── bmcps-compliance.test.ts  # BMCPS v3.0 standard compliance
├── smoke/                  # Smoke tests
│   └── server-startup.test.ts
└── fixtures/               # Test data
    ├── addresses.json
    ├── transactions.json
    └── mock-responses.json
```

---

## Test Categories

### 1. Smoke Tests (Quick Validation)

```typescript
// tests/smoke/server-startup.test.ts
describe('Server Startup', () => \{
  it('should load without errors', () => \{
    expect(() => \{
      require('../../src/index');
    \}).not.toThrow();
  \});

  it('should have correct server metadata', async () => \{
    const \{ Server \} = await import('../../src/index');
    expect(Server.name).toMatch(/^[a-z]+[-_]mcp[-_]server$/);
    expect(Server.version).toMatch(/^\d+\.\d+\.\d+$/);
  \});
\});
```

### 2. Unit Tests (Component Testing)

```typescript
// tests/unit/core/get-balance.test.ts
import \{ handleGetBalance \} from '../../../src/tools/core/\{prefix\}-get-balance';
import \{ mockClient \} from '../../fixtures/mock-client';

describe('Get Balance Tool', () => \{
  it('should return balance for valid address', async () => \{
    const args = \{ address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' \};
    const result = await handleGetBalance(args, mockClient);
    
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    
    const data = JSON.parse(result.content[0].text);
    expect(data).toHaveProperty('address');
    expect(data).toHaveProperty('balance');
    expect(data).toHaveProperty('formatted');
  \});

  it('should throw error for invalid address', async () => \{
    const args = \{ address: 'invalid' \};
    
    await expect(
      handleGetBalance(args, mockClient)
    ).rejects.toThrow('Invalid address format');
  \});

  it('should handle network errors gracefully', async () => \{
    const failingClient = \{
      ...mockClient,
      provider: \{
        getBalance: jest.fn().mockRejectedValue(new Error('Network error'))
      \}
    \};
    
    const args = \{ address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' \};
    
    await expect(
      handleGetBalance(args, failingClient)
    ).rejects.toThrow('Failed to get balance');
  \});
\});
```

### 3. Integration Tests (System Testing)

```typescript
// tests/integration/tools.test.ts
import \{ Server \} from '@modelcontextprotocol/sdk/server';
import \{ TOOL_DEFINITIONS, TOOL_HANDLERS \} from '../../src/tools';

describe('Tool Integration', () => \{
  let server: Server;
  
  beforeAll(async () => \{
    server = new Server(
      \{ name: 'test-server', version: '1.0.0' \},
      \{ capabilities: \{ tools: \{\} \} \}
    );
  \});

  describe('Tool Registration', () => \{
    it('should have all 25 BMCPS v3.0 core tools', () => \{
      const coreTools = [
        '\{prefix\}_get_chain_info',
        '\{prefix\}_get_balance',
        '\{prefix\}_get_transaction',
        '\{prefix\}_get_block',
        '\{prefix\}_validate_address',
        '\{prefix\}_get_transaction_history',
        '\{prefix\}_create_wallet',
        '\{prefix\}_help',
        '\{prefix\}_search_tools',
        '\{prefix\}_list_tools_by_category',
        '\{prefix\}_send_transaction',
        '\{prefix\}_get_network_info',
        '\{prefix\}_set_network',
        '\{prefix\}_get_gas_price',
        '\{prefix\}_get_mempool_info',
        '\{prefix\}_estimate_fees',
        '\{prefix\}_import_wallet',
        '\{prefix\}_get_wallet_info',
        '\{prefix\}_get_account_info',
        '\{prefix\}_generate_address',
        '\{prefix\}_get_token_balance',
        '\{prefix\}_get_token_info',
        '\{prefix\}_transfer_token',
        '\{prefix\}_approve_token',
        '\{prefix\}_get_token_allowance'
      ];
      
      coreTools.forEach(toolName => \{
        const tool = TOOL_DEFINITIONS.find(t => t.name === toolName);
        expect(tool).toBeDefined();
        expect(TOOL_HANDLERS[toolName]).toBeDefined();
      \});
    \});

    it('should follow naming conventions', () => \{
      TOOL_DEFINITIONS.forEach(tool => \{
        expect(tool.name).toMatch(/^[a-z]+_[a-z]+(_[a-z]+)*$/);
      \});
    \});

    it('should have valid input schemas', () => \{
      TOOL_DEFINITIONS.forEach(tool => \{
        expect(tool.inputSchema).toBeDefined();
        expect(tool.inputSchema.type).toBe('object');
        expect(tool.inputSchema.properties).toBeDefined();
      \});
    \});
  \});

  describe('Tool Execution', () => \{
    it('should execute tools without errors', async () => \{
      const testCases = [
        \{ tool: '\{prefix\}_get_chain_info', args: \{\} \},
        \{ tool: '\{prefix\}_validate_address', args: \{ address: 'test-address' \} \},
        \{ tool: '\{prefix\}_help', args: \{\} \}
      ];
      
      for (const \{ tool, args \} of testCases) \{
        const handler = TOOL_HANDLERS[tool];
        expect(handler).toBeDefined();
        
        // Test that handler returns expected format
        const mockClient = \{ /* mock client */ \};
        const result = await handler(args, mockClient);
        
        expect(result).toHaveProperty('content');
        expect(Array.isArray(result.content)).toBe(true);
        expect(result.content[0]).toHaveProperty('type');
        expect(result.content[0]).toHaveProperty('text');
      \}
    \});
  \});
\});
```

### 4. BMCPS v3.0 Compliance Tests

```typescript
// tests/integration/bmcps-compliance.test.ts
import * as fs from 'fs';
import * as path from 'path';

describe('Blockchain MCP Standard v3.0 (BMCPS v3.0) Compliance', () => \{
  describe('Directory Structure', () => \{
    const requiredDirs = [
      'src/tools/core',
      'src/tools/wallet',
      'src/tools/tokens',
      'src/types',
      'src/utils',
      'src/config'
    ];
    
    requiredDirs.forEach(dir => \{
      it(`should have $\{dir\} directory`, () => \{
        const dirPath = path.join(process.cwd(), dir);
        expect(fs.existsSync(dirPath)).toBe(true);
      \});
    \});
  \});

  describe('Code Organization', () => \{
    it('should have modular tool files', () => \{
      const toolsDir = path.join(process.cwd(), 'src/tools/core');
      const files = fs.readdirSync(toolsDir);
      
      // Should have individual tool files, not monolithic
      expect(files.length).toBeGreaterThan(5);
      
      files.forEach(file => \{
        expect(file).toMatch(/^[a-z-]+\.ts$/);
      \});
    \});

    it('should have client abstraction', () => \{
      const clientPath = path.join(process.cwd(), 'src/client.ts');
      expect(fs.existsSync(clientPath)).toBe(true);
    \});

    it('index.ts should be under 500 lines', () => \{
      const indexPath = path.join(process.cwd(), 'src/index.ts');
      const content = fs.readFileSync(indexPath, 'utf-8');
      const lines = content.split('\n').length;
      
      expect(lines).toBeLessThan(500);
    \});
  \});

  describe('Tool Naming', () => \{
    it('should use handle prefix for all handlers', async () => \{
      const \{ TOOL_HANDLERS \} = await import('../../src/tools');
      
      Object.values(TOOL_HANDLERS).forEach(handler => \{
        expect(handler.name).toMatch(/^handle[A-Z]/);
      \});
    \});
  \});

  describe('Error Handling', () => \{
    it('should use McpError for all errors', async () => \{
      const toolFile = fs.readFileSync(
        path.join(process.cwd(), 'src/tools/core/\{prefix\}-get-balance.ts'),
        'utf-8'
      );
      
      expect(toolFile).toContain('McpError');
      expect(toolFile).toContain('ErrorCode');
      expect(toolFile).not.toContain('console.log');
      expect(toolFile).not.toContain('console.error');
    \});
  \});
\});
```

---

## Validation Scripts

### Pre-flight Checklist Script

```bash
#!/bin/bash
# validate-preflight.sh

echo "🚀 Blockchain MCP Standard v3.0 (BMCPS v3.0) Pre-flight Checklist"
echo "=================================="

# Environment checks
echo "✓ Checking environment..."
node_version=$(node -v)
if [[ $node_version == v18* ]] || [[ $node_version == v20* ]]; then
  echo "  ✓ Node.js $node_version"
else
  echo "  ✗ Node.js version must be 18+"
  exit 1
fi

# Dependencies check
echo "✓ Checking dependencies..."
if [ -f "package-lock.json" ]; then
  echo "  ✓ Dependencies locked"
else
  echo "  ⚠ No package-lock.json found"
fi

# TypeScript build
echo "✓ Building TypeScript..."
if npm run build > /dev/null 2>&1; then
  echo "  ✓ TypeScript builds successfully"
else
  echo "  ✗ TypeScript build failed"
  exit 1
fi

# Test execution
echo "✓ Running tests..."
if npm test > /dev/null 2>&1; then
  echo "  ✓ Tests pass"
else
  echo "  ✗ Tests failed"
  exit 1
fi

# Tool count validation
echo "✓ Validating tools..."
tool_count=$(grep -c '"name"' src/tools/index.ts 2>/dev/null || echo "0")
if [ "$tool_count" -ge "25" ]; then
  echo "  ✓ $tool_count tools found (≥25 required)"
else
  echo "  ✗ Only $tool_count tools found (25 required)"
  exit 1
fi

echo "=================================="
echo "✅ All pre-flight checks passed!"
```

### Server Startup Validation

```bash
#!/bin/bash
# validate-startup.sh

echo "🔍 Server Startup Validation"
echo "============================"

# Start server in background
timeout 5 npm run start > startup.log 2>&1 &
SERVER_PID=$!

sleep 2

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
  echo "✓ Server started successfully"
  
  # Check for error output
  if grep -q "error\|Error\|ERROR" startup.log; then
    echo "⚠ Errors detected during startup:"
    grep -i error startup.log
  else
    echo "✓ No errors during startup"
  fi
  
  # Kill the server
  kill $SERVER_PID 2>/dev/null
else
  echo "✗ Server failed to start"
  cat startup.log
  exit 1
fi

# Test with MCP Inspector
echo "✓ Testing with MCP Inspector..."
timeout 10 npx @modelcontextprotocol/inspector node dist/index.js > inspector.log 2>&1 &
INSPECTOR_PID=$!

sleep 3

if ps -p $INSPECTOR_PID > /dev/null; then
  echo "✓ MCP Inspector connection successful"
  kill $INSPECTOR_PID 2>/dev/null
else
  echo "✗ MCP Inspector connection failed"
  exit 1
fi

echo "============================"
echo "✅ Server startup validated!"
```

---

## Performance Testing

### Load Testing Suite

```typescript
// tests/performance/load.test.ts
describe('Performance Tests', () => \{
  it('should handle 100 concurrent tool calls', async () => \{
    const promises = [];
    
    for (let i = 0; i < 100; i++) \{
      promises.push(
        handleGetChainInfo(\{\}, mockClient)
      );
    \}
    
    const start = Date.now();
    await Promise.all(promises);
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(5000); // Should complete in 5 seconds
  \});

  it('should maintain memory usage under load', async () => \{
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Execute 1000 tool calls
    for (let i = 0; i < 1000; i++) \{
      await handleGetBalance(
        \{ address: 'test-address' \},
        mockClient
      );
    \}
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB
    
    expect(memoryIncrease).toBeLessThan(100); // Less than 100MB increase
  \});
\});
```

---

## Test Coverage Requirements

### Minimum Coverage Targets (Production Standards)

- **Lines**: 95%
- **Functions**: 95%
- **Branches**: 90%
- **Statements**: 95%

### Critical Path Coverage (Must be 100%)
- All Blockchain MCP Standard v3.0 (BMCPS v3.0) core tools (25 tools)
- Error handling paths
- Network failure scenarios
- Input validation logic
- Security-sensitive operations

### Coverage Report Generation

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html

# Check coverage thresholds
npm run test:coverage -- --coverageThreshold='\{"global":\{"lines":80\}\}'
```

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js $\{\{ matrix.node-version \}\}
      uses: actions/setup-node@v3
      with:
        node-version: $\{\{ matrix.node-version \}\}
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Run tests
      run: npm test
    
    - name: Coverage
      run: npm run test:coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info
    
    - name: Validate BMCPS v3.0 compliance
      run: ./scripts/validate-bmcps.sh
```

---

## Security Testing (Mandatory)

### Input Validation Tests

```typescript
// tests/security/input-validation.test.ts
describe('Security: Input Validation', () => \{
  describe('Address Validation', () => \{
    const maliciousInputs = [
      '0x0000000000000000000000000000000000000000', // Zero address
      '<script>alert("xss")</script>', // XSS attempt
      '"; DROP TABLE users; --', // SQL injection
      '../../../etc/passwd', // Path traversal
      '0x' + 'f'.repeat(100), // Overflow attempt
      '\x00\x01\x02', // Null bytes
      '$\{7*7\}', // Template injection
      '\{\{7*7\}\}', // Template injection variant
    ];
    
    maliciousInputs.forEach(input => \{
      it(`should reject malicious input: $\{input.substring(0, 20)\}...`, async () => \{
        await expect(
          handleValidateAddress(\{ address: input \}, mockClient)
        ).rejects.toThrow();
      \});
    \});
  \});

  describe('Transaction Amount Validation', () => \{
    it('should reject negative amounts', async () => \{
      await expect(
        handleSendTransaction(\{ amount: -1 \}, mockClient)
      ).rejects.toThrow('Invalid amount');
    \});

    it('should reject amounts exceeding MAX_SAFE_INTEGER', async () => \{
      await expect(
        handleSendTransaction(\{ amount: Number.MAX_SAFE_INTEGER + 1 \}, mockClient)
      ).rejects.toThrow('Amount exceeds safe range');
    \});

    it('should reject non-numeric amounts', async () => \{
      await expect(
        handleSendTransaction(\{ amount: 'abc' \}, mockClient)
      ).rejects.toThrow('Amount must be numeric');
    \});
  \});

  describe('Rate Limiting', () => \{
    it('should enforce rate limits on rapid calls', async () => \{
      const promises = [];
      for (let i = 0; i < 100; i++) \{
        promises.push(handleGetBalance(\{ address: 'test' \}, mockClient));
      \}
      
      const results = await Promise.allSettled(promises);
      const rateLimited = results.filter(r => 
        r.status === 'rejected' && 
        r.reason.message.includes('rate limit')
      );
      
      expect(rateLimited.length).toBeGreaterThan(0);
    \});
  \});
\});
```

### Network Security Tests

```typescript
// tests/security/network.test.ts
describe('Security: Network Protection', () => \{
  it('should not expose sensitive RPC URLs', async () => \{
    const result = await handleGetChainInfo(\{\}, mockClient);
    const text = result.content[0].text;
    
    expect(text).not.toContain('api-key');
    expect(text).not.toContain('secret');
    expect(text).not.toContain(process.env.RPC_API_KEY);
  \});

  it('should timeout on slow network responses', async () => \{
    const slowClient = \{
      provider: \{
        getBalance: () => new Promise(resolve => setTimeout(resolve, 10000))
      \}
    \};
    
    await expect(
      handleGetBalance(\{ address: 'test' \}, slowClient)
    ).rejects.toThrow('Request timeout');
  \});

  it('should validate SSL certificates', async () => \{
    const insecureClient = new Client(\{ 
      url: 'https://self-signed.badssl.com/',
      rejectUnauthorized: false 
    \});
    
    await expect(
      insecureClient.connect()
    ).rejects.toThrow('SSL certificate');
  \});
\});
```

## Chaos Engineering Tests

### Fault Injection Testing

```typescript
// tests/chaos/fault-injection.test.ts
describe('Chaos: Fault Tolerance', () => \{
  it('should handle random network failures', async () => \{
    const chaosClient = \{
      provider: \{
        getBalance: jest.fn().mockImplementation(() => \{
          if (Math.random() < 0.3) \{ // 30% failure rate
            throw new Error('Network unreachable');
          \}
          return BigInt(1000000000000000000);
        \})
      \}
    \};
    
    const results = [];
    for (let i = 0; i < 100; i++) \{
      try \{
        const result = await handleGetBalance(
          \{ address: 'test' \}, 
          chaosClient
        );
        results.push(result);
      \} catch (error) \{
        results.push(error);
      \}
    \}
    
    // Should have both successes and failures
    const successes = results.filter(r => !r.message);
    const failures = results.filter(r => r.message);
    
    expect(successes.length).toBeGreaterThan(0);
    expect(failures.length).toBeGreaterThan(0);
    
    // All failures should be handled gracefully
    failures.forEach(error => \{
      expect(error.message).toContain('Failed to get balance');
    \});
  \});

  it('should recover from provider disconnection', async () => \{
    let connected = true;
    const unstableClient = \{
      provider: \{
        getBalance: jest.fn().mockImplementation(() => \{
          if (!connected) throw new Error('Provider disconnected');
          return BigInt(1000000000000000000);
        \})
      \},
      reconnect: jest.fn().mockImplementation(() => \{
        connected = true;
      \})
    \};
    
    // Disconnect provider
    connected = false;
    
    // First call should fail
    await expect(
      handleGetBalance(\{ address: 'test' \}, unstableClient)
    ).rejects.toThrow();
    
    // Should attempt reconnection
    expect(unstableClient.reconnect).toHaveBeenCalled();
  \});
\});
```

## Regression Testing Suite

### Historical Bug Prevention

```typescript
// tests/regression/historical-bugs.test.ts
describe('Regression: Historical Bugs', () => \{
  // Document each fixed bug to prevent regression
  
  it('should handle BigInt serialization correctly (Bug #123)', async () => \{
    // Previously failed with: TypeError: Do not know how to serialize a BigInt
    const result = await handleGetBalance(
      \{ address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' \},
      mockClient
    );
    
    const parsed = JSON.parse(result.content[0].text);
    expect(typeof parsed.balance).toBe('string');
    expect(parsed.balance).toMatch(/^\d+$/);
  \});

  it('should not hang on XRPL client initialization (Bug #456)', async () => \{
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Initialization timeout')), 5000)
    );
    
    const initPromise = initializeXRPLClient();
    
    await expect(
      Promise.race([initPromise, timeoutPromise])
    ).resolves.not.toThrow();
  \});

  it('should handle invalid test addresses gracefully (Bug #789)', async () => \{
    // Previously used invalid address in tests
    const validTestAddress = 'rB7ASwFaJ2ryXUDUN8ViiVWba1ikXcqFxB';
    
    const result = await handleValidateAddress(
      \{ address: validTestAddress \},
      mockClient
    );
    
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.valid).toBe(true);
  \});
\});
```

## Mutation Testing

### Code Mutation Verification

```typescript
// tests/mutation/mutation.test.ts
describe('Mutation Testing', () => \{
  it('should catch mutations in critical logic', () => \{
    // Test that changing operators breaks tests
    const originalCode = `if (amount > 0)`;
    const mutations = [
      `if (amount >= 0)`, // Boundary mutation
      `if (amount < 0)`,  // Operator mutation
      `if (amount == 0)`, // Equality mutation
    ];
    
    mutations.forEach(mutation => \{
      // Each mutation should cause test failure
      expect(() => \{
        // Run test suite with mutated code
      \}).toThrow();
    \});
  \});
\});
```

## Contract Testing

### API Contract Validation

```typescript
// tests/contract/api-contract.test.ts
describe('API Contract Testing', () => \{
  const schemaValidator = new Ajv();
  
  it('should maintain backward compatibility', async () => \{
    const v1Response = await handleGetBalanceV1(\{ address: 'test' \}, mockClient);
    const v2Response = await handleGetBalance(\{ address: 'test' \}, mockClient);
    
    // V2 should include all V1 fields
    const v1Fields = Object.keys(JSON.parse(v1Response.content[0].text));
    const v2Fields = Object.keys(JSON.parse(v2Response.content[0].text));
    
    v1Fields.forEach(field => \{
      expect(v2Fields).toContain(field);
    \});
  \});

  it('should validate response schemas', async () => \{
    const schema = \{
      type: 'object',
      properties: \{
        address: \{ type: 'string' \},
        balance: \{ type: 'string' \},
        formatted: \{ type: 'string' \}
      \},
      required: ['address', 'balance', 'formatted']
    \};
    
    const result = await handleGetBalance(
      \{ address: 'test' \},
      mockClient
    );
    
    const data = JSON.parse(result.content[0].text);
    const valid = schemaValidator.validate(schema, data);
    
    expect(valid).toBe(true);
  \});
\});
```

## Stress Testing

### High Load Scenarios

```typescript
// tests/stress/load.test.ts
describe('Stress Testing', () => \{
  it('should handle 1000 concurrent connections', async () => \{
    const connections = [];
    
    for (let i = 0; i < 1000; i++) \{
      connections.push(createClient());
    \}
    
    const results = await Promise.allSettled(
      connections.map(client => client.connect())
    );
    
    const successful = results.filter(r => r.status === 'fulfilled');
    expect(successful.length).toBeGreaterThan(950); // 95% success rate
  \});

  it('should not leak memory under sustained load', async () => \{
    const initialMemory = process.memoryUsage().heapUsed;
    
    for (let cycle = 0; cycle < 10; cycle++) \{
      // Execute 10,000 operations
      for (let i = 0; i < 10000; i++) \{
        await handleGetChainInfo(\{\}, mockClient);
      \}
      
      // Force garbage collection
      if (global.gc) global.gc();
      
      const currentMemory = process.memoryUsage().heapUsed;
      const memoryGrowth = (currentMemory - initialMemory) / 1024 / 1024;
      
      // Memory should not grow more than 50MB per cycle
      expect(memoryGrowth / (cycle + 1)).toBeLessThan(50);
    \}
  \});
\});
```

## UAT (User Acceptance Testing)

### Rigorous Manual Testing Checklist

1. **Server Startup**
   - [ ] Server starts without errors
   - [ ] Correct network displayed
   - [ ] Tool count matches documentation

2. **Core Tools Testing**
   - [ ] `get_chain_info` returns network data
   - [ ] `get_balance` works with valid address
   - [ ] `validate_address` correctly validates
   - [ ] `help` displays all tools
   - [ ] `search_tools` finds tools by keyword

3. **Error Handling**
   - [ ] Invalid addresses return clear errors
   - [ ] Network timeouts handled gracefully
   - [ ] Missing parameters caught with validation

4. **Performance**
   - [ ] Tools respond within 2 seconds
   - [ ] No memory leaks during extended use
   - [ ] Handles rapid successive calls

5. **Documentation**
   - [ ] README lists all tools
   - [ ] Tool descriptions are clear
   - [ ] Examples work as documented

---

## Common Test Issues & Solutions

### Issue: Import path errors in tests
```typescript
// Wrong
import \{ handler \} from '../src/tools/core/tool';

// Correct
import \{ handler \} from '../src/tools/core/tool.js';
```

### Issue: Jest cannot find modules
```javascript
// Add to jest.config.js
moduleNameMapper: \{
  '^(\\.\{1,2\}/.*)\\.js$': '$1'
\}
```

### Issue: Async tests timing out
```typescript
// Increase timeout for slow operations
jest.setTimeout(10000); // 10 seconds

it('should handle slow operation', async () => \{
  // test code
\}, 10000);
```

### Issue: Mock client not working
```typescript
// Create proper mock client
const mockClient = \{
  provider: \{
    getBalance: jest.fn().mockResolvedValue(BigInt(1000000000000000000)),
    getBlockNumber: jest.fn().mockResolvedValue(12345),
    // ... other mocked methods
  \},
  isHealthy: jest.fn().mockResolvedValue(true)
\};
```

---

## Test Reporting

### Console Output Format
```
 PASS  tests/unit/core/get-balance.test.ts
 PASS  tests/unit/core/get-chain-info.test.ts
 PASS  tests/integration/tools.test.ts
 PASS  tests/integration/mbss-compliance.test.ts
 PASS  tests/smoke/server-startup.test.ts

Test Suites: 5 passed, 5 total
Tests:       47 passed, 47 total
Snapshots:   0 total
Time:        4.123 s
Coverage:    85.3% lines, 82.1% functions
```

---

## Summary

This comprehensive testing standard ensures:
- ✅ **Quality**: 80%+ code coverage
- ✅ **Reliability**: All tools tested
- ✅ **Compliance**: Blockchain MCP Standard v3.0 (BMCPS v3.0) validated
- ✅ **Performance**: Load testing included
- ✅ **Automation**: CI/CD ready
- ✅ **Documentation**: Clear test structure

Follow this standard to achieve production-ready blockchain MCP servers with confidence.

---

**Test early. Test often. Ship with confidence.**
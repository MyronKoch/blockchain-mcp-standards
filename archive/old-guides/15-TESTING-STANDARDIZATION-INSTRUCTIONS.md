# Testing Standardization Instructions for Blockchain MCP Servers

## Objective
Standardize testing across all 15 testnet and 17 mainnet blockchain MCP servers using Jest with TypeScript support.

## Current State Analysis
Based on package.json review:
- **Have Jest configured**: bitcoin-testnet, osmosis-testnet (partially)
- **No testing setup**: Most other servers
- **Inconsistent approaches**: Some have test scripts but no actual tests

## Standard to Implement

### 1. Dependencies to Add
Add to `devDependencies` in each server's package.json:
```json
{
  "jest": "^29.7.0",
  "ts-jest": "^29.1.5",
  "@types/jest": "^29.5.12",
  "ts-node": "^10.9.2"
}
```

### 2. Jest Configuration
Create `jest.config.js` in each server root:
```javascript
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
    }]
  }
};
```

### 3. Test Directory Structure
Create for each server:
```
tests/
├── unit/
│   ├── utils.test.ts      # Test utility functions
│   └── types.test.ts      # Test type validations
├── integration/
│   ├── tools.test.ts      # Test tool handlers
│   └── client.test.ts     # Test API clients
└── smoke.test.ts          # Basic smoke test
```

### 4. Baseline Smoke Test
Create `tests/smoke.test.ts` for each server:
```typescript
describe('[ServerName] MCP Server', () => {
  it('should load without errors', () => {
    expect(() => {
      require('../src/index');
    }).not.toThrow();
  });

  it('should export expected MCP server structure', async () => {
    const serverModule = await import('../src/index');
    expect(serverModule).toBeDefined();
    // Add server-specific checks based on structure
  });
});
```

### 5. Tool Testing Template
Create `tests/integration/tools.test.ts`:
```typescript
import { describe, it, expect, jest } from '@jest/globals';

describe('Tool Registration', () => {
  it('should register all documented tools', async () => {
    // Import and check tool count matches README
    const tools = await import('../src/index');
    // Server-specific tool count from README
    const EXPECTED_TOOL_COUNT = XX; // Fill from README
    expect(tools.length).toBe(EXPECTED_TOOL_COUNT);
  });

  it('should follow naming convention', async () => {
    // Check all tools follow prefix pattern (btc_, eth_, sol_, etc.)
    const tools = await import('../src/index');
    const PREFIX = 'xxx_'; // Server-specific prefix
    tools.forEach(tool => {
      expect(tool.name).toMatch(new RegExp(`^${PREFIX}`));
    });
  });
});
```

### 6. Package.json Scripts
Update scripts section:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:verbose": "jest --verbose"
  }
}
```

## Implementation Order

### Phase 1: High-Priority Servers (Most Tools)
1. **bitcoin-testnet** (94 tools) - Has Jest, needs tests
2. **solana-testnet** (50 tools) - No testing
3. **avalanche-testnet** (39 tools) - No testing
4. **near-testnet** (37 tools) - No testing
5. **bsc-testnet** (37 tools) - No testing

### Phase 2: Medium-Priority Servers
6. **ethereum-sepolia** (30 tools)
7. **polygon-amoy** (30 tools)
8. **worldchain-testnet** (27 tools)
9. **arbitrum-sepolia** (25 tools)
10. **base-sepolia** (24 tools)

### Phase 3: Smaller Servers
11. **tron-testnet** (20 tools)
12. **sui-testnet** (20 tools)
13. **xrp-testnet** (39 tools)
14. **cosmos-theta** (20 tools)

### Phase 4: Special Case
15. **osmosis-testnet** (119 tools) - Already has some testing

## Verification Checklist
For each server, verify:
- [ ] Jest and ts-jest installed
- [ ] jest.config.js created
- [ ] tests/ directory structure created
- [ ] Smoke test passes
- [ ] `npm test` runs successfully
- [ ] Tool count test matches README

## Special Considerations

### For Servers with Existing Tests
- Preserve any existing test files
- Integrate them into the new structure
- Ensure backward compatibility

### For Single-File Servers
Servers with everything in one index.ts file (like Bitcoin):
- Focus on integration tests
- Test tool handlers directly
- Consider suggesting refactoring in comments

### For Modular Servers
Servers with organized tool directories (like Osmosis):
- Create unit tests for each tool file
- Test individual tool functions
- Higher coverage targets possible

## Expected Outcomes
1. All servers can run `npm test` successfully
2. Minimum smoke test coverage for all servers
3. Consistent testing approach across ecosystem
4. Foundation for future test expansion

## Notes for Implementation
- Start with smoke tests to ensure basic functionality
- Don't break existing functionality
- Comment any servers that have unique testing needs
- Create a summary report of test coverage per server

## Questions to Consider
- Should we enforce minimum coverage thresholds?
- Do we want GitHub Actions CI/CD for testing?
- Should mainnet servers mirror testnet test structure?

---
Generated for delegation to another AI assistant for implementation.
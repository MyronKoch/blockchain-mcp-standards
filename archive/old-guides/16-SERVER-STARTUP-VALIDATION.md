# Server Startup Validation Checklist

## Overview
This document provides a comprehensive validation process for MCP blockchain servers before deployment. Following this checklist ensures servers meet MBPS v2.1 standards and function correctly with AI clients.

## Pre-Deployment Validation

### 1. Build Validation ✅

#### TypeScript Compilation
```bash
# Clean build
rm -rf dist/ build/
npm run build

# Expected output
✅ No TypeScript errors
✅ Output directory created (dist/ or build/)
✅ Source maps generated
```

#### Build Artifacts Check
```bash
# Verify essential files
ls -la dist/index.js       # Main entry point
ls -la dist/tools/          # Modular tools directory
ls -la dist/**/*.d.ts       # TypeScript definitions
```

### 2. STDIO Protocol Compliance ✅

#### Console Output Test
```bash
# Test for spurious console output
echo '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"0.1.0","capabilities":{}},"id":1}' | node dist/index.js 2>/tmp/stderr.log

# Validate clean stderr
if [ -s /tmp/stderr.log ]; then
  echo "❌ FAIL: Console output detected"
  cat /tmp/stderr.log
else
  echo "✅ PASS: STDIO is clean"
fi
```

#### Error Handling Test
```bash
# Test error reporting (should only log actual errors)
echo 'invalid json' | node dist/index.js 2>&1 | grep -q "error"
echo "✅ Error handling works"
```

### 3. Tool Registration Validation ✅

#### MBPS v2.1 Compliance
```bash
# Run MCP Inspector
npm run inspect

# Verify minimum 25 required tools:
- [ ] {prefix}_get_chain_info
- [ ] {prefix}_get_balance
- [ ] {prefix}_get_transaction
- [ ] {prefix}_get_block
- [ ] {prefix}_validate_address
- [ ] {prefix}_get_transaction_history
- [ ] {prefix}_create_wallet
- [ ] {prefix}_help
- [ ] {prefix}_search_tools
- [ ] {prefix}_list_tools_by_category
- [ ] {prefix}_send_transaction
- [ ] {prefix}_get_network_info
- [ ] {prefix}_set_network
- [ ] {prefix}_get_gas_price
- [ ] {prefix}_get_mempool_info
- [ ] {prefix}_estimate_fees
- [ ] {prefix}_import_wallet
- [ ] {prefix}_get_wallet_info
- [ ] {prefix}_get_account_info
- [ ] {prefix}_generate_address
- [ ] {prefix}_get_token_balance
- [ ] {prefix}_get_token_info
- [ ] {prefix}_transfer_token
- [ ] {prefix}_approve_token
- [ ] {prefix}_get_token_allowance
```

#### Tool Count Verification
```typescript
// Test script: verify-tools.ts
import { toolDefinitions } from './dist/tools';

const requiredCount = 25; // MBPS v2.1 minimum
const actualCount = toolDefinitions.length;

console.log(`Tool count: ${actualCount}`);
console.log(`MBPS compliance: ${actualCount >= requiredCount ? '✅' : '❌'}`);
```

### 4. Network Configuration ✅

#### Environment Variables
```bash
# Test network switching
NETWORK=mainnet node dist/index.js &
NETWORK=testnet node dist/index.js &

# Verify correct endpoints
grep -r "rpc.*url" dist/
```

#### Connection Testing
```javascript
// test-connection.js
const { Connection } = require('./dist/client');

async function testConnection() {
  const networks = ['mainnet', 'testnet'];
  
  for (const network of networks) {
    process.env.NETWORK = network;
    const client = new Connection();
    
    try {
      await client.getBlockHeight();
      console.log(`✅ ${network}: Connected`);
    } catch (error) {
      console.log(`❌ ${network}: Failed - ${error.message}`);
    }
  }
}
```

### 5. Help System Validation ✅

#### Help Command Test
```bash
# Test help tool via MCP Inspector
echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"{prefix}_help","arguments":{}},"id":1}' | node dist/index.js

# Verify response includes:
- [ ] Server description
- [ ] Available categories
- [ ] Tool count
- [ ] Usage examples
```

#### Tool Discovery Test
```bash
# Search tools
echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"{prefix}_search_tools","arguments":{"query":"balance"}},"id":1}' | node dist/index.js

# List by category
echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"{prefix}_list_tools_by_category","arguments":{"category":"core"}},"id":1}' | node dist/index.js
```

## Integration Testing

### 6. MCP Inspector Testing ✅

```bash
# Launch inspector
npm run inspect

# Manual test checklist:
- [ ] Server connects without errors
- [ ] All tools appear in tool list
- [ ] Core tools execute successfully
- [ ] Error messages are informative
- [ ] No timeout issues
```

### 7. Claude Desktop Integration ✅

#### Configuration Test
```json
// claude_desktop_config.json
{
  "mcpServers": {
    "test-server": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
      "env": {
        "NETWORK": "testnet"
      }
    }
  }
}
```

#### Validation Steps
1. Add server to config
2. Restart Claude Desktop
3. Verify server appears in MCP menu
4. Test basic commands
5. Check error handling

### 8. Performance Validation ✅

#### Startup Time
```bash
# Measure startup time
time echo '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}' | node dist/index.js

# Expected: < 2 seconds
```

#### Memory Usage
```bash
# Monitor memory
node --expose-gc --max-old-space-size=512 dist/index.js &
PID=$!
ps aux | grep $PID | awk '{print $6}'  # RSS in KB

# Expected: < 200MB initial
```

#### Tool Response Time
```bash
# Measure tool execution
time echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"{prefix}_get_chain_info","arguments":{}},"id":1}' | node dist/index.js

# Expected: < 3 seconds for network calls
```

## Test Automation

### 9. Automated Test Suite ✅

#### Unit Tests
```bash
npm test

# Expected coverage:
- [ ] > 80% code coverage
- [ ] All tools have tests
- [ ] Error cases tested
```

#### Integration Tests
```bash
npm run test:integration

# Verify:
- [ ] Network connectivity
- [ ] Tool execution
- [ ] Error handling
- [ ] Help system
```

#### Smoke Tests
```bash
npm run test:smoke

# Quick validation:
- [ ] Server starts
- [ ] Tools load
- [ ] No import errors
```

## Validation Report Template

```markdown
## Server Validation Report

**Server**: [Name]
**Version**: [Version]
**Date**: [Date]
**Validator**: [Name]

### Build Status
- [ ] TypeScript compilation: ✅/❌
- [ ] Build artifacts present: ✅/❌
- [ ] No console.error in run(): ✅/❌

### MBPS v2.1 Compliance
- [ ] 25 core tools present: ✅/❌
- [ ] Tool naming convention: ✅/❌
- [ ] Help system functional: ✅/❌

### Testing Results
- [ ] Unit tests passing: [X/Y]
- [ ] Integration tests: [X/Y]
- [ ] Smoke tests: ✅/❌

### Performance Metrics
- Startup time: [X]ms
- Memory usage: [X]MB
- Tool response: [X]ms avg

### Issues Found
1. [Issue description]
2. [Issue description]

### Recommendation
[ ] Ready for deployment
[ ] Requires fixes
[ ] Major refactoring needed
```

## Common Issues and Solutions

### Issue: Server hangs on startup
**Solution**: Check for console output in run() method

### Issue: Tools not appearing
**Solution**: Verify tool registration in setupToolHandlers()

### Issue: Network connection fails
**Solution**: Check RPC endpoints and environment variables

### Issue: TypeScript compilation errors
**Solution**: Ensure all dependencies installed, check tsconfig.json

### Issue: High memory usage
**Solution**: Review connection pooling, implement cleanup

## CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Server Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
      
      - name: Build server
        run: npm run build
      
      - name: Check STDIO compliance
        run: npm run test:stdio
      
      - name: Validate tools
        run: npm run validate:tools
      
      - name: Run tests
        run: npm test
      
      - name: Performance check
        run: npm run test:performance
      
      - name: Generate report
        run: npm run report:validation
```

## References

- MBPS v2.1 Comprehensive: ./MBPS-v2.1-COMPREHENSIVE.md
- STDIO Protocol Guidelines: ./STDIO-PROTOCOL-GUIDELINES.md
- Tool Naming Conventions: ./TOOL-NAMING-CONVENTIONS.md
- Testing Standards: ./TESTING-STANDARDIZATION-INSTRUCTIONS.md

---

**Last Updated**: September 2024
**Version**: 1.0.0
**Status**: Active Standard
**Required**: Before all deployments
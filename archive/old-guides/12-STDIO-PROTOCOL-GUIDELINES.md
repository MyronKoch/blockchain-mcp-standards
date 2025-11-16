# STDIO Protocol Guidelines for MCP Servers

## Overview
This document defines the standards for proper stdio (standard input/output) communication in MCP (Model Context Protocol) servers. Violations of these guidelines will cause server failures and communication breakdowns with AI clients.

## Critical Requirements

### 1. No Console Output in Production Code
**NEVER** write to stdout or stderr in production server code, except for error handling in catch blocks.

#### ❌ INCORRECT - Breaks MCP Protocol
```typescript
async run() {
  const transport = new StdioServerTransport();
  await this.server.connect(transport);
  console.error('Server running on stdio');  // BREAKS MCP PROTOCOL!
  console.log('Connected to network');       // BREAKS MCP PROTOCOL!
}
```

#### ✅ CORRECT - Clean stdio communication
```typescript
async run() {
  const transport = new StdioServerTransport();
  await this.server.connect(transport);
  // No console output - stdio must remain clean for MCP protocol
}
```

### 2. Error Handling Best Practices

#### Allowed Console Usage
Console output is ONLY permitted in error catch blocks:

```typescript
async run() {
  try {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  } catch (error) {
    console.error('Failed to start server:', error);  // ✅ Acceptable
    process.exit(1);
  }
}
```

### 3. Debugging During Development

#### Development-Only Logging
Use environment variables for debug logging:

```typescript
if (process.env.DEBUG === 'true') {
  console.error('[DEBUG] Server initialized');  // Only in debug mode
}
```

#### Alternative: File-Based Logging
For production debugging, write to log files instead:

```typescript
import fs from 'fs';

function debugLog(message: string) {
  if (process.env.LOG_FILE) {
    fs.appendFileSync(process.env.LOG_FILE, `${new Date().toISOString()} - ${message}\n`);
  }
}
```

## Common Violations and Fixes

### Issue 1: Status Messages
**Problem**: Servers outputting "Server running" messages
**Solution**: Remove all status console outputs

### Issue 2: Connection Confirmations  
**Problem**: "Connected to [network]" messages
**Solution**: Silent connection, only report errors

### Issue 3: Shutdown Messages
**Problem**: "Server shutting down" notifications
**Solution**: Silent shutdown, use exit codes for status

## Validation Checklist

Before deploying any MCP server:

- [ ] Search for all `console.log` statements - remove or guard with DEBUG flag
- [ ] Search for all `console.error` statements - keep ONLY in catch blocks
- [ ] Test with MCP Inspector - no spurious output should appear
- [ ] Run server via stdio - verify clean protocol communication
- [ ] Check all initialization code for console statements
- [ ] Review shutdown handlers for console output

## Testing for STDIO Compliance

### Quick Test Script
```bash
# Test server stdio compliance
echo '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"0.1.0","capabilities":{}},"id":1}' | node dist/index.js 2>/tmp/stderr.log

# Check for clean stderr (should be empty or only contain actual errors)
if [ -s /tmp/stderr.log ]; then
  echo "❌ Server has console output:"
  cat /tmp/stderr.log
else
  echo "✅ Server stdio is clean"
fi
```

## Migration Guide

For existing servers with console output:

1. **Identify all console statements**:
   ```bash
   grep -r "console\.\(log\|error\)" src/
   ```

2. **Remove or comment status messages**:
   ```typescript
   // console.error('Server running on stdio');  // Removed for STDIO compliance
   ```

3. **Keep error handling**:
   ```typescript
   } catch (error) {
     console.error('Server error:', error);  // Keep this
   }
   ```

4. **Rebuild and test**:
   ```bash
   npm run build
   npm run inspect  # Test with MCP Inspector
   ```

## References

- MCP Protocol Specification: https://modelcontextprotocol.io/docs
- StdioServerTransport Documentation
- MBPS v2.1 Standards: ./MBPS-v2.1-COMPREHENSIVE.md

---

**Last Updated**: September 2024
**Version**: 1.0.0
**Status**: Active Standard
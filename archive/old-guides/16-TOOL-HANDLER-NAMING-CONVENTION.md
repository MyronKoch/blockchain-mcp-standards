# Tool Handler Naming Convention Standard for MCP Servers

## Purpose
This document establishes the mandatory naming conventions for tool handler functions across all blockchain MCP servers to ensure consistency, maintainability, and seamless integration.

## The Problem We're Solving
When multiple developers work on MCP tools, inconsistent naming conventions can cause:
- TypeScript compilation errors
- Import/export mismatches
- Integration failures
- Testing difficulties
- Maintenance confusion

## Mandatory Naming Convention

### 1. Handler Function Pattern
**ALL tool handler functions MUST follow this exact pattern:**

```typescript
export async function handle{ToolName}(
    args: any
): Promise<{ content: Array<{ type: string; text: string }> }> {
    // Implementation
}
```

### 2. Naming Rules

#### Tool File Names
- **Pattern**: `{blockchain}-{tool_name_snake_case}.ts`
- **Example**: `world-get_chain_info.ts`
- **Location**: `src/tools/{category}/`

#### Handler Function Names
- **Pattern**: `handle{ToolNamePascalCase}`
- **Conversion**: Snake_case tool name → PascalCase handler
- **Examples**:
  - `world-get_chain_info.ts` → `handleGetChainInfo`
  - `world-verify_world_id.ts` → `handleVerifyWorldId`
  - `world-get_l1_block_number.ts` → `handleGetL1BlockNumber`

#### Import Statements
```typescript
// ✅ CORRECT
import { handleGetChainInfo } from './core/world-get_chain_info.js';

// ❌ INCORRECT - Don't use these patterns
import { getChainInfo } from './core/world-get_chain_info.js';
import { world_get_chain_info } from './core/world-get_chain_info.js';
```

### 3. Tool Registry Mapping

In `src/tools/index.ts`:

```typescript
export const TOOL_HANDLERS: Record<string, (args: any) => Promise<{ content: Array<{ type: string; text: string }> }>> = {
    // Tool name (snake_case) maps to handler function (PascalCase with 'handle' prefix)
    'world_get_chain_info': handleGetChainInfo,
    'world_verify_world_id': handleVerifyWorldId,
    'world_get_l1_block_number': handleGetL1BlockNumber,
    // ... etc
};
```

## Complete Example

### File: `src/tools/core/world-get_balance.ts`
```typescript
import { ethers } from 'ethers';
import { createSuccessResponse, formatErrorForUser } from '../../shared/common.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';

// ✅ CORRECT: Handler function with proper naming
export async function handleGetBalance(
    args: any
): Promise<{ content: Array<{ type: string; text: string }> }> {
    const { address } = args;
    
    try {
        // Implementation
        const balance = await getBalance(address);
        return createSuccessResponse({ balance });
    } catch (error) {
        throw new McpError(
            ErrorCode.InternalError,
            formatErrorForUser(error)
        );
    }
}

// Internal helper functions can use any naming convention
async function getBalance(address: string): Promise<string> {
    // Implementation
}
```

### File: `src/tools/index.ts`
```typescript
// ✅ CORRECT: Import with handle prefix
import { handleGetBalance } from './core/world-get_balance.js';

export const TOOL_HANDLERS = {
    // ✅ CORRECT: Registry mapping
    'world_get_balance': handleGetBalance,
};
```

### File: `src/tool-definitions.ts`
```typescript
export const TOOL_DEFINITIONS = [
    {
        // ✅ CORRECT: Tool name in snake_case
        name: 'world_get_balance',
        description: 'Get ETH balance for an address',
        inputSchema: {
            type: 'object',
            properties: {
                address: { type: 'string' }
            },
            required: ['address']
        }
    }
];
```

## Common Mistakes to Avoid

### ❌ Mistake 1: Inconsistent Export Names
```typescript
// WRONG - Function name doesn't match pattern
export async function getBalance(args: any) { }
export async function world_get_balance(args: any) { }
export async function WorldGetBalance(args: any) { }
```

### ❌ Mistake 2: Wrong Import Names
```typescript
// WRONG - Importing wrong function name
import { getBalance } from './core/world-get_balance.js';
import { world_get_balance } from './core/world-get_balance.js';
```

### ❌ Mistake 3: Mismatched Registry
```typescript
// WRONG - Handler doesn't match import
import { handleGetBalance } from './core/world-get_balance.js';
export const TOOL_HANDLERS = {
    'world_get_balance': getBalance, // Should be handleGetBalance
};
```

## Validation Checklist

Before committing any new tool:

- [ ] File name follows pattern: `{blockchain}-{tool_name}.ts`
- [ ] Export function named: `handle{ToolNamePascalCase}`
- [ ] Function signature matches exact pattern
- [ ] Import statement uses `handle` prefix
- [ ] Tool registry maps correctly
- [ ] Tool definition name matches registry key
- [ ] TypeScript compilation succeeds
- [ ] Tests pass

## Automated Validation

Add this test to your test suite:

```typescript
describe('Tool Naming Convention', () => {
    it('should follow handler naming pattern', () => {
        Object.entries(TOOL_HANDLERS).forEach(([toolName, handler]) => {
            // Convert snake_case to PascalCase
            const expectedName = 'handle' + toolName
                .split('_')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join('')
                .replace(/^[A-Z]+/, match => match.charAt(0).toUpperCase() + match.slice(1));
            
            expect(handler.name).toBe(expectedName);
        });
    });
});
```

## Migration Guide

If you have existing tools with incorrect naming:

1. **Update the export function name**:
   ```typescript
   // Before
   export async function getChainInfo(args: any) { }
   
   // After
   export async function handleGetChainInfo(args: any) { }
   ```

2. **Update the import statement**:
   ```typescript
   // Before
   import { getChainInfo } from './core/world-get_chain_info.js';
   
   // After
   import { handleGetChainInfo } from './core/world-get_chain_info.js';
   ```

3. **Update the registry**:
   ```typescript
   // Before
   'world_get_chain_info': getChainInfo,
   
   // After
   'world_get_chain_info': handleGetChainInfo,
   ```

## Enforcement

- **Code Reviews**: All PRs must follow this convention
- **CI/CD**: Automated tests verify naming conventions
- **Linting**: ESLint rules enforce patterns
- **Documentation**: This standard is mandatory for all contributors

## Benefits

Following this standard ensures:
- ✅ Consistent codebase across all MCP servers
- ✅ Predictable import/export patterns
- ✅ Easier collaboration between developers
- ✅ Reduced TypeScript compilation errors
- ✅ Simplified testing and mocking
- ✅ Clear separation of concerns

## Summary

**One Rule to Remember:**
> Every tool handler function MUST be named `handle{ToolNamePascalCase}` and follow the exact signature pattern.

This standard is **MANDATORY** for all blockchain MCP server implementations to maintain consistency and prevent integration issues.

---
*Standard Version: 1.0*
*Created: 2025-09-23*
*Status: ACTIVE*
*Applies to: All blockchain MCP servers*
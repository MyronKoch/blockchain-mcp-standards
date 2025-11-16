# Error Handling Patterns for MCP Blockchain Servers

## Overview
Consistent error handling ensures robust, debuggable, and user-friendly MCP servers. This document defines standard patterns for error handling across all blockchain MCP implementations.

## Core Principles

1. **Fail Gracefully** - Never crash the server for recoverable errors
2. **Informative Messages** - Provide actionable error information
3. **Consistent Structure** - Use standardized error formats
4. **Proper Propagation** - Bubble errors appropriately through the stack
5. **User-Friendly** - Translate technical errors for AI consumption

## Error Types and Handling

### 1. Network Errors

#### Pattern
```typescript
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

async function handleNetworkOperation() {
  try {
    const result = await provider.getBlockNumber();
    return result;
  } catch (error) {
    // Identify specific network issues
    if (error.code === 'ECONNREFUSED') {
      throw new McpError(
        ErrorCode.InternalError,
        `Network unavailable: Cannot connect to ${network} RPC endpoint. Please check network status.`
      );
    }
    
    if (error.code === 'ETIMEDOUT') {
      throw new McpError(
        ErrorCode.InternalError,
        `Network timeout: Request to ${network} took too long. Try again or check network congestion.`
      );
    }
    
    // Generic network error
    throw new McpError(
      ErrorCode.InternalError,
      `Network error: ${error.message}. Please verify RPC endpoint configuration.`
    );
  }
}
```

### 2. Validation Errors

#### Pattern
```typescript
function validateAddress(address: string, network: string): void {
  // Chain-specific validation
  if (!address) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Address is required. Please provide a valid blockchain address.'
    );
  }
  
  // Ethereum-like chains
  if (network === 'ethereum' && !ethers.isAddress(address)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Invalid Ethereum address: "${address}". Expected format: 0x... (40 hex characters)`
    );
  }
  
  // Bitcoin
  if (network === 'bitcoin' && !isValidBitcoinAddress(address)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Invalid Bitcoin address: "${address}". Supported formats: P2PKH, P2SH, Bech32`
    );
  }
}
```

### 3. Transaction Errors

#### Pattern
```typescript
async function sendTransaction(params: TransactionParams) {
  try {
    const tx = await signer.sendTransaction(params);
    return tx;
  } catch (error) {
    // Insufficient funds
    if (error.message.includes('insufficient funds')) {
      const balance = await getBalance(params.from);
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Insufficient funds: Account has ${balance} but transaction requires ${params.value}. ` +
        `Please add funds or reduce the transaction amount.`
      );
    }
    
    // Gas estimation failed
    if (error.message.includes('gas required exceeds allowance')) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Gas estimation failed: Transaction may fail. ` +
        `Try manually setting gas limit or check contract interaction.`
      );
    }
    
    // Nonce issues
    if (error.message.includes('nonce')) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Transaction nonce error: ${error.message}. ` +
        `This usually means a pending transaction exists. Wait or cancel it first.`
      );
    }
    
    throw new McpError(
      ErrorCode.InternalError,
      `Transaction failed: ${error.message}`
    );
  }
}
```

### 4. Smart Contract Errors

#### Pattern
```typescript
async function callContract(address: string, method: string, args: any[]) {
  try {
    const result = await contract[method](...args);
    return result;
  } catch (error) {
    // Revert with reason
    if (error.reason) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Contract reverted: ${error.reason}`
      );
    }
    
    // Method not found
    if (error.message.includes('no matching function')) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Contract method "${method}" not found at ${address}. ` +
        `Verify contract ABI and method name.`
      );
    }
    
    // Contract not deployed
    if (error.message.includes('contract not deployed')) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `No contract at address ${address} on ${network}. ` +
        `Verify address and network.`
      );
    }
    
    throw new McpError(
      ErrorCode.InternalError,
      `Contract call failed: ${error.message}`
    );
  }
}
```

## Error Response Format

### Standard MCP Error Structure
```typescript
interface McpErrorResponse {
  jsonrpc: '2.0';
  error: {
    code: number;
    message: string;
    data?: any;
  };
  id: number | string | null;
}
```

### Error Codes (MCP Standard)
```typescript
enum ErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
}
```

## Tool-Level Error Handling

### Tool Handler Pattern
```typescript
async function handleToolCall(name: string, args: any) {
  try {
    // Validate tool exists
    if (!toolHandlers[name]) {
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Tool "${name}" not found. Use ${prefix}_help to see available tools.`
      );
    }
    
    // Validate arguments
    const validation = validateToolArgs(name, args);
    if (!validation.valid) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid arguments for ${name}: ${validation.errors.join(', ')}`
      );
    }
    
    // Execute tool
    const result = await toolHandlers[name](args);
    return result;
    
  } catch (error) {
    // Re-throw MCP errors
    if (error instanceof McpError) {
      throw error;
    }
    
    // Wrap unexpected errors
    console.error(`Unexpected error in ${name}:`, error);
    throw new McpError(
      ErrorCode.InternalError,
      `Tool execution failed: ${error.message}`
    );
  }
}
```

## Recovery Strategies

### 1. Retry with Backoff
```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry validation errors
      if (error instanceof McpError && 
          error.code === ErrorCode.InvalidParams) {
        throw error;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new McpError(
    ErrorCode.InternalError,
    `Operation failed after ${maxRetries} attempts: ${lastError.message}`
  );
}
```

### 2. Fallback Providers
```typescript
class ProviderWithFallback {
  private providers: Provider[];
  private currentIndex: number = 0;
  
  async call(method: string, params: any[]): Promise<any> {
    const startIndex = this.currentIndex;
    
    do {
      try {
        const provider = this.providers[this.currentIndex];
        return await provider[method](...params);
      } catch (error) {
        // Try next provider
        this.currentIndex = (this.currentIndex + 1) % this.providers.length;
        
        // All providers failed
        if (this.currentIndex === startIndex) {
          throw new McpError(
            ErrorCode.InternalError,
            'All RPC providers failed. Network may be down.'
          );
        }
      }
    } while (true);
  }
}
```

### 3. Circuit Breaker
```typescript
class CircuitBreaker {
  private failures: number = 0;
  private lastFailTime: number = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Circuit is open - fail fast
    if (this.state === 'open') {
      const timeSinceLastFail = Date.now() - this.lastFailTime;
      if (timeSinceLastFail < 60000) { // 1 minute timeout
        throw new McpError(
          ErrorCode.InternalError,
          'Service temporarily unavailable. Please try again later.'
        );
      }
      this.state = 'half-open';
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailTime = Date.now();
    
    if (this.failures >= 5) {
      this.state = 'open';
    }
  }
}
```

## Logging Best Practices

### Error Logging Pattern
```typescript
function logError(context: string, error: Error, metadata?: any) {
  // Development logging to file
  if (process.env.LOG_FILE) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      metadata
    };
    
    fs.appendFileSync(
      process.env.LOG_FILE,
      JSON.stringify(logEntry) + '\n'
    );
  }
  
  // Never log to console in production (breaks STDIO)
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}] ${error.message}`, metadata);
  }
}
```

## User-Friendly Error Messages

### Good vs Bad Examples

#### ❌ Bad - Too Technical
```
Error: ECONNREFUSED 127.0.0.1:8545
```

#### ✅ Good - User Friendly
```
Network unavailable: Cannot connect to Ethereum mainnet. 
Please check your internet connection or try again later.
```

#### ❌ Bad - No Context
```
Error: Invalid address
```

#### ✅ Good - Actionable
```
Invalid Ethereum address: "0x123". 
Expected format: 0x followed by 40 hexadecimal characters.
Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb81
```

#### ❌ Bad - Generic
```
Error: Transaction failed
```

#### ✅ Good - Specific
```
Transaction failed: Insufficient funds.
Account balance: 0.5 ETH
Required: 1.2 ETH (including gas)
Please add 0.7 ETH to complete this transaction.
```

## Testing Error Handling

### Unit Test Pattern
```typescript
describe('Error Handling', () => {
  it('should handle network errors gracefully', async () => {
    // Mock network failure
    jest.spyOn(provider, 'getBlockNumber').mockRejectedValue(
      new Error('ECONNREFUSED')
    );
    
    await expect(getChainInfo()).rejects.toThrow(McpError);
    await expect(getChainInfo()).rejects.toThrow(/Network unavailable/);
  });
  
  it('should validate addresses correctly', () => {
    expect(() => validateAddress('', 'ethereum')).toThrow(/required/);
    expect(() => validateAddress('invalid', 'ethereum')).toThrow(/Invalid Ethereum address/);
    expect(() => validateAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb81', 'ethereum')).not.toThrow();
  });
  
  it('should retry on transient failures', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Timeout'))
      .mockResolvedValue('success');
    
    const result = await retryWithBackoff(mockFn, 3, 100);
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});
```

## References

- MCP Protocol Error Codes: https://modelcontextprotocol.io/docs/errors
- STDIO Protocol Guidelines: ./STDIO-PROTOCOL-GUIDELINES.md
- Testing Standards: ./TESTING-STANDARDIZATION-INSTRUCTIONS.md

---

**Last Updated**: September 2024
**Version**: 1.0.0
**Status**: Active Standard
**Required**: All error handling must follow these patterns
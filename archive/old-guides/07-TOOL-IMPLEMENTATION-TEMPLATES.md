# MBPS Tool Implementation Templates

## 🎯 Complete Implementation Guide for 25 MBPS Core Tools

This document provides complete, copy-paste ready implementations for all 25 MBPS v2.1 core tools. Each tool includes validation schemas, error handling, and blockchain-specific implementations.

---

## Prerequisites

1. **Project Setup Complete** (see PROJECT-SETUP-TEMPLATE.md)
2. **Blockchain Client Initialized** (see BLOCKCHAIN-CLIENT-TEMPLATES.md)
3. **TypeScript Environment Configured**

## Tool Implementation Structure

```typescript
// src/tools/core/mbps-core-tools.ts
import { z } from 'zod';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { BlockchainClient } from '../../client.js';

// Validation Schemas
const AddressSchema = z.object({
  address: z.string().min(1, 'Address required')
});

const TransactionHashSchema = z.object({
  hash: z.string().min(1, 'Transaction hash required')
});

const BlockNumberSchema = z.object({
  blockNumber: z.union([z.number(), z.string()]).optional()
});

// Tool Definitions
export const toolDefinitions = [
  // 1. Chain Info
  {
    name: '{prefix}_get_chain_info',
    description: 'Get comprehensive blockchain information',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },

  // 2. Network Info
  {
    name: '{prefix}_get_network_info',
    description: 'Get network status and configuration',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },

  // ... all 25 tool definitions
];

// Handler Implementations
export async function handleGetChainInfo(args: any, client: BlockchainClient) {
  try {
    // Implementation
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(chainInfo, null, 2)
      }]
    };
  } catch (error: any) {
    throw new McpError(ErrorCode.InternalError, error.message);
  }
}

// ... all 25 handlers
```

---

## 1. `{prefix}_get_chain_info`

**Purpose:** Comprehensive blockchain network information

```typescript
// Schema
const GetChainInfoSchema = z.object({});

// Tool Definition
{
  name: '{prefix}_get_chain_info',
  description: 'Get comprehensive blockchain information including network metrics, gas prices, validators, and market data',
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  }
}

// Implementation
export async function handleGetChainInfo(args: any, client: BlockchainClient) {
  try {
    const network = await client.getNetwork();
    const latestBlock = await client.getLatestBlock();
    const gasPrice = await client.getGasPrice();
    const validatorCount = await client.getValidatorCount();

    const chainInfo = {
      network: network.name,
      chainId: network.chainId,
      blockHeight: latestBlock.number,
      gasPrice: gasPrice?.toString(),
      validators: validatorCount,
      timestamp: Date.now(),
      symbol: network.symbol
    };

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(chainInfo, null, 2)
      }]
    };
  } catch (error: any) {
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to get chain info: ${error.message}`
    );
  }
}
```

## 2. `{prefix}_get_network_info`

**Purpose:** Network status and health metrics

```typescript
// Schema
const GetNetworkInfoSchema = z.object({});

// Tool Definition
{
  name: '{prefix}_get_network_info',
  description: 'Get network status, health, RPC endpoints, and configuration details',
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  }
}

// Implementation
export async function handleGetNetworkInfo(args: any, client: BlockchainClient) {
  try {
    const network = await client.getNetwork();
    const health = await client.checkHealth();
    const peers = await client.getPeerCount();

    const networkInfo = {
      network: network.name,
      chainId: network.chainId,
      rpcUrl: network.rpcUrl,
      health: health.status,
      peers: peers,
      blockTime: network.blockTime,
      consensus: network.consensus
    };

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(networkInfo, null, 2)
      }]
    };
  } catch (error: any) {
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to get network info: ${error.message}`
    );
  }
}
```

## 3. `{prefix}_get_balance`

**Purpose:** Native token balance for any address

```typescript
// Schema
const GetBalanceSchema = z.object({
  address: z.string().min(1, 'Address required')
});

// Tool Definition
{
  name: '{prefix}_get_balance',
  description: 'Get native token balance for an address with formatted and raw values',
  inputSchema: {
    type: 'object',
    properties: {
      address: {
        type: 'string',
        description: 'Blockchain address'
      }
    },
    required: ['address']
  }
}

// Implementation
export async function handleGetBalance(args: any, client: BlockchainClient) {
  try {
    const { address } = GetBalanceSchema.parse(args);

    // Validate address format
    if (!client.isValidAddress(address)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid address format: ${address}`
      );
    }

    const balance = await client.getBalance(address);
    const formatted = client.formatBalance(balance);
    const network = await client.getNetwork();

    const balanceInfo = {
      address,
      balance: formatted,
      balanceRaw: balance.toString(),
      symbol: network.symbol,
      decimals: network.decimals
    };

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(balanceInfo, null, 2)
      }]
    };
  } catch (error: any) {
    if (error instanceof McpError) throw error;
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to get balance: ${error.message}`
    );
  }
}
```

## 4. `{prefix}_get_transaction`

**Purpose:** Transaction details by hash

```typescript
// Schema
const GetTransactionSchema = z.object({
  hash: z.string().min(1, 'Transaction hash required')
});

// Tool Definition
{
  name: '{prefix}_get_transaction',
  description: 'Get detailed transaction information by hash with receipt data',
  inputSchema: {
    type: 'object',
    properties: {
      hash: {
        type: 'string',
        description: 'Transaction hash'
      }
    },
    required: ['hash']
  }
}

// Implementation
export async function handleGetTransaction(args: any, client: BlockchainClient) {
  try {
    const { hash } = GetTransactionSchema.parse(args);

    // Validate transaction hash format
    if (!client.isValidTxHash(hash)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid transaction hash format: ${hash}`
      );
    }

    const tx = await client.getTransaction(hash);
    const receipt = await client.getTransactionReceipt(hash);

    const txInfo = {
      hash,
      status: receipt?.status || 'pending',
      blockNumber: tx.blockNumber,
      from: tx.from,
      to: tx.to,
      value: tx.value.toString(),
      gasUsed: receipt?.gasUsed?.toString(),
      gasPrice: tx.gasPrice?.toString(),
      confirmations: await client.getConfirmations(hash)
    };

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(txInfo, null, 2)
      }]
    };
  } catch (error: any) {
    if (error instanceof McpError) throw error;
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to get transaction: ${error.message}`
    );
  }
}
```

## 5. `{prefix}_get_block`

**Purpose:** Block information by number/hash

```typescript
// Schema
const GetBlockSchema = z.object({
  blockNumber: z.union([z.number(), z.string()]).optional()
});

// Tool Definition
{
  name: '{prefix}_get_block',
  description: 'Get block information by number or hash',
  inputSchema: {
    type: 'object',
    properties: {
      blockNumber: {
        type: 'string',
        description: 'Block number, hash, or "latest" (default: latest)'
      }
    },
    required: []
  }
}

// Implementation
export async function handleGetBlock(args: any, client: BlockchainClient) {
  try {
    const { blockNumber = 'latest' } = GetBlockSchema.parse(args);

    const block = await client.getBlock(blockNumber);
    const network = await client.getNetwork();

    const blockInfo = {
      number: block.number,
      hash: block.hash,
      timestamp: block.timestamp,
      transactions: block.transactions.length,
      gasUsed: block.gasUsed?.toString(),
      gasLimit: block.gasLimit?.toString(),
      miner: block.miner,
      network: network.name
    };

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(blockInfo, null, 2)
      }]
    };
  } catch (error: any) {
    if (error instanceof McpError) throw error;
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to get block: ${error.message}`
    );
  }
}
```

## 6. `{prefix}_validate_address`

**Purpose:** Address format validation

```typescript
// Schema
const ValidateAddressSchema = z.object({
  address: z.string().min(1, 'Address required')
});

// Tool Definition
{
  name: '{prefix}_validate_address',
  description: 'Validate blockchain address format and network compatibility',
  inputSchema: {
    type: 'object',
    properties: {
      address: {
        type: 'string',
        description: 'Address to validate'
      }
    },
    required: ['address']
  }
}

// Implementation
export async function handleValidateAddress(args: any, client: BlockchainClient) {
  try {
    const { address } = ValidateAddressSchema.parse(args);

    const isValid = client.isValidAddress(address);
    const addressType = client.getAddressType(address);
    const network = await client.getNetwork();

    const validation = {
      address,
      isValid,
      format: addressType,
      network: network.name,
      chainId: network.chainId
    };

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(validation, null, 2)
      }]
    };
  } catch (error: any) {
    if (error instanceof McpError) throw error;
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to validate address: ${error.message}`
    );
  }
}
```

## 7. `{prefix}_get_transaction_history`

**Purpose:** Transaction history for an address

```typescript
// Schema
const GetTransactionHistorySchema = z.object({
  address: z.string().min(1, 'Address required'),
  limit: z.number().min(1).max(100).default(10)
});

// Tool Definition
{
  name: '{prefix}_get_transaction_history',
  description: 'Get transaction history for an address',
  inputSchema: {
    type: 'object',
    properties: {
      address: {
        type: 'string',
        description: 'Address to get transaction history for'
      },
      limit: {
        type: 'number',
        description: 'Number of transactions (default: 10, max: 100)'
      }
    },
    required: ['address']
  }
}

// Implementation
export async function handleGetTransactionHistory(args: any, client: BlockchainClient) {
  try {
    const { address, limit } = GetTransactionHistorySchema.parse(args);

    if (!client.isValidAddress(address)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid address format: ${address}`
      );
    }

    const transactions = await client.getTransactionHistory(address, limit);
    const network = await client.getNetwork();

    const history = {
      address,
      transactions: transactions.map(tx => ({
        hash: tx.hash,
        blockNumber: tx.blockNumber,
        from: tx.from,
        to: tx.to,
        value: tx.value.toString(),
        timestamp: tx.timestamp,
        status: tx.status
      })),
      total: transactions.length,
      network: network.name
    };

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(history, null, 2)
      }]
    };
  } catch (error: any) {
    if (error instanceof McpError) throw error;
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to get transaction history: ${error.message}`
    );
  }
}
```

## 8-10. Help System Tools

**Purpose:** Interactive tool discovery and guidance

```typescript
// Schemas
const HelpSchema = z.object({
  topic: z.string().optional()
});

const SearchToolsSchema = z.object({
  query: z.string().min(1, 'Search query required'),
  category: z.string().optional()
});

const ListToolsByCategorySchema = z.object({
  category: z.string().optional()
});

// Tool Definitions
{
  name: '{prefix}_help',
  description: 'Get help and usage information',
  inputSchema: {
    type: 'object',
    properties: {
      topic: { type: 'string', description: 'Help topic' }
    },
    required: []
  }
},
{
  name: '{prefix}_search_tools',
  description: 'Search available tools',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
      category: { type: 'string', description: 'Tool category' }
    },
    required: ['query']
  }
},
{
  name: '{prefix}_list_tools_by_category',
  description: 'List tools by category',
  inputSchema: {
    type: 'object',
    properties: {
      category: { type: 'string', description: 'Tool category' }
    },
    required: []
  }
}

// Implementations
export async function handleHelp(args: any, client: BlockchainClient) {
  const { topic } = HelpSchema.parse(args);

  const helpText = `
# {Blockchain} MCP Server

## Available Categories:
- core: Blockchain fundamentals (25 tools)
- tokens: Token operations
- network: Network management
- transactions: Transaction operations
- wallets: Wallet management

## Quick Start:
1. Get chain info: {prefix}_get_chain_info
2. Check balance: {prefix}_get_balance
3. Send transaction: {prefix}_send_transaction

## For more help:
- Search tools: {prefix}_search_tools
- List by category: {prefix}_list_tools_by_category
  `;

  return {
    content: [{
      type: 'text',
      text: helpText.trim()
    }]
  };
}
```

## 11. `{prefix}_send_transaction`

**Purpose:** Send native tokens between addresses

```typescript
// Schema
const SendTransactionSchema = z.object({
  to: z.string().min(1, 'Recipient address required'),
  amount: z.string().min(1, 'Amount required'),
  privateKey: z.string().optional()
});

// Tool Definition
{
  name: '{prefix}_send_transaction',
  description: 'Send native tokens between addresses',
  inputSchema: {
    type: 'object',
    properties: {
      to: {
        type: 'string',
        description: 'Recipient address'
      },
      amount: {
        type: 'string',
        description: 'Amount to send'
      },
      privateKey: {
        type: 'string',
        description: 'Private key for signing (optional, for development only)'
      }
    },
    required: ['to', 'amount']
  }
}

// Implementation
export async function handleSendTransaction(args: any, client: BlockchainClient) {
  try {
    const { to, amount, privateKey } = SendTransactionSchema.parse(args);

    if (!client.isValidAddress(to)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid recipient address: ${to}`
      );
    }

    if (privateKey && !client.isValidPrivateKey(privateKey)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid private key format`
      );
    }

    // WARNING: Private key handling for development only
    const txHash = await client.sendTransaction(to, amount, privateKey);
    const network = await client.getNetwork();

    const result = {
      to,
      amount,
      network: network.name,
      txHash,
      status: 'pending',
      warning: privateKey ? '⚠️ Private key used for development/testing only' : undefined
    };

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error: any) {
    if (error instanceof McpError) throw error;
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to send transaction: ${error.message}`
    );
  }
}
```

## 12-25. Additional Core Tools

**Continue with the same pattern for all 25 tools:**

### Network Management
- `get_network_info` - Network status and health
- `set_network` - Network switching capability

### Gas/Fee Management
- `get_gas_price` - Fee estimation
- `get_mempool_info` - Network congestion
- `estimate_fees` - Smart fee calculation

### Wallet Management
- `import_wallet` - Private key/mnemonic import
- `get_wallet_info` - Comprehensive account details
- `get_account_info` - Account analytics
- `generate_address` - Multi-format address generation

### Token Operations
- `get_token_balance` - Token balance queries
- `get_token_info` - Token metadata
- `transfer_token` - Token transfers
- `approve_token` - Token approvals
- `get_token_allowance` - Allowance checking

## Implementation Checklist

For each tool implementation:

- [ ] **Input Validation**: Zod schemas for all parameters
- [ ] **Address Validation**: Check address format before blockchain calls
- [ ] **Error Handling**: McpError for all error cases
- [ ] **Response Format**: Consistent JSON structure
- [ ] **Documentation**: Clear parameter descriptions
- [ ] **Testing**: Unit tests for validation and error cases

## Common Patterns

### Error Handling Pattern
```typescript
try {
  const params = Schema.parse(args);
  // Validate blockchain-specific requirements
  if (!client.isValidAddress(params.address)) {
    throw new McpError(ErrorCode.InvalidParams, 'Invalid address');
  }
  // Implementation
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
} catch (error: any) {
  if (error instanceof McpError) throw error;
  throw new McpError(ErrorCode.InternalError, error.message);
}
```

### Response Format Pattern
```typescript
const result = {
  // Required fields
  address: params.address,
  // Blockchain-specific data
  balance: formatted,
  balanceRaw: rawValue,
  symbol: network.symbol,
  // Metadata
  network: network.name,
  timestamp: Date.now()
};

return {
  content: [{
    type: 'text',
    text: JSON.stringify(result, null, 2)
  }]
};
```

---

**Next:** See BLOCKCHAIN-CLIENT-TEMPLATES.md for blockchain-specific client implementations.

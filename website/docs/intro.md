---
sidebar_position: 1
---

# Introduction to BMCPS v3.0

Welcome to **BMCPS v3.0** (Blockchain Multi-Protocol Standard) — the universal standard for blockchain AI integration that solves the **context rot** problem.

## What is BMCPS?

BMCPS is a comprehensive standard for building AI-to-blockchain integrations. Unlike traditional approaches that lock you into a single protocol, BMCPS generates **4 different formats** from one universal schema:

- **MCP Servers** - Full-featured Claude Desktop integration (~5k token context)
- **OpenAI Functions** - Lightweight function calling (~500 token context)
- **REST APIs** - Zero context overhead for production scale
- **JSON Schemas** - Format-agnostic base for custom protocols

## The Context Rot Problem

At AI Engineer Summit 2025, a critical limitation of MCP was identified: **context rot**. When MCP loads all tool definitions into context upfront (~5k tokens), it:

- Wastes valuable context space in long conversations
- Limits the room for actual conversation history
- Becomes problematic for extended agent sessions

**BMCPS solves this** by offering protocol flexibility. Choose the format that matches your context requirements:

| Protocol | Context Cost | Best Use Case |
|----------|-------------|---------------|
| REST API | **0 tokens** | Production apps, high-scale systems |
| OpenAI Functions | **~500 tokens** | Long conversations, extended sessions |
| MCP Server | **~5k tokens** | Feature-rich, short interactions |

## Quick Example

Generate an Ethereum integration in any format:

```bash
# OpenAI Functions (low context)
node bmcps-generator.js --blockchain eth --format openai

# MCP Server (full features)
node bmcps-generator.js --blockchain eth --format mcp

# REST API (zero context)
node bmcps-generator.js --blockchain eth --format rest-api

# All formats at once
node bmcps-generator.js --blockchain eth --format all
```

Each command generates a complete, production-ready integration with:
- ✅ All 25 mandatory BMCPS tools
- ✅ Complete documentation
- ✅ Testing frameworks
- ✅ Type safety (TypeScript where applicable)

## Why BMCPS?

### 1. Protocol Flexibility
Don't get locked into one protocol. Generate MCP for prototyping, then switch to REST API for production — **same tools, different transport**.

### 2. Context Management
Choose your context overhead:
- **0 tokens** (REST API) for unlimited scale
- **~500 tokens** (OpenAI) for long conversations
- **~5k tokens** (MCP) for feature-rich interactions

### 3. Universal Compatibility
Works with **17+ blockchains**: Ethereum, Bitcoin, Solana, Avalanche, Polygon, and more. Consistent 25-tool interface across all chains.

### 4. Factory Automation
Generate complete integrations in seconds. No manual setup, no boilerplate code — just working implementations.

### 5. Production Ready
- 238 automated tests (100% passing)
- Built-in error handling patterns
- Security best practices
- Comprehensive testing standards

## What's Included?

### Core Tools (25 mandatory)
Every BMCPS integration includes:
- **Core Operations** (5): get_chain_info, get_balance, get_transaction, get_block, validate_address
- **Transactions** (2): get_transaction_history, send_transaction
- **Wallet Management** (3): create_wallet, import_wallet, generate_address
- **Network Control** (3): get_network_info, set_network, get_gas_price
- **Fee Management** (2): estimate_fees, get_mempool_info
- **Account Info** (2): get_wallet_info, get_account_info
- **Token Operations** (5): get_token_balance, get_token_info, transfer_token, approve_token, get_token_allowance
- **Help System** (3): help, search_tools, list_tools_by_category

### Generator Features
- **Multi-format output** - MCP, OpenAI, REST API, JSON Schema
- **17+ blockchains** - EVM, SVM, Move-based, and more
- **Complete documentation** - README, examples, usage guides
- **Type safety** - Full TypeScript support for MCP
- **Testing included** - Jest test suites generated automatically

## Getting Started

Ready to build? Choose your path:

1. **Quick Start** - Generate your first integration in 5 minutes
   - → [Quick Start Guide](/docs/QUICK-START-GUIDE)

2. **Choose a Protocol** - Understand which format fits your needs
   - → [Protocol Comparison](/docs/11-PROTOCOL-COMPARISON)

3. **Read the Standard** - Deep dive into BMCPS v3.0 specification
   - → [BMCPS v3.0 Standard](/docs/Blockchain-MCP-Standard-v3.0)

4. **See All Tools** - Browse the universal tool registry
   - → [Tool Registry](/docs/02-UNIVERSAL-TOOL-NAMING-REGISTRY)

## Architecture Overview

```
┌─────────────────────────────────────┐
│   tools-schema.json                  │  ← Universal source of truth
│   (25 tool definitions)              │
└───────────┬─────────────────────────┘
            │
    ┌───────┴────────────────┬─────────────┬────────────┐
    ↓                        ↓             ↓            ↓
┌──────────┐         ┌──────────┐   ┌─────────┐  ┌──────────┐
│ OpenAI   │         │   MCP    │   │REST API │  │  JSON    │
│Functions │         │  Server  │   │         │  │ Schema   │
└──────────┘         └──────────┘   └─────────┘  └──────────┘
~500 tokens          ~5k tokens      0 tokens       N/A

One schema → Multiple protocols → Choose what fits
```

## Key Concepts

### Protocol-Agnostic Design
BMCPS tool definitions are **independent of transport protocol**. The same `get_balance` tool works whether you're using MCP, OpenAI Functions, or REST API.

### Modular Architecture
Tools are organized by category:
- `core/` - Blockchain fundamentals
- `wallet/` - Wallet operations
- `network/` - Network management
- `tokens/` - Token operations
- `help/` - Help system
- And more...

### Compliance Levels
- **Bronze** (Minimum Viable): 25 core tools
- **Silver** (Production Ready): 40+ tools, full architecture compliance
- **Gold** (Enterprise Grade): 100+ tools, optimized, audited

## Community & Support

- **Documentation**: https://bmcps.dev
- **GitHub**: https://github.com/MyronKoch/blockchain-mcp-standards
- **Issues**: Report bugs or request features on GitHub

## Version Information

- **Current Version**: v3.0.0
- **Release Date**: January 2025
- **Status**: Production Ready
- **Test Coverage**: 100% (238/238 tests passing)

---

**Ready to start building?** Head to the [Quick Start Guide](/docs/QUICK-START-GUIDE) and generate your first integration!

# CoinGecko Integration Standard for Blockchain MCP Servers

## Overview

This document standardizes how blockchain MCP servers should integrate basic price data while recommending the CoinGecko MCP server for advanced market analytics.

## Standard Implementation Pattern

### 1. Tool Description Update

For any `get_token_price` or similar price-fetching tool, update the description to clarify scope:

```typescript
{
  name: `${prefix}_get_token_price`,
  description: 'Get current token price and market data (basic). For advanced market analytics, historical data, and multiple token tracking, consider using the CoinGecko MCP server',
  inputSchema: {
    properties: {
      currency: { 
        description: 'Currency to get price in (usd, eur, btc). For more currencies, use CoinGecko MCP server',
        default: 'usd'
      }
    }
  }
}
```

### 2. README Documentation Section

Add this section to your server's README, typically before the Security section:

```markdown
## Market Data Integration

### Built-in Price Information
- **Basic Price Data**: The `[prefix]_get_token_price` tool provides current [TOKEN] price and basic market data
- **Supported Currencies**: USD, EUR, BTC, and other major currencies
- **Data Source**: CoinGecko free API (or specify alternative like DEX prices)
- **Update Frequency**: Real-time on request

### Advanced Market Analytics
For advanced market data capabilities, we recommend using the dedicated **[CoinGecko MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/coingecko)** alongside this [BLOCKCHAIN] server:

**CoinGecko MCP Server provides:**
- **Historical Price Data**: OHLCV data, price charts over time
- **Multiple Token Tracking**: Track thousands of tokens simultaneously
- **Market Analytics**: Market cap rankings, volume analysis, trending tokens
- **DeFi Metrics**: TVL, yield farming rates, liquidity pool data
- **Global Market Data**: Exchange volumes, derivatives, global crypto stats
- **Advanced Queries**: Complex filtering, sorting, and aggregation

### Recommended Setup
\`\`\`json
// In your Claude Desktop config
{
  "mcpServers": {
    "[blockchain]-[network]": {
      "command": "node",
      "args": ["path/to/[blockchain]-mcp-server/dist/index.js"]
    },
    "coingecko": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-coingecko"]
    }
  }
}
\`\`\`

This combination gives you:
- **[Blockchain] Server**: Full blockchain operations + basic price data
- **CoinGecko Server**: Comprehensive market analytics and advanced price tracking
```

## Implementation Variants

### 1. CoinGecko API Direct (Most Common)

For servers using CoinGecko API directly (like Solana, WorldChain):

```typescript
const response = await fetch(
  `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=${currency}`
);
```

**Documentation Note**: Mention "CoinGecko free API" as data source.

### 2. DEX Price Feeds

For servers using DEX prices (like BSC with PancakeSwap):

```typescript
// Getting price from DEX router
const amountsOut = await router.getAmountsOut(amountIn, [tokenA, tokenB]);
```

**Documentation Note**: Specify the DEX used (e.g., "PancakeSwap V2 price oracle") and still recommend CoinGecko MCP for historical/analytical data.

### 3. Multiple Price Sources

For servers with multiple price options:

```typescript
// Support both CoinGecko and DEX prices
const priceSource = args.source || 'coingecko';
if (priceSource === 'coingecko') {
  // CoinGecko implementation
} else if (priceSource === 'dex') {
  // DEX implementation
}
```

**Documentation Note**: List all available sources and their trade-offs.

## Migration Checklist

When applying this standard to an existing server:

1. ✅ Identify all price-related tools (`get_token_price`, `get_price`, etc.)
2. ✅ Update tool descriptions to mention CoinGecko MCP for advanced features
3. ✅ Add "Market Data Integration" section to README
4. ✅ Verify the data source is correctly documented (CoinGecko, DEX, etc.)
5. ✅ Test that basic price functionality still works
6. ✅ Ensure Claude Desktop config example uses correct paths

## Benefits of This Approach

### For Users
- **Single Server Simplicity**: Basic price data without additional setup
- **Clear Upgrade Path**: Know exactly when/why to add CoinGecko MCP
- **No Duplicate Functionality**: Each server has a clear purpose
- **Reduced Latency**: Common operations in one server

### For Maintainers
- **Reduced Complexity**: No need to implement advanced market features
- **Clear Boundaries**: Each server focuses on its core competency
- **Easier Maintenance**: Less code to maintain and update
- **API Quota Management**: Basic features use minimal API calls

## Examples

### Solana DevNet Server
- **Built-in**: `sol_get_token_price` - Current SOL price
- **CoinGecko MCP**: Historical SOL prices, SPL token analytics

### BSC TestNet Server
- **Built-in**: `bsc_get_token_price` - DEX-based token prices
- **CoinGecko MCP**: Market cap rankings, global BNB metrics

### WorldChain TestNet Server
- **Built-in**: `world_get_token_price` - ETH price (native currency)
- **CoinGecko MCP**: Layer 2 analytics, gas price trends

## Best Practices

1. **Keep It Simple**: Only implement basic price fetching
2. **Document Clearly**: Always specify data source and limitations
3. **Guide Users**: Provide clear migration path to CoinGecko MCP
4. **Respect Rate Limits**: Use caching where appropriate
5. **Handle Errors Gracefully**: Provide fallbacks when price APIs fail

## Compliance Verification

A server is compliant with this standard when:

1. ✅ Price tool descriptions mention CoinGecko MCP option
2. ✅ README has "Market Data Integration" section
3. ✅ Data sources are clearly documented
4. ✅ Claude Desktop config example is provided
5. ✅ Advanced features are explicitly deferred to CoinGecko MCP

## Related Standards

- **MBPS v2.1**: Includes `get_token_price` as optional tool
- **README Documentation Standard**: Specifies section ordering
- **Error Handling Patterns**: For API failure scenarios
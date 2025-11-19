# MCP Help System Standard v1.0

## Universal Help System for Model Context Protocol Servers

This document defines a standardized help system that can be implemented across any MCP server to provide users with interactive discovery, search, and guidance capabilities.

## Overview

Large MCP servers with many tools need a systematic way for users to discover functionality. This standard provides a consistent 3-tool pattern that makes any server self-documenting and user-friendly.

## Standard Components

### Required Tools (3 tools minimum)

1. **`\{prefix\}_help`** - Interactive help system with contextual guidance
2. **`\{prefix\}_search_tools`** - Search tools by keyword, category, or description  
3. **`\{prefix\}_list_tools_by_category`** - Browse tools organized by functional categories

Where `\{prefix\}` is the server's standard tool prefix (e.g., `osmo_`, `eth_`, `btc_`, `db_`, `api_`, etc.).

## Implementation Structure

### File Organization
```
src/tools/help/
├── tool-registry.ts      # Central metadata registry for all tools
├── help.ts              # Main interactive help system
├── search-tools.ts      # Search functionality across tools
└── list-by-category.ts  # Category-based tool browser
```

### Tool Registry Schema
```typescript
interface ToolMetadata \{
  name: string;           // Tool name including prefix
  category: string;       // Functional category (e.g., "blockchain", "staking")
  description: string;    // Brief description of functionality
  parameters?: string[];  // Key parameter names
  examples?: string[];    // Usage examples
  tags?: string[];       // Additional searchable keywords
\}
```

### Category Standards

#### For Blockchain Servers
- `blockchain` - Core blockchain operations (blocks, transactions, chain info)
- `account` - Account and balance operations
- `staking` - Validator staking and delegation
- `governance` - Proposals and voting
- `defi` - DeFi operations (pools, swaps, liquidity)
- `transaction` - Transaction preparation and simulation
- `wallet` - Wallet management and generation

#### For General Servers
- `core` - Essential server functionality
- `data` - Data retrieval and querying
- `admin` - Administrative operations
- `search` - Search and discovery tools
- `utility` - Helper and utility functions

## Tool Implementation Templates

### 1. Help Tool Template
```typescript
export async function handleHelp(args: \{ topic?: string \}) \{
  const topics = \{
    overview: "Server overview and capabilities",
    categories: "Available tool categories", 
    getting_started: "Basic usage examples",
    // Add server-specific topics
  \};

  if (!args.topic) \{
    return \{
      available_topics: Object.keys(topics),
      usage: "Use \{prefix\}_help with a topic for detailed guidance"
    \};
  \}

  // Return topic-specific help content
\}
```

### 2. Search Tool Template
```typescript
export async function handleSearchTools(args: \{ query: string; category?: string \}) \{
  const allTools = getToolRegistry();
  
  const results = allTools.filter(tool => \{
    const matchesQuery = tool.name.includes(args.query) || 
                        tool.description.toLowerCase().includes(args.query.toLowerCase());
    const matchesCategory = !args.category || tool.category === args.category;
    return matchesQuery && matchesCategory;
  \});

  return \{
    query: args.query,
    results_count: results.length,
    tools: results
  \};
\}
```

### 3. List by Category Template
```typescript
export async function handleListByCategory(args: \{ category?: string \}) \{
  const allTools = getToolRegistry();
  
  if (!args.category) \{
    const categories = [...new Set(allTools.map(t => t.category))];
    return \{
      available_categories: categories,
      usage: "Specify a category to see tools in that group"
    \};
  \}

  const toolsInCategory = allTools.filter(t => t.category === args.category);
  return \{
    category: args.category,
    tool_count: toolsInCategory.length,
    tools: toolsInCategory
  \};
\}
```

## Integration Guidelines

### 1. Tool Registration
Each server should maintain a central registry of all tools with metadata:

```typescript
// src/tools/help/tool-registry.ts
export const TOOL_REGISTRY: ToolMetadata[] = [
  \{
    name: "prefix_get_info",
    category: "core", 
    description: "Get basic server information",
    parameters: ["format"],
    examples: ["prefix_get_info", "prefix_get_info format=json"]
  \},
  // ... all other tools
];
```

### 2. Main Server Integration
```typescript
// In main index.ts
import \{ handleHelp, handleSearchTools, handleListByCategory \} from './tools/help';

// Register help tools
server.setRequestHandler(ListToolsRequestSchema, async () => (\{
  tools: [
    // ... other tools
    \{
      name: "prefix_help",
      description: "Get interactive help and guidance",
      inputSchema: \{
        type: "object",
        properties: \{
          topic: \{ type: "string", description: "Help topic" \}
        \}
      \}
    \},
    \{
      name: "prefix_search_tools", 
      description: "Search tools by keyword or category",
      inputSchema: \{
        type: "object",
        properties: \{
          query: \{ type: "string", description: "Search query" \},
          category: \{ type: "string", description: "Filter by category" \}
        \},
        required: ["query"]
      \}
    \},
    \{
      name: "prefix_list_tools_by_category",
      description: "Browse tools organized by category", 
      inputSchema: \{
        type: "object",
        properties: \{
          category: \{ type: "string", description: "Category name" \}
        \}
      \}
    \}
  ]
\}));
```

## Benefits

### For Users
- **Discoverability** - Find relevant tools quickly in large servers
- **Learning** - Understand server capabilities through structured exploration
- **Consistency** - Same help pattern across all MCP servers
- **Self-service** - Reduce need for external documentation

### For Developers  
- **Documentation** - Self-documenting tool registries
- **Maintenance** - Centralized metadata management
- **Testing** - Registry enables comprehensive tool validation
- **Standards** - Consistent implementation patterns

## Examples by Server Type

### Blockchain Server (Osmosis Example)
- `osmo_help` with topics: overview, staking, pools, governance, defi, transactions
- 119 tools organized across 20+ categories
- Search across DeFi, staking, governance functionality

### Database Server (Example)
- `db_help` with topics: overview, queries, admin, backup, performance
- Categories: core, query, admin, backup, monitoring, utility

### API Server (Example)  
- `api_help` with topics: overview, auth, endpoints, rate_limits
- Categories: auth, data, monitoring, admin, utility

## Implementation Checklist

- [ ] Create `src/tools/help/` directory structure
- [ ] Implement tool registry with all server tools
- [ ] Create the 3 required help tools
- [ ] Integrate help tools into main server
- [ ] Test help system functionality
- [ ] Update server README with help system documentation

## Versioning

- **v1.0** - Initial standard with 3-tool pattern
- Future versions may add optional tools like `prefix_get_examples`, `prefix_validate_usage`

## Contributing

This standard is designed to evolve. Improvements and extensions welcome through:
1. Implementation feedback from various server types
2. Additional tool patterns that prove universally useful
3. Enhanced metadata schemas for specialized server types

## License

This standard is provided under MIT license for universal adoption across the MCP ecosystem.

---

*This standard was developed from the successful implementation in the Osmosis MCP server, which demonstrated the value of structured help systems for servers with 119+ tools.*
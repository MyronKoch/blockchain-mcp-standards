# BMCPS v3.0 → Multi-Protocol Future Roadmap

**Status**: Active Development
**Last Updated**: November 20, 2025
**Goal**: Transform BMCPS from MCP-only to a universal blockchain AI integration standard

---

## Executive Summary

Following discussions at AI Engineer Summit 2025 about MCP's uncertain future, this roadmap outlines how to make BMCPS protocol-agnostic while maintaining all current functionality. The goal is to position BMCPS as **the** standard for blockchain AI integration, regardless of which transport protocol wins.

---

## Phase 0: Strategic Decisions 🎯

### Naming Strategy Decision

**Current**: Blockchain MCP Standard (BMCPS)
**Problem**: "MCP" ties us to a potentially dying protocol

**Options Evaluated**:

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Blockchain Multi-Protocol Standard** | ✅ Keep bmcps.dev domain<br>✅ Explicitly multi-protocol<br>✅ No rebranding needed | ⚠️ Slight ambiguity | ⭐ **RECOMMENDED** |
| **Blockchain Modular Protocol Standard** | ✅ Emphasizes architecture<br>✅ Keep domain | ⚠️ Less clear about multiple transports | Good backup |
| **Blockchain AI Standard (BAS)** | ✅ Future-proof<br>✅ Clean | ❌ Lose bmcps.dev<br>❌ Complete rebrand | Not worth it |
| Keep as "MCP Standard" | ✅ No changes needed | ❌ Dead if MCP dies | ❌ **AVOID** |

**Decision Required**: Choose naming interpretation before Phase 1

---

## Phase 1: Foundation (Week 1-2) 🏗️

### 1.1 Create Universal Tool Schema

**File**: `tools-schema.json`
**Purpose**: Single source of truth for all 25 mandatory tools

**Structure**:
```json
{
  "version": "3.0",
  "tools": [
    {
      "name": "get_balance",
      "category": "core",
      "description": "Get native token balance for an address",
      "inputs": {
        "address": {
          "type": "string",
          "description": "Wallet address to query",
          "required": true,
          "validation": "blockchain_address"
        }
      },
      "outputs": {
        "balance": {
          "type": "string",
          "description": "Balance in smallest unit (wei, satoshi, etc.)"
        },
        "formatted_balance": {
          "type": "string",
          "description": "Human-readable balance"
        }
      },
      "errors": [
        {
          "code": "INVALID_ADDRESS",
          "message": "Address format is invalid"
        },
        {
          "code": "NETWORK_ERROR",
          "message": "Failed to connect to blockchain node"
        }
      ]
    }
    // ... all 25 tools
  ]
}
```

**Tasks**:
- [ ] Define complete schema for all 25 tools
- [ ] Add validation rules for each input
- [ ] Document all possible error codes
- [ ] Create schema validator script

**Deliverable**: `tools-schema.json` + `validate-schema.js`

---

### 1.2 Build Multi-Format Generator System

**File**: `bmcps-generator.js` (new unified generator)
**Purpose**: Generate server code for any protocol

**Usage**:
```bash
# MCP Server (current default)
node bmcps-generator.js --blockchain eth --format mcp

# OpenAI Function Calling
node bmcps-generator.js --blockchain eth --format openai

# REST API with OpenAPI spec
node bmcps-generator.js --blockchain eth --format rest-api

# JSON Schema only (for custom implementations)
node bmcps-generator.js --blockchain eth --format json-schema

# All formats at once
node bmcps-generator.js --blockchain eth --format all
```

**Architecture**:
```
bmcps-generator.js
├── core/
│   ├── schema-loader.js      # Load tools-schema.json
│   ├── validator.js           # Validate blockchain prefix
│   └── file-generator.js      # Common file operations
├── formats/
│   ├── mcp/                   # MCP server generator
│   │   ├── templates/
│   │   └── generator.js
│   ├── openai/                # OpenAI functions generator
│   │   ├── templates/
│   │   └── generator.js
│   ├── rest-api/              # REST API generator
│   │   ├── templates/
│   │   └── generator.js
│   └── json-schema/           # Pure schema generator
│       └── generator.js
└── utils/
    ├── naming.js              # Prefix + naming conventions
    └── typescript.js          # TS code generation helpers
```

**Tasks**:
- [ ] Create base generator framework
- [ ] Implement MCP format generator (migrate from bmcps-factory.js)
- [ ] Implement OpenAI format generator
- [ ] Implement REST API format generator
- [ ] Implement JSON schema format generator
- [ ] Add --format flag with validation
- [ ] Write comprehensive tests

**Deliverable**: `bmcps-generator.js` with 4+ format options

---

### 1.3 Update Core Documentation

**Files to Update**:
- `01-Blockchain-MCP-Standard-v3.0.md` → Rename to `01-Blockchain-Multi-Protocol-Standard-v3.0.md`
- `README.md`
- `llm.txt`
- `CLAUDE.md`
- `website/docusaurus.config.ts`
- `website/src/pages/index.tsx`

**Key Messaging Changes**:

**Before**:
> "The Blockchain MCP Standard (BMCPS) v3.0 is the unified standard for building blockchain MCP servers"

**After**:
> "The Blockchain Multi-Protocol Standard (BMCPS) v3.0 is the universal standard for blockchain AI integration across any protocol: MCP, OpenAI Functions, REST APIs, and custom implementations"

**New Section to Add**: "Protocol Flexibility"
```markdown
## Protocol Flexibility

BMCPS v3.0 is designed to work with any AI-blockchain integration protocol:

### Supported Formats
- **MCP (Model Context Protocol)**: First-class support for Anthropic's MCP
- **OpenAI Functions**: Generate OpenAI function schemas
- **REST API**: Standard HTTP/JSON APIs with OpenAPI specs
- **Custom**: JSON schemas for building your own integration

### Why Protocol-Agnostic?
The AI tooling landscape is rapidly evolving. BMCPS provides:
1. **Tool standardization** - 25 mandatory tools every blockchain needs
2. **Naming convention** - `{prefix}_{action}_{resource}` works everywhere
3. **Architecture patterns** - Modular structure independent of transport
4. **Factory automation** - Generate any format from one standard

**The protocol may change, but blockchain operations remain the same.**
```

**Tasks**:
- [ ] Update all documentation headers
- [ ] Add "Protocol Flexibility" section to main standard
- [ ] Update homepage messaging
- [ ] Create protocol comparison table
- [ ] Update all references from "MCP Standard" to "Multi-Protocol Standard"

**Deliverable**: Updated documentation emphasizing multi-protocol support

---

## Phase 2: Implementation Examples (Week 3-4) 📚

### 2.1 Create Reference Implementations

**Directory Structure**:
```
examples/
├── mcp-server/               # Current MCP implementation
│   ├── ethereum-mainnet/
│   ├── bitcoin-mainnet/
│   └── solana-mainnet/
├── openai-functions/         # OpenAI function calling
│   ├── ethereum-mainnet/
│   └── README.md
├── rest-api/                 # REST API implementation
│   ├── ethereum-mainnet/
│   ├── openapi.yaml
│   └── README.md
├── langchain-tools/          # LangChain integration
│   ├── ethereum-mainnet/
│   └── README.md
└── custom-integration/       # Using raw JSON schemas
    ├── ethereum-mainnet/
    └── README.md
```

**Example Implementations to Create**:

#### 2.1.1 MCP Server (Ethereum)
- Full 25-tool implementation
- Uses `@modelcontextprotocol/sdk`
- Deployment via npx/docker
- **Status**: Already exists, needs documentation update

#### 2.1.2 OpenAI Functions (Ethereum)
```typescript
// Generated from bmcps-generator.js --format openai
const ethereumFunctions = [
  {
    name: "eth_get_balance",
    description: "Get native token balance for an Ethereum address",
    parameters: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Ethereum address (0x...)"
        }
      },
      required: ["address"]
    }
  },
  // ... 24 more tools
];

// Use with OpenAI SDK
const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{role: "user", content: "What's the balance of 0x...?"}],
  functions: ethereumFunctions,
  function_call: "auto"
});
```

#### 2.1.3 REST API (Ethereum)
```yaml
# openapi.yaml - Generated from bmcps-generator.js --format rest-api
openapi: 3.0.0
info:
  title: Ethereum BMCPS API
  version: 3.0.0
paths:
  /eth/balance/{address}:
    get:
      summary: Get ETH balance
      operationId: eth_get_balance
      parameters:
        - name: address
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Balance retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BalanceResponse'
```

#### 2.1.4 LangChain Tools (Ethereum)
```typescript
import { Tool } from "langchain/tools";

export class EthereumGetBalanceTool extends Tool {
  name = "eth_get_balance";
  description = "Get native ETH balance for an address";

  async _call(address: string): Promise<string> {
    // Implementation using BMCPS standard
    const balance = await this.client.getBalance(address);
    return JSON.stringify(balance);
  }
}
```

**Tasks**:
- [ ] Generate MCP reference implementation
- [ ] Generate OpenAI Functions reference implementation
- [ ] Generate REST API reference implementation
- [ ] Generate LangChain tools reference implementation
- [ ] Create README for each example
- [ ] Add deployment/usage instructions

**Deliverable**: 4 complete reference implementations

---

### 2.2 Create Migration Guides

**Guides to Create**:

1. **`guides/using-bmcps-with-openai.md`**
   - How to generate OpenAI function schemas
   - Integration with OpenAI SDK
   - Example chat completion with function calling

2. **`guides/using-bmcps-with-langchain.md`**
   - How to create LangChain tools from BMCPS
   - Integration patterns
   - Agent examples

3. **`guides/building-rest-api-from-bmcps.md`**
   - Generate OpenAPI spec
   - Deploy as REST service
   - Authentication & rate limiting

4. **`guides/migrating-from-mcp.md`**
   - If you have an MCP server, how to make it multi-protocol
   - Breaking changes (if any)
   - Timeline for deprecation (none planned)

**Tasks**:
- [ ] Write OpenAI integration guide
- [ ] Write LangChain integration guide
- [ ] Write REST API guide
- [ ] Write migration guide
- [ ] Add to documentation site

**Deliverable**: 4 comprehensive migration guides

---

## Phase 3: Website & Marketing (Week 5) 🚀

### 3.1 Update Homepage Messaging

**Current State**: Homepage says "MCP servers"
**Target State**: Homepage emphasizes protocol flexibility

**New Homepage Sections**:

1. **Hero Section**:
   ```
   The Universal Standard for Blockchain AI Integration

   Build once, deploy anywhere: MCP, OpenAI, REST APIs, or custom protocols.
   One standard. Any blockchain. Any AI framework.
   ```

2. **Protocol Support Section**:
   - Visual comparison of MCP vs OpenAI vs REST
   - Show same tool in different formats
   - "Generate All Formats with One Command"

3. **Feature Grid Updates**:
   - Replace "MCP Server" with "Multi-Protocol"
   - Add "Format Flexibility" card
   - Update Factory Automation to show --format flag

**Tasks**:
- [ ] Update hero section
- [ ] Create protocol comparison component
- [ ] Add format examples
- [ ] Update feature cards
- [ ] Add "Why Protocol-Agnostic" section

**Deliverable**: Updated bmcps.dev homepage

---

### 3.2 Create Protocol Comparison Page

**New Page**: `/docs/protocol-comparison`

**Content**:
- Side-by-side comparison of MCP, OpenAI Functions, REST
- When to use each protocol
- Performance characteristics
- Ecosystem support
- Migration paths between protocols

**Visual**:
```
┌─────────────────────────────────────────────────────────┐
│  Same BMCPS Tool, Different Protocols                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  MCP Server          OpenAI Functions      REST API     │
│  ┌──────────┐        ┌──────────┐         ┌──────────┐ │
│  │ get_     │        │ {         │         │ GET      │ │
│  │ balance  │   →    │  name:... │    →    │ /balance │ │
│  │          │        │  params.. │         │          │ │
│  └──────────┘        └──────────┘         └──────────┘ │
│                                                          │
│  Generated from tools-schema.json                        │
└─────────────────────────────────────────────────────────┘
```

**Tasks**:
- [ ] Create comparison page
- [ ] Add visual diagrams
- [ ] Document trade-offs
- [ ] Add to sidebar navigation

**Deliverable**: `/docs/protocol-comparison` page

---

## Phase 4: Community & Ecosystem (Week 6+) 🌐

### 4.1 GitHub Repository Updates

**Files to Add**:
- [x] `ROADMAP.md` (this document)
- [ ] `CONTRIBUTING.md` - Update for multi-protocol contributions
- [ ] `ARCHITECTURE.md` - Explain generator system
- [ ] `PROTOCOL-SUPPORT.md` - Status of each protocol implementation

**GitHub Actions to Create**:
- [ ] Multi-format validation CI
- [ ] Test all generated formats
- [ ] Auto-generate examples on release

**Tasks**:
- [ ] Add roadmap to repo
- [ ] Update CONTRIBUTING
- [ ] Create architecture docs
- [ ] Set up CI/CD for multi-format testing

**Deliverable**: Updated GitHub repository

---

### 4.2 Community Outreach

**Platforms**:
- Twitter/X: Announce multi-protocol support
- Reddit: r/ethdev, r/Bitcoin, r/solana
- Discord: Major blockchain communities
- Dev.to: Write article about protocol-agnostic standards

**Content to Create**:
1. **Blog Post**: "Why BMCPS is Protocol-Agnostic (and Why That Matters)"
2. **Twitter Thread**: MCP uncertainty → multi-protocol solution
3. **Video Demo**: Generate same tools for 3 different protocols
4. **Podcast Pitch**: Reach out to AI/blockchain podcasts

**Tasks**:
- [ ] Write announcement blog post
- [ ] Create demo video
- [ ] Post to relevant communities
- [ ] Reach out to influencers

**Deliverable**: Multi-channel launch announcement

---

## Phase 5: Long-Term Maintenance (Ongoing) 🔄

### 5.1 Protocol Support Matrix

Track implementation status for each protocol:

| Protocol | Status | Priority | ETA |
|----------|--------|----------|-----|
| MCP | ✅ Complete | High | Done |
| OpenAI Functions | 🚧 In Progress | High | Phase 2 |
| REST API | 🚧 In Progress | Medium | Phase 2 |
| LangChain Tools | 📋 Planned | Medium | Phase 2 |
| Vercel AI SDK | 📋 Planned | Low | Phase 3 |
| Custom JSON | ✅ Complete | Medium | Phase 1 |

### 5.2 Version Strategy

**Versioning**:
- BMCPS v3.x = Current standard (protocol-agnostic)
- Individual format generators can version independently
- `tools-schema.json` has its own semver

**Backward Compatibility**:
- Existing MCP servers remain 100% compatible
- New formats are additive, not breaking changes
- Deprecation policy: 6 months notice minimum

---

## Success Metrics 📊

### Phase 1 Success
- [ ] tools-schema.json validates successfully
- [ ] bmcps-generator.js can generate 3+ formats
- [ ] Documentation mentions "Multi-Protocol" > "MCP"

### Phase 2 Success
- [ ] 4 reference implementations working
- [ ] Migration guides tested by external developers
- [ ] Examples deploy successfully

### Phase 3 Success
- [ ] Homepage no longer MCP-exclusive
- [ ] Protocol comparison page live
- [ ] Community feedback positive

### Overall Success (6 months)
- [ ] 100+ servers generated across all protocols
- [ ] 3+ external contributors
- [ ] Adoption by at least one major blockchain project
- [ ] Listed in AI engineering resources (swyx's newsletter, etc.)

---

## Risk Mitigation 🛡️

### Risk: MCP Dies Completely
**Mitigation**: Multi-protocol support means we're not dependent on MCP
**Action**: Maintain OpenAI Functions as primary if MCP fades

### Risk: New Protocol Emerges
**Mitigation**: Generator architecture makes adding new formats easy
**Action**: Can add new format in ~1 week if needed

### Risk: Community Doesn't Adopt
**Mitigation**: Direct outreach to blockchain projects
**Action**: Offer to help integrate BMCPS into their tooling

### Risk: Competing Standard Emerges
**Mitigation**: Be first, be best, be most comprehensive
**Action**: Speed to market with multi-protocol support

---

## Timeline Summary 📅

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 0** | 2 days | Naming decision, strategic alignment |
| **Phase 1** | 1-2 weeks | tools-schema.json, bmcps-generator.js, updated docs |
| **Phase 2** | 2-3 weeks | 4 reference implementations, migration guides |
| **Phase 3** | 1 week | Updated website, comparison page |
| **Phase 4** | 1 week | Community launch |
| **Phase 5** | Ongoing | Maintenance, new protocols |

**Total Time to Multi-Protocol MVP**: 4-6 weeks

---

## Decision Points 🎯

**Immediate Decisions Needed**:
1. ✅ Confirm naming: "Blockchain Multi-Protocol Standard" or alternative?
2. ✅ Priority order for protocol implementations (MCP, OpenAI, REST)?
3. ✅ Green light to start Phase 1?

**Next Review**: After Phase 1 completion (2 weeks)

---

## Resources Required 💰

**Development Time**:
- Phase 1: ~40 hours (1 week full-time)
- Phase 2: ~80 hours (2 weeks full-time)
- Phase 3: ~20 hours (0.5 weeks full-time)
- Total: ~140 hours (~3.5 weeks full-time)

**Infrastructure**:
- GitHub repository: Free
- bmcps.dev hosting: $12/year (already purchased)
- CI/CD: GitHub Actions free tier
- Total: $12/year

**No additional budget required** ✅

---

## Next Steps ⚡

**Immediate (Today)**:
1. **Decision**: Approve "Blockchain Multi-Protocol Standard" naming
2. **Action**: Start creating tools-schema.json
3. **Action**: Begin bmcps-generator.js architecture

**This Week**:
1. Complete tools-schema.json with all 25 tools
2. Build base generator framework
3. Implement MCP format generator (migrate existing)

**Next Week**:
1. Implement OpenAI format generator
2. Implement REST API format generator
3. Update core documentation

---

**Questions or feedback on this roadmap?** Open an issue or PR at https://github.com/MyronKoch/blockchain-mcp-standards

---

*Last updated: November 20, 2025 by Claude (AI Assistant)*

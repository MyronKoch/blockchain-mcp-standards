# Blockchain MCP Server Standards

## 📚 Consolidated Documentation (v3.0)

We've consolidated 28 documents down to 10 core standards for clarity and maintainability.

---

## Core Standards (Numbered in Usage Order)

### 01. **[01-Blockchain-MCP-Standard-v3.0.md](./01-Blockchain-MCP-Standard-v3.0.md)** ⭐
**READ FIRST - The Main Standard** - Understand the architecture and requirements.
- Modular architecture patterns
- 25 mandatory tools specification
- Code organization structure
- Naming conventions
- Implementation templates

### 02. **[02-UNIVERSAL-TOOL-NAMING-REGISTRY.md](./02-UNIVERSAL-TOOL-NAMING-REGISTRY.md)** 📖
**REFERENCE - Tool Naming** - Complete registry of all standard tool names.
- Naming convention (`{prefix}_{action}_{resource}`)
- All 25 mandatory tools with exact names
- Extended tools (optional but standardized)
- Blockchain prefix registry
- Action verb and resource object catalogs

### 03. **[03-QUICK-START-GUIDE.md](./03-QUICK-START-GUIDE.md)** 🚀
**START HERE - Implementation Guide** - Begin building or converting.
- New server creation (2 hours)
- Migration from monolithic to modular
- Step-by-step instructions
- Validation scripts

### 04. **[04-NETWORK-CONFIGURATIONS.md](./04-NETWORK-CONFIGURATIONS.md)** 🌐
**CONFIGURE - Network Setup** - Set up blockchain connections.
- RPC endpoints
- Chain IDs
- Testnet/Mainnet configs
- Environment variables

### 05. **[05-TESTING-STANDARD.md](./05-TESTING-STANDARD.md)** 🧪
**VALIDATE - Testing Requirements** - Ensure 95%+ coverage.
- Jest configuration
- Security testing suite
- Chaos engineering tests
- Performance benchmarks
- UAT procedures

### 06. **[06-ERROR-HANDLING-PATTERNS.md](./06-ERROR-HANDLING-PATTERNS.md)** 🛡️
**IMPLEMENT - Error Management** - Add proper error handling.
- McpError usage
- Error codes
- User-friendly messages
- Recovery strategies

### 07. **[07-HELP-SYSTEM-IMPLEMENTATION.md](./07-HELP-SYSTEM-IMPLEMENTATION.md)** ❓
**ENHANCE - Help System** - Implement tool discovery.
- Tool discovery
- Category organization
- Search functionality
- Help formatting

### 08. **[08-README-TEMPLATE.md](./08-README-TEMPLATE.md)** 📝
**DOCUMENT - Create README** - Document your server.
- Standard sections
- Tool documentation format
- Example content
- Markdown conventions

### 09. **[09-TROUBLESHOOTING.md](./09-TROUBLESHOOTING.md)** 🔧
**DEBUG - Fix Issues** - Solve common problems.
- TypeScript errors
- Import issues
- Network problems
- Testing failures

### 10. **[10-CONSOLIDATION-PLAN.md](./10-CONSOLIDATION-PLAN.md)** 📋
**REFERENCE - Historical Context** - Understand the consolidation.

---

## 📋 Document Usage Workflow

### Building a New Server (Follow in Order)
1. **[01-Blockchain-MCP-Standard-v3.0]** → Read standard & requirements
2. **[02-UNIVERSAL-TOOL-NAMING-REGISTRY]** → Understand tool naming conventions
3. **[03-QUICK-START]** → Follow Option A for new builds
4. **[04-NETWORK-CONFIGS]** → Set up blockchain connections
5. **[06-ERROR-HANDLING]** → Implement error patterns
6. **[07-HELP-SYSTEM]** → Add help tools
7. **[05-TESTING]** → Write tests & validate
8. **[08-README-TEMPLATE]** → Document your server
9. **[09-TROUBLESHOOTING]** → Fix any issues

### Converting Existing Server (Follow in Order)
1. **[01-Blockchain-MCP-Standard-v3.0]** → Understand target architecture
2. **[02-UNIVERSAL-TOOL-NAMING-REGISTRY]** → Check tool naming compliance
3. **[03-QUICK-START]** → Follow Option B for migration
4. **[06-ERROR-HANDLING]** → Refactor error handling
5. **[05-TESTING]** → Add comprehensive tests
6. **[08-README-TEMPLATE]** → Update documentation
7. **[09-TROUBLESHOOTING]** → Debug migration issues

### Quick Reference

**For New Developers:**
- Start with docs 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08

**For Migration:**
- Start with docs 01 → 02 → 03 → 06 → 05 → 08 → 09

**For Debugging:**
- Jump directly to doc 09 (TROUBLESHOOTING)

**For Testing:**
- Jump directly to doc 05 (TESTING-STANDARD)

**For Tool Naming:**
- Jump directly to doc 02 (UNIVERSAL-TOOL-NAMING-REGISTRY)

---

## Benefits of Consolidation

### Before (28 documents, ~300KB)
- 🔴 Massive duplication across documents
- 🔴 Unclear which standard to follow
- 🔴 Information scattered everywhere
- 🔴 Maintenance nightmare

### After (10 documents, ~160KB)
- ✅ **64% reduction** in document count
- ✅ **47% reduction** in total size
- ✅ **Single source of truth** (Blockchain MCP Standard v3.0 (BMCPS v3.0))
- ✅ **Clear hierarchy** of standards
- ✅ **No duplication** between documents
- ✅ **Easy to maintain** and update

---

## Archived Documents

Historical documents are preserved in the `archive/` directory:

- `archive/mbps-v2.1/` - Previous tool requirement standards
- `archive/msas-v1.0/` - Previous architecture standards  
- `archive/old-guides/` - Superseded guides and templates
- `archive/specific-implementations/` - Chain-specific docs

These are kept for reference but should not be used for new development.

---

## Version History

- **v3.0** (Current) - Unified Blockchain MCP Standard (BMCPS) with 9 core documents
- **v2.1** - Separate MBPS (tools) and MSAS (architecture) standards
- **v2.0** - Initial MBPS comprehensive standard
- **v1.0** - Original scattered documentation

---

## Contributing

When updating standards:
1. Edit the appropriate document in the main directory
2. Do not create new documents unless absolutely necessary
3. Ensure changes are reflected in related documents
4. Update this README if structural changes occur

---

**Build modular. Scale infinitely. Ship fast.**

*Last consolidated: January 2025*
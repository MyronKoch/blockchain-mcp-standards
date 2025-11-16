# Blockchain MCP Server Standards

## 📚 Consolidated Documentation (v3.0)

We've consolidated 28 documents down to 9 core standards for clarity and maintainability.

---

## Core Standards (Numbered in Usage Order)

### 01. **[01-Blockchain-MCP-Standard-v3.0.md](./01-01-Blockchain-MCP-Standard-v3.0.md)** ⭐
**READ FIRST - The Main Standard** - Understand the architecture and requirements.
- Modular architecture patterns
- 25 mandatory tools specification
- Code organization structure
- Naming conventions
- Implementation templates

### 02. **[QUICK-START-GUIDE.md](./02-QUICK-START-GUIDE.md)** 🚀
**START HERE - Implementation Guide** - Begin building or converting.
- New server creation (2 hours)
- Migration from monolithic to modular
- Step-by-step instructions
- Validation scripts

### 03. **[NETWORK-CONFIGURATIONS.md](./03-NETWORK-CONFIGURATIONS.md)** 🌐
**CONFIGURE - Network Setup** - Set up blockchain connections.
- RPC endpoints
- Chain IDs
- Testnet/Mainnet configs
- Environment variables

### 04. **[ERROR-HANDLING-PATTERNS.md](./04-ERROR-HANDLING-PATTERNS.md)** 🛡️
**IMPLEMENT - Error Management** - Add proper error handling.
- McpError usage
- Error codes
- User-friendly messages
- Recovery strategies

### 05. **[HELP-SYSTEM-IMPLEMENTATION.md](./05-HELP-SYSTEM-IMPLEMENTATION.md)** ❓
**ENHANCE - Help System** - Implement tool discovery.
- Tool discovery
- Category organization
- Search functionality
- Help formatting

### 06. **[TESTING-STANDARD.md](./06-TESTING-STANDARD.md)** 🧪
**VALIDATE - Testing Requirements** - Ensure 95%+ coverage.
- Jest configuration
- Security testing suite
- Chaos engineering tests
- Performance benchmarks
- UAT procedures

### 07. **[README-TEMPLATE.md](./07-README-TEMPLATE.md)** 📝
**DOCUMENT - Create README** - Document your server.
- Standard sections
- Tool documentation format
- Example content
- Markdown conventions

### 08. **[TROUBLESHOOTING.md](./08-TROUBLESHOOTING.md)** 🔧
**DEBUG - Fix Issues** - Solve common problems.
- TypeScript errors
- Import issues
- Network problems
- Testing failures

### 09. **[CONSOLIDATION-PLAN.md](./09-CONSOLIDATION-PLAN.md)** 📋
**REFERENCE - Historical Context** - Understand the consolidation.

---

## 📋 Document Usage Workflow

### Building a New Server (Follow in Order)
1. **[01-Blockchain-MCP-Standard-v3.0]** → Read standard & requirements
2. **[02-QUICK-START]** → Follow Option A for new builds
3. **[03-NETWORK-CONFIGS]** → Set up blockchain connections
4. **[04-ERROR-HANDLING]** → Implement error patterns
5. **[05-HELP-SYSTEM]** → Add help tools
6. **[06-TESTING]** → Write tests & validate
7. **[07-README-TEMPLATE]** → Document your server
8. **[08-TROUBLESHOOTING]** → Fix any issues

### Converting Existing Server (Follow in Order)
1. **[01-Blockchain-MCP-Standard-v3.0]** → Understand target architecture
2. **[02-QUICK-START]** → Follow Option B for migration
3. **[04-ERROR-HANDLING]** → Refactor error handling
4. **[06-TESTING]** → Add comprehensive tests
5. **[07-README-TEMPLATE]** → Update documentation
6. **[08-TROUBLESHOOTING]** → Debug migration issues

### Quick Reference

**For New Developers:**
- Start with docs 01 → 02 → 03 → 04 → 05 → 06 → 07

**For Migration:**
- Start with docs 01 → 02 → 04 → 06 → 07 → 08

**For Debugging:**
- Jump directly to doc 08 (TROUBLESHOOTING)

**For Testing:**
- Jump directly to doc 06 (TESTING-STANDARD)

---

## Benefits of Consolidation

### Before (28 documents, ~300KB)
- 🔴 Massive duplication across documents
- 🔴 Unclear which standard to follow
- 🔴 Information scattered everywhere
- 🔴 Maintenance nightmare

### After (9 documents, ~150KB)
- ✅ **68% reduction** in document count
- ✅ **50% reduction** in total size
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

*Last consolidated: September 2025*
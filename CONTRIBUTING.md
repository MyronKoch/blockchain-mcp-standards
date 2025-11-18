# Contributing to Blockchain MCP Standard (BMCPS)

Thank you for your interest in contributing to the Blockchain MCP Standard! This document provides guidelines for contributing to the standards documentation and tooling.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Types of Contributions](#types-of-contributions)
- [Contribution Process](#contribution-process)
- [Documentation Standards](#documentation-standards)
- [Review Process](#review-process)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment. We value:
- Constructive feedback and discussion
- Clear and professional communication
- Focus on improving the standard for all users
- Respect for different perspectives and use cases

---

## How to Contribute

### Reporting Issues
If you find inconsistencies, errors, or areas for improvement:

1. **Check existing issues** to avoid duplicates
2. **Open a new issue** with:
   - Clear title describing the problem
   - Specific document(s) affected
   - Current behavior vs. expected behavior
   - Suggested fix (if applicable)

### Suggesting Enhancements
For new features, tools, or improvements:

1. **Open an issue** labeled "enhancement"
2. **Describe the proposal**:
   - What problem does it solve?
   - Which blockchains/use cases benefit?
   - Impact on existing standards
   - Backward compatibility considerations

---

## Types of Contributions

### 1. Documentation Improvements
- Fixing typos, grammatical errors, or unclear wording
- Adding examples or clarifications
- Improving code samples
- Updating outdated information

**Process**: Direct pull request for minor fixes, issue discussion for major changes

### 2. New Tool Proposals
Adding new tools to the standard:

- **Mandatory tools** (requires major version): Need broad consensus and multiple blockchain support
- **Optional tools** (minor version): Should follow existing patterns and naming conventions

**Process**: 
1. Open issue for discussion
2. Demonstrate need across multiple blockchains
3. Show examples from existing implementations
4. Update doc 02 (UNIVERSAL-TOOL-NAMING-REGISTRY.md)

### 3. New Blockchain Support
Proposing a new blockchain prefix:

**Requirements**:
- Active blockchain with public testnet/mainnet
- RPC endpoints available for developers
- Clear documentation of blockchain capabilities
- Commitment to implement 25 mandatory tools

**Process**:
1. Open issue with blockchain proposal
2. Add to "Proposed Future Support" section in doc 02
3. After 2+ server implementations, move to "Official BMCPS v3.0 Supported Blockchains"

### 4. Factory Script Improvements
Enhancing automation tools:

- `bmcps-factory.js`
- `bmcps-validation.js`
- `bmcps-testing-framework.js`
- `implementation-templates.js`

**Requirements**:
- Must work across all 15 official blockchains
- Maintain backward compatibility
- Include usage examples
- Test against reference implementations

### 5. Testing Standards
Improvements to doc 05 (TESTING-STANDARD.md):

- New test categories
- Additional security tests
- Performance benchmarks
- UAT procedures

---

## Contribution Process

### Step 1: Fork and Clone
```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR-USERNAME/blockchain-mcp-standards.git
cd blockchain-mcp-standards
git remote add upstream https://github.com/ORIGINAL-OWNER/blockchain-mcp-standards.git
```

### Step 2: Create a Branch
```bash
git checkout -b feature/your-improvement-name
# or
git checkout -b fix/issue-number-description
```

### Step 3: Make Changes
Follow the [Documentation Standards](#documentation-standards) below.

### Step 4: Test Your Changes
- Verify all internal links work
- Check markdown renders correctly
- Run validation scripts if applicable
- Ensure no broken references

### Step 5: Commit
```bash
git add .
git commit -m "Clear description of changes

- Specific change 1
- Specific change 2
- Fixes #issue-number (if applicable)"
```

### Step 6: Push and Create PR
```bash
git push origin feature/your-improvement-name
```

Then open a Pull Request on GitHub with:
- Clear title and description
- Link to related issue (if applicable)
- Summary of changes
- Impact on existing standards

---

## Documentation Standards

### File Naming
- Use numbered prefixes for core documents: `01-`, `02-`, etc.
- Use kebab-case for names: `tool-naming-registry.md`
- Keep filenames concise but descriptive

### Markdown Formatting
- Use ATX-style headers (`#`, `##`, `###`)
- Maximum line length: 120 characters (flexible for tables)
- Use code fences with language hints: ` ```typescript `
- Use tables for structured data
- Include table of contents for documents >500 lines

### Cross-References
- Use relative links: `./01-Blockchain-MCP-Standard-v3.0.md`
- Always include file extensions: `.md`
- Test all links before submitting

### Code Examples
- Use TypeScript for server examples
- Use bash for command-line examples
- Include comments explaining key concepts
- Keep examples concise and focused

### Terminology
- **Use**: "BMCPS v3.0" or "Blockchain MCP Standard v3.0"
- **Don't use**: MBSS, MSAS, MBPS (except in historical context)
- **Blockchain names**: Use official capitalization (e.g., "Ethereum" not "ethereum")
- **Tool naming**: Always use backticks: `` `eth_get_balance` ``

---

## Review Process

### For Maintainers

**Minor Changes** (typos, formatting, small clarifications):
- Review within 48 hours
- Merge if no issues

**Major Changes** (new tools, architecture changes, breaking changes):
- Require discussion and consensus
- Review by 2+ maintainers
- Allow 7 days for community feedback
- Update CHANGELOG.md
- Tag with appropriate version

### For Contributors

Your PR will be reviewed for:
1. **Correctness**: Is the information accurate?
2. **Consistency**: Does it align with existing standards?
3. **Completeness**: Are all related documents updated?
4. **Clarity**: Is it easy to understand?
5. **Impact**: What's the effect on existing implementations?

Expect:
- Constructive feedback within 7 days
- Possible requests for changes or clarification
- Merge after approval from maintainers

---

## Specific Contribution Guidelines

### Proposing New Mandatory Tools
**High bar for acceptance**:
1. Must be applicable to 10+ blockchains
2. Must not duplicate existing tools
3. Must follow naming convention
4. Requires major version bump

Example proposal format:
```markdown
## Proposal: Add `{prefix}_get_nonce` to mandatory tools

**Rationale**: Nonce management is essential for transaction ordering on 12+ blockchains

**Affected Blockchains**: Ethereum, Polygon, Avalanche, BNB Chain, Arbitrum, Base, TRON, ...

**Current Workaround**: Users must query manually via `get_account_info`

**Implementation Examples**: [Link to 3+ existing implementations]

**Breaking Change**: Yes - requires all servers to implement

**Proposed Version**: 4.0.0
```

### Updating Blockchain Registry
To add a blockchain to "Official BMCPS v3.0 Supported Blockchains":

**Requirements**:
1. 2+ production MCP servers implementing 25 mandatory tools
2. Public RPC endpoints available
3. Active community and documentation
4. Listed in doc 02 "Proposed Future Support" for 30+ days

**Process**:
1. Submit PR moving blockchain from "Proposed" to "Official"
2. Add to all relevant tables (doc 01, 02, CLAUDE.md, llm.txt)
3. Include links to reference server implementations

---

## Questions?

- **Documentation questions**: Open an issue with label "question"
- **Implementation questions**: Refer to doc 03 (QUICK-START-GUIDE.md)
- **Urgent issues**: Tag issue as "urgent" with clear justification

---

## Recognition

Contributors will be recognized in:
- Git commit history
- CHANGELOG.md (for significant contributions)
- Future versions of the standard

Thank you for helping improve the Blockchain MCP Standard! 🚀

# Changelog

All notable changes to the Blockchain MCP Standard (BMCPS) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2025-01-XX

### Added
- **Unified Standard**: Combined MBPS v2.1 (tool requirements) and MSAS v1.0 (architecture standard) into single BMCPS v3.0
- **10 Core Documents**: Consolidated 28 scattered documents into 10 numbered standards
- **Universal Tool Naming Registry** (doc 02): Comprehensive registry of all standard tool names with 15 official blockchains
- **Factory Automation**: 4 Node.js scripts for server generation, validation, testing, and templates
  - `bmcps-factory.js` - Generate new compliant servers
  - `bmcps-validation.js` - Validate server compliance
  - `bmcps-testing-framework.js` - Setup testing infrastructure
  - `implementation-templates.js` - Generate tool implementation stubs
- **15 Official Blockchain Prefixes**: Bitcoin, Ethereum, Solana, Polygon, Avalanche, Arbitrum, Base, BNB Chain, Cosmos, Osmosis, NEAR, Sui, TRON, XRP, World Chain
- **6 Proposed Blockchains**: Cardano, Polkadot, Chainlink, Stellar, Flow, Aptos (marked as future support)
- **llm.txt**: AI-friendly quick reference guide for LLMs
- **CLAUDE.md**: Repository instructions for Claude Code
- **Compliance Levels**: Bronze (25 tools), Silver (40+ tools), Gold (100+ tools)

### Changed
- **Document Count**: Reduced from 28 documents to 10 core standards (64% reduction)
- **Total Size**: Reduced from ~300KB to ~160KB (47% reduction)
- **Naming Convention**: Standardized to `{prefix}_{action}_{resource}` across all blockchains
- **Mandatory Tools**: Clarified exactly 25 required tools (was 24 in some docs)
- **Directory Structure**: Enforced modular organization with category-based tool folders
- **Version Date**: Standardized to January 2025

### Fixed
- **Documentation Consistency**: Fixed all cross-references and broken links
- **Blockchain Registry**: Aligned all documents to 15 official blockchains
- **Terminology**: Replaced inconsistent MBSS/MSAS references with BMCPS v3.0
- **Tool Counts**: Corrected "24 tools" to "25 tools" where incorrect
- **README Links**: Fixed all 9 broken document links in README.md

### Removed
- **Duplicate Documentation**: Eliminated massive duplication across scattered docs
- **Obsolete Standards**: Archived MBPS v2.1 and MSAS v1.0 to `archive/` directory
- **Confusing Terminology**: Removed mixed usage of MBSS/MBPS/MSAS in favor of unified BMCPS

## [2.1.0] - 2024-12-XX

### Added
- MBPS (MCP Blockchain Protocol Standard) tool requirements
- 25 mandatory tool specification
- Tool naming conventions
- Extended tool categories

## [1.0.0] - 2024-09-XX

### Added
- MSAS (MCP Server Architecture Standard) initial release
- Modular architecture patterns
- Directory structure conventions
- Code organization guidelines

---

## Migration Guide

### From v2.1 to v3.0
1. Update all references from "MBPS" to "BMCPS v3.0"
2. Update all references from "MSAS" to "BMCPS v3.0"
3. Use numbered documents (01-10) instead of old file names
4. Ensure all 25 mandatory tools are implemented
5. Follow modular directory structure from doc 01
6. Use tool naming from doc 02 (UNIVERSAL-TOOL-NAMING-REGISTRY.md)

### From v1.0 to v3.0
1. Implement all 25 mandatory tools from doc 01
2. Reorganize code into modular structure
3. Follow naming convention: `{prefix}_{action}_{resource}`
4. Add comprehensive testing per doc 05
5. Update documentation per doc 08

---

## Versioning Strategy

- **Major version** (X.0.0): Breaking changes to standard requirements
- **Minor version** (3.X.0): New optional tools, clarifications, non-breaking additions
- **Patch version** (3.0.X): Typo fixes, documentation improvements, corrections

---

*For detailed information, see the [10 core standards](./README.md) in this repository.*

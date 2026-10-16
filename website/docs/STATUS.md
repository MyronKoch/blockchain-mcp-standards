---
title: "Status: frozen, and what I'd change today"
sidebar_label: "Status: frozen (read first)"
---

# Status: frozen, and what I'd change today

I wrote BMCPS v3.0 in 2025, while building a family of blockchain MCP servers, because I wanted every one of them to expose the same tools under the same names. As of October 2026 it is **frozen**: kept online as a reference, no longer actively developed.

## What it is

- **A specification.** 25 mandatory tools, `{prefix}_{action}_{resource}` naming, one tool per file, and Bronze / Silver / Gold compliance tiers.
- **`tools-schema.json`.** The 25 tools described once, independent of any protocol.
- **`bmcps-generator.js`.** Emits MCP, OpenAI function, REST API and JSON Schema output from that one file. Its 238 automated tests pass.

## Honest limits

- **The MCP output is a skeleton, and as shipped it does not compile.** Handlers are stubs, and a quoting bug in one generated tool breaks the TypeScript build.
- **The "JSON Schema" output is not valid JSON Schema** for tools that take parameters. It lists them in BMCPS's own format rather than as `properties`.
- **The 238 tests check the shape of the generated files, not that they build or run.** That gap is how the two bugs above shipped.
- **The generator knows 17 chain identifiers.** That is a target list, not 17 working integrations.
- **24 or 25.** The servers I built against this standard implement 24 of the 25 tools: each is pinned to one network, so `set_network` does not apply. The specification text still says 25.
- **It targets MCP as it stood in 2025.** The protocol has moved on since; the current revision is 2026-07-28.

## What I'd change today

1. **Make "it runs" the first test.** In CI, generate a server, build it, start it, and call `tools/list`. Shape checks come second.
2. **One canonical tool contract** in a single machine-readable file that the spec, generators and validators all read, so counts and names cannot drift apart.
3. **Use what MCP has added since:** tool annotations (read-only vs destructive), `outputSchema` with structured results, and `isError` for tool failures instead of protocol errors.
4. **Gate anything that moves funds.** `send_transaction`, `transfer_token` and `approve_token` should require explicit approval by default.
5. **Target the current MCP revision** and drop the patterns it has deprecated.
6. **Keep one copy of the docs.** The repository and this site each carry their own, and they drifted.

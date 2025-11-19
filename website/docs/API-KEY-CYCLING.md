# API Key Cycling Guide for Blockchain MCP Servers

## 🔒 Security Notice

This document provides instructions for rotating API keys and sensitive credentials used in blockchain MCP servers built according to BMCPS v3.0. Regular key rotation is a critical security practice.

**⚠️ IMPORTANT**: Never commit API keys, private keys, or secrets to version control. Always use environment variables or secure secret management.

---

## Table of Contents
- [Common API Keys in Blockchain MCP Servers](#common-api-keys-in-blockchain-mcp-servers)
- [When to Rotate Keys](#when-to-rotate-keys)
- [Step-by-Step Key Rotation](#step-by-step-key-rotation)
- [Provider-Specific Instructions](#provider-specific-instructions)
- [Verification Checklist](#verification-checklist)
- [Emergency Key Revocation](#emergency-key-revocation)

---

## Common API Keys in Blockchain MCP Servers

### 1. **RPC Provider API Keys**
Used to connect to blockchain networks.

**Providers:**
- **Alchemy** - Ethereum, Polygon, Arbitrum, Base, etc.
- **Infura** - Ethereum, Polygon, Arbitrum
- **QuickNode** - Multi-chain support
- **Ankr** - Multi-chain support
- **Helius** - Solana
- **GetBlock** - Multi-chain support

**Environment Variable**: `RPC_URL` or `\{BLOCKCHAIN\}_RPC_URL`

**Example**:
```bash
ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
```

### 2. **Blockchain Explorer API Keys**
Used for transaction history and account lookups.

**Providers:**
- **Etherscan** - Ethereum
- **Polygonscan** - Polygon
- **Arbiscan** - Arbitrum
- **Basescan** - Base
- **BscScan** - BNB Chain
- **Blockchair** - Bitcoin
- **XRPScan** - XRP Ledger

**Environment Variable**: `EXPLORER_API_KEY` or `\{BLOCKCHAIN\}_EXPLORER_API_KEY`

**Example**:
```bash
ETHERSCAN_API_KEY=ABCDEFGHIJKLMNOPQRSTUVWXYZ123456
POLYGONSCAN_API_KEY=ABCDEFGHIJKLMNOPQRSTUVWXYZ123456
```

### 3. **Price/Market Data API Keys**
Used for token price queries and market data.

**Providers:**
- **CoinGecko** (Pro)
- **CoinMarketCap**
- **Coinbase**
- **Messari**

**Environment Variable**: `PRICE_API_KEY` or `COINGECKO_API_KEY`

**Example**:
```bash
COINGECKO_API_KEY=CG-XXXXXXXXXXXXXXXXXXXX
COINMARKETCAP_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 4. **MCP Inspector/Testing Keys**
Used during development and testing.

**Environment Variable**: `MCP_TEST_KEY` or `INSPECTOR_API_KEY`

### 5. **Database/Storage API Keys** (if applicable)
For caching or persistent storage.

**Providers:**
- **Supabase**
- **MongoDB Atlas**
- **Redis Cloud**
- **PostgreSQL**

**Environment Variable**: `DATABASE_URL`

---

## When to Rotate Keys

### Scheduled Rotation (Recommended)
- **Every 90 days** for production keys
- **Every 30 days** for development/testing keys
- **Immediately** after team member departure

### Immediate Rotation Required
1. **Key Exposure**: API key committed to public repository
2. **Security Breach**: Unauthorized access detected
3. **Suspicious Activity**: Unusual API usage patterns
4. **Compliance**: Regulatory or audit requirements
5. **Service Compromise**: Provider reports breach

---

## Step-by-Step Key Rotation

### Phase 1: Generate New Keys (Day 0)

#### For RPC Providers (Alchemy Example)

1. **Log into Alchemy Dashboard**
   - Go to https://dashboard.alchemy.com/
   - Navigate to "Apps"

2. **Create New App**
   - Click "Create App"
   - Name: `\{blockchain\}-mcp-server-v2` (increment version)
   - Chain: Select your blockchain
   - Network: Mainnet or Testnet

3. **Get New API Key**
   - Click "View Key"
   - Copy the new HTTPS endpoint
   - Store securely (password manager)

4. **Repeat for Each Blockchain**

#### For Blockchain Explorers (Etherscan Example)

1. **Log into Etherscan**
   - Go to https://etherscan.io/myapikey
   - Login with your account

2. **Generate New API Key**
   - Click "Add" to create new API key
   - Name: `mcp-server-2025-01` (use date)
   - Copy the new key

3. **Save Securely**

### Phase 2: Update Environment Variables (Day 0)

#### Local Development

1. **Update `.env.local` file** (NEVER commit this file)
   ```bash
   # Old keys (keep temporarily)
   # ETH_RPC_URL_OLD=https://eth-mainnet.g.alchemy.com/v2/OLD_KEY
   
   # New keys (active)
   ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/NEW_KEY
   POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/NEW_KEY
   ETHERSCAN_API_KEY=NEW_ETHERSCAN_KEY
   POLYGONSCAN_API_KEY=NEW_POLYGONSCAN_KEY
   ```

2. **Verify `.gitignore` includes**:
   ```
   .env
   .env.local
   .env.*.local
   *.key
   *.pem
   secrets/
   ```

#### Production/Staging Environments

**Option A: Environment Variables (Recommended)**

For cloud deployments:

1. **AWS Systems Manager Parameter Store**
   ```bash
   aws ssm put-parameter \
     --name /mcp-server/eth/rpc-url \
     --value "https://eth-mainnet.g.alchemy.com/v2/NEW_KEY" \
     --type SecureString \
     --overwrite
   ```

2. **Heroku Config Vars**
   ```bash
   heroku config:set ETH_RPC_URL="https://eth-mainnet.g.alchemy.com/v2/NEW_KEY"
   ```

3. **Vercel Environment Variables**
   - Dashboard → Project → Settings → Environment Variables
   - Update each key
   - Redeploy

**Option B: Secret Management Services**

1. **HashiCorp Vault**
   ```bash
   vault kv put secret/mcp-server \
     eth_rpc_url="https://eth-mainnet.g.alchemy.com/v2/NEW_KEY"
   ```

2. **AWS Secrets Manager**
   ```bash
   aws secretsmanager update-secret \
     --secret-id mcp-server/eth-rpc \
     --secret-string '\{"rpc_url":"https://eth-mainnet.g.alchemy.com/v2/NEW_KEY"\}'
   ```

### Phase 3: Test New Keys (Day 0)

#### Run Verification Tests

1. **Local Testing**
   ```bash
   # Load new environment
   source .env.local
   
   # Build and test
   npm run build
   npm run test
   
   # Manual inspection
   npm run inspect
   ```

2. **Test Each Tool**
   ```bash
   # Test RPC connectivity
   curl -X POST https://eth-mainnet.g.alchemy.com/v2/NEW_KEY \
     -H "Content-Type: application/json" \
     -d '\{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1\}'
   
   # Expected: \{"jsonrpc":"2.0","id":1,"result":"0x..."\}
   ```

3. **Verify in MCP Inspector**
   - Open MCP Inspector
   - Test `\{prefix\}_get_chain_info`
   - Test `\{prefix\}_get_balance` with known address
   - Test `\{prefix\}_get_transaction_history`

4. **Check Logs**
   ```bash
   # Look for authentication errors
   grep -i "auth\|unauthorized\|forbidden" logs/*.log
   ```

### Phase 4: Deploy Changes (Day 1-2)

#### Deployment Strategy

**Blue-Green Deployment (Recommended)**
1. Deploy new version with new keys to "green" environment
2. Test thoroughly in green environment
3. Switch traffic from "blue" to "green"
4. Monitor for 24 hours
5. Decommission "blue" environment

**Rolling Update**
1. Update keys in staging environment first
2. Test for 24 hours in staging
3. Gradually roll out to production (10% → 50% → 100%)
4. Monitor error rates and latency

### Phase 5: Revoke Old Keys (Day 7)

**⚠️ Wait Period**: Keep old keys active for 7 days to ensure smooth transition.

#### Alchemy (RPC Provider)

1. **Archive Old App**
   - Dashboard → Apps
   - Click on old app
   - "Archive App" (don't delete immediately)

2. **Verify No Usage**
   - Check analytics for requests on old key
   - Should be 0 requests after migration

3. **Delete After 30 Days**

#### Etherscan (Explorer API)

1. **Deactivate Old Key**
   - Dashboard → API Keys
   - Click "Delete" on old key

2. **Confirm Deletion**

#### Document the Rotation

Update your internal documentation:
```markdown
## API Key Rotation Log

| Date | Provider | Key Name | Rotated By | Reason |
|------|----------|----------|------------|--------|
| 2025-01-15 | Alchemy | eth-mainnet-v2 | DevOps | Scheduled 90-day rotation |
| 2025-01-15 | Etherscan | api-key-2025-01 | DevOps | Scheduled 90-day rotation |
```

---

## Provider-Specific Instructions

### Alchemy

**Dashboard**: https://dashboard.alchemy.com/

**Steps**:
1. Apps → Create App
2. Select Chain & Network
3. Copy HTTPS endpoint
4. Update `\{BLOCKCHAIN\}_RPC_URL`
5. Archive old app after 7 days

**Rate Limits**: Check your plan's compute units

### Infura

**Dashboard**: https://infura.io/dashboard

**Steps**:
1. Create New Project
2. Copy Project ID
3. Update RPC URL: `https://mainnet.infura.io/v3/PROJECT_ID`
4. Delete old project after verification

### QuickNode

**Dashboard**: https://dashboard.quicknode.com/

**Steps**:
1. Create Endpoint
2. Select Chain & Network
3. Copy HTTP Provider URL
4. Update environment variable
5. Delete old endpoint after 7 days

### Helius (Solana)

**Dashboard**: https://dashboard.helius.dev/

**Steps**:
1. Create New API Key
2. Copy key
3. Update `SOLANA_RPC_URL`
4. Deactivate old key after verification

### Etherscan/Polygonscan/BscScan

**Dashboard**: https://etherscan.io/myapikey (varies by chain)

**Steps**:
1. Login → My API Keys
2. Add new API key
3. Name with date (e.g., `mcp-2025-01`)
4. Copy key
5. Delete old key after 7 days

---

## Verification Checklist

After rotating keys, verify:

### Immediate Checks (Day 0)
- [ ] All new keys stored in secure location (password manager)
- [ ] `.env.local` updated with new keys
- [ ] `.env.local` NOT committed to git
- [ ] `.gitignore` includes `.env*`
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] MCP Inspector connects successfully
- [ ] Basic tools work (`get_chain_info`, `get_balance`)

### Pre-Production Checks (Day 1)
- [ ] Staging environment updated
- [ ] Staging tests pass
- [ ] Rate limits verified (no 429 errors)
- [ ] Error monitoring configured
- [ ] Rollback plan documented

### Production Checks (Day 2)
- [ ] Production environment updated
- [ ] Health checks passing
- [ ] Error rates normal (&lt;0.1%)
- [ ] Latency within SLA
- [ ] No authentication errors in logs

### Post-Rotation Checks (Day 7)
- [ ] Old keys showing zero usage
- [ ] No alerts or incidents
- [ ] Old keys archived/deleted
- [ ] Rotation documented in change log
- [ ] Next rotation scheduled (90 days)

---

## Emergency Key Revocation

### If Keys Are Compromised

**Immediate Actions (Within 1 Hour)**:

1. **Revoke Exposed Keys**
   - Log into each provider dashboard
   - Delete/deactivate exposed keys immediately
   - Document time of revocation

2. **Generate Emergency Replacement Keys**
   - Create new keys with emergency naming (`emergency-2025-01-15`)
   - Deploy immediately to production

3. **Update All Environments**
   ```bash
   # Emergency deployment script
   ./scripts/emergency-key-rotation.sh
   ```

4. **Notify Team**
   - Alert security team
   - Post in incident channel
   - Document incident timeline

5. **Assess Damage**
   - Check API usage logs for unauthorized requests
   - Review transaction history for suspicious activity
   - Check for data exfiltration

6. **Monitor Closely**
   - 24-hour monitoring
   - Alert on any unusual patterns
   - Review logs every 2 hours

### If Keys Committed to Git

**Critical Steps**:

1. **Immediately Revoke Keys**
   - Even if you delete the commit, keys are in git history
   - Revoke ALL exposed keys immediately

2. **Rewrite Git History** (if caught quickly)
   ```bash
   # Remove sensitive file from entire history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (⚠️ coordinate with team)
   git push origin --force --all
   ```

3. **Notify Repository Host**
   - GitHub: Use "Report a security vulnerability"
   - GitLab: Contact support to purge sensitive data

4. **Rotate All Keys**
   - Even unrelated keys should be rotated
   - Assume all secrets in the repo are compromised

5. **Post-Mortem**
   - Document how keys were exposed
   - Update processes to prevent recurrence
   - Implement pre-commit hooks:
     ```bash
     # .git/hooks/pre-commit
     #!/bin/bash
     if git diff --cached --name-only | grep -E "\.env|\.key|\.pem"; then
       echo "❌ Error: Attempting to commit secret file"
       exit 1
     fi
     ```

---

## Best Practices

### Key Management

1. **Never Hardcode Keys**
   ```typescript
   // ❌ NEVER DO THIS
   const apiKey = "abc123...";
   
   // ✅ ALWAYS USE ENVIRONMENT VARIABLES
   const apiKey = process.env.API_KEY;
   ```

2. **Use Different Keys Per Environment**
   - Development: `dev-api-key`
   - Staging: `staging-api-key`
   - Production: `prod-api-key`

3. **Implement Key Rotation Automation**
   ```bash
   # Cron job for quarterly rotation reminder
   0 0 1 */3 * /usr/local/bin/rotation-reminder.sh
   ```

4. **Use Secret Management Services**
   - AWS Secrets Manager
   - HashiCorp Vault
   - Azure Key Vault
   - Google Secret Manager

5. **Least Privilege Principle**
   - Create API keys with minimum required permissions
   - Separate read-only keys from write keys

### Monitoring

1. **Set Up Alerts**
   - Alert on authentication failures
   - Alert on rate limit exceeded (429 errors)
   - Alert on unusual usage patterns

2. **Log API Key Usage**
   ```typescript
   logger.info('API request', \{
     provider: 'alchemy',
     keyPrefix: apiKey.slice(0, 8) + '...',  // Never log full key
     endpoint: '/v2/...',
     timestamp: Date.now()
   \});
   ```

3. **Regular Audits**
   - Monthly review of active API keys
   - Quarterly security audit
   - Annual penetration testing

---

## Compliance & Documentation

### Required Documentation

Maintain these records:

1. **API Key Inventory**
   ```csv
   Provider,Key Name,Environment,Created,Last Rotated,Next Rotation,Owner
   Alchemy,eth-mainnet-v3,production,2025-01-15,2025-01-15,2025-04-15,devops@company.com
   ```

2. **Rotation Schedule**
   ```markdown
   | Next Rotation Date | Provider | Environment |
   |--------------------|----------|-------------|
   | 2025-04-15 | Alchemy | Production |
   | 2025-04-15 | Etherscan | Production |
   ```

3. **Incident Log**
   Track all key-related incidents

4. **Access Log**
   Who has access to which keys

### Compliance Requirements

- **SOC 2**: Key rotation every 90 days
- **PCI DSS**: Quarterly key rotation for payment systems
- **ISO 27001**: Documented key management procedures
- **GDPR**: Secure key storage and access controls

---

## Emergency Contacts

### Provider Support

| Provider | Support URL | Emergency Contact |
|----------|-------------|-------------------|
| Alchemy | https://docs.alchemy.com/support | support@alchemy.com |
| Infura | https://infura.io/contact | support@infura.io |
| QuickNode | https://quicknode.com/contact | support@quicknode.com |
| Etherscan | https://etherscan.io/contactus | api@etherscan.io |

---

## Additional Resources

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [NIST Key Management Guidelines](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final)
- [AWS Secrets Manager Best Practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)

---

**Last Updated**: January 2025
**Document Owner**: Security Team
**Review Cycle**: Quarterly

*This document is part of the Blockchain MCP Standard v3.0 (BMCPS v3.0) security documentation.*

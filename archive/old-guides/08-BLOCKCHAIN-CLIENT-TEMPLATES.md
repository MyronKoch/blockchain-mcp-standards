# Blockchain Client Implementation Templates

## 🎯 Complete Client Setup for All Blockchain Types

This document provides complete, ready-to-use blockchain client implementations for different blockchain ecosystems. Each template includes connection handling, error management, and common operations.

---

## 1. EVM Chains (Ethereum, Polygon, BSC, Arbitrum, Base, etc.)

### Dependencies
```bash
npm install ethers@^6.0.0
npm install @types/node@^20.0.0
```

### Client Implementation
```typescript
// src/client.ts
import { ethers } from 'ethers';
import { NetworkConfig } from './config/network.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export class BlockchainClient {
  private provider: ethers.JsonRpcProvider;
  private network: NetworkConfig;

  constructor(network?: string) {
    this.network = this.getNetwork(network);
    this.provider = new ethers.JsonRpcProvider(this.network.rpcUrl);
    this.initializeProvider();
  }

  private getNetwork(networkName?: string): NetworkConfig {
    const networks: Record<string, NetworkConfig> = {
      mainnet: {
        name: 'Ethereum Mainnet',
        chainId: 1,
        rpcUrl: process.env.RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
        symbol: 'ETH',
        blockTime: 12,
        consensus: 'Proof of Stake',
        explorer: 'https://etherscan.io'
      },
      sepolia: {
        name: 'Ethereum Sepolia',
        chainId: 11155111,
        rpcUrl: process.env.TESTNET_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
        symbol: 'ETH',
        blockTime: 12,
        consensus: 'Proof of Stake',
        explorer: 'https://sepolia.etherscan.io'
      },
      polygon: {
        name: 'Polygon Mainnet',
        chainId: 137,
        rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
        symbol: 'MATIC',
        blockTime: 2,
        consensus: 'Proof of Stake',
        explorer: 'https://polygonscan.com'
      },
      amoy: {
        name: 'Polygon Amoy',
        chainId: 80002,
        rpcUrl: process.env.POLYGON_TESTNET_RPC_URL || 'https://rpc-amoy.polygon.technology',
        symbol: 'MATIC',
        blockTime: 2,
        consensus: 'Proof of Stake',
        explorer: 'https://amoy.polygonscan.com'
      },
      bsc: {
        name: 'BNB Smart Chain',
        chainId: 56,
        rpcUrl: process.env.BSC_RPC_URL || 'https://bsc-dataseed1.binance.org',
        symbol: 'BNB',
        blockTime: 3,
        consensus: 'Proof of Staked Authority',
        explorer: 'https://bscscan.com'
      },
      bscTestnet: {
        name: 'BNB Smart Chain Testnet',
        chainId: 97,
        rpcUrl: process.env.BSC_TESTNET_RPC_URL || 'https://bsc-testnet-rpc.publicnode.com',
        symbol: 'tBNB',
        blockTime: 3,
        consensus: 'Proof of Staked Authority',
        explorer: 'https://testnet.bscscan.com'
      }
    };

    return networks[networkName || 'sepolia'] || networks.sepolia;
  }

  private async initializeProvider() {
    try {
      // Test connection
      await this.provider.getBlockNumber();
    } catch (error: any) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to connect to ${this.network.name}: ${error.message}`
      );
    }
  }

  // Core blockchain operations
  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  async getBalance(address: string): Promise<bigint> {
    return await this.provider.getBalance(address);
  }

  async getTransaction(hash: string): Promise<ethers.TransactionResponse> {
    return await this.provider.getTransaction(hash);
  }

  async getTransactionReceipt(hash: string): Promise<ethers.TransactionReceipt | null> {
    return await this.provider.getTransactionReceipt(hash);
  }

  async getBlock(blockNumber: string | number): Promise<ethers.Block> {
    return await this.provider.getBlock(blockNumber);
  }

  async getGasPrice(): Promise<bigint> {
    return await this.provider.getFeeData();
  }

  // Validation methods
  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  isValidTxHash(hash: string): boolean {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  }

  isValidPrivateKey(privateKey: string): boolean {
    try {
      return /^0x[a-fA-F0-9]{64}$/.test(privateKey);
    } catch {
      return false;
    }
  }

  formatBalance(balance: bigint): string {
    return ethers.formatEther(balance);
  }

  getAddressType(address: string): string {
    return 'hex';
  }

  async getConfirmations(hash: string): Promise<number> {
    const tx = await this.provider.getTransaction(hash);
    if (!tx || !tx.blockNumber) return 0;

    const currentBlock = await this.provider.getBlockNumber();
    return currentBlock - tx.blockNumber + 1;
  }

  async getTransactionHistory(address: string, limit: number): Promise<any[]> {
    // EVM chains don't have built-in transaction history
    // This would require external indexing service
    return [];
  }

  async sendTransaction(to: string, amount: string, privateKey?: string): Promise<string> {
    if (!privateKey) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Private key required for transaction signing'
      );
    }

    const wallet = new ethers.Wallet(privateKey, this.provider);
    const tx = await wallet.sendTransaction({
      to,
      value: ethers.parseEther(amount)
    });

    return tx.hash;
  }

  // Get current network
  async getNetwork(): Promise<NetworkConfig> {
    return this.network;
  }

  // Check network health
  async checkHealth(): Promise<{ status: 'healthy' | 'unhealthy' }> {
    try {
      await this.provider.getBlockNumber();
      return { status: 'healthy' };
    } catch {
      return { status: 'unhealthy' };
    }
  }

  async getPeerCount(): Promise<number> {
    try {
      const network = await this.provider.getNetwork();
      return 1; // Simplified for most RPC providers
    } catch {
      return 0;
    }
  }
}
```

## 2. Solana

### Dependencies
```bash
npm install @solana/web3.js@^1.87.0
npm install @solana/spl-token@^0.4.0
```

### Client Implementation
```typescript
// src/client.ts
import {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { NetworkConfig } from './config/network.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export class BlockchainClient {
  private connection: Connection;
  private network: NetworkConfig;

  constructor(network?: string) {
    this.network = this.getNetwork(network);
    this.connection = new Connection(this.network.rpcUrl, 'confirmed');
    this.initializeConnection();
  }

  private getNetwork(networkName?: string): NetworkConfig {
    const networks: Record<string, NetworkConfig> = {
      mainnet: {
        name: 'Solana Mainnet',
        chainId: 101,
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        symbol: 'SOL',
        blockTime: 0.4,
        consensus: 'Proof of Stake',
        explorer: 'https://solscan.io'
      },
      devnet: {
        name: 'Solana Devnet',
        chainId: 103,
        rpcUrl: 'https://api.devnet.solana.com',
        symbol: 'SOL',
        blockTime: 0.4,
        consensus: 'Proof of Stake',
        explorer: 'https://solscan.io/?cluster=devnet'
      }
    };

    return networks[networkName || 'devnet'] || networks.devnet;
  }

  private async initializeConnection() {
    try {
      await this.connection.getVersion();
    } catch (error: any) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to connect to ${this.network.name}: ${error.message}`
      );
    }
  }

  // Core operations
  async getBlockNumber(): Promise<number> {
    return await this.connection.getSlot();
  }

  async getBalance(address: string): Promise<bigint> {
    const publicKey = new PublicKey(address);
    const balance = await this.connection.getBalance(publicKey);
    return BigInt(balance);
  }

  async getTransaction(hash: string): Promise<any> {
    const signature = hash;
    return await this.connection.getTransaction(signature);
  }

  async getBlock(slot: string | number): Promise<any> {
    const slotNumber = typeof slot === 'string' ? parseInt(slot) : slot;
    return await this.connection.getBlock(slotNumber);
  }

  // Validation methods
  isValidAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  isValidTxHash(hash: string): boolean {
    return /^[A-Za-z0-9]{88}$/.test(hash);
  }

  isValidPrivateKey(privateKey: string): boolean {
    try {
      const keypair = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));
      return keypair.publicKey.toString().length > 0;
    } catch {
      return false;
    }
  }

  formatBalance(balance: bigint): string {
    return (Number(balance) / LAMPORTS_PER_SOL).toFixed(9);
  }

  getAddressType(address: string): string {
    return 'base58';
  }

  async getConfirmations(hash: string): Promise<number> {
    const tx = await this.connection.getTransaction(hash);
    if (!tx) return 0;

    const currentSlot = await this.connection.getSlot();
    return currentSlot - tx.slot + 1;
  }

  async getTransactionHistory(address: string, limit: number): Promise<any[]> {
    const publicKey = new PublicKey(address);
    const transactions = await this.connection.getSignaturesForAddress(publicKey, { limit });

    return transactions.map((sig, index) => ({
      hash: sig.signature,
      blockNumber: sig.slot,
      from: address,
      to: 'unknown', // Solana doesn't have explicit to/from
      value: '0', // Would need additional parsing
      timestamp: sig.blockTime,
      status: sig.confirmationStatus === 'finalized' ? 'confirmed' : 'pending'
    }));
  }

  async sendTransaction(to: string, amount: string, privateKey?: string): Promise<string> {
    if (!privateKey) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Private key required for Solana transaction signing'
      );
    }

    const fromKeypair = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));
    const toPublicKey = new PublicKey(to);
    const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports
      })
    );

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [fromKeypair]
    );

    return signature;
  }

  // Solana-specific methods
  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<any> {
    const tokenMint = new PublicKey(tokenAddress);
    const wallet = new PublicKey(walletAddress);

    try {
      const balance = await this.connection.getTokenAccountBalance(tokenMint);
      return {
        balance: balance.value.amount,
        decimals: balance.value.decimals,
        uiAmount: balance.value.uiAmount
      };
    } catch {
      return { balance: '0', decimals: 0, uiAmount: 0 };
    }
  }

  async getTokenInfo(tokenAddress: string): Promise<any> {
    // Solana token info would require additional API calls
    return {
      address: tokenAddress,
      name: 'Unknown Token',
      symbol: 'UNKNOWN',
      decimals: 9,
      totalSupply: '0'
    };
  }

  // Get current network
  async getNetwork(): Promise<NetworkConfig> {
    return this.network;
  }

  // Check network health
  async checkHealth(): Promise<{ status: 'healthy' | 'unhealthy' }> {
    try {
      await this.connection.getVersion();
      return { status: 'healthy' };
    } catch {
      return { status: 'unhealthy' };
    }
  }

  async getPeerCount(): Promise<number> {
    return 0; // Solana RPC doesn't expose peer count easily
  }
}
```

## 3. Bitcoin

### Dependencies
```bash
npm install bitcoinjs-lib@^6.1.0
npm install axios@^1.6.0
npm install tiny-secp256k1@^2.2.0
npm install ecpair@^2.1.0
```

### Client Implementation
```typescript
// src/client.ts
import axios, { AxiosInstance } from 'axios';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import { NetworkConfig } from './config/network.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

const ECPair = ECPairFactory(ecc);
bitcoin.initEccLib(ecc);

export class BlockchainClient {
  private rpcClient: AxiosInstance;
  private network: NetworkConfig;

  constructor(network?: string) {
    this.network = this.getNetwork(network);
    this.rpcClient = axios.create({
      baseURL: this.network.rpcUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.initializeClient();
  }

  private getNetwork(networkName?: string): NetworkConfig {
    const networks: Record<string, NetworkConfig> = {
      mainnet: {
        name: 'Bitcoin Mainnet',
        chainId: 'mainnet',
        rpcUrl: 'https://mempool.space/api',
        symbol: 'BTC',
        blockTime: 600,
        consensus: 'Proof of Work',
        explorer: 'https://mempool.space'
      },
      testnet: {
        name: 'Bitcoin Testnet',
        chainId: 'testnet',
        rpcUrl: 'https://mempool.space/testnet/api',
        symbol: 'tBTC',
        blockTime: 600,
        consensus: 'Proof of Work',
        explorer: 'https://mempool.space/testnet'
      }
    };

    return networks[networkName || 'testnet'] || networks.testnet;
  }

  private async initializeClient() {
    try {
      await this.rpcClient.get('/blocks/tip/height');
    } catch (error: any) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to connect to ${this.network.name}: ${error.message}`
      );
    }
  }

  // Core operations
  async getBlockNumber(): Promise<number> {
    const response = await this.rpcClient.get('/blocks/tip/height');
    return response.data;
  }

  async getBalance(address: string): Promise<bigint> {
    const response = await this.rpcClient.get(`/address/${address}`);
    return BigInt(Math.floor(response.data.chain_stats.funded_txo_sum / 100000000));
  }

  async getTransaction(hash: string): Promise<any> {
    const response = await this.rpcClient.get(`/tx/${hash}`);
    return response.data;
  }

  async getBlock(blockNumber: string | number): Promise<any> {
    if (blockNumber === 'latest') {
      const height = await this.getBlockNumber();
      blockNumber = height;
    }
    const response = await this.rpcClient.get(`/block/${blockNumber}`);
    return response.data;
  }

  // Validation methods
  isValidAddress(address: string): boolean {
    try {
      bitcoin.address.toOutputScript(address, this.getBitcoinNetwork());
      return true;
    } catch {
      return false;
    }
  }

  isValidTxHash(hash: string): boolean {
    return /^[a-fA-F0-9]{64}$/.test(hash);
  }

  isValidPrivateKey(privateKey: string): boolean {
    try {
      const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'));
      return keyPair.publicKey.length > 0;
    } catch {
      return false;
    }
  }

  formatBalance(balance: bigint): string {
    return (Number(balance) / 100000000).toFixed(8);
  }

  getAddressType(address: string): string {
    try {
      bitcoin.address.toOutputScript(address, this.getBitcoinNetwork());
      return 'bech32'; // Most common for testnet
    } catch {
      return 'unknown';
    }
  }

  async getConfirmations(hash: string): Promise<number> {
    const tx = await this.getTransaction(hash);
    if (!tx.status?.confirmed) return 0;

    const currentBlock = await this.getBlockNumber();
    return currentBlock - tx.status.block_height + 1;
  }

  async getTransactionHistory(address: string, limit: number): Promise<any[]> {
    const response = await this.rpcClient.get(`/address/${address}/txs`);
    return response.data.slice(0, limit).map((tx: any) => ({
      hash: tx.txid,
      blockNumber: tx.status.block_height,
      from: 'unknown', // Bitcoin doesn't have explicit from/to
      to: 'unknown',
      value: tx.vout.reduce((sum: number, output: any) => {
        return sum + output.value;
      }, 0),
      timestamp: tx.status.block_time,
      status: tx.status.confirmed ? 'confirmed' : 'pending'
    }));
  }

  async sendTransaction(to: string, amount: string, privateKey?: string): Promise<string> {
    if (!privateKey) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Private key required for Bitcoin transaction signing'
      );
    }

    // This is a simplified implementation
    // Real Bitcoin transactions require UTXO management
    throw new McpError(
      ErrorCode.InternalError,
      'Bitcoin transaction sending requires UTXO management - use btc_send_raw_transaction'
    );
  }

  // Bitcoin-specific methods
  async getMempoolInfo(): Promise<any> {
    const response = await this.rpcClient.get('/mempool');
    return response.data;
  }

  async getFeeEstimates(): Promise<any> {
    const response = await this.rpcClient.get('/v1/fees/recommended');
    return response.data;
  }

  private getBitcoinNetwork(): bitcoin.Network {
    return this.network.chainId === 'testnet'
      ? bitcoin.networks.testnet
      : bitcoin.networks.bitcoin;
  }

  // Get current network
  async getNetwork(): Promise<NetworkConfig> {
    return this.network;
  }

  // Check network health
  async checkHealth(): Promise<{ status: 'healthy' | 'unhealthy' }> {
    try {
      await this.getBlockNumber();
      return { status: 'healthy' };
    } catch {
      return { status: 'unhealthy' };
    }
  }

  async getPeerCount(): Promise<number> {
    return 0; // Bitcoin RPC doesn't expose peer count easily
  }
}
```

## 4. Cosmos SDK (Osmosis, Cosmos Hub, etc.)

### Dependencies
```bash
npm install @cosmjs/stargate@^0.32.0
npm install @cosmjs/proto-signing@^0.32.0
npm install @cosmjs/amino@^0.32.0
```

### Client Implementation
```typescript
// src/client.ts
import {
  StargateClient,
  SigningStargateClient,
  QueryClient,
  setupAuthExtension,
  setupBankExtension,
  setupTxExtension,
  setupStakingExtension
} from '@cosmjs/stargate';
import { NetworkConfig } from './config/network.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export class BlockchainClient {
  private client: StargateClient;
  private network: NetworkConfig;

  constructor(network?: string) {
    this.network = this.getNetwork(network);
    this.initializeClient();
  }

  private getNetwork(networkName?: string): NetworkConfig {
    const networks: Record<string, NetworkConfig> = {
      osmosistestnet: {
        name: 'Osmosis Testnet',
        chainId: 'osmo-test-5',
        rpcUrl: 'https://rpc.osmotest5.osmosis.zone',
        symbol: 'OSMO',
        blockTime: 6,
        consensus: 'Tendermint Proof of Stake',
        explorer: 'https://testnet.osmosis.explorer'
      },
      cosmoshub: {
        name: 'Cosmos Hub',
        chainId: 'cosmoshub-4',
        rpcUrl: 'https://rpc-cosmoshub.blockapsis.com',
        symbol: 'ATOM',
        blockTime: 6,
        consensus: 'Tendermint Proof of Stake',
        explorer: 'https://www.mintscan.io/cosmos'
      }
    };

    return networks[networkName || 'osmosistestnet'] || networks.osmosistestnet;
  }

  private async initializeClient() {
    try {
      this.client = await StargateClient.connect(this.network.rpcUrl);
    } catch (error: any) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to connect to ${this.network.name}: ${error.message}`
      );
    }
  }

  // Core operations
  async getBlockNumber(): Promise<number> {
    return await this.client.getHeight();
  }

  async getBalance(address: string): Promise<bigint> {
    const balances = await this.client.getAllBalances(address);
    const nativeBalance = balances.find(b => b.denom === 'uosmo');
    return nativeBalance ? BigInt(nativeBalance.amount) : BigInt(0);
  }

  async getTransaction(hash: string): Promise<any> {
    return await this.client.getTx(hash);
  }

  async getBlock(blockNumber: string | number): Promise<any> {
    const height = typeof blockNumber === 'string' ? parseInt(blockNumber) : blockNumber;
    return await this.client.getBlock(height);
  }

  // Validation methods
  isValidAddress(address: string): boolean {
    try {
      // Cosmos address validation
      return address.startsWith('osmo') && address.length === 44;
    } catch {
      return false;
    }
  }

  isValidTxHash(hash: string): boolean {
    return /^[A-F0-9]{64}$/.test(hash.toUpperCase());
  }

  isValidPrivateKey(privateKey: string): boolean {
    try {
      // Would need mnemonic validation for Cosmos
      return privateKey.length > 0;
    } catch {
      return false;
    }
  }

  formatBalance(balance: bigint): string {
    return (Number(balance) / 1000000).toFixed(6); // uosmo to OSMO
  }

  getAddressType(address: string): string {
    return 'bech32';
  }

  async getConfirmations(hash: string): Promise<number> {
    const tx = await this.client.getTx(hash);
    if (!tx) return 0;

    const currentBlock = await this.client.getHeight();
    return currentBlock - tx.height + 1;
  }

  async getTransactionHistory(address: string, limit: number): Promise<any[]> {
    // Cosmos doesn't have built-in transaction history
    // This would require additional indexing
    return [];
  }

  async sendTransaction(to: string, amount: string, privateKey?: string): Promise<string> {
    // Would require SigningStargateClient setup
    throw new McpError(
      ErrorCode.InternalError,
      'Cosmos transaction sending requires wallet setup'
    );
  }

  // Cosmos-specific methods
  async getValidators(): Promise<any[]> {
    const queryClient = QueryClient.withExtensions(
      await StargateClient.connect(this.network.rpcUrl),
      setupStakingExtension
    );

    return await queryClient.staking.validators('BOND_STATUS_BONDED');
  }

  async getDelegation(address: string): Promise<any[]> {
    const queryClient = QueryClient.withExtensions(
      await StargateClient.connect(this.network.rpcUrl),
      setupStakingExtension
    );

    return await queryClient.staking.delegatorDelegations(address);
  }

  async getRewards(address: string): Promise<any[]> {
    const queryClient = QueryClient.withExtensions(
      await StargateClient.connect(this.network.rpcUrl),
      setupStakingExtension
    );

    return await queryClient.staking.delegationRewards(address);
  }

  // Get current network
  async getNetwork(): Promise<NetworkConfig> {
    return this.network;
  }

  // Check network health
  async checkHealth(): Promise<{ status: 'healthy' | 'unhealthy' }> {
    try {
      await this.client.getHeight();
      return { status: 'healthy' };
    } catch {
      return { status: 'unhealthy' };
    }
  }

  async getPeerCount(): Promise<number> {
    return 0; // Cosmos RPC doesn't expose peer count easily
  }
}
```

## 5. XRP Ledger

### Dependencies
```bash
npm install xrpl@^2.12.0
```

### Client Implementation
```typescript
// src/client.ts
import { Client, Wallet } from 'xrpl';
import { NetworkConfig } from './config/network.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export class BlockchainClient {
  private client: Client;
  private network: NetworkConfig;

  constructor(network?: string) {
    this.network = this.getNetwork(network);
    this.client = new Client(this.network.rpcUrl);
    this.initializeClient();
  }

  private getNetwork(networkName?: string): NetworkConfig {
    const networks: Record<string, NetworkConfig> = {
      mainnet: {
        name: 'XRP Ledger Mainnet',
        chainId: 'mainnet',
        rpcUrl: 'wss://xrplcluster.com',
        symbol: 'XRP',
        blockTime: 3,
        consensus: 'Ripple Protocol Consensus',
        explorer: 'https://livenet.xrpl.org'
      },
      testnet: {
        name: 'XRP Ledger Testnet',
        chainId: 'testnet',
        rpcUrl: 'wss://s.altnet.rippletest.net:51233',
        symbol: 'XRP',
        blockTime: 3,
        consensus: 'Ripple Protocol Consensus',
        explorer: 'https://testnet.xrpl.org'
      }
    };

    return networks[networkName || 'testnet'] || networks.testnet;
  }

  private async initializeClient() {
    try {
      await this.client.connect();
    } catch (error: any) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to connect to ${this.network.name}: ${error.message}`
      );
    }
  }

  async disconnect() {
    await this.client.disconnect();
  }

  // Core operations
  async getBlockNumber(): Promise<number> {
    const ledger = await this.client.getLedger();
    return ledger.ledgerVersion;
  }

  async getBalance(address: string): Promise<bigint> {
    const account = await this.client.getAccount(address);
    return BigInt(account.xrpBalance);
  }

  async getTransaction(hash: string): Promise<any> {
    return await this.client.getTransaction(hash);
  }

  async getBlock(blockNumber: string | number): Promise<any> {
    const ledger = await this.client.getLedger({
      ledgerVersion: typeof blockNumber === 'string' ? parseInt(blockNumber) : blockNumber
    });
    return ledger;
  }

  // Validation methods
  isValidAddress(address: string): boolean {
    try {
      // XRP address validation
      return /^r[A-HJ-NP-Za-km-z1-9]{24,34}$/.test(address);
    } catch {
      return false;
    }
  }

  isValidTxHash(hash: string): boolean {
    return /^[A-F0-9]{64}$/.test(hash.toUpperCase());
  }

  isValidPrivateKey(privateKey: string): boolean {
    try {
      return /^[A-F0-9]{64}$/.test(privateKey.toUpperCase());
    } catch {
      return false;
    }
  }

  formatBalance(balance: bigint): string {
    return (Number(balance) / 1000000).toFixed(6); // drops to XRP
  }

  getAddressType(address: string): string {
    return 'xrp';
  }

  async getConfirmations(hash: string): Promise<number> {
    const tx = await this.client.getTransaction(hash);
    if (!tx) return 0;

    const currentLedger = await this.client.getLedger();
    return currentLedger.ledgerVersion - tx.ledgerIndex + 1;
  }

  async getTransactionHistory(address: string, limit: number): Promise<any[]> {
    const payments = await this.client.getAccountTransactions(address, {
      limit
    });

    return payments.map((tx: any) => ({
      hash: tx.tx.hash,
      blockNumber: tx.tx.ledger_index,
      from: tx.tx.Account,
      to: tx.tx.Destination,
      value: tx.tx.Amount,
      timestamp: tx.tx.date,
      status: tx.validated ? 'confirmed' : 'pending'
    }));
  }

  async sendTransaction(to: string, amount: string, privateKey?: string): Promise<string> {
    if (!privateKey) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Private key required for XRP transaction signing'
      );
    }

    const wallet = Wallet.fromSecret(privateKey);
    const payment = {
      TransactionType: 'Payment',
      Account: wallet.address,
      Destination: to,
      Amount: (parseFloat(amount) * 1000000).toString() // XRP to drops
    };

    const prepared = await this.client.prepareTransaction(payment);
    const signed = wallet.sign(prepared);
    const result = await this.client.submitAndWait(signed.tx_blob);

    if (result.result.engine_result !== 'tesSUCCESS') {
      throw new McpError(
        ErrorCode.InternalError,
        `Transaction failed: ${result.result.engine_result}`
      );
    }

    return result.result.tx_json.hash;
  }

  // XRP-specific methods
  async getAccountInfo(address: string): Promise<any> {
    return await this.client.getAccount(address);
  }

  async getAccountTransactions(address: string, options?: any): Promise<any[]> {
    return await this.client.getAccountTransactions(address, options);
  }

  async getServerInfo(): Promise<any> {
    return await this.client.getServerInfo();
  }

  // Get current network
  async getNetwork(): Promise<NetworkConfig> {
    return this.network;
  }

  // Check network health
  async checkHealth(): Promise<{ status: 'healthy' | 'unhealthy' }> {
    try {
      await this.client.getServerInfo();
      return { status: 'healthy' };
    } catch {
      return { status: 'unhealthy' };
    }
  }

  async getPeerCount(): Promise<number> {
    const info = await this.client.getServerInfo();
    return info.result.info.peers || 0;
  }
}
```

## Usage Example

```typescript
// In your tool implementations
import { BlockchainClient } from '../../client.js';

export async function handleGetBalance(args: any, client: BlockchainClient) {
  try {
    const { address } = GetBalanceSchema.parse(args);

    if (!client.isValidAddress(address)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid address format: ${address}`
      );
    }

    const balance = await client.getBalance(address);
    const formatted = client.formatBalance(balance);
    const network = await client.getNetwork();

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          address,
          balance: formatted,
          balanceRaw: balance.toString(),
          symbol: network.symbol
        }, null, 2)
      }]
    };
  } catch (error: any) {
    if (error instanceof McpError) throw error;
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to get balance: ${error.message}`
    );
  }
}
```

---

**Next:** See COMMON-CONFIGURATIONS.md for package.json, tsconfig.json, and other configuration templates.

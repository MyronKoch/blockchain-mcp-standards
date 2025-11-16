#!/usr/bin/env node
/**
 * Blockchain MCP Standard v3.0 (BMCPS v3.0) Compliance Validator
 *
 * Validates blockchain MCP servers against the Blockchain MCP Standard v3.0 (BMCPS v3.0) Unified Standard
 * Checks architecture, tool implementation, naming conventions, and compliance levels.
 *
 * Usage: node mbss-v3-validation.js /path/to/server
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Blockchain MCP Standard v3.0 (BMCPS v3.0) Requirements
const REQUIRED_TOOLS = [
    'get_chain_info', 'get_balance', 'get_transaction', 'get_block', 'validate_address',
    'get_transaction_history', 'send_transaction', 'create_wallet', 'import_wallet',
    'generate_address', 'get_network_info', 'set_network', 'get_gas_price',
    'estimate_fees', 'get_mempool_info', 'get_wallet_info', 'get_account_info',
    'get_token_balance', 'get_token_info', 'transfer_token', 'approve_token',
    'get_token_allowance', 'help', 'search_tools', 'list_tools_by_category'
];

const REQUIRED_CATEGORIES = [
    'core', 'wallet', 'network', 'tokens', 'help'
];

const OPTIONAL_CATEGORIES = [
    'account', 'nft', 'defi', 'staking', 'governance', 'contracts',
    'bridge', 'analytics', 'security', 'events', 'advanced'
];

const COMPLIANCE_LEVELS = {
    BRONZE: { tools: 25, categories: 5, structure: true },
    SILVER: { tools: 40, categories: 12, structure: true, extended: true },
    GOLD: { tools: 100, categories: 16, structure: true, extended: true, production: true }
};

class BMCPSValidator {
    constructor(serverPath) {
        this.serverPath = serverPath;
        this.results = {
            architecture: { score: 0, max: 10, details: [] },
            tools: { score: 0, max: 40, details: [] },
            naming: { score: 0, max: 15, details: [] },
            testing: { score: 0, max: 10, details: [] },
            documentation: { score: 0, max: 10, details: [] },
            security: { score: 0, max: 15, details: [] },
            total: { score: 0, max: 100 }
        };
        this.complianceLevel = 'NONE';
    }

    validate() {
        console.log('🔍 Blockchain MCP Standard v3.0 (BMCPS v3.0) Compliance Validation');
        console.log('=====================================');
        console.log(`📁 Validating server: ${this.serverPath}\n`);

        this.validateArchitecture();
        this.validateTools();
        this.validateNaming();
        this.validateTesting();
        this.validateDocumentation();
        this.validateSecurity();

        this.calculateTotalScore();
        this.determineComplianceLevel();
        this.printResults();
        this.printRecommendations();

        return this.results;
    }

    validateArchitecture() {
        console.log('🏗️  Checking Architecture...');

        // Check directory structure
        const srcPath = path.join(this.serverPath, 'src');
        const toolsPath = path.join(srcPath, 'tools');

        if (!fs.existsSync(srcPath)) {
            this.results.architecture.details.push('❌ Missing src/ directory');
            return;
        }

        // Check required categories
        let requiredFound = 0;
        REQUIRED_CATEGORIES.forEach(category => {
            const categoryPath = path.join(toolsPath, category);
            if (fs.existsSync(categoryPath)) {
                requiredFound++;
                this.results.architecture.details.push(`✅ ${category}/ directory exists`);
            } else {
                this.results.architecture.details.push(`❌ Missing ${category}/ directory`);
            }
        });

        // Check optional categories
        let optionalFound = 0;
        OPTIONAL_CATEGORIES.forEach(category => {
            const categoryPath = path.join(toolsPath, category);
            if (fs.existsSync(categoryPath)) {
                optionalFound++;
                this.results.architecture.details.push(`✅ ${category}/ directory exists`);
            }
        });

        // Check core files
        const requiredFiles = ['index.ts', 'tool-definitions.ts'];
        requiredFiles.forEach(file => {
            const filePath = path.join(srcPath, file);
            if (fs.existsSync(filePath)) {
                this.results.architecture.details.push(`✅ ${file} exists`);
            } else {
                this.results.architecture.details.push(`❌ Missing ${file}`);
            }
        });

        this.results.architecture.score = (requiredFound / REQUIRED_CATEGORIES.length) * 10;
        console.log(`   Score: ${this.results.architecture.score}/10\n`);
    }

    validateTools() {
        console.log('🛠️  Checking Tools...');

        const toolsPath = path.join(this.serverPath, 'src', 'tools');
        if (!fs.existsSync(toolsPath)) {
            this.results.tools.details.push('❌ No tools directory found');
            return;
        }

        let toolsFound = 0;
        let toolsImplemented = 0;

        // Check each required tool
        REQUIRED_TOOLS.forEach(tool => {
            const toolFiles = this.findToolFiles(tool);
            if (toolFiles.length > 0) {
                toolsImplemented++;
                this.results.tools.details.push(`✅ ${tool} implemented`);
            } else {
                this.results.tools.details.push(`❌ ${tool} missing`);
            }
            toolsFound += toolFiles.length;
        });

        // Check for extended tools
        const extendedTools = this.countExtendedTools();
        this.results.tools.details.push(`📊 Extended tools found: ${extendedTools}`);

        this.results.tools.score = (toolsImplemented / REQUIRED_TOOLS.length) * 30 + Math.min(extendedTools * 0.5, 10);
        console.log(`   Required: ${toolsImplemented}/${REQUIRED_TOOLS.length}, Extended: ${extendedTools}`);
        console.log(`   Score: ${this.results.tools.score}/40\n`);
    }

    validateNaming() {
        console.log('🏷️  Checking Naming Conventions...');

        const toolsPath = path.join(this.serverPath, 'src', 'tools');
        if (!fs.existsSync(toolsPath)) {
            this.results.naming.details.push('❌ No tools directory found');
            return;
        }

        let namingScore = 0;
        const prefix = this.getBlockchainPrefix();

        // Check if tool files follow naming convention
        const allToolFiles = this.getAllToolFiles();
        let correctlyNamed = 0;

        allToolFiles.forEach(file => {
            const fileName = path.basename(file, '.ts');
            // Should be: {prefix}_{action}_{resource}
            const parts = fileName.split('_');
            if (parts.length >= 3 && fileName.includes(prefix)) {
                correctlyNamed++;
                this.results.naming.details.push(`✅ ${fileName} follows naming convention`);
            } else {
                this.results.naming.details.push(`❌ ${fileName} violates naming convention`);
            }
        });

        namingScore = (correctlyNamed / Math.max(allToolFiles.length, 1)) * 15;
        this.results.naming.score = namingScore;
        console.log(`   Score: ${this.results.naming.score}/15\n`);
    }

    validateTesting() {
        console.log('🧪 Checking Testing...');

        const testPath = path.join(this.serverPath, 'tests');
        if (!fs.existsSync(testPath)) {
            this.results.testing.details.push('❌ No tests directory found');
            return;
        }

        const testFiles = fs.readdirSync(testPath).filter(f => f.endsWith('.test.ts') || f.endsWith('.spec.ts'));
        this.results.testing.details.push(`📊 Found ${testFiles.length} test files`);

        if (testFiles.length >= 3) {
            this.results.testing.score = 10;
            this.results.testing.details.push('✅ Comprehensive testing suite');
        } else if (testFiles.length >= 1) {
            this.results.testing.score = 5;
            this.results.testing.details.push('⚠️ Basic testing present');
        }

        console.log(`   Score: ${this.results.testing.score}/10\n`);
    }

    validateDocumentation() {
        console.log('📚 Checking Documentation...');

        const readmePath = path.join(this.serverPath, 'README.md');
        if (fs.existsSync(readmePath)) {
            const readme = fs.readFileSync(readmePath, 'utf8');
            if (readme.length > 500) {
                this.results.documentation.score = 10;
                this.results.documentation.details.push('✅ Comprehensive README');
            } else {
                this.results.documentation.score = 5;
                this.results.documentation.details.push('⚠️ Basic README present');
            }
        } else {
            this.results.documentation.details.push('❌ Missing README.md');
        }

        console.log(`   Score: ${this.results.documentation.score}/10\n`);
    }

    validateSecurity() {
        console.log('🔒 Checking Security...');

        // Check for package.json
        const packagePath = path.join(this.serverPath, 'package.json');
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            const hasSecurityDeps = this.checkSecurityDependencies(packageJson);
            if (hasSecurityDeps) {
                this.results.security.score = 15;
                this.results.security.details.push('✅ Security dependencies present');
            } else {
                this.results.security.score = 5;
                this.results.security.details.push('⚠️ Basic security setup');
            }
        }

        console.log(`   Score: ${this.results.security.score}/15\n`);
    }

    calculateTotalScore() {
        this.results.total.score = Object.values(this.results)
            .filter(r => typeof r.score === 'number')
            .reduce((sum, r) => sum + r.score, 0);
    }

    determineComplianceLevel() {
        const score = this.results.total.score;
        if (score >= 85) this.complianceLevel = '🥇 GOLD';
        else if (score >= 65) this.complianceLevel = '🥈 SILVER';
        else if (score >= 45) this.complianceLevel = '🥉 BRONZE';
        else this.complianceLevel = '❌ NON-COMPLIANT';
    }

    printResults() {
        console.log('📊 VALIDATION RESULTS');
        console.log('=====================');
        console.log(`🎯 Compliance Level: ${this.complianceLevel}`);
        console.log(`📈 Overall Score: ${this.results.total.score}/100\n`);

        Object.entries(this.results).forEach(([category, result]) => {
            if (category !== 'total') {
                console.log(`${category.toUpperCase()}: ${result.score}/${result.max}`);
                result.details.forEach(detail => console.log(`  ${detail}`));
                console.log('');
            }
        });
    }

    printRecommendations() {
        console.log('💡 RECOMMENDATIONS');
        console.log('==================');

        if (this.results.architecture.score < 10) {
            console.log('🏗️  Architecture: Create missing required category directories');
        }
        if (this.results.tools.score < 30) {
            console.log('🛠️  Tools: Implement missing mandatory tools');
        }
        if (this.results.naming.score < 15) {
            console.log('🏷️  Naming: Fix tool file naming to follow {prefix}_{action}_{resource}');
        }
        if (this.results.testing.score < 10) {
            console.log('🧪 Testing: Add comprehensive test suite');
        }
        if (this.results.documentation.score < 10) {
            console.log('📚 Documentation: Create comprehensive README.md');
        }
        if (this.results.security.score < 15) {
            console.log('🔒 Security: Add security dependencies and validation');
        }

        if (this.complianceLevel === '🥇 GOLD') {
            console.log('🎉 CONGRATULATIONS: Your server is production-ready!');
        } else if (this.complianceLevel === '🥈 SILVER') {
            console.log('🚀 Good progress! Add more extended tools for Gold level.');
        } else if (this.complianceLevel === '🥉 BRONZE') {
            console.log('📈 Solid foundation! Implement extended tools and testing for Silver level.');
        } else {
            console.log('⚠️  Needs work. Focus on mandatory requirements first.');
        }
    }

    // Helper methods
    getBlockchainPrefix() {
        // Try to determine from package.json name
        const packagePath = path.join(this.serverPath, 'package.json');
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            const name = packageJson.name || '';
            // Extract prefix (e.g., "eth-testnet-mcp-server" -> "eth")
            const match = name.match(/^([a-z]+)-/);
            if (match) return match[1];
        }
        return 'unknown';
    }

    findToolFiles(toolName) {
        const toolsPath = path.join(this.serverPath, 'src', 'tools');
        const files = [];

        const searchDirectory = (dir) => {
            if (!fs.existsSync(dir)) return;

            fs.readdirSync(dir).forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    searchDirectory(filePath);
                } else if (file.endsWith('.ts') && file.includes(toolName)) {
                    files.push(filePath);
                }
            });
        };

        searchDirectory(toolsPath);
        return files;
    }

    getAllToolFiles() {
        const toolsPath = path.join(this.serverPath, 'src', 'tools');
        const files = [];

        const searchDirectory = (dir) => {
            if (!fs.existsSync(dir)) return;

            fs.readdirSync(dir).forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    searchDirectory(filePath);
                } else if (file.endsWith('.ts')) {
                    files.push(filePath);
                }
            });
        };

        searchDirectory(toolsPath);
        return files;
    }

    countExtendedTools() {
        const allFiles = this.getAllToolFiles();
        return allFiles.filter(file => {
            const fileName = path.basename(file, '.ts');
            return !REQUIRED_TOOLS.some(tool => fileName.includes(tool));
        }).length;
    }

    checkSecurityDependencies(packageJson) {
        const securityDeps = ['helmet', 'cors', 'express-rate-limit', 'zod', 'bcrypt'];
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        return securityDeps.some(dep => dependencies[dep]);
    }
}

// Main execution
if (require.main === module) {
    const serverPath = process.argv[2];
    if (!serverPath) {
        console.error('Usage: node mbss-v3-validation.js /path/to/server');
        process.exit(1);
    }

    if (!fs.existsSync(serverPath)) {
        console.error(`❌ Server path not found: ${serverPath}`);
        process.exit(1);
    }

    const validator = new BMCPSValidator(serverPath);
    validator.validate();
}

module.exports = BMCPSValidator;

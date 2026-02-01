/*
 * Copyright (c) 2025–2026 Paul Viandier
 * All rights reserved.
 *
 * This source code is proprietary.
 * Commercial use, redistribution, or modification is strictly prohibited
 * without prior written permission.
 *
 * See the LICENSE file in the project root for full license terms.
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '..', '.env') });

async function main() {
    console.log('🚀 Starting commit synchronization...\n');

    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL is not configured');
        process.exit(1);
    }

    if (!process.env.GITHUB_TOKEN) {
        console.error('❌ GITHUB_TOKEN is not configured');
        process.exit(1);
    }

    console.log('✅ Environment variables OK\n');

    const { syncAllRepositories } = await import('../lib/github/sync');

    try {
        const results = await syncAllRepositories();

        console.log('\n📊 Synchronization Results:');
        console.log('================================');

        for (const result of results.results) {
            const status = result.success ? '✅' : '❌';
            console.log(`${status} ${result.repo}: ${result.commitsAdded} commits added${result.error ? ` (Error: ${result.error})` : ''}`);
        }

        console.log('================================');
        console.log(`Total: ${results.total} repos, ${results.success} success, ${results.failed} failed`);

        process.exit(results.failed > 0 ? 1 : 0);
    } catch (error) {
        console.error('❌ Sync failed:', error);
        process.exit(1);
    }
}

void main().catch((error) => {
    console.error('❌ Unhandled error in main:', error);
    process.exit(1);
});
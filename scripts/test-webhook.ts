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
import crypto from 'crypto';

config({ path: resolve(__dirname, '..', '.env') });

const WEBHOOK_URL = 'http://localhost:3000/api/github/webhook';
const SECRET = process.env.GITHUB_WEBHOOK_SECRET;

if (!SECRET) {
    console.error('❌ GITHUB_WEBHOOK_SECRET non configuré dans .env');
    process.exit(1);
}

const payload = {
    ref: 'refs/heads/main',
    repository: {
        name: 'portfolio',
        owner: {
            login: '5061756c2e56'
        }
    },
    commits: [
        {
            id: 'test' + Date.now().toString(16),
            message: '[TEST] Commit de test webhook - ' + new Date().toISOString(),
            timestamp: new Date().toISOString(),
            url: 'https://github.com/test/test/commit/test',
            author: {
                name: 'Test User',
                email: 'test@example.com'
            }
        }
    ],
    head_commit: {
        id: 'test' + Date.now().toString(16),
        message: '[TEST] Commit de test webhook - ' + new Date().toISOString(),
        timestamp: new Date().toISOString(),
        url: 'https://github.com/test/test/commit/test',
        author: {
            name: 'Test User',
            email: 'test@example.com'
        }
    }
};

async function testWebhook() {
    console.log('🧪 Test du webhook GitHub...\n');

    const body = JSON.stringify(payload);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const hmac = crypto.createHmac('sha256', SECRET);
    const signature = 'sha256=' + hmac.update(body).digest('hex');

    console.log('📤 Envoi du payload...');
    console.log('   URL:', WEBHOOK_URL);
    console.log('   Repo:', payload.repository.owner.login + '/' + payload.repository.name);
    console.log('   Commit:', payload.commits[0].id.substring(0, 7));

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-GitHub-Event': 'push',
                'X-GitHub-Delivery': crypto.randomUUID(),
                'X-Hub-Signature-256': signature
            },
            body
        });

        const data = await response.json();

        if (response.ok) {
            console.log('\n✅ Webhook traité avec succès!');
            console.log('   Réponse:', JSON.stringify(data, null, 2));
        } else {
            console.log('\n❌ Erreur:', response.status);
            console.log('   Réponse:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('\n❌ Erreur de connexion:', error);
        console.log('\n💡 Assurez-vous que le serveur dev tourne (pnpm dev)');
    }
}

testWebhook();
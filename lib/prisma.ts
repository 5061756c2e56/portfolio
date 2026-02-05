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

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient | null = null;

function createPrismaClientSync(): PrismaClient | null {
    if (!process.env.DATABASE_URL) {
        return null;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const prismaModule = require('@prisma/client');
        const PrismaClientConstructor = prismaModule.PrismaClient;

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const adapterModule = require('@prisma/adapter-pg');
        const PrismaPgAdapter = adapterModule.PrismaPg;

        if (!PrismaClientConstructor || !PrismaPgAdapter) {
            console.warn(
                '[Prisma] PrismaClient not found - run `npx prisma generate`'
            );
            return null;
        }

        const adapter = new PrismaPgAdapter({
            connectionString: process.env.DATABASE_URL
        });

        return new PrismaClientConstructor({
            adapter,
            log:
                process.env.NODE_ENV === 'development'
                    ? ['error', 'warn']
                    : ['error']
        });
    } catch (error) {
        console.warn('[Prisma] Failed to create PrismaClient:', error);
        return null;
    }
}

export function getPrisma(): PrismaClient | null {
    if (prismaInstance) {
        return prismaInstance;
    }

    if (globalForPrisma.prisma) {
        prismaInstance = globalForPrisma.prisma;
        return prismaInstance;
    }

    prismaInstance = createPrismaClientSync();

    if (prismaInstance && process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prismaInstance;
    }

    return prismaInstance;
}

const prisma = getPrisma();
export default prisma;

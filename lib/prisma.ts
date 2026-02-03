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

type PrismaClientType = any;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientType | undefined;
};

let prismaInstance: PrismaClientType | null = null;

function createPrismaClientSync(): PrismaClientType | null {
    if (!process.env.DATABASE_URL) {
        return null;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const prismaModule = require('@prisma/client');
        const PrismaClient = prismaModule.PrismaClient;

        if (!PrismaClient) {
            console.warn('[Prisma] PrismaClient not found - run `npx prisma generate`');
            return null;
        }

        return new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
            datasources: {
                db: {
                    url: process.env.DATABASE_URL
                }
            }
        });
    } catch (error) {
        console.warn('[Prisma] Failed to create PrismaClient:', error);
        return null;
    }
}

export function getPrisma(): PrismaClientType | null {
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
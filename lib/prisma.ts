import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

try {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    // Prevent multiple instances of Prisma Client in development
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error);
  throw new Error('Failed to initialize database connection');
}

export default prisma;
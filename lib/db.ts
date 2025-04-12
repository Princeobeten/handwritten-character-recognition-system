import { createPool, sql } from '@vercel/postgres';

// Create a connection pool
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  max: 10, // Maximum number of clients to create
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
});

// Export the sql query helper
export { sql };

// Export a function to get a client from the pool
export async function getClient() {
  return await pool.connect();
}

// Export a function to execute a query with automatic client release
export async function query(text: string, params?: (string | number | boolean | null)[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

// Export a function to execute a transaction
export async function transaction<T>(callback: (client: import('@vercel/postgres').VercelPoolClient) => Promise<T>) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
import "server-only";

import { Pool, type PoolClient, type QueryResultRow } from "pg";

import { env } from "@/server/env";

declare global {
  var __signalmatchPool: Pool | undefined;
}

const pool =
  global.__signalmatchPool ??
  new Pool({
    connectionString: env.SUPABASE_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 8,
  });

if (process.env.NODE_ENV !== "production") {
  global.__signalmatchPool = pool;
}

export async function sql<T extends QueryResultRow = QueryResultRow>(
  query: string,
  params: unknown[] = [],
) {
  return pool.query<T>(query, params);
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
) {
  const client = await pool.connect();
  try {
    await client.query("begin");
    const result = await fn(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

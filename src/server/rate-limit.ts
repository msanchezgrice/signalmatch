import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { env } from "@/server/env";

const memoryCounter = new Map<string, { count: number; resetAt: number }>();

const redisLimiter =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(120, "1 m"),
      })
    : null;

export async function enforceRateLimit(key: string) {
  if (redisLimiter) {
    const result = await redisLimiter.limit(key);
    return { ok: result.success, resetAt: Date.now() + result.reset }; // best effort
  }

  const now = Date.now();
  const windowMs = 60_000;
  const current = memoryCounter.get(key);

  if (!current || current.resetAt < now) {
    memoryCounter.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, resetAt: now + windowMs };
  }

  if (current.count >= 60) {
    return { ok: false, resetAt: current.resetAt };
  }

  current.count += 1;
  memoryCounter.set(key, current);

  return { ok: true, resetAt: current.resetAt };
}

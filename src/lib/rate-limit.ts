type Entry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Entry>();

const MAX_KEYS = 5000;

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

function cleanup() {
  const now = Date.now();

  for (const [key, value] of store.entries()) {
    if (now >= value.resetAt) {
      store.delete(key);
    }
  }

  if (store.size > MAX_KEYS) {
    const firstKey = store.keys().next().value;
    if (firstKey) store.delete(firstKey);
  }
}

if (typeof global !== "undefined") {
  setInterval(cleanup, 60_000).unref();
}

export function rateLimit(key: string, limit = 100, windowMs = 60_000): RateLimitResult {
  const now = Date.now();

  const current = store.get(key);

  if (!current || now >= current.resetAt) {
    const resetAt = now + windowMs;

    store.set(key, {
      count: 1,
      resetAt,
    });

    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetAt,
    };
  }

  if (current.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;

  store.set(key, current);

  return {
    success: true,
    limit,
    remaining: limit - current.count,
    resetAt: current.resetAt,
  };
}

export function clearRateLimit(key: string) {
  store.delete(key);
}

export function resetAllRateLimits() {
  store.clear();
}

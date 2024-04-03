import { IP } from "./ip";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
});

export async function rateLimit() {
  const ip = IP();
  if (ip) {
    const { success } = await ratelimiter.limit(ip);

    if (!success) {
      throw new Error("Too many requests");
    }
  }
}

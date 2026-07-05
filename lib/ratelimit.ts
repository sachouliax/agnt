import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// 12 chat messages per hour per IP — keeps a public, unauthenticated,
// pay-per-token endpoint from being trivially spammed into a large bill.
export const chatRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(12, "1 h"),
      prefix: "agnt:chat-ratelimit",
    })
  : null;

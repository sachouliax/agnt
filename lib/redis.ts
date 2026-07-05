import { Redis } from "@upstash/redis";

// Vercel's Upstash Marketplace integration provisions KV_REST_API_* names;
// support both that and the plain Upstash naming.
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;

// Shared lightweight protection for public AI edge functions.
// Provides: per-IP in-memory rate limiting + payload size guard + string length validator.
// NOTE: in-memory limits are per-instance. They mitigate, but do not eliminate, abuse.

const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(req: Request, opts: { limit: number; windowMs: number }): Response | null {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.reset < now) {
    buckets.set(ip, { count: 1, reset: now + opts.windowMs });
    return null;
  }
  b.count += 1;
  if (b.count > opts.limit) {
    const retry = Math.ceil((b.reset - now) / 1000);
    return new Response(
      JSON.stringify({ error: `Too many requests. Retry in ${retry}s.` }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retry),
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
  return null;
}

export async function readJsonWithLimit<T>(req: Request, maxBytes: number): Promise<T> {
  const cl = req.headers.get("content-length");
  if (cl && Number(cl) > maxBytes) {
    throw new PayloadTooLarge(`Payload exceeds ${maxBytes} bytes`);
  }
  const buf = await req.arrayBuffer();
  if (buf.byteLength > maxBytes) {
    throw new PayloadTooLarge(`Payload exceeds ${maxBytes} bytes`);
  }
  return JSON.parse(new TextDecoder().decode(buf)) as T;
}

export class PayloadTooLarge extends Error {}

export function clampString(v: unknown, max: number): string | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v !== "string") return undefined;
  return v.slice(0, max);
}

import { NextResponse } from "next/server";
import {
  getSupabasePublicClient,
  getSupabaseServerClient,
  isSupabasePublicConfigured
} from "../../../../lib/supabase-server";

const TABLE_NAME = "community_posts";
const POST_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const POST_LIMIT_MAX = 5;
const MIN_FORM_FILL_MS = 2500;
const globalState = globalThis;

if (!globalState.__communityRateLimitStore) {
  globalState.__communityRateLimitStore = new Map();
}
const rateLimitStore = globalState.__communityRateLimitStore;

function trimTrailingSlash(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function getSiteOrigin() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (!siteUrl) return "";
  try {
    return trimTrailingSlash(new URL(siteUrl).origin);
  } catch {
    return "";
  }
}

function getRequestOrigin(request) {
  const origin = request.headers.get("origin");
  if (origin) return trimTrailingSlash(origin);

  const referer = request.headers.get("referer");
  if (!referer) return "";
  try {
    return trimTrailingSlash(new URL(referer).origin);
  } catch {
    return "";
  }
}

function isAllowedOrigin(request) {
  const siteOrigin = getSiteOrigin();
  if (!siteOrigin) return true;

  const requestOrigin = getRequestOrigin(request);
  if (!requestOrigin) return true;
  if (requestOrigin === siteOrigin) return true;

  if (process.env.NODE_ENV !== "production") {
    return requestOrigin === "http://localhost:3000" || requestOrigin === "http://127.0.0.1:3000";
  }

  return false;
}

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function checkRateLimit(key, maxHits, windowMs) {
  const now = Date.now();
  const hits = rateLimitStore.get(key) || [];
  const recentHits = hits.filter((time) => now - time < windowMs);

  if (recentHits.length >= maxHits) {
    const retryAfter = Math.ceil((windowMs - (now - recentHits[0])) / 1000);
    rateLimitStore.set(key, recentHits);
    return { allowed: false, retryAfter };
  }

  recentHits.push(now);
  rateLimitStore.set(key, recentHits);
  return { allowed: true, retryAfter: 0 };
}

function hasSuspiciousUrl(value) {
  return /(https?:\/\/|www\.)/i.test(value);
}

export async function GET() {
  if (!isSupabasePublicConfigured()) {
    return NextResponse.json({
      configured: false,
      posts: []
    });
  }

  const supabase = getSupabasePublicClient();
  if (!supabase) {
    return NextResponse.json({ configured: false, posts: [] });
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("id,nickname,content,rating,created_at")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .limit(60);

  if (error) {
    return NextResponse.json({ configured: true, posts: [], error: "Failed to load posts." }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    posts: data || []
  });
}

export async function POST(request) {
  if (!isSupabasePublicConfigured()) {
    return NextResponse.json(
      { error: "Supabase public environment variables are missing. Set URL and anon key first." },
      { status: 503 }
    );
  }

  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(`community-post:${ip}`, POST_LIMIT_MAX, POST_LIMIT_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const supabase = getSupabaseServerClient() || getSupabasePublicClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase client initialization failed." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const nickname = String(body?.nickname || "").trim();
  const content = String(body?.content || "").trim();
  const rating = Number(body?.rating || 0);
  const website = String(body?.website || "").trim();
  const formStartedAt = Number(body?.formStartedAt || 0);
  const now = Date.now();

  if (website) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }
  if (!Number.isFinite(formStartedAt) || now - formStartedAt < MIN_FORM_FILL_MS) {
    return NextResponse.json({ error: "Please complete the form a bit more slowly." }, { status: 400 });
  }
  if (now - formStartedAt > 2 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Form expired. Please refresh and try again." }, { status: 400 });
  }

  if (!nickname || nickname.length < 2 || nickname.length > 24) {
    return NextResponse.json({ error: "Nickname must be between 2 and 24 characters." }, { status: 400 });
  }
  if (!content || content.length < 8 || content.length > 1000) {
    return NextResponse.json({ error: "Review content must be between 8 and 1000 characters." }, { status: 400 });
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
  }
  if (hasSuspiciousUrl(content)) {
    return NextResponse.json({ error: "Links are not allowed in review content." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      nickname,
      content,
      rating,
      is_visible: true
    })
    .select("id,nickname,content,rating,created_at")
    .single();

  if (error) {
    console.error("community_posts insert failed", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    return NextResponse.json(
      { error: process.env.NODE_ENV !== "production" ? error.message || "Failed to save post." : "Failed to save post." },
      { status: 500 }
    );
  }

  return NextResponse.json({ post: data }, { status: 201 });
}

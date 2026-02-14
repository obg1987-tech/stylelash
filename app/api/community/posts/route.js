import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "../../../../lib/supabase-server";

const TABLE_NAME = "community_posts";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      posts: []
    });
  }

  const supabase = getSupabaseServerClient();
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
    return NextResponse.json({ configured: true, posts: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    posts: data || []
  });
}

export async function POST(request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase client initialization failed." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const nickname = String(body?.nickname || "").trim();
  const content = String(body?.content || "").trim();
  const rating = Number(body?.rating || 0);

  if (!nickname || nickname.length < 2) {
    return NextResponse.json({ error: "닉네임은 2자 이상 입력해 주세요." }, { status: 400 });
  }
  if (!content || content.length < 8) {
    return NextResponse.json({ error: "후기는 8자 이상 입력해 주세요." }, { status: 400 });
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "별점은 1~5 사이로 선택해 주세요." }, { status: 400 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post: data }, { status: 201 });
}


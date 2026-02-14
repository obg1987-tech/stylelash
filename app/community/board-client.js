"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function Stars({ value }) {
  const count = Math.max(1, Math.min(5, Number(value) || 0));
  return <span>{"★".repeat(count)}{"☆".repeat(5 - count)}</span>;
}

export default function CommunityBoardClient() {
  const [configured, setConfigured] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    nickname: "",
    rating: "5",
    content: ""
  });

  const canSubmit = useMemo(
    () => form.nickname.trim().length >= 2 && form.content.trim().length >= 8 && !submitting,
    [form, submitting]
  );

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/community/posts", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "게시글을 불러오지 못했습니다.");
      setConfigured(payload.configured !== false);
      setPosts(Array.isArray(payload.posts) ? payload.posts : []);
    } catch (error) {
      setMessage(error.message || "게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: form.nickname.trim(),
          rating: Number(form.rating),
          content: form.content.trim()
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "등록에 실패했습니다.");
      setMessage("후기가 등록되었습니다.");
      setForm({ nickname: "", rating: "5", content: "" });
      await fetchPosts();
    } catch (error) {
      setMessage(error.message || "등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="community-page">
      <header className="community-head">
        <Link href="/" className="community-back">← Back to Home</Link>
        <h1>후기 게시판</h1>
        <p>실제 방문 후기를 남기고, 다른 고객들의 경험을 확인해보세요.</p>
      </header>

      <section className="community-grid">
        <article className="community-card">
          <h2>후기 작성</h2>
          {!configured ? (
            <p className="community-hint">
              Supabase 환경변수가 설정되지 않았습니다. 설정 후 등록 기능이 활성화됩니다.
            </p>
          ) : null}
          <form onSubmit={submit} className="community-form">
            <label>
              닉네임
              <input
                type="text"
                value={form.nickname}
                minLength={2}
                maxLength={24}
                onChange={(e) => setForm((prev) => ({ ...prev, nickname: e.target.value }))}
                placeholder="예: 브로우맛집"
              />
            </label>
            <label>
              별점
              <select
                value={form.rating}
                onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))}
              >
                <option value="5">5점</option>
                <option value="4">4점</option>
                <option value="3">3점</option>
                <option value="2">2점</option>
                <option value="1">1점</option>
              </select>
            </label>
            <label>
              후기 내용
              <textarea
                value={form.content}
                minLength={8}
                maxLength={1000}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="시술 만족도, 분위기, 결과 등을 자유롭게 남겨주세요."
                rows={5}
              />
            </label>
            <button type="submit" disabled={!canSubmit || !configured}>
              {submitting ? "등록 중..." : "후기 등록"}
            </button>
          </form>
          {message ? <p className="community-message">{message}</p> : null}
        </article>

        <article className="community-card">
          <h2>최신 후기</h2>
          {loading ? <p className="community-hint">불러오는 중...</p> : null}
          {!loading && posts.length === 0 ? (
            <p className="community-hint">아직 등록된 후기가 없습니다.</p>
          ) : null}
          <div className="community-post-list">
            {posts.map((post) => (
              <section key={post.id} className="community-post">
                <header>
                  <strong>{post.nickname}</strong>
                  <span><Stars value={post.rating} /></span>
                </header>
                <p>{post.content}</p>
                <small>{formatDate(post.created_at)}</small>
              </section>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}


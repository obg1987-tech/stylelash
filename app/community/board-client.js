"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function applyMagnetic(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;
  const maxShift = 8;
  event.currentTarget.style.setProperty("--mag-x", `${(px * maxShift).toFixed(2)}px`);
  event.currentTarget.style.setProperty("--mag-y", `${(py * maxShift).toFixed(2)}px`);
}

function resetMagnetic(event) {
  event.currentTarget.style.setProperty("--mag-x", "0px");
  event.currentTarget.style.setProperty("--mag-y", "0px");
}

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
    content: "",
    website: "",
    formStartedAt: Date.now()
  });

  const canSubmit = useMemo(() => !submitting && configured, [submitting, configured]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/community/posts", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "후기 목록을 불러오지 못했습니다.");
      setConfigured(payload.configured !== false);
      setPosts(Array.isArray(payload.posts) ? payload.posts : []);
    } catch (error) {
      setMessage(error.message || "후기 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const nickname = form.nickname.trim();
    const content = form.content.trim();
    const rating = Number(form.rating);

    if (nickname.length < 2) {
      setMessage("닉네임은 2자 이상 입력해 주세요.");
      return;
    }
    if (content.length < 8) {
      setMessage("후기는 8자 이상 입력해 주세요.");
      return;
    }
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      setMessage("별점은 1~5 사이로 선택해 주세요.");
      return;
    }

    if (!canSubmit) return;
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          rating,
          content,
          website: form.website,
          formStartedAt: form.formStartedAt
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "후기 등록에 실패했습니다.");
      setMessage("후기가 등록되었습니다.");
      setForm({ nickname: "", rating: "5", content: "", website: "", formStartedAt: Date.now() });
      await fetchPosts();
    } catch (error) {
      setMessage(error.message || "후기 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="community-page">
      <header className="community-head community-card--glass">
        <Link href="/" className="community-back">
          ← Back to Home
        </Link>
        <h1>눈썹문신 고객 후기</h1>
        <p>고객 리얼 후기를 한눈에 보고, 직접 경험을 공유해 보세요.</p>
        <div className="community-hero-badges" aria-hidden>
          <span className="community-hero-badge">실시간 업데이트</span>
          <span className="community-hero-badge">고객 리뷰 아카이브</span>
          <span className="community-hero-badge">스타일 피드백</span>
        </div>
      </header>

      <section className="community-grid">
        <article className="community-card community-card--glass">
          <h2>후기 작성</h2>
          {!configured ? (
            <p className="community-hint">현재 게시판 설정이 완료되지 않았습니다. 관리자에게 문의해 주세요.</p>
          ) : null}
          <form onSubmit={submit} className="community-form">
            <input
              type="text"
              name="website"
              value={form.website}
              autoComplete="off"
              tabIndex={-1}
              aria-hidden
              onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
              style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
            />
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
              <select value={form.rating} onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))}>
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
                placeholder="시술 만족도, 분위기, 결과를 자세히 남겨주시면 다른 분들에게 큰 도움이 됩니다."
                rows={6}
              />
            </label>
            <button type="submit" disabled={!canSubmit || !configured}>
              {submitting ? "등록 중..." : "후기 등록"}
            </button>
          </form>
          {message ? <p className="community-message">{message}</p> : null}
        </article>

        <article className="community-card community-card--glass">
          <h2>최신 후기</h2>
          {loading ? <p className="community-hint">불러오는 중...</p> : null}
          {!loading && posts.length === 0 ? <p className="community-hint">아직 등록된 후기가 없습니다.</p> : null}
          <div className="community-post-list">
            {posts.map((post) => (
              <section key={post.id} className="community-post">
                <header>
                  <strong>{post.nickname}</strong>
                  <span>
                    <Stars value={post.rating} />
                  </span>
                </header>
                <p>{post.content}</p>
                <small>{formatDate(post.created_at)}</small>
              </section>
            ))}
          </div>
        </article>
      </section>

      <Link
        href="/"
        className="community-floating-home-btn"
        aria-label="메인으로 이동"
        onMouseMove={applyMagnetic}
        onMouseLeave={resetMagnetic}
      >
        <span>Home</span>
        <small>Main</small>
      </Link>
    </main>
  );
}

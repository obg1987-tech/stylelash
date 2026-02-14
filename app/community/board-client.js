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

  const canSubmit = useMemo(() => !submitting && configured, [submitting, configured]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/community/posts", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Failed to load posts.");
      setConfigured(payload.configured !== false);
      setPosts(Array.isArray(payload.posts) ? payload.posts : []);
    } catch (error) {
      setMessage(error.message || "Failed to load posts.");
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
      setMessage("Nickname must be at least 2 characters.");
      return;
    }
    if (content.length < 8) {
      setMessage("Review content must be at least 8 characters.");
      return;
    }
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      setMessage("Rating must be between 1 and 5.");
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
          content
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Failed to register review.");
      setMessage("Review submitted successfully.");
      setForm({ nickname: "", rating: "5", content: "" });
      await fetchPosts();
    } catch (error) {
      setMessage(error.message || "Failed to register review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="community-page">
      <header className="community-head">
        <Link href="/" className="community-back">
          ← Back to Home
        </Link>
        <h1>Community Board</h1>
        <p>Leave your review and check real customer feedback.</p>
      </header>

      <section className="community-grid">
        <article className="community-card">
          <h2>Write a Review</h2>
          {!configured ? (
            <p className="community-hint">
              Supabase is not configured yet. Set `NEXT_PUBLIC_SUPABASE_URL` and keys in Vercel and `.env.local`.
            </p>
          ) : null}
          <form onSubmit={submit} className="community-form">
            <label>
              Nickname
              <input
                type="text"
                value={form.nickname}
                minLength={2}
                maxLength={24}
                onChange={(e) => setForm((prev) => ({ ...prev, nickname: e.target.value }))}
                placeholder="Example: BrowLover"
              />
            </label>
            <label>
              Rating
              <select value={form.rating} onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))}>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </label>
            <label>
              Review
              <textarea
                value={form.content}
                minLength={8}
                maxLength={1000}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Tell us about your result, design, and overall experience."
                rows={5}
              />
            </label>
            <button type="submit" disabled={!canSubmit || !configured}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
          {message ? <p className="community-message">{message}</p> : null}
        </article>

        <article className="community-card">
          <h2>Latest Reviews</h2>
          {loading ? <p className="community-hint">Loading...</p> : null}
          {!loading && posts.length === 0 ? <p className="community-hint">No reviews yet.</p> : null}
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
    </main>
  );
}

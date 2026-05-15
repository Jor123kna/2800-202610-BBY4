import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import PageHint, { hints } from "../components/PageHint";

function Community() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(true);
  const [activeSort, setActiveSort] = useState("newest");
  const [message, setMessage] = React.useState("");
  const { userData } = useAuth();

  useEffect(() => {
    const savedMessage = localStorage.getItem("communityMessage");
    if (!savedMessage) return;
    const parsedMessage = JSON.parse(savedMessage);
    if (Date.now() > parsedMessage.expiresAt) {
      localStorage.removeItem("communityMessage");
      return;
    }
    setMessage(parsedMessage.text);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setPosts(data.posts);
        } else {
          setError("Failed to load posts");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Something went wrong loading posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "ai") return post.aigenerated === true;
    return post.role === activeFilter;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (activeSort === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (activeSort === "oldest")
      return new Date(a.createdAt) - new Date(b.createdAt);
    if (activeSort === "most-replies") {
      const aCount = a.replies?.length ?? a.replyCount ?? 0;
      const bCount = b.replies?.length ?? b.replyCount ?? 0;
      return bCount - aCount;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="page-padding">
        <h1>Community</h1>
        <p
          style={{
            color: "var(--color-text-secondary)",
            marginTop: "var(--space-4)",
          }}
        >
          Loading posts...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-padding">
        <h1>Community</h1>
        <p style={{ color: "red", marginTop: "var(--space-4)" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-padding">
      {message && (
        <div
          className="card"
          style={{
            marginBottom: "var(--space-4)",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-brand)",
          }}
        >
          <p>{message}</p>
        </div>
      )}

      {showHint && userData?.firstTimeMode && (
        <PageHint
          message={hints["Community"]}
          onClose={() => setShowHint(false)}
        />
      )}

      <div style={{ marginBottom: "var(--space-4)" }}>
        <h1 style={{ marginBottom: "var(--space-2)" }}>Community</h1>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "var(--text-sm)",
          }}
        >
          See what's happening around you
        </p>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs" style={{ marginBottom: "var(--space-3)" }}>
        {[
          { value: "all", label: "All", count: posts.length },
          {
            value: "in-need",
            label: "🆘 In Need",
            count: posts.filter((p) => p.role === "in-need").length,
          },
          {
            value: "helper",
            label: "🤝 To Help",
            count: posts.filter((p) => p.role === "helper").length,
          },
          {
            value: "ai",
            label: "🤖 AI Generated",
            count: posts.filter((p) => p.aigenerated === true).length,
          },
        ].map(({ value, label, count }) => (
          <button
            key={value}
            className={`filter-tab ${activeFilter === value ? "active" : ""}`}
            onClick={() => setActiveFilter(value)}
            aria-pressed={activeFilter === value}
          >
            {label}
            <span className="filter-tab-count">{count}</span>
          </button>
        ))}
      </div>

      {/* Sort tabs — same style, own row, no counts */}
      <div
        className="filter-tabs filter-tabs--sort"
        style={{ marginBottom: "var(--space-4)" }}
      >
        {[
          { value: "newest", label: "🆕 Newest" },
          { value: "oldest", label: "📅 Oldest" },
          { value: "most-replies", label: "💬 Most Replies" },
        ].map(({ value, label }) => (
          <button
            key={value}
            className={`filter-tab filter-tab--sort ${activeSort === value ? "active" : ""}`}
            onClick={() => setActiveSort(value)}
            aria-pressed={activeSort === value}
          >
            {label}
          </button>
        ))}
      </div>

      {sortedPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">
            📭
          </div>
          <h3 className="empty-state-title">No posts yet</h3>
          <p className="empty-state-desc">
            {activeFilter === "all"
              ? "Be the first to share with your community"
              : "No posts in this category yet"}
          </p>
        </div>
      ) : (
        <div className="post-list">
          {sortedPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      <button
        className="fab tour-create-post"
        onClick={() => navigate("/post")}
        aria-label="Create new post"
      >
        +
      </button>
    </div>
  );
}

export default Community;

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

  // fetch real posts from backend
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

  // filter function
  const filteredPosts = posts.filter((post) => {
    if (activeFilter === "all") return true;

    if (activeFilter === "ai") {
      return post.aigenerated === true;
    }

    return post.role === activeFilter;
  });

  // sorting function
  const sortedPosts = filteredPosts.sort((a, b) => {
    if (activeSort === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (activeSort === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  // loading state
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

  // error state
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
      {/* Page Hint */}
      {showHint && userData?.firstTimeMode && (
        <PageHint
          message={hints["Community"]}
          onClose={() => setShowHint(false)}
        />
      )}

      {/* Page header */}
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

      {/* Sort tabs */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          marginBottom: "var(--space-4)",
        }}
      >
        <select
          value={activeSort}
          onChange={(e) => setActiveSort(e.target.value)}
          className="input"
          style={{ width: "auto" }}
        >
          <option value="newest">🕒 Newest First</option>
          <option value="oldest">🕒 Oldest First</option>
        </select>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
          aria-pressed={activeFilter === "all"}
        >
          All
          <span className="filter-tab-count">{posts.length}</span>
        </button>
        <button
          className={`filter-tab ${activeFilter === "in-need" ? "active" : ""}`}
          onClick={() => setActiveFilter("in-need")}
          aria-pressed={activeFilter === "in-need"}
        >
          🆘 In Need
          <span className="filter-tab-count">
            {posts.filter((p) => p.role === "in-need").length}
          </span>
        </button>
        <button
          className={`filter-tab ${activeFilter === "helper" ? "active" : ""}`}
          onClick={() => setActiveFilter("helper")}
          aria-pressed={activeFilter === "helper"}
        >
          🤝 To Help
          <span className="filter-tab-count">
            {posts.filter((p) => p.role === "helper").length}
          </span>
        </button>
        <button
          className={`filter-tab ${activeFilter === "ai" ? "active" : ""}`}
          onClick={() => setActiveFilter("ai")}
          aria-pressed={activeFilter === "ai"}
        >
          🤖 AI Generated
          <span className="filter-tab-count">
            {posts.filter((p) => p.aigenerated === true).length}
          </span>
        </button>
      </div>

      {/* Post list OR empty state */}
      {filteredPosts.length === 0 ? (
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

      {/* Floating "+" button */}
      <button
        className="fab"
        onClick={() => navigate("/post")}
        aria-label="Create new post"
      >
        +
      </button>
    </div>
  );
}

export default Community;

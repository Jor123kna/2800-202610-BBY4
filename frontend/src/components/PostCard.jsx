import React from "react";
import { useNavigate } from "react-router-dom";

function PostCard({ post }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const handleClick = () => navigate(`/post/${post._id}`);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const replyCount = post.replies?.length ?? post.replyCount ?? 0;

  return (
    <article
      className="post-card post-card-clickable"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View post: ${post.title}`}
    >
      {/* Top row: badges left, reply count right */}
      <div className="post-card-header">
        <div className="post-card-badges">
          <span className={`role-tag role-tag-${post.role}`}>
            {post.role === "in-need" ? "🆘 In Need" : "🤝 To Help"}
          </span>
          {post.aigenerated && (
            <span className="role-tag role-tag-ai">🤖 AI Generated</span>
          )}
        </div>
        <span
          className="post-card-reply-count"
          aria-label={`${replyCount} replies`}
        >
          💬 {replyCount}
        </span>
      </div>

      {/* Title */}
      <h3 className="post-card-title">{post.title}</h3>

      {/* Content preview */}
      <p className="post-card-content">
        {post.content.length > 150
          ? `${post.content.substring(0, 150)}...`
          : post.content}
      </p>

      {/* Footer: author + date */}
      <div className="post-card-footer">
        <span className="post-card-author">
          {post.author?.firstName} {post.author?.lastName}
        </span>
        <span className="post-card-date">{formatDate(post.createdAt)}</span>
      </div>
    </article>
  );
}

export default PostCard;

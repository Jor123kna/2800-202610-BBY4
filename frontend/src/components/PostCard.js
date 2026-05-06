import React from 'react';

function PostCard({ post }) {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    return (
        <article className="post-card">
            {/* Role badge at top */}
            <div className="post-card-header">
                <span className={`role-tag role-tag-${post.role}`}>
                    {post.role === 'in-need' ? '🆘 In Need' : '🤝 To Help'}
                </span>
            </div>

            {/* Title */}
            <h3 className="post-card-title">{post.title}</h3>

            {/* Content preview (~first 150 characters)*/}
            <p className="post-card-content">
                {post.content.length > 150
                    ? `${post.content.substring(0, 150)}...`
                    : post.content}
            </p>

            {/* Footer: author + date */}
            <div className="post-card-footer">
                {/* author is now an object */}
                <span className="post-card-author">
                    {post.author?.firstName} {post.author?.lastName}
                </span>
                {/* date field is createdAt */}
                <span className="post-card-date">
                    {formatDate(post.createdAt)}
                </span>
            </div>
        </article>
    );
}

export default PostCard;
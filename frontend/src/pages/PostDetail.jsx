import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import PageHint, {hints} from '../components/PageHint';
import { useAuth } from '../context/AuthContext';

const REPLIES_PER_PAGE = 5;

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData } = useAuth();

    const replyListEndRef = useRef(null);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showHint, setShowHint] = useState(true);
    

    const [replies, setReplies] = useState([]);
    const [repliesLoading, setRepliesLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(REPLIES_PER_PAGE);

    // Reply input state
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Track which reply is currently being deleted
    const [deletingId, setDeletingId] = useState(null);

    // Fetch single post + replies in parallel
    useEffect(() => {
        const fetchPostAndReplies = async () => {
            try {
                const [postRes, repliesRes] = await Promise.all([
                    fetch(`${API_URL}/posts/${id}`, { credentials: 'include' }),
                    fetch(`${API_URL}/replies/post/${id}`, { credentials: 'include' })
                ]);

                const postData = await postRes.json();

                if (postRes.ok) {
                    setPost(postData.post);
                } else {
                    setError('Post not found');
                    return;
                }

                if (repliesRes.ok) {
                    const repliesData = await repliesRes.json();
                    setReplies(repliesData.replies || []);
                }

            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Something went wrong loading this post');
            } finally {
                setLoading(false);
                setRepliesLoading(false);
            }
        };

        fetchPostAndReplies();
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getInitials = (firstName, lastName) => {
        const f = firstName?.[0] || '';
        const l = lastName?.[0] || '';
        return (f + l).toUpperCase() || '?';
    };

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + REPLIES_PER_PAGE);
    };

    // Submit reply to backend
    const handleSubmitReply = async (e) => {
        e.preventDefault();

        const trimmed = replyText.trim();
        if (!trimmed || submitting) return;

        setSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/replies`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId: id,
                    content: trimmed
                })
            });

            const data = await response.json();

            if (response.ok) {
                const newReplyCount = replies.length + 1;
                setReplies((prev) => [...prev, data.reply]);
                setVisibleCount((prev) => Math.max(prev, newReplyCount));

                setReplyText('');

                setTimeout(() => {
                    replyListEndRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end'
                    });
                }, 100);
            } else {
                console.error('Failed to send reply:', data.message);
                alert(data.message || 'Failed to send reply');
            }

        } catch (err) {
            console.error('Error sending reply:', err);
            alert('Could not send reply. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Delete a reply
    const handleDeleteReply = async (replyId) => {
        // Confirm before deleting
        if (!window.confirm('Delete this reply? This cannot be undone.')) {
            return;
        }

        setDeletingId(replyId);

        try {
            const response = await fetch(`${API_URL}/replies/${replyId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setReplies((prev) => prev.filter((r) => r._id !== replyId));
            } else {
                alert(data.message || 'Failed to delete reply');
            }

        } catch (err) {
            console.error('Error deleting reply:', err);
            alert('Could not delete reply. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmitReply(e);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="post-detail-page">
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Loading post...
                </p>
            </div>
        );
    }

    // Error state
    if (error || !post) {
        return (
            <div className="post-detail-page">
                <button
                    onClick={() => navigate('/community')}
                    className="btn-back"
                    aria-label="Back to community"
                >
                    ← Back to community
                </button>
                <div className="empty-state">
                    <div className="empty-state-icon" aria-hidden="true">😕</div>
                    <h3 className="empty-state-title">Post not found</h3>
                    <p className="empty-state-desc">
                        {error || 'This post may have been removed.'}
                    </p>
                </div>
            </div>
        );
    }

    const roleLabel = post.role === 'in-need' ? '🆘 In Need' : '🤝 To Help';
    const visibleReplies = replies.slice(0, visibleCount);
    const hasMore = visibleCount < replies.length;
    const remainingCount = replies.length - visibleCount;

    const currentUserId = userData?.id;
    const postAuthorId = post.author?._id;

    return (
        <>
            <div className="post-detail-page post-detail-page-with-input">
                <button
                    onClick={() => navigate(-1)}
                    className="btn-back"
                    aria-label="Back to community"
                >
                    ← Go back
                </button>
                {/* Page Hint */}
                {showHint && userData?.firstTimeMode && (
                    <PageHint
                        message={hints['PostDetails']}
                        onClose={() => setShowHint(false)}
                    />
                )}

                {/* Original post card */}
                <article className={`post-detail-card post-detail-card-${post.role}`}>
                    <div className="post-detail-strip">
                        <span className="post-detail-strip-role">{roleLabel}</span>
                        {post.neighbourhood && (
                            <span className="post-detail-strip-neighbourhood">
                                · {post.neighbourhood}
                            </span>
                        )}
                    </div>

                    <div className="post-detail-body">
                        <h1 className="post-detail-title">{post.title}</h1>

                        <div className="post-detail-author">
                            <div className="post-detail-avatar" aria-hidden="true">
                                {getInitials(post.author?.firstName, post.author?.lastName)}
                            </div>
                            <div className="post-detail-author-info">
                                <span className="post-detail-author-name">
                                    {post.author?.firstName} {post.author?.lastName}
                                </span>
                                <span className="post-detail-time">
                                    {formatDate(post.createdAt)}
                                </span>
                            </div>
                        </div>

                        <p className="post-detail-content">{post.content}</p>
                    </div>
                </article>

                {/* Replies section */}
                <div className="reply-section">
                    <h3 className="reply-section-title">
                        💬 Replies ({replies.length})
                    </h3>

                    {repliesLoading ? (
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                            Loading replies...
                        </p>
                    ) : replies.length === 0 ? (
                        <div className="reply-empty">
                            <p>No replies yet · Be the first to respond</p>
                        </div>
                    ) : (
                        <>
                            <div className="reply-list">
                                {visibleReplies.map((reply) => {
                                    const isPostAuthor = reply.author?._id === postAuthorId;
                                    const isMyReply = reply.author?._id === currentUserId;
                                    const isDeleting = deletingId === reply._id;

                                    return (
                                        <div
                                            key={reply._id}
                                            className={`reply-card ${isPostAuthor ? 'reply-card-author' : ''}`}
                                        >
                                            <div className="reply-avatar" aria-hidden="true">
                                                {getInitials(reply.author?.firstName, reply.author?.lastName)}
                                            </div>
                                            <div className="reply-body">
                                                <div className="reply-header">
                                                    <span className="reply-author-name">
                                                        {reply.author?.firstName} {reply.author?.lastName}
                                                    </span>
                                                    {isPostAuthor && (
                                                        <span className="reply-author-badge">Author</span>
                                                    )}
                                                    <span className="reply-time">
                                                        {formatDate(reply.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="reply-content">{reply.content}</p>

                                                {/* Delete button */}
                                                {isMyReply && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteReply(reply._id)}
                                                        disabled={isDeleting}
                                                        className="btn-reply-delete"
                                                        aria-label="Delete this reply"
                                                    >
                                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* invisible anchor for auto-scroll after sending a reply */}
                                <div ref={replyListEndRef} aria-hidden="true" />
                            </div>

                            {hasMore && (
                                <button
                                    className="btn-load-more"
                                    onClick={handleLoadMore}
                                    aria-label={`Load ${Math.min(REPLIES_PER_PAGE, remainingCount)} more replies`}
                                >
                                    Load {Math.min(REPLIES_PER_PAGE, remainingCount)} more replies
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Fixed reply input bar */}
            {userData ? (
                <form className="reply-input-bar" onSubmit={handleSubmitReply}>
                    <textarea
                        className="reply-input"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        maxLength={500}
                        disabled={submitting}
                        aria-label="Reply text"
                    />
                    <button
                        type="submit"
                        className="reply-send-btn"
                        disabled={!replyText.trim() || submitting}
                        aria-label="Send reply"
                    >
                        {submitting ? '...' : 'Send'}
                    </button>
                </form>
            ) : (
                <div className="reply-input-bar reply-input-bar-signin">
                    <button
                        type="button"
                        onClick={() => navigate('/signin')}
                        className="btn-signin-prompt"
                    >
                        Sign in to reply
                    </button>
                </div>
            )}
        </>
    );
}

export default PostDetail;
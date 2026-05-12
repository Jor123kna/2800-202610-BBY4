import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const MOCK_REPLIES = [
    {
        _id: 'r1',
        author: { firstName: 'Mike', lastName: 'Johnson' },
        content: 'I think I saw someone matching that description near Robson Square about an hour ago. Walking east.',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        isAuthor: false
    },
    {
        _id: 'r2',
        author: { firstName: 'Jorja', lastName: 'Knaus' },
        content: 'Thank you so much! I will head there right now. Please keep an eye out 🙏',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isAuthor: true
    },
    {
        _id: 'r3',
        author: { firstName: 'Anna', lastName: 'Lee' },
        content: 'I am in the area too. Will help look. What was she wearing?',
        createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        isAuthor: false
    },
    {
        _id: 'r4',
        author: { firstName: 'David', lastName: 'Park' },
        content: 'Just checked Granville St — no sign of her there. Heading west now.',
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        isAuthor: false
    },
    {
        _id: 'r5',
        author: { firstName: 'Sarah', lastName: 'Kim' },
        content: 'I work at the coffee shop on Davie. I will keep an eye on the street.',
        createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        isAuthor: false
    },
    {
        _id: 'r6',
        author: { firstName: 'Ahmad', lastName: 'Khalil' },
        content: 'Have you contacted the police yet? They can help coordinate the search faster.',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        isAuthor: false
    },
    {
        _id: 'r7',
        author: { firstName: 'Jorja', lastName: 'Knaus' },
        content: 'Yes, called them already. They are sending an officer over now.',
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        isAuthor: true
    },
    {
        _id: 'r8',
        author: { firstName: 'Emily', lastName: 'Chen' },
        content: 'Praying for you. Please update us when you find her 💚',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        isAuthor: false
    }
];

const REPLIES_PER_PAGE = 5;

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [replies, setReplies] = useState([]);
    const [visibleCount, setVisibleCount] = useState(REPLIES_PER_PAGE);

    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_URL}/posts/${id}`, {
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    setPost(data.post);
                    // load mock replies for now
                    // replace with fetch when backend ready
                    setReplies(MOCK_REPLIES);
                } else {
                    setError('Post not found');
                }

            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Something went wrong loading this post');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
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

    const handleSubmitReply = async (e) => {
        e.preventDefault();

        const trimmed = replyText.trim();
        if (!trimmed || submitting) return;

        setSubmitting(true);

        // replace with POST request to backend
        const newReply = {
            _id: `temp-${Date.now()}`,
            author: {
                firstName: userData?.firstName || 'You',
                lastName: userData?.lastName || ''
            },
            content: trimmed,
            createdAt: new Date().toISOString(),
            isAuthor: userData?._id === post.author?._id
        };

        setReplies((prev) => [...prev, newReply]);

        setVisibleCount((prev) => Math.max(prev, replies.length + 1));

        setReplyText('');
        setSubmitting(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmitReply(e);
        }
    };

    if (loading) {
        return (
            <div className="post-detail-page">
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Loading post...
                </p>
            </div>
        );
    }

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

    return (
        <>
            {/* add bottom padding */}
            <div className="post-detail-page post-detail-page-with-input">
                {/* Back button */}
                <button
                    onClick={() => navigate('/community')}
                    className="btn-back"
                    aria-label="Back to community"
                >
                    ← Back to community
                </button>

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

                    {replies.length === 0 ? (
                        <div className="reply-empty">
                            <p>No replies yet · Be the first to respond</p>
                        </div>
                    ) : (
                        <>
                            <div className="reply-list">
                                {visibleReplies.map((reply) => (
                                    <div
                                        key={reply._id}
                                        className={`reply-card ${reply.isAuthor ? 'reply-card-author' : ''}`}
                                    >
                                        <div className="reply-avatar" aria-hidden="true">
                                            {getInitials(reply.author?.firstName, reply.author?.lastName)}
                                        </div>
                                        <div className="reply-body">
                                            <div className="reply-header">
                                                <span className="reply-author-name">
                                                    {reply.author?.firstName} {reply.author?.lastName}
                                                </span>
                                                {reply.isAuthor && (
                                                    <span className="reply-author-badge">Author</span>
                                                )}
                                                <span className="reply-time">
                                                    {formatDate(reply.createdAt)}
                                                </span>
                                            </div>
                                            <p className="reply-content">{reply.content}</p>
                                        </div>
                                    </div>
                                ))}
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

            {/* reply input bar */}
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
                        aria-label="Reply text"
                    />
                    <button
                        type="submit"
                        className="reply-send-btn"
                        disabled={!replyText.trim() || submitting}
                        aria-label="Send reply"
                    >
                        Send
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHint, {hints} from '../components/PageHint';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';


function Notifications() {
    const navigate = useNavigate();
    const { userData, authLoading } = useAuth();

    const [showHint, setShowHint] = useState(true);
    const [activeTab, setActiveTab] = useState('my-posts');

    const [myPostsNotifs, setMyPostsNotifs] = useState([]);
    const [myRepliesNotifs, setMyRepliesNotifs] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        localStorage.setItem('notifsLastSeen', Date.now().toString());

        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${API_URL}/replies/notifications`, {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    setMyPostsNotifs(data.myPosts || []);

                    const merged = mergeReplyGroupsByPost(data.myReplies || []);

                    setMyRepliesNotifs(merged);
                } else {
                    console.error(data.message || 'Failed to load notifications');
                }

            } catch (error) {
                console.error('Error loading notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userData) {
            fetchNotifications();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [userData, authLoading]);

    const mergeReplyGroupsByPost = (groups) => {
        const grouped = {};

        groups.forEach((group) => {
            const key = group.postId.toString();

            if (!grouped[key]) {
                grouped[key] = {
                    postId: group.postId,
                    postTitle: group.postTitle,
                    postRole: group.postRole,
                    replies: []
                };
            }

            grouped[key].replies.push(...group.replies);
        });

        return Object.values(grouped);
    };

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

    if (!authLoading && !userData) {
        return (
            <div className="notifications-page">
                <div className="empty-state">
                    <div className="empty-state-icon" aria-hidden="true">🔔</div>
                    <h3 className="empty-state-title">Sign in to see notifications</h3>
                    <p className="empty-state-desc">
                        Get updates when people reply to your posts.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/signin')}
                    >
                        Sign in
                    </button>
                </div>
            </div>
        );
    }

    const currentList = activeTab === 'my-posts' ? myPostsNotifs : myRepliesNotifs;
    const myPostsCount = myPostsNotifs.reduce((sum, group) => sum + group.replies.length, 0);
    const myRepliesCount = myRepliesNotifs.reduce((sum, group) => sum + group.replies.length, 0);

    return (
        <div className="notifications-page">
            {/* Page Hint */}
            {showHint && userData?.firstTimeMode && (
                <PageHint
                    message={hints['Notifications']}
                    onClose={() => setShowHint(false)}
                />
            )}
            <h1 className="notifications-title">Notifications</h1>

            {/* Tabs */}
            <div className="notif-tabs" role="tablist" aria-label="Notification categories">
                <button
                    role="tab"
                    aria-selected={activeTab === 'my-posts'}
                    className={`notif-tab ${activeTab === 'my-posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my-posts')}
                >
                    Your posts ({myPostsCount})
                </button>
                <button
                    role="tab"
                    aria-selected={activeTab === 'my-replies'}
                    className={`notif-tab ${activeTab === 'my-replies' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my-replies')}
                >
                    Your replies ({myRepliesCount})
                </button>
            </div>

            {/* Content */}
            {currentList.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon" aria-hidden="true">🔕</div>
                    <h3 className="empty-state-title">No notifications yet</h3>
                    <p className="empty-state-desc">
                        {activeTab === 'my-posts'
                            ? "You'll see replies to your posts here."
                            : "You'll see new replies on posts you replied to here."}
                    </p>
                </div>
            ) : (
                <div className="notif-list">
                    {currentList.map((group) => (
                        <div
                            key={`${activeTab}-${group.postId}`}
                            className="notif-group"
                        >
                            {/* Post header */}
                            <button
                                className="notif-group-header"
                                onClick={() => navigate(`/post/${group.postId}`)}
                                aria-label={`Open post: ${group.postTitle}`}
                            >
                                <div className="notif-group-label">
                                    {activeTab === 'my-posts' ? 'YOUR POST' : 'YOU REPLIED TO'}
                                </div>
                                <div className="notif-group-title">
                                    {group.postTitle}
                                </div>
                                <div className="notif-group-meta">
                                    {group.replies.length} {group.replies.length === 1 ? 'reply' : 'replies'}
                                </div>
                            </button>

                            {/* List of replies in this group */}
                            <div className="notif-replies">
                                {group.replies.map((reply) => (
                                    <div key={reply._id} className="notif-reply">
                                        <div className="notif-reply-avatar" aria-hidden="true">
                                            {getInitials(reply.author?.firstName, reply.author?.lastName)}
                                        </div>
                                        <div className="notif-reply-body">
                                            <div className="notif-reply-header">
                                                <span className="notif-reply-name">
                                                    {reply.author?.firstName} {reply.author?.lastName}
                                                </span>
                                                <span className="notif-reply-time">
                                                    {formatDate(reply.createdAt)}
                                                </span>
                                            </div>
                                            <p className="notif-reply-content">{reply.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Notifications;
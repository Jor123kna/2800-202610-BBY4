import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import PageHint from '../components/PageHint';


function Community() {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [showHint, setShowHint] = useState(true);
    const [activeSort, setActiveSort] = useState('newest');


    // fetch user data 
      useEffect(() => {
        const fetchProfile = async () => {
          try {
            const response = await fetch('http://localhost:5000/users/profile', {
              method: 'GET',
              credentials: 'include',
            });
    
            const data = await response.json();
    
            if (response.ok) {
              setUserData(data.user);
            } else {
              setUserData(null);
            }
          } catch (error) {
            console.error('Failed to fetch profile:', error);
            setUserData(null);
          }
        };
    
        fetchProfile();
      }, []);

    // fetch real posts from backend
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5000/posts', {
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    setPosts(data.posts);
                } else {
                    setError('Failed to load posts');
                }

            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('Something went wrong loading posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // filter function
    const filteredPosts = posts.filter((post) => {
        if (activeFilter === 'all') return true;
        return post.role === activeFilter;
    });

    // sorting function
    const sortedPosts = filteredPosts.sort((a, b) => {
        if (activeSort === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (activeSort === 'oldest') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return 0; 
    });

    // loading state
    if (loading) {
        return (
            <div className="page-padding">
                <h1>Community</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)' }}>
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
                <p style={{ color: 'red', marginTop: 'var(--space-4)' }}>
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="page-padding">
            {/* Page Hint */}
            {showHint && userData?.firstTimeMode && (
                <PageHint
                    message="Tap + to create a post. Filter by In Need or To Help!"
                    onClose={() => setShowHint(false)}
                />
            )}

            {/* Page header */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Community</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                    See what's happening around you
                </p>
            </div>

            {/* Sort tabs */}
            <div style={{ 
                display: 'flex', 
                gap: 'var(--space-2)', 
                marginBottom: 'var(--space-4)' 
            }}>
                <select
                    value={activeSort}
                    onChange={(e) => setActiveSort(e.target.value)}
                    className="input"
                    style={{ width: 'auto' }}
                >
                    <option value="newest">🕒 Newest First</option>
                    <option value="oldest">🕒 Oldest First</option>
                </select>
            </div>

            {/* Filter tabs */}
            <div className="filter-tabs">
                <button
                    className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                    aria-pressed={activeFilter === 'all'}
                >
                    All
                    <span className="filter-tab-count">{posts.length}</span>
                </button>
                <button
                    className={`filter-tab ${activeFilter === 'in-need' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('in-need')}
                    aria-pressed={activeFilter === 'in-need'}
                >
                    🆘 In Need
                    <span className="filter-tab-count">
                        {posts.filter((p) => p.role === 'in-need').length}
                    </span>
                </button>
                <button
                    className={`filter-tab ${activeFilter === 'helper' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('helper')}
                    aria-pressed={activeFilter === 'helper'}
                >
                    🤝 To Help
                    <span className="filter-tab-count">
                        {posts.filter((p) => p.role === 'helper').length}
                    </span>
                </button>
            </div>

            {/* Post list OR empty state */}
            {filteredPosts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon" aria-hidden="true">📭</div>
                    <h3 className="empty-state-title">No posts yet</h3>
                    <p className="empty-state-desc">
                        {activeFilter === 'all'
                            ? 'Be the first to share with your community'
                            : 'No posts in this category yet'}
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
                onClick={() => navigate('/post')}
                aria-label="Create new post"
            >
                +
            </button>
        </div>
    );
}

export default Community;
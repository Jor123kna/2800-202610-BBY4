import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

/**
 * Currently uses dummy data.
 */
function Community() {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('all');

  const [posts] = useState([
    {
      id: 1,
      title: 'Need help moving sandbags before the storm',
      content: 'Heavy rain is expected tonight and my basement is starting to flood. I have sandbags in my garage but I need help moving them to the front of the house. Anyone in the Hastings area available?',
      author: 'Sarah J.',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      role: 'in-need',
    },
    {
      id: 2,
      title: 'Offering rides to evacuation shelter',
      content: 'I have a truck and can take up to 4 people plus belongings to the BCIT Community Centre shelter. DM me if you need a ride. Available all day today and tomorrow.',
      author: 'Mike T.',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      role: 'helper',
    },
    {
      id: 3,
      title: 'Looking for baby formula and diapers',
      content: 'We had to evacuate quickly and forgot supplies for our 6-month-old. If anyone has extra formula (any brand) or size 3 diapers to spare, please reach out. We are at the Burnaby shelter.',
      author: 'Anna K.',
      date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      role: 'in-need',
    },
    {
      id: 4,
      title: 'Free hot meals at our community kitchen',
      content: 'Our church is serving free hot meals from 11am-7pm every day this week. No questions asked. Located at 4567 Main St. Bring family, friends, neighbours.',
      author: 'David L.',
      date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      role: 'helper',
    },
    {
      id: 5,
      title: 'Lost contact with elderly neighbor',
      content: 'My elderly neighbor Mrs. Chen lives alone and I have not been able to reach her since the power went out yesterday. She lives on Pender St. If anyone can do a wellness check, I would really appreciate it.',
      author: 'Jamie R.',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      role: 'in-need',
    },
  ]);

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'all') return true;
    return post.role === activeFilter;
  });

  return (
    <div className="page-padding">
      {/* Page header */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h1 style={{ marginBottom: 'var(--space-2)' }}>Community</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          See what's happening around you
        </p>
      </div>

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
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Floating "+" button to create new post */}
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
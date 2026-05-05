import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Post() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        neighbourhood: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // get user from session - same as Profile.jsx
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/users/profile', {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    setUserData(data.user);
                } else {
                    setUserData(null);
                }

            } catch (error) {
                console.error('Error fetching profile:', error);
                setUserData(null);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to create post');
                setLoading(false);
                return;
            }

            navigate('/community');

        } catch (err) {
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    // loading state
    if (!userData && userData !== null) {
        return <p>Loading...</p>;
    }

    // not logged in 
    if (!userData) {
        return (
            <div className="page-padding">
                <h1>Create a Post</h1>
                <div className="card" style={{ marginTop: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        You must be logged in to create a post.
                    </p>
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: 'var(--space-4)' }}
                        onClick={() => navigate('/signin')}
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    // logged in - show form
    return (
        <div className="page-padding">
            <h1>Create a Post</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
                Share with your community
            </p>

            <div className="card" style={{ marginTop: 'var(--space-4)' }}>

                {/* Show user info from session */}
                <div className="input-group">
                    <label className="input-label">Posting as</label>
                    <input
                        type="text"
                        className="input"
                        value={`${userData.firstName} ${userData.lastName} (${userData.role})`}
                        disabled
                        style={{
                            backgroundColor: 'var(--color-bg-secondary)',
                            color: 'var(--color-text-secondary)'
                        }}
                    />
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Title */}
                    <div className="input-group">
                        <label htmlFor="title" className="input-label">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input"
                            placeholder="What do you need help with?"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div className="input-group">
                        <label htmlFor="content" className="input-label">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className="input"
                            placeholder="Describe your situation..."
                            rows={5}
                            required
                        />
                    </div>

                    {/* Neighbourhood */}
                    <div className="input-group">
                        <label htmlFor="neighbourhood" className="input-label">
                            Neighbourhood (optional)
                        </label>
                        <input
                            type="text"
                            id="neighbourhood"
                            name="neighbourhood"
                            value={formData.neighbourhood}
                            onChange={handleChange}
                            className="input"
                            placeholder="e.g. Mount Pleasant"
                        />
                    </div>

                    {error && (
                        <p style={{ color: 'red', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        style={{ marginTop: 'var(--space-4)' }}
                        disabled={loading}
                    >
                        {loading ? 'Posting...' : 'Create Post'}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default Post;
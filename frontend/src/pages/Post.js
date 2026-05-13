import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import PageHint from "../components/PageHint";
import { useAuth } from "../context/AuthContext";

function Post() {
  const navigate = useNavigate();
  const location = useLocation();

  const editPost = location.state?.editPost;
  const isEditing = Boolean(editPost);
  const { userData } = useAuth();
  const [showHint, setShowHint] = useState(true);
  const [formData, setFormData] = useState({
    title: editPost?.title || '',
    content: editPost?.content || '',
    neighbourhood: editPost?.neighbourhood || '',
    role: editPost?.role || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const TITLE_MAX = 100;
  const CONTENT_MAX = 500;
  const CONTENT_MIN = 10;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });

    if (errors.role) {
      setErrors({ ...errors, role: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Please enter a title";
    } else if (formData.title.length > TITLE_MAX) {
      newErrors.title = `Title must be ${TITLE_MAX} characters or less`;
    }

    if (!formData.role) {
      newErrors.role = "Please select a post type";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Please add some details";
    } else if (formData.content.length < CONTENT_MIN) {
      newErrors.content = `Details must be at least ${CONTENT_MIN} characters`;
    } else if (formData.content.length > CONTENT_MAX) {
      newErrors.content = `Details must be ${CONTENT_MAX} characters or less`;
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setSubmitError("");


    try {
      const response = await fetch(
       isEditing ? `${API_URL}/posts/${editPost._id}` : `${API_URL}/posts`, 
        {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.message || (isEditing ? 'Failed to update post' : 'Failed to create post'));
        setLoading(false);
        return;
      }

      navigate(isEditing ? '/profile' : '/community');
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/community");
  };

  if (!userData && userData !== null) {
    return (
      <div className="page-padding">
        <p style={{ color: "var(--color-text-secondary)" }}>Loading...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="page-padding">
        <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
          <h1 style={{ marginBottom: "var(--space-2)" }}>Create a post</h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
            }}
          >
            You must be logged in to create a post
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/signin")}
            className="btn btn-primary"
          >
            Sign in
          </button>
        </div>
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
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ marginBottom: 'var(--space-2)' }}>{isEditing ? 'Edit a Post' : 'Create a post'}</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Share with your community
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Posting as (user info from session) */}
        <div className="input-group">
          <label className="input-label">Posting as</label>
          <input
            type="text"
            className="input"
            value={`${userData.firstName} ${userData.lastName} (${userData.role})`}
            disabled
            style={{
              backgroundColor: "var(--color-surface-sunken)",
              color: "var(--color-text-secondary)",
            }}
          />
        </div>
        {/* Title */}
        <div className="input-group">
          <label htmlFor="title" className="input-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input ${errors.title ? "input-error" : ""}`}
            placeholder="What's happening?"
            maxLength={TITLE_MAX}
          />
          {errors.title && (
            <span className="input-error-message">{errors.title}</span>
          )}
        </div>

        {/* Role Toggle (reused style from Sign Up) */}
        <div className="input-group">
          <label className="input-label">Type of post</label>
          <div className="role-toggle">
            <button
              type="button"
              className={`role-toggle-option ${formData.role === "in-need" ? "selected in-need" : ""}`}
              onClick={() => handleRoleSelect("in-need")}
              aria-pressed={formData.role === "in-need"}
            >
              <span className="role-toggle-icon" aria-hidden="true">
                🆘
              </span>
              <span className="role-toggle-title">In Need</span>
              <span className="role-toggle-desc">Asking for help</span>
            </button>

            <button
              type="button"
              className={`role-toggle-option ${formData.role === "helper" ? "selected helper" : ""}`}
              onClick={() => handleRoleSelect("helper")}
              aria-pressed={formData.role === "helper"}
            >
              <span className="role-toggle-icon" aria-hidden="true">
                🤝
              </span>
              <span className="role-toggle-title">To Help</span>
              <span className="role-toggle-desc">Offering support</span>
            </button>
          </div>
          {errors.role && (
            <span className="input-error-message">{errors.role}</span>
          )}
        </div>

        {/* Content textarea */}
        <div className="input-group">
          <label htmlFor="content" className="input-label">
            Details
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className={`input textarea ${errors.content ? "input-error" : ""}`}
            placeholder="Provide more information so others can help..."
            rows={6}
            maxLength={CONTENT_MAX}
          />
          <div className="textarea-footer">
            {errors.content ? (
              <span className="input-error-message">{errors.content}</span>
            ) : (
              <span></span>
            )}
            <span className="char-counter">
              {formData.content.length} / {CONTENT_MAX}
            </span>
          </div>
        </div>

        {/* Neighbourhood (optional) */}
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

        {/* Submit error message */}
        {submitError && (
          <div
            className="alert alert-emergency"
            style={{ marginBottom: "var(--space-4)" }}
          >
            {submitError}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
          style={{ marginTop: "var(--space-4)" }}
        >
          {loading ? 'Posting...' : (isEditing ? 'Update Post' : 'Post to community')}
        </button>

        {/* Cancel link */}
        <div style={{ textAlign: "center", marginTop: "var(--space-4)" }}>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
              cursor: "pointer",
              padding: "var(--space-2)",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Post;

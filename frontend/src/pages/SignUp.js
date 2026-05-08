import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'in-need',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Sign up failed');
        return;
      }

      console.log('Sign up successful:', data);

      const successMessage = {
        text: 'Account created successfully! Welcome to RouteRelief.',
        expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
      };

      localStorage.setItem('communityMessage', JSON.stringify(successMessage));

      navigate('/community', { state: { startTour: true } });
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="page-padding-narrow">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ marginBottom: 'var(--space-2)' }}>Welcome to RouteRelief</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Where we can help those around
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="firstName" className="input-label">First name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="lastName" className="input-label">Last name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email" className="input-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="phone" className="input-label">Phone number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input"
            placeholder="(optional)"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="input-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">How would you like to participate?</label>
          <div className="role-toggle">
            <button
              type="button"
              className={`role-toggle-option ${formData.role === 'in-need' ? 'selected in-need' : ''}`}
              onClick={() => handleRoleSelect('in-need')}
              aria-pressed={formData.role === 'in-need'}
            >
              <span className="role-toggle-icon" aria-hidden="true">🆘</span>
              <span className="role-toggle-title">I need help</span>
              <span className="role-toggle-desc">Receive support from the community</span>
            </button>

            <button
              type="button"
              className={`role-toggle-option ${formData.role === 'helper' ? 'selected helper' : ''}`}
              onClick={() => handleRoleSelect('helper')}
              aria-pressed={formData.role === 'helper'}
            >
              <span className="role-toggle-icon" aria-hidden="true">🤝</span>
              <span className="role-toggle-title">I want to help</span>
              <span className="role-toggle-desc">Offer support to those in need</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          style={{ marginTop: 'var(--space-4)' }}
        >
          Create account
        </button>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
          <Link
            to="/"
            style={{
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
            }}
          >
            Cancel
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Already have an account? </span>
          <Link
            to="/signin"
            style={{
              color: 'var(--color-brand)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
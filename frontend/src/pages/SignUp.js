import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign up submitted:', formData);
    // TODO: connect to backend signup API
    navigate('/community');
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
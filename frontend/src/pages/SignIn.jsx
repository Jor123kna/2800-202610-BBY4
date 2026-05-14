import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/users/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Unable to log in.");
        return;
      }

      console.log("Sign in successful:", data);
      navigate("/community");
    } catch (error) {
      console.error("Sign in error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="page-padding-narrow"
      style={{ paddingTop: "var(--space-12)" }}
    >
      <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
        <h1 style={{ marginBottom: "var(--space-2)" }}>Welcome back</h1>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "var(--text-sm)",
          }}
        >
          Log in to access your community
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email" className="input-label">
            Email
          </label>
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
          <label htmlFor="password" className="input-label">
            Password
          </label>
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

        {errorMessage && (
          <p
            style={{
              color: "red",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-4)",
            }}
          >
            {errorMessage}
          </p>
        )}

        <div style={{ textAlign: "right", marginBottom: "var(--space-4)" }}>
          <Link
            to="#"
            style={{
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              fontSize: "var(--text-sm)",
            }}
          >
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Log in
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: "var(--space-6)",
            fontSize: "var(--text-sm)",
          }}
        >
          <span style={{ color: "var(--color-text-secondary)" }}>
            Don't have an account?{" "}
          </span>
          <Link
            to="/signup"
            style={{
              color: "var(--color-brand)",
              textDecoration: "none",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignIn;

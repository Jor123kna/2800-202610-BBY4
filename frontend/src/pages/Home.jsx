import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      className="page-padding-narrow"
      style={{ textAlign: "center", paddingTop: "80px" }}
    >
      <h1 style={{ marginBottom: "var(--space-3)" }}>Welcome to RouteRelief</h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          marginBottom: "var(--space-8)",
          fontSize: "var(--text-base)",
        }}
      >
        Stay safe and connected with your community.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        <Link
          to="/signup"
          className="btn btn-primary btn-block"
          style={{ textDecoration: "none" }}
        >
          Sign up
        </Link>
        <Link
          to="/signin"
          className="btn btn-secondary btn-block"
          style={{ textDecoration: "none" }}
        >
          Log in
        </Link>
      </div>

      <p
        style={{
          marginTop: "var(--space-8)",
          color: "var(--color-text-secondary)",
          fontSize: "var(--text-sm)",
        }}
      >
        Please sign in or log in to access our community
      </p>
    </div>
  );
}

export default Home;

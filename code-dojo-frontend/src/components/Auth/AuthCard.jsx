import React from "react";

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="auth-card">
      <h1 className="auth-title">{title}</h1>
      <p className="auth-subtitle">{subtitle}</p>

      <div className="auth-form">{children}</div>
    </div>
  );
}

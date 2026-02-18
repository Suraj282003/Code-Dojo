import React from "react";

export default function AuthButton({ text, loading, onClick }) {
  return (
    <button
      className="auth-button"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <span className="loader"></span> : text}
    </button>
  );
}

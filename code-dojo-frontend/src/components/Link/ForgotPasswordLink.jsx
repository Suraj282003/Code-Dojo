import React from "react";

export default function ForgotPasswordLink({ onClick }) {
  return (
    <p
      onClick={onClick}
      className="text-white text-left cursor-pointer hover:text-gray-300 transition mb-2"
    >
      Forgot password?
    </p>
  );
}

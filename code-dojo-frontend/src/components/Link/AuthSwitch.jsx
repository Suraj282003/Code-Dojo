import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSwitch({ text, linkText, to, variant = "red" }) {
  const navigate = useNavigate();

  const color =
    variant === "red"
      ? "text-red-400 hover:text-red-500"
      : "text-white hover:text-gray-300";

  return (
    <p
      onClick={() => navigate(to)}
      className={`${color} text-center cursor-pointer transition mt-4`}
    >
      {text} <span className="font-semibold">{linkText}</span>
    </p>
  );
}

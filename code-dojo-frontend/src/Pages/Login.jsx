import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import NinjaBackground from "../components/Auth/NinjaBackground";
import AuthCard from "../components/Auth/AuthCard";
import { Navigate } from "react-router-dom";
import AuthButton from "../components/Button/AuthButton";
import AuthSwitch from "../components/Link/AuthSwitch";
import ForgotPasswordLink from "../components/Link/ForgotPasswordLink";
import GoogleButton from "../components/Button/GoogleButton";

export default function Login() {
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await login(form);
      toast.success("Welcome back to the Dojo 🥷");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />; // or /dashboard later
  }

  const handleForgot = () => {
  toast.info("Password recovery coming soon 🛠️");
  };



  return (
    <NinjaBackground>
     <AuthCard
      title="Return to the Dojo"
      subtitle="The battle awaits you."
      >

        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Secret Code"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

  <   ForgotPasswordLink onClick={handleForgot} />

      <AuthButton
        text="Enter"
        loading={loading}
        onClick={handleSubmit}
      />

      <GoogleButton />    

      <AuthSwitch
        text="New warrior?"
        linkText="Join the battlefield ⚔️"
        to="/signup"
        variant="red"
      />

      </AuthCard>
    </NinjaBackground>
  );
}

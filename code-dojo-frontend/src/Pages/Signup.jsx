import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import NinjaBackground from "../components/Auth/NinjaBackground";
import AuthCard from "../components/Auth/AuthCard";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthButton from "../components/Button/AuthButton";
import AuthSwitch from "../components/Link/AuthSwitch";
import GoogleButton from "../components/Button/GoogleButton";

export default function Signup() {
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

useEffect(() => {
    const checkRefreshToken = async () => {
      try {
        const res = await axios.post(
          "/auth/refresh-token",
          {},
          { withCredentials: true } // VERY IMPORTANT
        );

        if (res.data?.success) {
          // store new access token (memory / context)
          // example:
          // setAuth(res.data.accessToken);

          if (res.data.user.hasJoinedBattle) {
            navigate("/");
          } else {
            navigate("/login");
          }
        }
      } catch (err) {
        // refresh token invalid → stay on signup
        console.log("No valid refresh token");
      }
    };

    checkRefreshToken();
  }, [navigate]);


    const handleSubmit = async () => {
    try {
        setLoading(true);
        await signup(form);
        toast.success("Welcome to the Dojo 🥷");
    } catch (err) {
        const message =
        err.response?.data?.message ||
        "Something went wrong. Try again.";

        toast.error(message);
    } finally {
        setLoading(false);
    }
    };

    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
      return <Navigate to="/home" replace />; // or /dashboard later
    }


  return (
    <NinjaBackground>
      <AuthCard
        title="Enter the Dojo"
        subtitle="Only the disciplined survive."
      >
        <input
          placeholder="Warrior Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Secret Code"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <AuthButton
          text="Join the Battle"
          loading={loading}
          onClick={handleSubmit}
        />

        <GoogleButton />

        <AuthSwitch
          text="Already forged?"
          linkText="Return to the dojo 🥷"
          to="/login"
          variant="white"
        />



      </AuthCard>
    </NinjaBackground>
  );
}

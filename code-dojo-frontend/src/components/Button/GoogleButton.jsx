import { GoogleLogin } from "@react-oauth/google";
import api from "../../api/axios";

export default function GoogleButton() {
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      window.location.href = "/"; // or navigate("/")
      console.log("Google Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);

    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  return (
    <div className="dojo-google-wrapper">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.log("Google Login Failed");
        }}
        theme="outline"
        size="large"
        width="100%"
      />
    </div>
  );
}

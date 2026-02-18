export default function ForgotPassword({ onClose }) {
  return (
    <div className="forgot-box">
      <h3>Reset Password</h3>
      <input type="email" placeholder="Enter your email" />
      <button>Send Reset Link</button>
      <button onClick={onClose}>Back to Login</button>
    </div>
  );
}

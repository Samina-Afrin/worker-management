import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import "./Login.css";

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.target);

    axios
      .post(`${import.meta.env.VITE_API_URL}login.php`, {
        email: form.get("email"),
        password: form.get("password")
      })
      .then((response) => {
        sessionStorage.setItem("access_token", response.data.jwt);
        sessionStorage.setItem("userdata", response.data.data);
        window.location.href = "./dashboard";
      })
      .catch(() => {
        setMessage("An error occurred while creating your account. Please try again.");
      });
  }

  return (
    <main className="login-page">
      <div className="login-bg-shape login-bg-shape-1" />
      <div className="login-bg-shape login-bg-shape-2" />

      <section className="login-card" aria-label="Sign in">
        <a href="/" className="login-brand text-decoration-none" aria-label="Stockroom home">
          <i className="bi bi-asterisk" aria-hidden="true" />
          <span>Stockroom</span>
        </a>

        <p className="login-subtitle">Please sign in to access your dashboard</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-form-group">
            <label htmlFor="login-email" className="login-form-label">Email Address</label>
            <div className="login-input-group">
              <i className="bi bi-envelope input-icon" aria-hidden="true" />
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="login-password" className="login-form-label">Password</label>
            <div className="login-input-group password-group">
              <i className="bi bi-shield-lock input-icon" aria-hidden="true" />
              <input
                id="login-password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                onClick={() => setPasswordVisible((visible) => !visible)}
              >
                <i className={passwordVisible ? "bi bi-eye-slash" : "bi bi-eye"} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="custom-control-label">
              <input type="checkbox" className="custom-checkbox-input" name="remember" />
              <span>Remember Me</span>
            </label>
            <button
              type="button"
              className="login-text-button"
              onClick={() => setMessage("Please contact your administrator to reset your password.")}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="btn-login" id="btn-submit">
            <span>Sign In to Dashboard</span>
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </button>

          <p className="login-status" role="status" aria-live="polite">
            {message}
          </p>
        </form>

        <div className="login-divider">Or sign in with</div>

        <div className="social-login-grid">
          <button type="button" className="btn-social" aria-label="Continue with Google">
            <i className="bi bi-google text-danger" aria-hidden="true" />
            <span>Google</span>
          </button>
          <button type="button" className="btn-social" aria-label="Continue with GitHub">
            <i className="bi bi-github" aria-hidden="true" />
            <span>GitHub</span>
          </button>
        </div>

        <p className="login-footer-text">
          Don&apos;t have an account? <Link to="/register">Register Now</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;

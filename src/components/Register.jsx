import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import "./Login.css";
import "./Register.css";

function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (password !== confirmPassword) {
      setMessage("Your passwords do not match. Please try again.");
      form.elements.confirmPassword.focus();
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_URL}register.php`, {
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password")
      })
      .then(() => {
        setMessage("Account created successfully. You can now sign in.");
      })
      .catch(() => {
        setMessage("An error occurred while creating your account. Please try again.");
      });
  }

  return (
    <main className="login-page register-page">
      <div className="login-bg-shape login-bg-shape-1" />
      <div className="login-bg-shape login-bg-shape-2" />

      <section className="login-card register-card" aria-label="Create an account">
        <a className="login-brand text-decoration-none" href="/" aria-label="Stockroom home">
          <i className="bi bi-asterisk" aria-hidden="true" />
          <span>Stockroom</span>
        </a>

        <p className="login-subtitle">Create your account and start managing smarter</p>

        <form className="login-form register-form" onSubmit={handleSubmit} noValidate>
          <div className="login-form-group">
            <label htmlFor="register-name" className="login-form-label">Full Name</label>
            <div className="login-input-group">
              <i className="bi bi-person input-icon" aria-hidden="true" />
              <input
                id="register-name"
                name="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                minLength={2}
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="register-email" className="login-form-label">Email Address</label>
            <div className="login-input-group">
              <i className="bi bi-envelope input-icon" aria-hidden="true" />
              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="register-password" className="login-form-label">Password</label>
            <div className="login-input-group password-group">
              <i className="bi bi-shield-lock input-icon" aria-hidden="true" />
              <input
                id="register-password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
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

          <div className="login-form-group">
            <label htmlFor="register-confirm-password" className="login-form-label">Confirm Password</label>
            <div className="login-input-group">
              <i className="bi bi-shield-lock input-icon" aria-hidden="true" />
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type={passwordVisible ? "text" : "password"}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-login register-submit" id="btn-submit-register">
            <span>Create account</span>
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </button>

          <p className="login-status" role="status" aria-live="polite">
            {message}
          </p>
        </form>

        <div className="login-footer-text register-login-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </section>
    </main>
  );
}

export default Register;

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TextField from "../components/TextField";
import PasswordInput from "../components/PasswordInput";
import { validateLoginForm } from "../utils/validation";
import "../components/forms.css";
import "./Register.css"; 

const INITIAL_VALUES = { email: "", password: "" };
async function loginUser({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (password === "Test@1234") {
        resolve({ ok: true, user: { email } });
      } else {
        reject(new Error("Incorrect email or password."));
      }
    }, 1000);
  });
}

export default function Login() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loggedInEmail, setLoggedInEmail] = useState("");

  const errors = useMemo(() => validateLoginForm(values), [values]);

  
  const getError = (field) => (touched[field] || submitted ? errors[field] : "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setServerError("");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const invalidFields = Object.keys(errors);
    if (invalidFields.length > 0) {
      document.getElementById(invalidFields[0])?.focus();
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError("");
      const email = values.email.trim().toLowerCase();
      await loginUser({ email, password: values.password });
      setLoggedInEmail(email);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loggedInEmail) {
    return (
      <div className="register-page">
        <section className="register-card success-card">
          <div className="success-icon" aria-hidden="true">✓</div>
          <h1>Welcome back!</h1>
          <p>You are logged in as {loggedInEmail}.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="register-page">
      <section className="register-card">
        <header className="register-header">
          <span className="brand">UniTrade</span>
          <h1>Log in</h1>
          <p>Welcome back! Enter your university email and password.</p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          {serverError && (
            <div className="alert-error" role="alert">{serverError}</div>
          )}

          <TextField
            id="email"
            name="email"
            type="email"
            label="University email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("email")}
            placeholder="name@university.edu.eg"
            autoComplete="email"
          />

          <PasswordInput
            id="password"
            name="password"
            label="Password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("password")}
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>

          <p className="login-hint">
            New to UniTrade? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
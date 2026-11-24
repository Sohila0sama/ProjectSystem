// src/pages/Register.jsx
import { useMemo, useState } from "react";
import PasswordInput from "../components/PasswordInput";
import { PASSWORD_RULES, validateRegisterForm } from "../utils/validation";
import "./Register.css";

const INITIAL_VALUES = { name: "", email: "", password: "", confirmPassword: "" };

// ---------------------------------------------------------------------------
// TODO (backend teammate): replace this mock with the real API call, e.g.
//
//   const res = await fetch("/api/auth/register", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name, email, password }),
//   });
//   if (!res.ok) throw new Error((await res.json()).message || "Registration failed.");
//   return res.json();
//
// For now: any email starting with "taken@" simulates "already registered".
// ---------------------------------------------------------------------------
async function registerUser({ email }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.startsWith("taken@")) {
        reject(new Error("This email is already registered."));
      } else {
        resolve({ ok: true });
      }
    }, 1000);
  });
}

function TextField({ id, name, label, type = "text", value, onChange, onBlur, error, placeholder, autoComplete }) {
  const errorId = `${id}-error`;
  return (
    <div className={`field ${error ? "field--invalid" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
        />
      </div>
      {error && (
        <p id={errorId} className="error-msg" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Register() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  // Recomputed on every change, so "confirm password" updates
  // automatically when the user edits the password field.
  const errors = useMemo(() => validateRegisterForm(values), [values]);

  // Only show an error after the user left the field, or tried to submit.
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
      await registerUser({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      setSuccess(true);
      setValues(INITIAL_VALUES);
      setTouched({});
      setSubmitted(false);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="register-page">
        <section className="register-card success-card">
          <div className="success-icon" aria-hidden="true">✓</div>
          <h1>Account created!</h1>
          <p>Your UniTrade account is ready. You can now log in with your university email.</p>
          <a className="submit-btn link-btn" href="/login">Go to login</a>
        </section>
      </main>
    );
  }

  const showChecklist = touched.password || submitted || values.password.length > 0;

  return (
    <main className="register-page">
      <section className="register-card">
        <header className="register-header">
          <span className="brand">UniTrade</span>
          <h1>Create your account</h1>
          <p>Student-only marketplace. Use your university email to join.</p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          {serverError && (
            <div className="alert-error" role="alert">{serverError}</div>
          )}

          <TextField
            id="name"
            name="name"
            label="Full name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("name")}
            placeholder="e.g. Ahmed Mohamed"
            autoComplete="name"
          />

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
            placeholder="Create a strong password"
            autoComplete="new-password"
            describedBy="password-rules"
          />

          {showChecklist && (
            <ul id="password-rules" className="rules" aria-label="Password requirements">
              {PASSWORD_RULES.map((rule) => {
                const met = rule.test(values.password);
                return (
                  <li key={rule.id} className={met ? "rule rule--met" : "rule"}>
                    <span aria-hidden="true">{met ? "✓" : "○"}</span> {rule.label}
                  </li>
                );
              })}
            </ul>
          )}

          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("confirmPassword")}
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <p className="login-hint">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </form>
      </section>
    </main>
  );
}

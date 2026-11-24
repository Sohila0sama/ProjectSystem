import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import TextField from "../components/TextField";
import { PASSWORD_RULES, validateRegisterForm } from "../utils/validation";
import "../components/forms.css";
import "./Register.css";

const INITIAL_VALUES = { name: "", email: "", password: "", confirmPassword: "" };

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

export default function Register() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const errors = useMemo(() => validateRegisterForm(values), [values]);
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
      <div className="register-page">
        <section className="register-card success-card">
          <div className="success-icon" aria-hidden="true">✓</div>
          <h1>Account created!</h1>
          <p>Your UniTrade account is ready. You can now log in with your university email.</p>
          <Link className="submit-btn link-btn" to="/login">Go to login</Link>
        </section>
      </div>
    );
  }

  const showChecklist = touched.password || submitted || values.password.length > 0;

  return (
    <div className="register-page">
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
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
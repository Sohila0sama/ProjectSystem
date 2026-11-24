// src/utils/validation.js
// All validation rules live here so they are easy to test and reuse (e.g. in the Login page).

// Accepts university domains such as: cu.edu.eg, mit.edu, ox.ac.uk, guc.edu.eg
export const UNIVERSITY_EMAIL_REGEX =
  /^[a-z0-9._%+-]+@([a-z0-9-]+\.)+(edu|ac)(\.[a-z]{2})?$/i;

// Each rule is shown live as a checklist under the password field.
export const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { id: "upper", label: "One uppercase letter (A-Z)", test: (v) => /[A-Z]/.test(v) },
  { id: "lower", label: "One lowercase letter (a-z)", test: (v) => /[a-z]/.test(v) },
  { id: "number", label: "One number (0-9)", test: (v) => /\d/.test(v) },
  {
    id: "special",
    label: "One special character (! @ # $ ...)",
    test: (v) => /[^A-Za-z0-9\s]/.test(v),
  },
];

export const validateName = (value) => {
  const v = value.trim();
  if (!v) return "Full name is required.";
  if (v.length < 3) return "Name must be at least 3 characters.";
  if (v.length > 50) return "Name must be 50 characters or fewer.";
  // Letters (any language, including Arabic), spaces, apostrophes, dots, hyphens
  if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(v)) {
    return "Name can only contain letters and spaces.";
  }
  return "";
};

export const validateEmail = (value) => {
  const v = value.trim();
  if (!v) return "University email is required.";
  if (/\s/.test(v)) return "Email must not contain spaces.";
  if (!v.includes("@")) return "Email must contain '@'.";
  if (!UNIVERSITY_EMAIL_REGEX.test(v)) {
    return "Use your university email (e.g. name@cu.edu.eg).";
  }
  return "";
};

export const validatePassword = (value) => {
  if (!value) return "Password is required.";
  if (/\s/.test(value)) return "Password must not contain spaces.";
  const failed = PASSWORD_RULES.find((rule) => !rule.test(value));
  return failed ? `Password needs: ${failed.label.toLowerCase()}.` : "";
};

export const validateConfirmPassword = (password, confirm) => {
  if (!confirm) return "Please confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return "";
};

// Returns an object with ONLY the invalid fields, in form order.
// Empty object => form is valid.
export const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const confirmError = validateConfirmPassword(password, confirmPassword);

  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  if (confirmError) errors.confirmPassword = confirmError;
  return errors;
};

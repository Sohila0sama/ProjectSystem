import { useEffect, useMemo, useState } from "react";
import TextField from "../components/TextField";
import { validateProfileForm } from "../utils/validation";
import "../components/forms.css";
import "./Profile.css";

const INITIAL_VALUES = { name: "", phone: "", faculty: "" };

// Week 3: replace with the real API call (PUT /api/users/me)
async function saveProfile(profile) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ok: true, profile }), 800);
  });
}

export default function Profile() {
  const [savedValues, setSavedValues] = useState(INITIAL_VALUES);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [savedAvatar, setSavedAvatar] = useState(null);

  const errors = useMemo(() => validateProfileForm(values), [values]);
  const getError = (field) => (touched[field] || submitted ? errors[field] : "");

  const isDirty =
    avatar !== savedAvatar ||
    Object.keys(values).some((key) => values[key] !== savedValues[key]);

  const initials =
    values.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?";

  // Free the old preview image from memory when it changes
  useEffect(() => {
    return () => {
      if (avatar && avatar !== savedAvatar) URL.revokeObjectURL(avatar);
    };
  }, [avatar, savedAvatar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setJustSaved(false);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setAvatar(URL.createObjectURL(file));
      setJustSaved(false);
    }
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
      const cleaned = {
        name: values.name.trim(),
        phone: values.phone.trim(),
        faculty: values.faculty.trim(),
      };
      await saveProfile(cleaned);
      setValues(cleaned);
      setSavedValues(cleaned);
      setSavedAvatar(avatar);
      setJustSaved(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-page">
      <section className="profile-card">
        <div className="profile-banner" />

        <label className="profile-avatar" title="Change photo">
          {avatar ? <img src={avatar} alt="Your avatar" /> : <span>{initials}</span>}
          <em>Edit</em>
          <input type="file" accept="image/*" onChange={handleAvatar} hidden />
        </label>

        <div className="profile-body">
          <h1>{values.name.trim() || "Your profile"}</h1>

          <form onSubmit={handleSubmit} noValidate>
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

            <div className="profile-row">
              <TextField
                id="phone"
                name="phone"
                type="tel"
                label="Phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={getError("phone")}
                placeholder="01012345678"
                autoComplete="tel"
              />

              <TextField
                id="faculty"
                name="faculty"
                label="Faculty"
                value={values.faculty}
                onChange={handleChange}
                onBlur={handleBlur}
                error={getError("faculty")}
                placeholder="e.g. Computer Science"
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={!isDirty || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>

            <p className="profile-saved" role="status">
              {justSaved ? "Profile updated." : ""}
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
import { useState } from "react";

const EMPTY = { name: "", phone: "", faculty: "" };

export default function useProfileForm(initial = EMPTY) {
  const [saved, setSaved] = useState(initial);
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [justSaved, setJustSaved] = useState(false);

  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  const validate = (v) => {
    const e = {};
    if (v.name.trim().length < 3) e.name = "Name must be at least 3 characters.";
    if (!/^01[0125]\d{8}$/.test(v.phone.trim()))
      e.phone = "Enter an Egyptian mobile number, e.g. 01012345678.";
    if (!v.faculty.trim()) e.faculty = "Faculty is required.";
    return e;
  };

  const onChange = (ev) => {
    const { name, value } = ev.target;
    setValues((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
    setJustSaved(false);
  };

  const onAvatar = (ev) => {
    const file = ev.target.files?.[0];
    if (file && file.type.startsWith("image/")) setAvatar(URL.createObjectURL(file));
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const e = validate(values);
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaved(values);
    setJustSaved(true);
    // Week 3: replace with the real API call (PUT /api/users/me)
  };

  const initials =
    values.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

  return { values, errors, avatar, dirty, justSaved, initials, onChange, onAvatar, onSubmit };
}

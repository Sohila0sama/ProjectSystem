import useProfileForm from "./useProfileForm";
import "./ProfileBanner.css";

export default function ProfileBanner() {
  const f = useProfileForm();
  const field = (name, label, type, ph) => (
    <div className="pc-field">
      <label htmlFor={`pc-${name}`}>{label}</label>
      <input id={`pc-${name}`} name={name} type={type} placeholder={ph}
        value={f.values[name]} onChange={f.onChange} aria-invalid={!!f.errors[name]} />
      {f.errors[name] && <span className="pc-err" role="alert">{f.errors[name]}</span>}
    </div>
  );
  return (
    <main className="pc-page">
      <form className="pc-card" onSubmit={f.onSubmit} noValidate>
        <div className="pc-banner" />
        <label className="pc-avatar" title="Change photo">
          {f.avatar ? <img src={f.avatar} alt="Your avatar" /> : <span>{f.initials}</span>}
          <em>Edit</em>
          <input type="file" accept="image/*" onChange={f.onAvatar} hidden />
        </label>
        <div className="pc-body">
          <h1>{f.values.name || "Your profile"}</h1>
          {field("name", "Full name", "text", "Fatma Ahmed")}
          <div className="pc-row">
            {field("phone", "Phone", "tel", "01012345678")}
            {field("faculty", "Faculty", "text", "Computer Science")}
          </div>
          <button type="submit" disabled={!f.dirty}>Save changes</button>
          <p className="pc-ok" role="status">{f.justSaved ? "Profile updated." : ""}</p>
        </div>
      </form>
    </main>
  );
}

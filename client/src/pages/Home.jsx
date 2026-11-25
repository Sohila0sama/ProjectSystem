import logo from "../assets/logo.png";

export default function Home() {
  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={logo}
        alt="Pickify"
        style={{ height: 160, mixBlendMode: "multiply" }}
      />
      <h1>Welcome to Pickify</h1>
      <p>The student-only campus marketplace.</p>
    </div>
  );
}
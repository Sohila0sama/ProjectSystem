import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
     <p>© {new Date().getFullYear()} Pickify — Campus Marketplace</p>
    </footer>
  );
}
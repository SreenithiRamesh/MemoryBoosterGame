import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        background: "#1e3a8a",
        padding: "1rem",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <h2>🧠 Memory Game</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/" style={{ color: "white" }}>Home</Link>
        <Link to="/play" style={{ color: "white" }}>Play</Link>
        <Link to="/login" style={{ color: "white" }}>Login</Link>
        <Link to="/register" style={{ color: "white" }}>Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;

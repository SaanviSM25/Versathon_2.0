import { useState } from "react";
import FindSkills from "./pages/FindSkills";
import Requests from "./pages/Requests";
import Sessions from "./pages/Sessions";

function App() {
  const [page, setPage] = useState("find");

  return (
    <div>

      {/* NAVIGATION */}
      <nav
        style={{
          padding: "15px 25px",
          backgroundColor: "#1e293b",
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >

        <button
          onClick={() => setPage("find")}
          style={buttonStyle}
        >
          Find Skills
        </button>

        <button
          onClick={() => setPage("requests")}
          style={buttonStyle}
        >
          Requests
        </button>

        <button
          onClick={() => setPage("sessions")}
          style={buttonStyle}
        >
          Sessions
        </button>

      </nav>

      {/* PAGES */}

      {page === "find" && (
        <FindSkills />
      )}

      {page === "requests" && (
        <Requests />
      )}

      {page === "sessions" && (
        <Sessions />
      )}

    </div>
  );
}

const buttonStyle = {
  padding: "10px 18px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  backgroundColor: "white",
  color: "#1e293b",
  fontWeight: "600",
};

export default App;
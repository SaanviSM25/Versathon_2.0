import { useEffect, useState } from "react";

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Temporary current user ID for testing
  // Replace this later with the logged-in user's actual ID
  const userId = "8853da02-7b17-4e6a-a1c2-8c229c9ef545";

  // ==========================================
  // GET SESSIONS
  // ==========================================

  const fetchSessions = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/sessions/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch sessions");
      }

      setSessions(data);
    } catch (error) {
      console.error("Fetch sessions error:", error);
      setMessage("Could not load sessions.");
    } finally {
      setLoading(false);
    }
  };

  // Load sessions when page opens
  useEffect(() => {
    fetchSessions();
  }, []);

  // ==========================================
  // UPDATE SESSION STATUS
  // ==========================================

  const updateSessionStatus = async (sessionId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/sessions/${sessionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update session");
      }

      setMessage(data.message);

      // Refresh sessions after update
      fetchSessions();
    } catch (error) {
      console.error("Update session error:", error);
      setMessage("Could not update session.");
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div style={styles.container}>
        <h1>Sessions</h1>
        <p>Loading your sessions...</p>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Sessions</h1>

      <p style={styles.subtitle}>
        View and manage your skill-sharing sessions.
      </p>

      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}

      {sessions.length === 0 ? (
        <div style={styles.emptyBox}>
          <h2>No sessions yet</h2>

          <p>
            Your upcoming and completed skill-sharing
            sessions will appear here.
          </p>
        </div>
      ) : (
        <div style={styles.sessionList}>
          {sessions.map((session) => (
            <div
              key={session.id}
              style={styles.card}
            >
              <h2 style={styles.cardTitle}>
                Skill Session
              </h2>

              <p>
                <strong>Date:</strong>{" "}
                {session.date}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {session.time}
              </p>

              <p>
                <strong>Role:</strong>{" "}
                {session.learnerid === userId
                  ? "Learner"
                  : "Mentor"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span style={styles.status}>
                  {session.status}
                </span>
              </p>

              <p>
                <strong>Request ID:</strong>{" "}
                {session.requestId}
              </p>

              <div style={styles.buttons}>
                {session.status === "scheduled" && (
                  <>
                    <button
                      style={styles.completeButton}
                      onClick={() =>
                        updateSessionStatus(
                          session.id,
                          "completed"
                        )
                      }
                    >
                      Mark Completed
                    </button>

                    <button
                      style={styles.cancelButton}
                      onClick={() =>
                        updateSessionStatus(
                          session.id,
                          "cancelled"
                        )
                      }
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        style={styles.refreshButton}
        onClick={fetchSessions}
      >
        Refresh Sessions
      </button>
    </div>
  );
}

// ==========================================
// SIMPLE STYLES
// ==========================================

const styles = {
  container: {
    padding: "40px",
    maxWidth: "900px",
    margin: "0 auto",
  },

  heading: {
    marginBottom: "8px",
  },

  subtitle: {
    color: "#666",
    marginBottom: "25px",
  },

  message: {
    padding: "12px",
    marginBottom: "20px",
    backgroundColor: "#e8f5e9",
    borderRadius: "8px",
  },

  emptyBox: {
    padding: "30px",
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: "12px",
  },

  sessionList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  card: {
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    marginTop: "0",
    marginBottom: "20px",
  },

  status: {
    fontWeight: "bold",
  },

  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },

  completeButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#4caf50",
    color: "white",
  },

  cancelButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#f44336",
    color: "white",
  },

  refreshButton: {
    marginTop: "25px",
    padding: "10px 18px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#333",
    color: "white",
  },
};

export default Sessions;
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Temporary current user
  // Later this will come from Supabase Auth
  const currentUserId =
    "8853da02-7b17-4e6a-a1c2-8c229c9ef545";

  // ==============================
  // GET PENDING REQUESTS
  // ==============================

  const fetchRequests = async () => {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("Request")
      .select("*")
      .eq("mentorId", currentUserId)
      .eq("status", "pending")
      .order("createdAt", {
        ascending: false,
      });

    if (error) {
      console.error("Error fetching requests:", error);
      setMessage("Could not load requests.");
    } else {
      setRequests(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ==============================
  // ACCEPT REQUEST
  // ==============================

  const acceptRequest = async (requestId) => {
    setMessage("");

    const { error } = await supabase
      .from("Request")
      .update({
        status: "accepted",
      })
      .eq("id", requestId);

    if (error) {
      console.error("Accept error:", error);
      setMessage("Could not accept request.");
      return;
    }

    setMessage("Request accepted successfully.");

    // Refresh requests
    fetchRequests();
  };

  // ==============================
  // REJECT REQUEST
  // ==============================

  const rejectRequest = async (requestId) => {
    setMessage("");

    const { error } = await supabase
      .from("Request")
      .update({
        status: "rejected",
      })
      .eq("id", requestId);

    if (error) {
      console.error("Reject error:", error);
      setMessage("Could not reject request.");
      return;
    }

    setMessage("Request rejected.");

    // Refresh requests
    fetchRequests();
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>Requests</h1>

      <p>
        Manage requests from students who want to
        learn from you.
      </p>

      {message && (
        <p
          style={{
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#e5e7eb",
          }}
        >
          {message}
        </p>
      )}

      {loading && (
        <p>Loading requests...</p>
      )}

      {!loading && requests.length === 0 && (
        <p>
          No pending requests.
        </p>
      )}

      {!loading &&
        requests.map((request) => (
          <div
            key={request.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "15px",
            }}
          >
            <h3>
              Skill Request
            </h3>

            <p>
              <strong>Request ID:</strong>{" "}
              {request.id}
            </p>

            <p>
              <strong>Learner ID:</strong>{" "}
              {request.learnerId}
            </p>

            <p>
              <strong>Skill ID:</strong>{" "}
              {request.skillId}
            </p>

            <p>
              <strong>Message:</strong>{" "}
              {request.message || "No message"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {request.status}
            </p>

            <button
              onClick={() =>
                acceptRequest(request.id)
              }
              style={{
                marginRight: "10px",
                padding: "8px 15px",
                cursor: "pointer",
              }}
            >
              Accept
            </button>

            <button
              onClick={() =>
                rejectRequest(request.id)
              }
              style={{
                padding: "8px 15px",
                cursor: "pointer",
              }}
            >
              Reject
            </button>
          </div>
        ))}
    </div>
  );
}

export default Requests;
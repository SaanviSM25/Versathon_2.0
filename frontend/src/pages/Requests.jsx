import { useEffect, useState } from "react";

// =====================================================
// CURRENT USER
// =====================================================

const CURRENT_USER_ID = "8853da02-7b17-4e6a-a1c2-8c229c9ef545";

const API_URL = "http://localhost:5000";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [skillName, setSkillName] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // =====================================================
  // LOAD REQUESTS + SESSIONS
  // =====================================================

  useEffect(() => {
    loadRequests();
    loadSessions();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/requests/${CURRENT_USER_ID}`
      );

      if (!response.ok) {
        throw new Error("Failed to load requests");
      }

      const data = await response.json();

      setRequests(data || []);
    } catch (error) {
      console.error("Load requests error:", error);
      setMessage("Could not load requests.");
    }
  };

  const loadSessions = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/sessions/${CURRENT_USER_ID}`
      );

      if (!response.ok) {
        throw new Error("Failed to load sessions");
      }

      const data = await response.json();

      setSessions(data || []);
    } catch (error) {
      console.error("Load sessions error:", error);
      setMessage("Could not load sessions.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEND REQUEST
  // =====================================================

  const sendRequest = async () => {
    if (skillName === "" || requestMessage === "") {
      setMessage("Please enter the skill and message.");
      return;
    }

    setMessage(
      "Send requests from the matching page so the mentor ID is included."
    );
  };

  // =====================================================
  // ACCEPT / REJECT REQUEST
  // =====================================================

  const updateStatus = async (id, newStatus) => {
    try {
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/requests/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update request");
      }

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === id
            ? { ...request, status: newStatus }
            : request
        )
      );

      setMessage(`Request ${newStatus} successfully.`);
    } catch (error) {
      console.error("Update request error:", error);
      setMessage("Could not update request.");
    }
  };

  // =====================================================
  // CREATE SESSION
  // =====================================================

  const scheduleSession = async (request) => {
    if (sessionDate === "" || sessionTime === "") {
      setMessage("Please select a date and time.");
      return;
    }

    try {
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId: request.id,
            learnerId: request.learnerId,
            mentorId: request.mentorId,
            skillId: request.skillId,
            date: sessionDate,
            time: sessionTime,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to schedule session");
      }

      const result = await response.json();

      if (result.session) {
        setSessions((currentSessions) => [
          ...currentSessions,
          result.session,
        ]);
      } else {
        await loadSessions();
      }

      setSessionDate("");
      setSessionTime("");

      setMessage("Session scheduled successfully.");
    } catch (error) {
      console.error("Schedule session error:", error);
      setMessage("Could not schedule session.");
    }
  };

  // =====================================================
  // COMPLETE SESSION
  // =====================================================

  const completeSession = async (sessionId) => {
    try {
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/sessions/${sessionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "completed",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to complete session");
      }

      setSessions((currentSessions) =>
        currentSessions.map((session) =>
          session.id === sessionId
            ? { ...session, status: "completed" }
            : session
        )
      );

      setMessage("Session marked as completed.");
    } catch (error) {
      console.error("Complete session error:", error);
      setMessage("Could not complete session.");
    }
  };

  // =====================================================
  // FEEDBACK
  // =====================================================

  const submitFeedback = () => {
    if (rating === "") {
      setMessage("Please select a rating.");
      return;
    }

    setFeedbackSubmitted(true);
    setMessage("Feedback submitted successfully.");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div>
        <h2>Campus Skill Exchange</h2>
        <p>Loading requests and sessions...</p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div>
      <h2>Campus Skill Exchange</h2>

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      {/* SEND REQUEST */}

      <div className="request-card">
        <h3>Send Learning Request</h3>

        <label>
          <strong>Skill:</strong>
        </label>

        <br />

        <input
          type="text"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          placeholder="Enter skill you want to learn"
        />

        <br />
        <br />

        <label>
          <strong>Message:</strong>
        </label>

        <br />

        <textarea
          value={requestMessage}
          onChange={(e) => setRequestMessage(e.target.value)}
          placeholder="Write your request message"
          rows="4"
        />

        <br />

        <button onClick={sendRequest}>
          Send Request
        </button>
      </div>

      {/* SENT REQUESTS */}

      <h2>My Sent Requests</h2>

      {requests
        .filter(
          (request) => request.learnerId === CURRENT_USER_ID
        )
        .map((request) => (
          <div className="request-card" key={request.id}>
            <h3>Request #{request.id}</h3>

            <p>
              <strong>Mentor ID:</strong>{" "}
              {request.mentorId}
            </p>

            <p>
              <strong>Skill ID:</strong>{" "}
              {request.skillId}
            </p>

            <p>
              <strong>Message:</strong>{" "}
              {request.message}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className="status">
                {request.status}
              </span>
            </p>

            <p>
              <strong>Requested on:</strong>{" "}
              {request.createdAt || "N/A"}
            </p>

            {request.status === "accepted" && (
              <div className="session">
                <h3>Schedule Session</h3>

                <label>
                  <strong>Date:</strong>
                </label>

                <br />

                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) =>
                    setSessionDate(e.target.value)
                  }
                />

                <br />
                <br />

                <label>
                  <strong>Time:</strong>
                </label>

                <br />

                <input
                  type="time"
                  value={sessionTime}
                  onChange={(e) =>
                    setSessionTime(e.target.value)
                  }
                />

                <br />

                <button
                  onClick={() =>
                    scheduleSession(request)
                  }
                >
                  Schedule Session
                </button>
              </div>
            )}
          </div>
        ))}

      {requests.filter(
        (request) => request.learnerId === CURRENT_USER_ID
      ).length === 0 && (
        <p>No sent requests yet.</p>
      )}

      {/* RECEIVED REQUESTS */}

      <h2>Received Requests</h2>

      {requests
        .filter(
          (request) => request.mentorId === CURRENT_USER_ID
        )
        .map((request) => (
          <div className="request-card" key={request.id}>
            <h3>Request #{request.id}</h3>

            <p>
              <strong>From learner:</strong>{" "}
              {request.learnerId}
            </p>

            <p>
              <strong>Skill ID:</strong>{" "}
              {request.skillId}
            </p>

            <p>
              <strong>Message:</strong>{" "}
              {request.message}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className="status">
                {request.status}
              </span>
            </p>

            <p>
              <strong>Requested on:</strong>{" "}
              {request.createdAt || "N/A"}
            </p>

            {request.status === "pending" && (
              <div>
                <button
                  onClick={() =>
                    updateStatus(
                      request.id,
                      "accepted"
                    )
                  }
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      request.id,
                      "rejected"
                    )
                  }
                >
                  Reject
                </button>
              </div>
            )}

            {request.status === "accepted" && (
              <div className="session">
                <h3>Schedule Session</h3>

                <label>
                  <strong>Date:</strong>
                </label>

                <br />

                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) =>
                    setSessionDate(e.target.value)
                  }
                />

                <br />
                <br />

                <label>
                  <strong>Time:</strong>
                </label>

                <br />

                <input
                  type="time"
                  value={sessionTime}
                  onChange={(e) =>
                    setSessionTime(e.target.value)
                  }
                />

                <br />

                <button
                  onClick={() =>
                    scheduleSession(request)
                  }
                >
                  Schedule Session
                </button>
              </div>
            )}
          </div>
        ))}

      {requests.filter(
        (request) => request.mentorId === CURRENT_USER_ID
      ).length === 0 && (
        <p>No received requests yet.</p>
      )}

      {/* UPCOMING SESSIONS */}

      <h2>Upcoming Sessions</h2>

      {sessions
        .filter(
          (session) => session.status === "scheduled"
        )
        .map((session) => (
          <div className="request-card" key={session.id}>
            <h3>Session #{session.id}</h3>

            <p>
              <strong>Learner:</strong>{" "}
              {session.learnerId}
            </p>

            <p>
              <strong>Mentor:</strong>{" "}
              {session.mentorId}
            </p>

            <p>
              <strong>Skill ID:</strong>{" "}
              {session.skillId}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {session.date}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {session.time}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className="status">
                Scheduled
              </span>
            </p>

            <button
              onClick={() =>
                completeSession(session.id)
              }
            >
              Mark Session Completed
            </button>
          </div>
        ))}

      {sessions.filter(
        (session) => session.status === "scheduled"
      ).length === 0 && (
        <p>No upcoming sessions.</p>
      )}

      {/* FEEDBACK */}

      {sessions.some(
        (session) => session.status === "completed"
      ) &&
        !feedbackSubmitted && (
          <div className="request-card">
            <h2>Give Feedback</h2>

            <label>
              <strong>Rating:</strong>
            </label>

            <br />

            <select
              value={rating}
              onChange={(e) =>
                setRating(e.target.value)
              }
            >
              <option value="">
                Select a rating
              </option>

              <option value="5">
                5 - Excellent
              </option>

              <option value="4">
                4 - Very Good
              </option>

              <option value="3">
                3 - Good
              </option>

              <option value="2">
                2 - Average
              </option>

              <option value="1">
                1 - Poor
              </option>
            </select>

            <br />
            <br />

            <label>
              <strong>Comment:</strong>
            </label>

            <br />

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Write your feedback"
              rows="4"
            />

            <br />

            <button onClick={submitFeedback}>
              Submit Feedback
            </button>
          </div>
        )}

      {/* FEEDBACK SUBMITTED */}

      {feedbackSubmitted && (
        <div className="request-card">
          <h2>Feedback Submitted</h2>

          <p>
            <strong>Rating:</strong>{" "}
            {rating} / 5
          </p>

          <p>
            <strong>Comment:</strong>{" "}
            {comment}
          </p>
        </div>
      )}
    </div>
  );
}

export default Requests;
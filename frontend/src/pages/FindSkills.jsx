import { useEffect, useState } from "react";

function FindSkills() {
  // =====================================================
  // CURRENT USER
  // =====================================================

  // Temporary current user.
  // Later this can come from Supabase Auth.
  const currentUserId =
    "8853da02-7b17-4e6a-a1c2-8c229c9ef545";

  // =====================================================
  // STATES
  // =====================================================

  const [selectedSkill, setSelectedSkill] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [message, setMessage] = useState("");

  const [sendingRequest, setSendingRequest] = useState(false);

  // =====================================================
  // AVAILABLE SKILLS
  // =====================================================

  const availableSkills = [
    "React",
    "Python",
    "C++",
    "Java",
    "Guitar",
    "Drawing",
    "Business",
    "Photography",
  ];

  // =====================================================
  // GET MATCHES FROM BACKEND
  // =====================================================

  const fetchMatches = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/matches/${currentUserId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load matches"
        );
      }

      setMatches(data || []);
    } catch (error) {
      console.error("Matching error:", error);

      setMessage(
        error.message ||
          "Could not load recommended students."
      );
    }

    setLoading(false);
  };

  // =====================================================
  // RUN WHEN PAGE LOADS
  // =====================================================

  useEffect(() => {
    fetchMatches();
  }, []);

  // =====================================================
  // OPEN SEND REQUEST MODAL
  // =====================================================

  const openRequestModal = (mentor, skillName) => {
    setSelectedMentor(mentor);
    setSelectedSkill(skillName);
    setMessage("");
    setModalOpen(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMentor(null);
    setMessage("");
    setSendingRequest(false);
  };

  // =====================================================
  // SEND REQUEST
  // =====================================================

  const sendRequest = async () => {
    if (!selectedMentor) {
      setMessage("Please select a mentor.");
      return;
    }

    if (!selectedSkill) {
      setMessage("Please select a skill.");
      return;
    }

    setSendingRequest(true);
    setMessage("");

    try {
      // =================================================
      // SEND REQUEST TO OUR NODE/EXPRESS BACKEND
      // =================================================

      const response = await fetch(
        "http://localhost:5000/api/requests",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            learnerId: currentUserId,
            mentorId: selectedMentor.id,
            skillName: selectedSkill,
            message: `I want to learn ${selectedSkill}.`,
          }),
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);

      // =================================================
      // HANDLE ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not create request."
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      setMessage(
        "Request sent successfully!"
      );

      setTimeout(() => {
        closeModal();
      }, 1000);

    } catch (error) {
      console.error(
        "Send request error:",
        error
      );

      setMessage(
        error.message ||
          "Could not create request."
      );

      setSendingRequest(false);
    }
  };

  // =====================================================
  // FILTER MATCHES BY SELECTED SKILL
  // =====================================================

  const filteredMatches = selectedSkill
    ? matches.filter((student) =>
        student.matchingSkills?.includes(
          selectedSkill
        )
      )
    : matches;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f1117",
        color: "white",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <h1
          style={{
            fontSize: "56px",
            marginBottom: "10px",
          }}
        >
          Find Skills
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#d1d5db",
            marginBottom: "30px",
          }}
        >
          Find students who can teach you the skills you
          want to learn.
        </p>

        {/* =================================================
            AVAILABLE SKILLS
        ================================================= */}

        <h2
          style={{
            marginBottom: "15px",
          }}
        >
          Available Skills
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "35px",
          }}
        >

          {/* SHOW ALL BUTTON */}

          <button
            onClick={() => {
              setSelectedSkill("");
              setMessage("");
            }}
            style={{
              padding: "10px 18px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              backgroundColor:
                selectedSkill === ""
                  ? "#4f46e5"
                  : "#555",
              color: "white",
            }}
          >
            Show All
          </button>

          {availableSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => {
                setSelectedSkill(skill);
                setMessage("");
              }}
              style={{
                padding: "10px 18px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                backgroundColor:
                  selectedSkill === skill
                    ? "#4f46e5"
                    : "#555",
                color: "white",
              }}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* =================================================
            ERROR / SUCCESS MESSAGE
        ================================================= */}

        {message && !modalOpen && (
          <div
            style={{
              padding: "15px",
              marginBottom: "25px",
              borderRadius: "8px",
              backgroundColor:
                message.includes("successfully")
                  ? "#14532d"
                  : "#991b1b",
              color: "white",
              fontSize: "17px",
            }}
          >
            {message}
          </div>
        )}

        {/* =================================================
            RECOMMENDED STUDENTS
        ================================================= */}

        <h2
          style={{
            marginBottom: "25px",
          }}
        >
          Recommended Students
        </h2>

        {loading && (
          <p
            style={{
              fontSize: "18px",
            }}
          >
            Loading recommended students...
          </p>
        )}

        {!loading &&
          filteredMatches.length === 0 && (
            <p
              style={{
                fontSize: "18px",
                color: "#d1d5db",
              }}
            >
              No matching students found.
            </p>
          )}

        {/* =================================================
            MATCH CARDS
        ================================================= */}

        {!loading &&
          filteredMatches.map((student) => (
            <div
              key={student.id}
              style={{
                backgroundColor: "#111827",
                border: "1px solid #475569",
                borderRadius: "12px",
                padding: "35px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >

              {/* NAME */}

              <h2
                style={{
                  fontSize: "28px",
                  marginBottom: "15px",
                }}
              >
                {student.name}
              </h2>

              {/* DEPARTMENT */}

              <p
                style={{
                  fontSize: "18px",
                  margin: "8px",
                }}
              >
                <strong>Department:</strong>{" "}
                {student.department}
              </p>

              {/* YEAR */}

              <p
                style={{
                  fontSize: "18px",
                  margin: "8px",
                }}
              >
                <strong>Year:</strong>{" "}
                {student.year}
              </p>

              {/* BIO */}

              <p
                style={{
                  fontSize: "17px",
                  margin: "12px 0",
                }}
              >
                <strong>Bio:</strong>{" "}
                {student.bio ||
                  "No bio available."}
              </p>

              {/* MATCH */}

              <p
                style={{
                  fontSize: "18px",
                  marginTop: "25px",
                }}
              >
                <strong>Match:</strong>{" "}
                {student.matchScore}%
              </p>

              {/* MATCHING SKILLS */}

              <p
                style={{
                  fontSize: "18px",
                  marginBottom: "20px",
                }}
              >
                <strong>
                  Matching Skills:
                </strong>{" "}
                {student.matchingSkills &&
                student.matchingSkills.length > 0
                  ? student.matchingSkills.join(
                      ", "
                    )
                  : "None"}
              </p>

              {/* SEND REQUEST BUTTON */}

              {student.matchingSkills &&
                student.matchingSkills.length > 0 && (
                  <button
                    onClick={() =>
                      openRequestModal(
                        student,
                        selectedSkill ||
                          student.matchingSkills[0]
                      )
                    }
                    style={{
                      padding: "12px 22px",
                      border: "none",
                      borderRadius: "7px",
                      backgroundColor: "#64748b",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    Send Request
                  </button>
                )}
            </div>
          ))}
      </div>

      {/* ===================================================
          SEND REQUEST MODAL
      =================================================== */}

      {modalOpen && selectedMentor && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor:
              "rgba(0, 0, 0, 0.75)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              backgroundColor: "white",
              color: "black",
              borderRadius: "15px",
              padding: "35px",
              boxSizing: "border-box",
            }}
          >

            {/* MODAL TITLE */}

            <h2
              style={{
                textAlign: "center",
                marginBottom: "25px",
              }}
            >
              Send Request
            </h2>

            {/* MENTOR */}

            <p
              style={{
                textAlign: "center",
                fontSize: "18px",
              }}
            >
              <strong>Mentor:</strong>{" "}
              {selectedMentor.name}
            </p>

            {/* SKILL */}

            <p
              style={{
                textAlign: "center",
                fontSize: "18px",
              }}
            >
              <strong>Skill:</strong>{" "}
              {selectedSkill}
            </p>

            {/* MESSAGE */}

            <label
              style={{
                display: "block",
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "bold",
                marginTop: "25px",
                marginBottom: "10px",
              }}
            >
              Message
            </label>

            <textarea
              value={`I want to learn ${selectedSkill}.`}
              readOnly
              rows="5"
              style={{
                width: "100%",
                padding: "15px",
                boxSizing: "border-box",
                borderRadius: "7px",
                border: "1px solid #ccc",
                resize: "vertical",
                fontSize: "16px",
              }}
            />

            {/* MODAL MESSAGE */}

            {message && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  borderRadius: "7px",
                  backgroundColor:
                    message.includes("successfully")
                      ? "#dcfce7"
                      : "#fee2e2",
                  color:
                    message.includes("successfully")
                      ? "#166534"
                      : "#b91c1c",
                  textAlign: "center",
                  fontSize: "16px",
                }}
              >
                {message}
              </div>
            )}

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >

              <button
                onClick={sendRequest}
                disabled={sendingRequest}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  borderRadius: "7px",
                  backgroundColor:
                    sendingRequest
                      ? "#9ca3af"
                      : "#475569",
                  color: "white",
                  cursor: sendingRequest
                    ? "not-allowed"
                    : "pointer",
                  fontSize: "16px",
                }}
              >
                {sendingRequest
                  ? "Sending..."
                  : "Send Request"}
              </button>

              <button
                onClick={closeModal}
                disabled={sendingRequest}
                style={{
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "7px",
                  backgroundColor: "#64748b",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindSkills;
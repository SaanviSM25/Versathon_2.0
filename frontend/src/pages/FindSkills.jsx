import { useEffect, useState } from "react";

function FindSkills() {
  const skills = [
    { id: 1, name: "React" },
    { id: 2, name: "Python" },
    { id: 3, name: "C++" },
    { id: 4, name: "Java" },
    { id: 5, name: "Guitar" },
    { id: 6, name: "Drawing" },
    { id: 7, name: "Business" },
    { id: 8, name: "Photography" },
  ];

  const [matches, setMatches] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporary user ID
  const currentUserId =
    "8853da02-7b17-4e6a-a1c2-8c229c9ef545";

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/matches/${currentUserId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Matches received:", data);

        setMatches(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);

        setError("Could not connect to the backend.");
        setLoading(false);
      });
  }, []);

  // Filter by selected skill
  const filteredMatches = selectedSkill
    ? matches.filter((match) =>
        match.matchingSkills.includes(selectedSkill)
      )
    : matches;

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px",
        textAlign: "center",
      }}
    >

      {/* HEADER */}

      <h1>Find Skills</h1>

      <p>
        Find students who can teach you the skills
        you want to learn.
      </p>


      {/* AVAILABLE SKILLS */}

      <h2>Available Skills</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {skills.map((skill) => (
          <button
            key={skill.id}
            onClick={() =>
              setSelectedSkill(skill.name)
            }
          >
            {skill.name}
          </button>
        ))}
      </div>


      {/* SELECTED SKILL */}

      {selectedSkill && (
        <div style={{ marginBottom: "20px" }}>

          <p>
            Showing students who teach:{" "}
            <strong>{selectedSkill}</strong>
          </p>

          <button
            onClick={() => setSelectedSkill(null)}
          >
            Show All
          </button>

        </div>
      )}


      {/* RECOMMENDED STUDENTS */}

      <h2>Recommended Students</h2>


      {/* LOADING */}

      {loading && (
        <p>Loading matches...</p>
      )}


      {/* ERROR */}

      {error && (
        <p>{error}</p>
      )}


      {/* NO MATCHES */}

      {!loading &&
        !error &&
        filteredMatches.length === 0 && (
          <p>
            No matching students found.
          </p>
        )}


      {/* STUDENT CARDS */}

      {!loading &&
        !error &&
        filteredMatches.map((match) => (

          <div
            key={match.id}
            style={{
              border: "1px solid #ddd",
              padding: "25px",
              margin: "20px 0",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >

            <h3>{match.name}</h3>

            <p>
              <strong>Department:</strong>{" "}
              {match.department}
            </p>

            <p>
              <strong>Year:</strong>{" "}
              {match.year}
            </p>

            <p>
              <strong>Bio:</strong>{" "}
              {match.bio || "No bio available"}
            </p>

            <p>
              <strong>Match:</strong>{" "}
              {match.matchScore}%
            </p>

            <p>
              <strong>Can Teach:</strong>{" "}
              {match.matchingSkills.join(", ")}
            </p>

            <button>
              View Profile
            </button>

          </div>

        ))}

    </div>
  );
}

export default FindSkills;
import { useState } from "react";

const mockUser = {
  id: "U001",
  name: "Rahul",
  college: "Sahyadri College",
  bio: "CSE student interested in web development",
  skillsToTeach: ["C++", "Python"],
  skillsToLearn: ["React", "Java"],
  availability: ["Evening", "Weekend"],
  rating: 4.5,
};

const mockSkills = [
  { id: "S001", name: "React", category: "Web Development" },
  { id: "S002", name: "JavaScript", category: "Programming" },
  { id: "S003", name: "Python", category: "Programming" },
  { id: "S004", name: "Java", category: "Programming" },
  { id: "S005", name: "C++", category: "Programming" },
  { id: "S006", name: "HTML/CSS", category: "Web Development" },
  { id: "S007", name: "UI/UX", category: "Design" },
  { id: "S008", name: "Machine Learning", category: "AI & Data" },
  { id: "S009", name: "Figma", category: "Design" },
  { id: "S010", name: "Web Development", category: "Web Development" },
];

function App() {
  const [page, setPage] = useState("landing");

  const [user, setUser] = useState(mockUser);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [editData, setEditData] = useState({
    name: mockUser.name,
    college: mockUser.college,
    bio: mockUser.bio,
  });

  const [selectedSkillType, setSelectedSkillType] = useState("learn");

  const [selectedAvailability, setSelectedAvailability] = useState(
    mockUser.availability
  );

  const [message, setMessage] = useState("");

  const availabilityOptions = [
    "Morning",
    "Afternoon",
    "Evening",
    "Night",
    "Weekend",
  ];

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // =========================
  // SIGN UP
  // =========================

  const handleSignup = (e) => {
    e.preventDefault();

    if (
      !signupData.name ||
      !signupData.email ||
      !signupData.password ||
      !signupData.college
    ) {
      showMessage("Please fill all fields.");
      return;
    }

    setUser({
      ...user,
      name: signupData.name,
      college: signupData.college,
    });

    setEditData({
      name: signupData.name,
      college: signupData.college,
      bio: user.bio,
    });

    setPage("profile");

    showMessage("Account created successfully!");
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      showMessage("Please enter your email and password.");
      return;
    }

    setPage("profile");

    showMessage("Welcome back!");
  };

  // =========================
  // EDIT PROFILE
  // =========================

  const goToEdit = () => {
    setEditData({
      name: user.name,
      college: user.college,
      bio: user.bio,
    });

    setSelectedAvailability(user.availability);

    setPage("edit");
  };

  const handleEditSave = (e) => {
    e.preventDefault();

    setUser({
      ...user,
      name: editData.name,
      college: editData.college,
      bio: editData.bio,
      availability: selectedAvailability,
    });

    setPage("profile");

    showMessage("Profile updated successfully!");
  };

  // =========================
  // SKILLS
  // =========================

  const handleSkillToggle = (skillName) => {
    if (selectedSkillType === "learn") {
      const exists = user.skillsToLearn.includes(skillName);

      setUser({
        ...user,
        skillsToLearn: exists
          ? user.skillsToLearn.filter(
              (skill) => skill !== skillName
            )
          : [...user.skillsToLearn, skillName],
      });
    } else {
      const exists = user.skillsToTeach.includes(skillName);

      setUser({
        ...user,
        skillsToTeach: exists
          ? user.skillsToTeach.filter(
              (skill) => skill !== skillName
            )
          : [...user.skillsToTeach, skillName],
      });
    }
  };

  // =========================
  // AVAILABILITY
  // =========================

  const handleAvailabilityToggle = (option) => {
    setSelectedAvailability((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
    );
  };

  return (
    <div className="app">

      {message && (
        <div className="toast">
          {message}
        </div>
      )}

      {/* =========================
          LANDING PAGE
      ========================= */}

      {page === "landing" && (
        <div className="landing-page">

          <nav className="navbar landing-nav">

            <div
              className="brand"
              onClick={() => setPage("landing")}
            >
              <div className="brand-icon">
                S
              </div>

              <span>
                SkillShare
              </span>
            </div>

            <div className="nav-actions">

              <button
                className="nav-link"
                onClick={() => setPage("login")}
              >
                Log in
              </button>

              <button
                className="primary-button small"
                onClick={() => setPage("signup")}
              >
                Create account
              </button>

            </div>

          </nav>

          <main className="hero">

            <div className="hero-content">

              <div className="hero-badge">
                ✨ Learn. Teach. Connect.
              </div>

              <h1>
                Share your skills.
                <br />
                <span>Grow together.</span>
              </h1>

              <p>
                Connect with students who want to learn
                what you know, while discovering people who
                can teach you something new.
              </p>

              <div className="hero-buttons">

                <button
                  className="primary-button"
                  onClick={() => setPage("signup")}
                >
                  Get started →
                </button>

                <button
                  className="secondary-button"
                  onClick={() => setPage("login")}
                >
                  I already have an account
                </button>

              </div>

              <div className="hero-stats">

                <div>
                  <strong>Learn</strong>
                  <span>new skills</span>
                </div>

                <div>
                  <strong>Teach</strong>
                  <span>what you know</span>
                </div>

                <div>
                  <strong>Connect</strong>
                  <span>with students</span>
                </div>

              </div>

            </div>

            <div className="hero-visual">

              <div className="visual-circle">
                <div className="visual-icon">
                  🤝
                </div>
              </div>

            </div>

          </main>

        </div>
      )}

      {/* =========================
          SIGN UP
      ========================= */}

      {page === "signup" && (
        <div className="auth-page">

          <div className="auth-card">

            <button
              className="back-button"
              onClick={() => setPage("landing")}
            >
              ← Back
            </button>

            <div className="auth-brand">

              <div className="brand-icon">
                S
              </div>

              <span>
                SkillShare
              </span>

            </div>

            <h1>
              Create your account
            </h1>

            <p className="auth-subtitle">
              Start sharing and learning skills with
              your peers.
            </p>

            <form onSubmit={handleSignup}>

              <label>
                Full name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={signupData.name}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    name: e.target.value,
                  })
                }
              />

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    email: e.target.value,
                  })
                }
              />

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    password: e.target.value,
                  })
                }
              />

              <label>
                College
              </label>

              <input
                type="text"
                placeholder="Your college"
                value={signupData.college}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    college: e.target.value,
                  })
                }
              />

              <button
                className="primary-button full"
                type="submit"
              >
                Create account →
              </button>

            </form>

            <p className="switch-auth">
              Already have an account?{" "}

              <button
                onClick={() => setPage("login")}
              >
                Log in
              </button>

            </p>

          </div>

        </div>
      )}

      {/* =========================
          LOGIN
      ========================= */}

      {page === "login" && (
        <div className="auth-page">

          <div className="auth-card">

            <button
              className="back-button"
              onClick={() => setPage("landing")}
            >
              ← Back
            </button>

            <div className="auth-brand">

              <div className="brand-icon">
                S
              </div>

              <span>
                SkillShare
              </span>

            </div>

            <h1>
              Welcome back
            </h1>

            <p className="auth-subtitle">
              Log in to continue your learning journey.
            </p>

            <form onSubmit={handleLogin}>

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    email: e.target.value,
                  })
                }
              />

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
              />

              <button
                className="primary-button full"
                type="submit"
              >
                Log in →
              </button>

            </form>

            <p className="switch-auth">
              Don't have an account?{" "}

              <button
                onClick={() => setPage("signup")}
              >
                Create one
              </button>

            </p>

          </div>

        </div>
      )}

      {/* =========================
          DASHBOARD
      ========================= */}

      {page !== "landing" &&
        page !== "signup" &&
        page !== "login" && (

        <div className="dashboard">

          <nav className="navbar dashboard-nav">

            <div className="brand">

              <div className="brand-icon">
                S
              </div>

              <span>
                SkillShare
              </span>

            </div>

            <div className="dashboard-nav-links">

              <button
                className={
                  page === "profile"
                    ? "active"
                    : ""
                }
                onClick={() => setPage("profile")}
              >
                Profile
              </button>

              <button
                className={
                  page === "skills"
                    ? "active"
                    : ""
                }
                onClick={() => setPage("skills")}
              >
                Skills
              </button>

              <button
                className={
                  page === "availability"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPage("availability")
                }
              >
                Availability
              </button>

            </div>

            <div className="avatar-nav">
              {user.name.charAt(0).toUpperCase()}
            </div>

          </nav>

          {/* =========================
              PROFILE
          ========================= */}

          {page === "profile" && (
            <main className="dashboard-content">

              <div className="profile-header">

                <div>

                  <span className="eyebrow">
                    MY PROFILE
                  </span>

                  <h1>
                    Your learning profile
                  </h1>

                  <p>
                    Tell others what you know and
                    what you want to learn.
                  </p>

                </div>

                <button
                  className="primary-button"
                  onClick={goToEdit}
                >
                  ✎ Edit profile
                </button>

              </div>

              <section className="profile-card">

                <div className="profile-main">

                  <div className="profile-avatar">
                    {user.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="profile-info">

                    <h2>
                      {user.name}
                    </h2>

                    <p className="college">
                      🎓 {user.college}
                    </p>

                    <div className="rating">

                      <span>
                        ★
                      </span>

                      <strong>
                        {user.rating}
                      </strong>

                      <small>
                        Peer rating
                      </small>

                    </div>

                  </div>

                </div>

                <div className="profile-divider"></div>

                <div className="bio-section">

                  <span className="section-label">
                    ABOUT
                  </span>

                  <p>
                    {user.bio}
                  </p>

                </div>

              </section>

              <div className="profile-grid">

                <section className="info-card">

                  <div className="card-heading">

                    <div className="heading-icon purple-icon">
                      ✨
                    </div>

                    <div>

                      <span>
                        WANT TO LEARN
                      </span>

                      <h3>
                        Skills I'm learning
                      </h3>

                    </div>

                  </div>

                  <div className="skill-tags">

                    {user.skillsToLearn.map(
                      (skill) => (
                        <span
                          className="skill-tag learn-tag"
                          key={skill}
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                  <button
                    className="text-button"
                    onClick={() => {
                      setSelectedSkillType("learn");
                      setPage("skills");
                    }}
                  >
                    Edit learning skills →
                  </button>

                </section>

                <section className="info-card">

                  <div className="card-heading">

                    <div className="heading-icon orange-icon">
                      💡
                    </div>

                    <div>

                      <span>
                        CAN TEACH
                      </span>

                      <h3>
                        Skills I can teach
                      </h3>

                    </div>

                  </div>

                  <div className="skill-tags">

                    {user.skillsToTeach.map(
                      (skill) => (
                        <span
                          className="skill-tag teach-tag"
                          key={skill}
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                  <button
                    className="text-button orange-text"
                    onClick={() => {
                      setSelectedSkillType("teach");
                      setPage("skills");
                    }}
                  >
                    Edit teaching skills →
                  </button>

                </section>

              </div>

              <section className="availability-summary">

                <div className="availability-title">

                  <div className="heading-icon green-icon">
                    🕐
                  </div>

                  <div>

                    <span>
                      AVAILABILITY
                    </span>

                    <h3>
                      When I'm usually available
                    </h3>

                  </div>

                </div>

                <div className="availability-pills">

                  {user.availability.map(
                    (time) => (
                      <span key={time}>
                        {time}
                      </span>
                    )
                  )}

                </div>

                <button
                  className="text-button green-text"
                  onClick={() =>
                    setPage("availability")
                  }
                >
                  Edit availability →
                </button>

              </section>

            </main>
          )}

          {/* =========================
              EDIT PROFILE
          ========================= */}

          {page === "edit" && (
            <main className="dashboard-content narrow">

              <button
                className="back-dashboard"
                onClick={() => setPage("profile")}
              >
                ← Back to profile
              </button>

              <div className="page-title">

                <span className="eyebrow">
                  PROFILE SETTINGS
                </span>

                <h1>
                  Edit your profile
                </h1>

                <p>
                  Keep your information up to date.
                </p>

              </div>

              <section className="edit-card">

                <form onSubmit={handleEditSave}>

                  <label>
                    Full name
                  </label>

                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        name: e.target.value,
                      })
                    }
                  />

                  <label>
                    College
                  </label>

                  <input
                    type="text"
                    value={editData.college}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        college: e.target.value,
                      })
                    }
                  />

                  <label>
                    Bio
                  </label>

                  <textarea
                    rows="5"
                    value={editData.bio}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        bio: e.target.value,
                      })
                    }
                  ></textarea>

                  <div className="form-actions">

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() =>
                        setPage("profile")
                      }
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="primary-button"
                    >
                      Save changes ✓
                    </button>

                  </div>

                </form>

              </section>

            </main>
          )}

          {/* =========================
              SKILLS
          ========================= */}

          {page === "skills" && (
            <main className="dashboard-content">

              <button
                className="back-dashboard"
                onClick={() => setPage("profile")}
              >
                ← Back to profile
              </button>

              <div className="page-title">

                <span className="eyebrow">
                  MY SKILLS
                </span>

                <h1>
                  What do you want to learn?
                </h1>

                <p>
                  Select the skills you want to learn
                  and the skills you can teach others.
                </p>

              </div>

              <div className="skill-switcher">

                <button
                  className={
                    selectedSkillType === "learn"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setSelectedSkillType("learn")
                  }
                >
                  ✨ I want to learn
                </button>

                <button
                  className={
                    selectedSkillType === "teach"
                      ? "selected teach"
                      : ""
                  }
                  onClick={() =>
                    setSelectedSkillType("teach")
                  }
                >
                  💡 I can teach
                </button>

              </div>

              <div className="skills-grid">

                {mockSkills.map((skill) => {

                  const isSelected =
                    selectedSkillType === "learn"
                      ? user.skillsToLearn.includes(
                          skill.name
                        )
                      : user.skillsToTeach.includes(
                          skill.name
                        );

                  return (
                    <button
                      key={skill.id}
                      className={`skill-option ${
                        isSelected
                          ? "selected-skill"
                          : ""
                      }`}
                      onClick={() =>
                        handleSkillToggle(
                          skill.name
                        )
                      }
                    >

                      <div className="skill-option-icon">
                        {skill.name.charAt(0)}
                      </div>

                      <div>

                        <strong>
                          {skill.name}
                        </strong>

                        <span>
                          {skill.category}
                        </span>

                      </div>

                      <div className="skill-check">
                        {isSelected ? "✓" : "+"}
                      </div>

                    </button>
                  );
                })}

              </div>

              <div className="selected-summary">

                <strong>
                  {selectedSkillType === "learn"
                    ? "Skills I want to learn"
                    : "Skills I can teach"}
                </strong>

                <div>

                  {(selectedSkillType === "learn"
                    ? user.skillsToLearn
                    : user.skillsToTeach
                  ).map((skill) => (
                    <span key={skill}>
                      {skill}
                    </span>
                  ))}

                </div>

              </div>

            </main>
          )}

          {/* =========================
              AVAILABILITY
          ========================= */}

          {page === "availability" && (
            <main className="dashboard-content narrow">

              <button
                className="back-dashboard"
                onClick={() => setPage("profile")}
              >
                ← Back to profile
              </button>

              <div className="page-title">

                <span className="eyebrow">
                  AVAILABILITY
                </span>

                <h1>
                  When are you free?
                </h1>

                <p>
                  Choose the times that usually work
                  best for your learning sessions.
                </p>

              </div>

              <section className="availability-card">

                <div className="availability-illustration">
                  🕐
                </div>

                <h2>
                  Select your availability
                </h2>

                <p>
                  You can choose more than one option.
                </p>

                <div className="availability-options">

                  {availabilityOptions.map(
                    (option) => {

                      const selected =
                        selectedAvailability.includes(
                          option
                        );

                      return (
                        <button
                          key={option}
                          className={`availability-option ${
                            selected
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleAvailabilityToggle(
                              option
                            )
                          }
                        >

                          <span>
                            {option === "Morning"
                              ? "🌅"
                              : option === "Afternoon"
                              ? "☀️"
                              : option === "Evening"
                              ? "🌆"
                              : option === "Night"
                              ? "🌙"
                              : "🗓️"}
                          </span>

                          {option}

                          {selected && (
                            <b>
                              ✓
                            </b>
                          )}

                        </button>
                      );
                    }
                  )}

                </div>

                <button
                  className="primary-button full"
                  onClick={() => {

                    setUser({
                      ...user,
                      availability:
                        selectedAvailability,
                    });

                    setPage("profile");

                    showMessage(
                      "Availability updated!"
                    );
                  }}
                >
                  Save availability ✓
                </button>

              </section>

            </main>
          )}

        </div>
      )}
    </div>
  );
}

export default App;
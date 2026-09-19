require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

const PORT = 5000;

// ==================== SUPABASE ====================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());

// ==================== TEST ROUTE ====================

app.get("/", (req, res) => {
  res.json({
    message: "Skill Exchange Backend is running",
  });
});

// ==================== MATCHING API ====================

app.get("/api/matches/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // ==========================================
    // 1. Get skills the user wants to LEARN
    // ==========================================

    const { data: learningSkills, error: learningError } =
      await supabase
        .from("user_skills")
        .select("skill_id")
        .eq("user_id", userId)
        .eq("type", "learn");

    if (learningError) {
      throw learningError;
    }

    if (!learningSkills || learningSkills.length === 0) {
      return res.json([]);
    }

    const learningSkillIds = learningSkills.map(
      (item) => item.skill_id
    );

    // ==========================================
    // 2. Find users who TEACH those skills
    // ==========================================

    const { data: teachingSkills, error: teachingError } =
      await supabase
        .from("user_skills")
        .select(`
          user_id,
          skill_id
        `)
        .in("skill_id", learningSkillIds)
        .eq("type", "teach")
        .neq("user_id", userId);

    if (teachingError) {
      throw teachingError;
    }

    if (!teachingSkills || teachingSkills.length === 0) {
      return res.json([]);
    }

    // ==========================================
    // 3. Get unique matched user IDs
    // ==========================================

    const matchedUserIds = [
      ...new Set(
        teachingSkills.map(
          (item) => item.user_id
        )
      ),
    ];

    // ==========================================
    // 4. Get profiles
    // ==========================================

    const { data: profiles, error: profileError } =
      await supabase
        .from("profiles")
        .select(`
          id,
          name,
          department,
          year,
          bio
        `)
        .in("id", matchedUserIds);

    if (profileError) {
      throw profileError;
    }

    // ==========================================
    // 5. Get skill names
    // ==========================================

    const skillIds = [
      ...new Set(
        teachingSkills.map(
          (item) => item.skill_id
        )
      ),
    ];

    const { data: skills, error: skillError } =
      await supabase
        .from("skills")
        .select(`
          id,
          name
        `)
        .in("id", skillIds);

    if (skillError) {
      throw skillError;
    }

    // ==========================================
    // 6. Create final matching results
    // ==========================================

    const matches = profiles.map((profile) => {

      // Skills this person teaches
      // that match what current user wants
      const matchingSkillIds =
        teachingSkills
          .filter(
            (item) =>
              item.user_id === profile.id
          )
          .map(
            (item) =>
              item.skill_id
          );

      // Convert skill IDs into skill names
      const matchingSkills =
        matchingSkillIds.map((skillId) => {

          const skill = skills.find(
            (item) =>
              item.id === skillId
          );

          return skill ? skill.name : "";
        });

      // Calculate match percentage
      const matchScore =
        Math.round(
          (matchingSkillIds.length /
            learningSkillIds.length) *
            100
        );

      return {
        id: profile.id,
        name: profile.name,
        department: profile.department,
        year: profile.year,
        bio: profile.bio,
        matchingSkills,
        matchScore,
      };
    });

    // ==========================================
    // 7. Send results to React
    // ==========================================

    res.json(matches);

  } catch (error) {

    console.error(
      "Matching error:",
      error
    );

    res.status(500).json({
      message: "Failed to find matches",
      error: error.message,
    });
  }
});

// ==================== START SERVER ====================

app.listen(PORT, () => {

  console.log(
    `Server running at http://localhost:${PORT}`
  );

});
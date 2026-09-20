require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = 5000;

// =====================================================
// SUPABASE
// =====================================================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY
);

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "Skill Exchange Backend is running",
  });
});

// =====================================================
// MATCHING API
// =====================================================

app.get("/api/matches/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // 1. Get skills the user wants to learn
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

    // 2. Find users who teach those skills
    const { data: teachingSkills, error: teachingError } =
      await supabase
        .from("user_skills")
        .select("user_id, skill_id")
        .in("skill_id", learningSkillIds)
        .eq("type", "teach")
        .neq("user_id", userId);

    if (teachingError) {
      throw teachingError;
    }

    if (!teachingSkills || teachingSkills.length === 0) {
      return res.json([]);
    }

    // 3. Unique matched users
    const matchedUserIds = [
      ...new Set(
        teachingSkills.map((item) => item.user_id)
      ),
    ];

    // 4. Get profiles
    const { data: profiles, error: profileError } =
      await supabase
        .from("profiles")
        .select("id, name, department, year, bio")
        .in("id", matchedUserIds);

    if (profileError) {
      throw profileError;
    }

    // 5. Get skill names
    const skillIds = [
      ...new Set(
        teachingSkills.map((item) => item.skill_id)
      ),
    ];

    const { data: skills, error: skillError } =
      await supabase
        .from("skills")
        .select("id, name")
        .in("id", skillIds);

    if (skillError) {
      throw skillError;
    }

    // 6. Create matches
    const matches = profiles.map((profile) => {

      const matchingSkillIds = teachingSkills
        .filter(
          (item) => item.user_id === profile.id
        )
        .map(
          (item) => item.skill_id
        );

      const matchingSkills = matchingSkillIds
        .map((skillId) => {

          const skill = skills.find(
            (item) => item.id === skillId
          );

          return skill ? skill.name : "";
        })
        .filter(Boolean);

      const matchScore = Math.round(
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
        matchingSkills: matchingSkills,
        matchingSkillIds: matchingSkillIds,
        matchScore: matchScore,
      };
    });

    res.json(matches);

  } catch (error) {

    console.error("Matching error:", error);

    res.status(500).json({
      message: "Failed to find matches",
      error: error.message,
    });
  }
});

// =====================================================
// SEND REQUEST API
// =====================================================

app.post("/api/requests", async (req, res) => {

  try {

    const {
      learnerId,
      mentorId,
      skillName,
      message,
    } = req.body;

    console.log("=================================");
    console.log("REQUEST RECEIVED");
    console.log("Learner ID:", learnerId);
    console.log("Mentor ID:", mentorId);
    console.log("Skill:", skillName);
    console.log("Message:", message);
    console.log("=================================");

    // Check required values
    if (!learnerId || !mentorId || !skillName) {

      return res.status(400).json({
        message:
          "Missing learnerId, mentorId, or skillName.",
      });
    }

    // =================================================
    // FIND SKILL
    // =================================================

    const { data: skillData, error: skillError } =
      await supabase
        .from("skills")
        .select("id, name")
        .ilike("name", skillName.trim());

    if (skillError) {

      console.error(
        "SKILL LOOKUP ERROR:",
        skillError
      );

      return res.status(500).json({
        message: "Skill lookup failed.",
        error: skillError.message,
        details: skillError.details,
        hint: skillError.hint,
      });
    }

    if (!skillData || skillData.length === 0) {

      return res.status(404).json({
        message:
          `Skill "${skillName}" was not found in the skills table.`,
      });
    }

    const skill = skillData[0];

    console.log("Skill found:", skill);

    // =================================================
    // INSERT REQUEST
    // =================================================

    const { error: requestError } =
      await supabase
        .from("Request")
        .insert([
          {
            learnerId: learnerId,
            mentorId: mentorId,
            skillId: skill.id,
            message: message || "",
            status: "pending",
          },
        ]);

    if (requestError) {

      console.error(
        "================================="
      );

      console.error(
        "REQUEST INSERT ERROR:"
      );

      console.error(
        requestError
      );

      console.error(
        "================================="
      );

      return res.status(500).json({
        message: "Could not create request.",
        error: requestError.message,
        details: requestError.details,
        hint: requestError.hint,
        code: requestError.code,
      });
    }

    console.log(
      "REQUEST CREATED SUCCESSFULLY"
    );

    // IMPORTANT:
    // We don't use .select() after insert.
    // This avoids a SELECT/RLS problem.

    return res.status(201).json({
      message: "Request sent successfully.",
    });

  } catch (error) {

    console.error(
      "REQUEST CREATION ERROR:",
      error
    );

    return res.status(500).json({
      message: "Could not create request.",
      error: error.message,
    });
  }
});

// =====================================================
// M4: GET REQUESTS
// =====================================================

app.get("/api/requests/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const { data, error } = await supabase
      .from("Request")
      .select("*")
      .or(`learnerId.eq.${userId},mentorId.eq.${userId}`)
      .order("createdAt", { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data || []);

  } catch (error) {

    console.error("Fetch requests error:", error);

    res.status(500).json({
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {

  console.log(
    `Server running at http://localhost:${PORT}`
  );

});
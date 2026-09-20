require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = 5000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY
);

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

    const { data: learningSkills, error: learningError } =
      await supabase
        .from("user_skills")
        .select("skill_id")
        .eq("user_id", userId)
        .eq("type", "learn");

    if (learningError) throw learningError;

    if (!learningSkills || learningSkills.length === 0) {
      return res.json([]);
    }

    const learningSkillIds = learningSkills.map(
      (item) => item.skill_id
    );

    const { data: teachingSkills, error: teachingError } =
      await supabase
        .from("user_skills")
        .select("user_id, skill_id")
        .in("skill_id", learningSkillIds)
        .eq("type", "teach")
        .neq("user_id", userId);

    if (teachingError) throw teachingError;

    if (!teachingSkills || teachingSkills.length === 0) {
      return res.json([]);
    }

    const matchedUserIds = [
      ...new Set(
        teachingSkills.map((item) => item.user_id)
      ),
    ];

    const { data: profiles, error: profileError } =
      await supabase
        .from("profiles")
        .select("id, name, department, year, bio")
        .in("id", matchedUserIds);

    if (profileError) throw profileError;

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

    if (skillError) throw skillError;

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

    if (!learnerId || !mentorId || !skillName) {
      return res.status(400).json({
        message:
          "Missing learnerId, mentorId, or skillName.",
      });
    }

    const { data: skillData, error: skillError } =
      await supabase
        .from("skills")
        .select("id, name")
        .ilike("name", skillName.trim());

    if (skillError) {
      return res.status(500).json({
        message: "Skill lookup failed.",
        error: skillError.message,
      });
    }

    if (!skillData || skillData.length === 0) {
      return res.status(404).json({
        message:
          `Skill "${skillName}" was not found in the skills table.`,
      });
    }

    const skill = skillData[0];

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
      return res.status(500).json({
        message: "Could not create request.",
        error: requestError.message,
      });
    }

    return res.status(201).json({
      message: "Request sent successfully.",
    });

  } catch (error) {

    console.error("REQUEST CREATION ERROR:", error);

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

    if (error) throw error;

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
// M4: ACCEPT / REJECT REQUEST
// =====================================================

app.patch("/api/requests/:requestId", async (req, res) => {
  try {

    const requestId = req.params.requestId;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be accepted or rejected.",
      });
    }

    const { error } = await supabase
      .from("Request")
      .update({
        status: status,
      })
      .eq("id", requestId);

    if (error) throw error;

    res.json({
      message: `Request ${status} successfully.`,
    });

  } catch (error) {

    console.error("Update request error:", error);

    res.status(500).json({
      message: "Failed to update request",
      error: error.message,
    });
  }
});

// =====================================================
// M4: CREATE SESSION
// =====================================================

app.post("/api/sessions", async (req, res) => {
  try {

    const {
      requestId,
      learnerid,
      mentorid,
      skillid,
      date,
      time,
    } = req.body;

    if (
      !requestId ||
      !learnerid ||
      !mentorid ||
      !skillid ||
      !date ||
      !time
    ) {
      return res.status(400).json({
        message: "Missing required session details.",
      });
    }

    const { data, error } = await supabase
      .from("Session")
      .insert([
        {
          requestId: requestId,
          learnerid: learnerid,
          mentorid: mentorid,
          skillid: skillid,
          date: date,
          time: time,
          status: "scheduled",
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: "Session scheduled successfully.",
      session: data?.[0] || null,
    });

  } catch (error) {

    console.error("Create session error:", error);

    res.status(500).json({
      message: "Failed to create session",
      error: error.message,
    });
  }
});

// =====================================================
// M4: GET SESSIONS
// =====================================================

app.get("/api/sessions/:userId", async (req, res) => {
  try {

    const userId = req.params.userId;

    const { data, error } = await supabase
      .from("Session")
      .select("*")
      .or(`learnerid.eq.${userId},mentorid.eq.${userId}`)
      .order("date", { ascending: true });

    if (error) throw error;

    res.json(data || []);

  } catch (error) {

    console.error("Fetch sessions error:", error);

    res.status(500).json({
      message: "Failed to fetch sessions",
      error: error.message,
    });
  }
});

// =====================================================
// M4: UPDATE SESSION STATUS
// =====================================================

app.patch("/api/sessions/:sessionId", async (req, res) => {
  try {

    const sessionId = req.params.sessionId;
    const { status } = req.body;

    if (!["scheduled", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        message:
          "Status must be scheduled, completed, or cancelled.",
      });
    }

    const { error } = await supabase
      .from("Session")
      .update({
        status: status,
      })
      .eq("id", sessionId);

    if (error) throw error;

    res.json({
      message: `Session marked as ${status}.`,
    });

  } catch (error) {

    console.error("Update session error:", error);

    res.status(500).json({
      message: "Failed to update session",
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
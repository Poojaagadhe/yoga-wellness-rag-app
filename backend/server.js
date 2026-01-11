// ===============================
// IMPORT REQUIRED PACKAGES
// ===============================
const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json()); // allow JSON input from frontend

// ===============================
// CONNECT TO MONGODB ATLAS
// ===============================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ===============================
// MONGODB SCHEMA (LOG USER QUERIES)
// ===============================
const querySchema = new mongoose.Schema({
  question: String,
  isUnsafe: Boolean,
  matchedArticles: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QueryLog = mongoose.model("QueryLog", querySchema);

// ===============================
// CONSTANTS
// ===============================
const PORT = process.env.PORT || 3000;

// health-related risk keywords
const unsafeKeywords = [
  "pregnant",
  "pregnancy",
  "high blood pressure",
  "low blood pressure",
  "bp",
  "heart",
  "surgery",
  "glaucoma",
  "injury",
  "hernia"
];

// yoga domain keywords (IMPORTANT: prevents hallucination)
const yogaDomainKeywords = [
  "yoga",
  "pranayama",
  "asana",
  "pose",
  "breathing",
  "breath",
  "meditation",
  "headstand",
  "sirsasana"
];

// ===============================
// HEALTH CHECK ENDPOINT
// ===============================
app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

// ===============================
// MAIN ASK ENDPOINT
// ===============================
app.post("/ask", (req, res) => {
  const userQuestion = req.body.question;

  // -------------------------------
  // VALIDATION
  // -------------------------------
  if (!userQuestion) {
    return res.status(400).json({ error: "Question is required" });
  }

  const normalizedQuestion = userQuestion.toLowerCase();

  // -------------------------------
  // DOMAIN GUARD (STEP 5 FIX)
  // -------------------------------
  const isYogaQuestion = yogaDomainKeywords.some(keyword =>
    normalizedQuestion.includes(keyword)
  );

  if (!isYogaQuestion) {
    // log non-yoga question
    const log = new QueryLog({
      question: userQuestion,
      isUnsafe: false,
      matchedArticles: []
    });
    log.save();

    return res.json({
      question: userQuestion,
      isUnsafe: false,
      matchedArticles: [],
      answer: "This assistant only answers yoga and wellness related questions.",
      warning: null
    });
  }

  // -------------------------------
  // SAFETY CHECK
  // -------------------------------
  const isUnsafe = unsafeKeywords.some(keyword =>
    normalizedQuestion.includes(keyword)
  );

  // -------------------------------
  // LOAD DATASET
  // -------------------------------
  const dataPath = path.join(
    __dirname,
    "..",
    "dataset",
    "yoga_knowledge_base.json"
  );

  const rawData = fs.readFileSync(dataPath, "utf-8");
  const articles = JSON.parse(rawData);

  // -------------------------------
  // ARTICLE MATCHING (TOKEN-BASED)
  // -------------------------------
  let matchedArticles = articles.filter(article => {
    // break title into words
    const titleTokens = article.title
      .toLowerCase()
      .replace(/[^a-z ]/g, "")
      .split(" ");

    // match any title word
    const titleMatch = titleTokens.some(token =>
      normalizedQuestion.includes(token)
    );

    // match category
    const categoryMatch = normalizedQuestion.includes(article.category);

    return titleMatch || categoryMatch;
  });

  // -------------------------------
  // SAFETY FALLBACK (IMPORTANT)
  // -------------------------------
  if (matchedArticles.length === 0 && isUnsafe) {
    const safetyArticle = articles.find(
      article => article.category === "safety"
    );
    if (safetyArticle) {
      matchedArticles = [safetyArticle];
    }
  }

  // -------------------------------
  // LOG QUERY TO DATABASE
  // -------------------------------
  const log = new QueryLog({
    question: userQuestion,
    isUnsafe,
    matchedArticles: matchedArticles.map(a => a.title)
  });
  log.save();

  // -------------------------------
  // SEND RESPONSE
  // -------------------------------
  res.json({
    question: userQuestion,
    isUnsafe,
    matchedArticles: matchedArticles.map(article => ({
      title: article.title,
      summary: article.content,
      difficulty: article.difficulty,
      category: article.category,
      contraindications: article.contraindications,
      source: article.source
    })),
    warning: isUnsafe
      ? "⚠️ This involves health conditions. Please consult a certified yoga instructor or medical professional."
      : null
  });
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ===============================
// IMPORT REQUIRED PACKAGES
// ===============================
const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json()); // allows JSON input from frontend

// ===============================
// CONNECT TO MONGODB (CLOUD)
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

// keywords that indicate medical risk
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

  // if no question is sent
  if (!userQuestion) {
    return res.status(400).json({ error: "Question is required" });
  }

  const normalizedQuestion = userQuestion.toLowerCase();

  // ===============================
  // SAFETY CHECK
  // ===============================
  const isUnsafe = unsafeKeywords.some(keyword =>
    normalizedQuestion.includes(keyword)
  );

  // ===============================
  // LOAD DATASET
  // ===============================
  const dataPath = path.join(
    __dirname,
    "..",
    "dataset",
    "yoga_knowledge_base.json"
  );

  const rawData = fs.readFileSync(dataPath, "utf-8");
  const articles = JSON.parse(rawData);

  // ===============================
  // ARTICLE MATCHING LOGIC
  // ===============================
  let matchedArticles = articles.filter(article => {
    // break title into words (tokens)
    const titleTokens = article.title
      .toLowerCase()
      .replace(/[^a-z ]/g, "")
      .split(" ");

    // match if any title word appears in question
    const titleMatch = titleTokens.some(token =>
      normalizedQuestion.includes(token)
    );

    // match if category appears in question
    const categoryMatch = normalizedQuestion.includes(article.category);

    return titleMatch || categoryMatch;
  });

  // ===============================
  // SAFETY FALLBACK (IMPORTANT)
  // ===============================
  if (matchedArticles.length === 0 && isUnsafe) {
    const safetyArticle = articles.find(
      article => article.category === "safety"
    );
    if (safetyArticle) {
      matchedArticles = [safetyArticle];
    }
  }

  // ===============================
  // NON-YOGA QUESTION GUARD
  // ===============================
  if (matchedArticles.length === 0) {
    // log query
    const log = new QueryLog({
      question: userQuestion,
      isUnsafe,
      matchedArticles: []
    });
    log.save();

    return res.json({
      question: userQuestion,
      isUnsafe,
      matchedArticles: [],
      answer: "This assistant only answers yoga and wellness related questions.",
      warning: null
    });
  }

  // ===============================
  // SAVE QUERY TO DATABASE
  // ===============================
  const log = new QueryLog({
    question: userQuestion,
    isUnsafe,
    matchedArticles: matchedArticles.map(a => a.title)
  });
  log.save();

  // ===============================
  // SEND RESPONSE TO FRONTEND
  // ===============================
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

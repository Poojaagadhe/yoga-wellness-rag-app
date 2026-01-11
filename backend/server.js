const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
app.use(express.json());

/* =========================
   MongoDB Connection
========================= */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

/* =========================
   MongoDB Schema
========================= */
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

/* =========================
   Constants
========================= */
const PORT = process.env.PORT || 3000;

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

/* =========================
   Health Check
========================= */
app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

/* =========================
   Core Ask Endpoint
========================= */
app.post("/ask", (req, res) => {
  const userQuestion = req.body.question;

  if (!userQuestion) {
    return res.status(400).json({
      error: "Question is required"
    });
  }

  const normalizedQuestion = userQuestion.toLowerCase();

  /* ---------- Safety Detection ---------- */
  const isUnsafe = unsafeKeywords.some(keyword =>
    normalizedQuestion.includes(keyword)
  );

  /* ---------- Load Dataset ---------- */
  const dataPath = path.join(
    __dirname,
    "..",
    "dataset",
    "yoga_knowledge_base.json"
  );

  const rawData = fs.readFileSync(dataPath, "utf-8");
  const articles = JSON.parse(rawData);

  /* ---------- Correct Retrieval Logic ---------- */
  let matchedArticles = articles.filter(article => {
    const cleanTitle = article.title
      .toLowerCase()
      .replace(/[^a-z ]/g, "");

    return (
      normalizedQuestion.includes(article.category) ||
      normalizedQuestion.includes(cleanTitle)
    );
  });

  /* ---------- Safety Fallback ---------- */
  if (matchedArticles.length === 0 && isUnsafe) {
    const safetyArticle = articles.find(
      article => article.category === "safety"
    );
    if (safetyArticle) {
      matchedArticles = [safetyArticle];
    }
  }

  /* ---------- Non-Yoga Guard ---------- */
  if (matchedArticles.length === 0) {
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
      answer:
        "This assistant only answers yoga and wellness related questions.",
      warning: null
    });
  }

  /* ---------- Save Query ---------- */
  const log = new QueryLog({
    question: userQuestion,
    isUnsafe,
    matchedArticles: matchedArticles.map(a => a.title)
  });
  log.save();

  /* ---------- Response ---------- */
  res.json({
    question: userQuestion,
    isUnsafe,
    matchedArticles: matchedArticles.map(a => ({
      title: a.title,
      content: a.content,
      contraindications: a.contraindications,
      source: a.source
    })),
    warning: isUnsafe
      ? "⚠️ This question involves health conditions. Please consult a certified yoga instructor or medical professional."
      : null
  });
});

/* =========================
   Start Server
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

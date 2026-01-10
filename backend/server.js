const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/yoga_rag_app")
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));
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



const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

app.post("/ask", (req, res) => {
  const userQuestion = req.body.question;
  const normalizedQuestion = userQuestion.toLowerCase();
  const unsafeKeywords = [
  "pregnant",
  "pregnancy",
  "high blood pressure",
  "low blood pressure",
  "bp",
  "surgery",
  "glaucoma",
  "hernia"
];

let isUnsafe = false;

for (let word of unsafeKeywords) {
  if (normalizedQuestion.includes(word)) {
    isUnsafe = true;
    break;
  }
}


  if (!userQuestion) {
    return res.status(400).json({
      error: "Question is required"
    });
  }

  const dataPath = path.join(__dirname, "..", "dataset", "yoga_knowledge_base.json");

  const rawData = fs.readFileSync(dataPath, "utf-8");
  const articles = JSON.parse(rawData);
  const matchedArticles = articles.filter(article =>
  normalizedQuestion.includes(article.title.toLowerCase()) ||
  article.content.toLowerCase().includes(normalizedQuestion)
);

  const log = new QueryLog({
  question: userQuestion,
  isUnsafe: isUnsafe,
  matchedArticles: matchedArticles.map(a => a.title)
});

log.save();

  res.json({
  question: userQuestion,
  isUnsafe: isUnsafe,
  matchedArticles: matchedArticles.map(a => a.title),
  warning: isUnsafe
    ? "This question involves a condition that may require professional guidance. Please consult a certified yoga instructor or medical professional."
    : null
});
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

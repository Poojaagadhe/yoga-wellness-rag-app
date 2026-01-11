# 🧘 Yoga Wellness RAG Micro-App

A safety-aware Yoga Wellness Assistant that answers yoga-related questions, retrieves relevant articles, applies health-risk warnings, and prevents out-of-domain hallucinations.  
The system is fully deployed with a modern dark-mode UI and cloud backend.

---

## 📌 Project Overview

This project implements a **Retrieval-Augmented Generation (RAG)–style micro application** for yoga and wellness education.  
Instead of generating uncontrolled answers, the system retrieves curated yoga knowledge articles and applies **rule-based safety checks** to ensure responsible guidance.

The application is designed with **healthcare-grade guardrails**, making it suitable for sensitive wellness topics.

---

## ✨ Key Features

- 🧠 **Knowledge-based Retrieval**  
  Retrieves answers from a curated yoga knowledge base (JSON).

- ⚠️ **Safety-Aware Responses**  
  Detects medical risk factors (e.g., pregnancy, blood pressure, injuries) and displays warnings.

- 🚫 **Zero Hallucination Guarantee**  
  Non-yoga questions are explicitly rejected using domain guard logic.

- 📊 **Query Logging**  
  All user questions and system decisions are stored in MongoDB Atlas for auditability.

- 🌙 **Modern Dark UI with Animations**  
  Streamlit frontend with dark-only theme, smooth transitions, and clean card-based layout.

- ☁️ **Fully Deployed Cloud Architecture**  
  Frontend, backend, and database are hosted online.

---
## 🏗️ System Architecture
    User (Browser)
     ↓
    Streamlit Cloud (Frontend)
     ↓  HTTP POST
    Render (Node.js + Express Backend)
     ↓
    MongoDB Atlas (Query Logs)
     ↓
    Local JSON Knowledge Base (Retrieval)


---

## 🛠️ Technology Stack

### Frontend
- Streamlit (Python)
- Custom CSS (Dark theme + animations)

### Backend
- Node.js
- Express.js
- Rule-based retrieval logic

### Database
- MongoDB Atlas (cloud)

### Deployment
- Streamlit Cloud (Frontend)
- Render (Backend)
- GitHub (Version control)

---

## 📂 Project Structure

    yoga-wellness-rag-app/
    │
    ├── frontend/
    │   └── app.py                # Streamlit UI
    │
    ├── backend/
    │   └── server.js             # Express backend
    │
    ├── dataset/
    │   └── yoga_knowledge_base.json
    │
    ├── README.md
    └── .gitignore


---

## 🔍 How the System Works

1. User enters a question in the Streamlit UI  
2. Question is sent to the backend (`/ask` endpoint)  
3. Backend checks:
   - Is the question yoga-related?
   - Does it involve health risks?
4. Relevant articles are retrieved using token-based matching  
5. Safety warnings are added if needed  
6. Query and metadata are logged to MongoDB  
7. Structured response is returned to the frontend

---

## 🧪 Testing & Validation

The application was tested using:

- Functional tests (correct article retrieval)
- Safety tests (pregnancy, blood pressure, injury cases)
- Negative tests (non-yoga questions)
- UI/UX checks (dark theme, animations, responsiveness)
- Database validation (MongoDB logging)

All tests passed successfully.

---

## 🚀 Live Deployment

- **Frontend (Streamlit Cloud):**  
  👉 *(Add your Streamlit app URL here)*

- **Backend (Render):**  
  👉 *(Add your backend API URL here)*

- **GitHub Repository:**  
  👉 https://github.com/Poojaagadhe/yoga-wellness-rag-app

---

## ⚠️ Disclaimer

This application is intended for **educational purposes only**.  
Yoga practices and health advice should always be followed under the guidance of a **certified yoga instructor or medical professional**.

---

## 🌱 Future Enhancements

- Semantic search using embeddings
- Cosine similarity ranking
- User session history
- Admin analytics dashboard
- Authentication and role-based access

---





## 🏗️ System Architecture


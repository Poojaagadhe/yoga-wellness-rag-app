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


---

## 🔐 Environment Variables Setup

Sensitive credentials are managed using environment variables.

### Backend (`backend/.env`)

Create a `.env` file inside the `backend/` directory:

---

## 🧠 RAG Pipeline Description

This project follows a **rule-based Retrieval-Augmented Generation (RAG) pipeline**:

1. User submits a question through the Streamlit frontend  
2. Backend applies a **domain guard** to ensure the query is yoga-related  
3. The question is normalized and processed  
4. Relevant articles are retrieved using **token-based matching** from the knowledge base  
5. Safety checks are applied for health-related keywords  
6. Structured answers (not generated text) are returned to the frontend  
7. Query metadata is logged to MongoDB Atlas  

This ensures **accuracy, transparency, and zero hallucination**.

---

## ⚠️ Safety Logic Description

The system implements multiple safety layers:

- **Domain Guard**: Rejects non-yoga questions  
- **Health Risk Detection**: Detects pregnancy, blood pressure, injuries, surgery, etc.  
- **Safety Fallback**: Returns general safety guidelines if a risky query lacks a direct article  
- **Warning Banner**: Clearly alerts users when professional guidance is required  

These mechanisms make the application suitable for wellness and healthcare-adjacent use cases.

---

## 🗃️ Data Models

### QueryLog (MongoDB)

Each user interaction is stored with the following schema:

- `question` (String): User’s input question  
- `isUnsafe` (Boolean): Indicates presence of health risk  
- `matchedArticles` (Array): Titles of retrieved articles  
- `createdAt` (Date): Timestamp  

This supports auditing, debugging, and future analytics.

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
  👉 https://yoga-wellness-rag-app-bcsqqbtuwgiyct9aci4iqk.streamlit.app/

- **Backend (Render):**  
  👉 https://docs-chat-bot.onrender.com

- **GitHub Repository:**  
  👉 https://github.com/Poojaagadhe/yoga-wellness-rag-app

---

## 🎥 Demo Video

A 2–5 minute demo video is provided demonstrating:

- Application overview  
- Question answering flow  
- Safety warnings  
- Non-yoga question rejection  
- MongoDB logging  

      https://drive.google.com/file/d/1PwALxWrvN3sPFgC29TT1gJowKvQ4yEZY/view?usp=sharing

---

## 🧠 AI Tools / IDE Usage Disclosure

The following AI tools were used **only for development assistance**:

- **ChatGPT (OpenAI)**  
  Used for:
  - Debugging guidance  
  - Architecture validation  
  - UI/UX improvement suggestions  
  - Documentation refinement  

All final logic, code integration, and decisions were **implemented and reviewed manually**.

---

## 📱 APK File Clarification

### UI Platform Choice

This project is implemented as a web-based application using Streamlit,
which is explicitly allowed as per the project specification
(“Simple Python web UI – Streamlit”).

The application is fully accessible via desktop and mobile browsers.


---

## ⚠️ Disclaimer

This application is intended for **educational purposes only**.  
Yoga practices and health advice should always be followed under the guidance of a **certified yoga instructor or medical professional**.

---

  

# ===============================
# IMPORT LIBRARIES
# ===============================
import streamlit as st
import requests

# ===============================
# PAGE CONFIG
# ===============================
st.set_page_config(
    page_title="Yoga Wellness Assistant",
    page_icon="🧘",
    layout="centered"
)

# ===============================
# DARK THEME + ANIMATIONS (CSS)
# ===============================
st.markdown("""
<style>
html, body, [class*="css"] {
    background-color: #0e1117;
    color: #eaeaea;
}

.title {
    font-size: 36px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 5px;
    animation: fadeIn 1s ease-in;
}

.subtitle {
    text-align: center;
    color: #9aa4b2;
    margin-bottom: 30px;
    animation: fadeIn 1.2s ease-in;
}

.card {
    background: rgba(255,255,255,0.05);
    border-radius: 14px;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    animation: slideUp 0.6s ease-out;
}

.warning {
    background: rgba(255,99,71,0.15);
    border-left: 4px solid tomato;
    padding: 15px;
    border-radius: 10px;
    margin-top: 15px;
}

.safe {
    background: #1f7a3f;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    display: inline-block;
}

.risk {
    background: #8b0000;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    display: inline-block;
}

@keyframes fadeIn {
    from {opacity: 0;}
    to {opacity: 1;}
}

@keyframes slideUp {
    from {transform: translateY(15px); opacity: 0;}
    to {transform: translateY(0); opacity: 1;}
}
</style>
""", unsafe_allow_html=True)

# ===============================
# HEADER
# ===============================
st.markdown('<div class="title">🧘 Yoga Wellness Assistant</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="subtitle">Ask yoga-related questions with built-in safety awareness</div>',
    unsafe_allow_html=True
)

# ===============================
# USER INPUT
# ===============================
question = st.text_input(
    "💬 Ask your question",
    placeholder="e.g. Is headstand safe during pregnancy?"
)

# ===============================
# BACKEND URL (RENDER)
# ===============================
BACKEND_URL = "https://yoga-wellness-rag-app.onrender.com/ask"

# ===============================
# ASK BUTTON
# ===============================
if st.button("✨ Ask Assistant"):

    if not question.strip():
        st.warning("Please enter a question.")
    else:
        with st.spinner("Thinking..."):
            try:
                response = requests.post(
                    BACKEND_URL,
                    json={"question": question},
                    timeout=15
                )

                if response.status_code != 200:
                    st.error("Backend error. Please try again later.")
                else:
                    data = response.json()

                    # -------------------------------
                    # SAFETY BADGE
                    # -------------------------------
                    if data.get("isUnsafe"):
                        st.markdown('<span class="risk">⚠️ Caution Required</span>', unsafe_allow_html=True)
                    else:
                        st.markdown('<span class="safe">✅ Safe</span>', unsafe_allow_html=True)

                    # -------------------------------
                    # ARTICLES DISPLAY
                    # -------------------------------
                    articles = data.get("matchedArticles", [])

                    if articles:
                        for article in articles:
                            title = article.get("title", "Untitled")
                            summary = article.get("summary", "No summary available.")
                            difficulty = article.get("difficulty", "N/A")
                            category = article.get("category", "N/A")
                            contraindications = ", ".join(article.get("contraindications", []))
                            source = article.get("source", "Unknown")

                            st.markdown(f"""
                            <div class="card">
                                <h3>{title}</h3>
                                <p><b>Summary:</b> {summary}</p>
                                <p><b>Difficulty:</b> {difficulty.capitalize() if isinstance(difficulty, str) else difficulty}</p>
                                <p><b>Category:</b> {category.capitalize() if isinstance(category, str) else category}</p>
                                <p><b>Contraindications:</b> {contraindications}</p>
                                <small><b>Source:</b> {source}</small>
                            </div>
                            """, unsafe_allow_html=True)
                    else:
                        st.info(data.get(
                            "answer",
                            "This assistant only answers yoga and wellness related questions."
                        ))

                    # -------------------------------
                    # WARNING MESSAGE
                    # -------------------------------
                    warning = data.get("warning")
                    if warning:
                        st.markdown(f"""
                        <div class="warning">
                            {warning}
                        </div>
                        """, unsafe_allow_html=True)

            except requests.exceptions.RequestException:
                st.error("❌ Unable to connect to backend server.")

# ===============================
# FOOTER
# ===============================
st.markdown("---")
st.markdown(
    "<p style='text-align:center; font-size:12px; color:#888;'>"
    "⚠️ Educational use only. Always consult a certified yoga instructor or medical professional."
    "</p>",
    unsafe_allow_html=True
)

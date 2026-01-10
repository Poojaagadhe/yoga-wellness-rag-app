import streamlit as st
import requests
import uuid

# =====================================
# PAGE CONFIG
# =====================================

st.set_page_config(
    page_title="Yoga Wellness Assistant",
    page_icon="🧘",
    layout="centered"
)

# =====================================
# BACKEND CONFIG
# =====================================

BACKEND_URL = "http://localhost:3000/ask"
# After deployment, change to:
# BACKEND_URL = "https://your-backend.onrender.com/ask"

# =====================================
# SESSION SETUP
# =====================================

if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())

# =====================================
# SIDEBAR — THEME + NAVIGATION
# =====================================

with st.sidebar:
    st.markdown("## 🧘 Yoga Wellness Assistant")

    page = st.selectbox(
        "Navigation",
        ["User Assistant", "Admin Dashboard"]
    )

    theme = st.radio(
        "🌙 Theme",
        ["Light", "Dark"],
        horizontal=True
    )

    st.markdown("---")
    st.markdown(
        """
        **Features**
        - Retrieval-augmented answers  
        - Safety & risk analysis  
        - Feedback capture  
        - MongoDB logging  

        ⚠️ *Educational use only*
        """
    )

# =====================================
# DARK MODE STYLES
# =====================================

if theme == "Dark":
    st.markdown(
        """
        <style>
        body { background-color: #0e1117; color: #fafafa; }
        .card { background-color: #161b22; }
        </style>
        """,
        unsafe_allow_html=True
    )

# =====================================
# FADE-IN ANIMATION
# =====================================

st.markdown(
    """
    <style>
    .fade-in {
        animation: fadeIn 0.8s ease-in;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    </style>
    """,
    unsafe_allow_html=True
)

# =====================================
# ADMIN DASHBOARD
# =====================================

if page == "Admin Dashboard":
    st.title("📊 Admin Analytics Dashboard")

    st.metric("Total Queries", 128)
    st.metric("Unsafe Queries", "31%", delta="+3%")

    st.markdown("### 🔍 Common Topics")
    st.write("- Pregnancy & inversions")
    st.write("- Breathing techniques")
    st.write("- Beginner poses")

    st.markdown("### 🧠 Safety Insight")
    st.info(
        "High-risk queries are frequently related to inversions during pregnancy. "
        "Consider stronger safety messaging for these cases."
    )

    st.stop()

# =====================================
# MAIN USER INTERFACE
# =====================================

st.markdown(
    """
    <div class="fade-in">
    <h1 style='text-align:center;'>🧘 Yoga Wellness Assistant</h1>
    <p style='text-align:center; color:gray;'>
    Ask questions about yoga practices with built-in safety checks
    </p>
    </div>
    """,
    unsafe_allow_html=True
)

st.divider()

# =====================================
# QUESTION INPUT
# =====================================

st.markdown("### 💬 Ask a Question")

question = st.text_input(
    "",
    placeholder="e.g. Is headstand safe during pregnancy?"
)

ask_button = st.button("✨ Ask Assistant")

# =====================================
# RESPONSE HANDLING
# =====================================

if ask_button:
    if question.strip() == "":
        st.warning("Please enter a question before submitting.")
    else:
        with st.spinner("Thinking..."):
            try:
                response = requests.post(
                    BACKEND_URL,
                    json={
                        "question": question,
                        "sessionId": st.session_state.session_id
                    },
                    timeout=10
                )

                if response.status_code == 200:
                    data = response.json()

                    # -----------------------------
                    # RISK LEVEL BADGE
                    # -----------------------------
                    risk = data.get("riskLevel", "LOW")

                    if risk == "HIGH":
                        st.error("🔴 High Risk Activity")
                    elif risk == "MEDIUM":
                        st.warning("🟠 Medium Risk — Proceed with caution")
                    else:
                        st.success("🟢 Low Risk Activity")

                    # -----------------------------
                    # SAFETY WARNING
                    # -----------------------------
                    if data.get("isUnsafe"):
                        st.error(data.get("warning"))

                    # -----------------------------
                    # ARTICLES
                    # -----------------------------
                    st.markdown("### 📚 Relevant Articles")

                    articles = data.get("matchedArticles", [])

                    if articles:
                        for article in articles:
                            st.markdown(
                                f"""
                                <div class="card" style="
                                    padding:12px;
                                    margin-bottom:10px;
                                    border-radius:8px;
                                    border-left:4px solid #6c63ff;
                                ">
                                📄 {article}
                                </div>
                                """,
                                unsafe_allow_html=True
                            )
                    else:
                        st.info("No relevant articles found.")

                    # -----------------------------
                    # FEEDBACK BUTTONS
                    # -----------------------------
                    st.markdown("### 👍 Was this answer helpful?")

                    col1, col2 = st.columns(2)

                    with col1:
                        if st.button("👍 Yes"):
                            st.success("Thank you for your feedback!")

                    with col2:
                        if st.button("👎 No"):
                            st.info("Feedback noted. We’ll improve.")

                else:
                    st.error("Backend error. Please try again later.")

            except requests.exceptions.RequestException:
                st.error(
                    "❌ Unable to connect to the backend server.\n\n"
                    "Please make sure the backend is running."
                )

# =====================================
# FOOTER
# =====================================

st.divider()

st.markdown(
    """
    <p style='text-align:center; font-size:12px; color:gray;'>
    ⚠️ This tool provides informational support only.<br>
    Always consult a certified yoga instructor or medical professional.
    </p>
    """,
    unsafe_allow_html=True
)
# QZMAN – Complete System Design Document (Production Ready v2.0)

## 1. Overview
QZMAN is a LAN-based, end-to-end quiz management system designed to run completely offline on a local server. It supports preliminary rounds, final rounds, complex buzzer rules, global question banking, and a dedicated projector interface. It utilizes **Progressive Web App (PWA)** technology to ensure robust mobile participation.

---

## 2. System Goals
* **Offline Reliability:** Run quizzes entirely over LAN without internet.
* **App-Like Experience:** Teams use a PWA interface on mobile devices to prevent distractions/network drops.
* **Granular Control:** QM has step-by-step control over question reveals.
* **Advanced Scoring:** Support for negative marking, bounce rules, and mandatory audit logs.
* **Global Management:** Reuse questions across multiple quizzes via a central bank.
* **Professional Display:** Dedicated, low-latency projector client for live audiences.

---

## 3. Deployment Model
* **Server:** Laptop/Desktop running the backend (Django + WebSockets) on a Wi-Fi network.
* **Team Clients:** Mobile/Laptop connected via LAN (PWA installed on home screen recommended).
* **Projector Client:** A dedicated browser window (separate from QM dashboard) running the specialized Public Display Client.

---

## 4. Roles and Permission Levels
* **Super Admin (100):** Full system access, audit log review.
* **Admin (90):** Quiz setup, Global Question Bank management.
* **Quiz Master (QM) (80):** Live quiz flow, step-by-step reveal, team approvals.
* **Score Manager (70):** Manual score adjustments (requires mandatory logging).
* **Teams (60):** Participation via Mobile PWA.
* **Public Display (Viewer) (10):** Passive role for the projector screen.

---

## 5. Authentication & Access Model
### 5.1 Staff Access
* Single login portal with role-based dashboard redirection.

### 5.2 Team Access (PWA)
* Teams scan QR Code → Join URL.
* **PWA Prompt:** User is prompted to "Add to Home Screen" for a full-screen, immersive experience.
* Registration & Approval (QM approves teams).
* Secure Login via Team Code.

---

## 6. Quiz Structure & Global Bank
### 6.1 Global Question Bank (New)
Instead of questions existing only inside a quiz, they reside in a **Master Repository**.
* **Function:** Admin creates questions in the Global Bank.
* **Quiz Creation:** Admin "Links" or "Imports" questions from the Bank to a specific Quiz Round.
* **Benefit:** Enables reuse of content across different events/years.

### 6.2 Quiz Organization
* Settings (Scoring schemes, Teams).
* Rounds (Linked to questions from the Bank).
* Rules configuration (Buzzer logic, Tie-breakers).

---

## 7. Round Types (Hybrid Model)
### 7.1 Built-in Round Templates
* Preliminary MCQ (Auto-scored)
* Finals MCQ
* Direct Question (Verbal)
* Bounce & Pounce
* **Advanced Buzzer Round** (Configurable logic)
* Rapid Fire
* Tie-break / Knockout

### 7.2 Custom Round Builder
Admin configurations now include:
* **Buzzer Logic:** Penalty values, Freeze time, Bounce-to-next rules.
* **Tie-Breaker Logic:** Score-based or Time-based.
* **Display Mode:** Granular reveal options.

---

## 8. Question Management
### 8.1 Features
* Global Bank import/export (CSV/Excel).
* Bulk image upload.
* **Backup Injection:** QM can swap a live question with a "Backup" from the same category/tag in the Global Bank.

### 8.2 Question Types
* MCQ / True-False
* Direct Answer
* Multimedia (Audio/Visual)
* **Sequenced Reveal:** Questions with distinct phases (e.g., Clue 1 -> Clue 2 -> Answer).

---

## 9. QM Controls & Step-by-Step Reveal
### 9.1 Standard Controls
* Next/Previous, Start Timer, Show Answer.

### 9.2 Step-by-Step Reveal (New)
For complex questions, the QM has granular "Advance" buttons:
1.  **State 1:** Show Question Text (or Image).
2.  **State 2:** Show Options (if MCQ).
3.  **State 3:** Open Buzzer/Input.
4.  **State 4:** Reveal Correct Answer.
* *Note:* Allows QM to read the question before options appear on team devices/projector.

---

## 10. Device Display Modes
1.  **Mobile PWA:** Optimized for touch, vibration feedback on buzzer.
2.  **Projector Client:** High-contrast, large font, animation-ready.
3.  **Dual Mode:** Syncs content across both.

---

## 11. Preliminary Round Design
### 11.1 Logic
* Teams answer MCQs on PWA.
* **Timer:** Hard stop on server side.

### 11.2 Advanced Tie-Resolution (New)
* **Primary:** Total Score.
* **Secondary (Tie-Breaker):** **Time-Based Ranking**. The system sums the time taken for all correct answers. Teams with faster aggregate response times rank higher.

### 11.3 Feedback (New)
* **Post-Round Summary:** Once the round ends, team devices display a personalized summary: *"Score: 15/20 | Time: 4m 30s"*.
* **Answer Key Release:** Admin can toggle "Show Answers" to push the full solution key to team devices after finalists are announced.

---

## 12. Final Round Design
* **Live Flow:** Controlled by QM with Step-by-Step reveal.
* **Media:** Images/Audio stream to Projector Client first, then optionally to Mobile PWA.

---

## 13. Scoring Model & Audit
### 13.1 Modes
1.  **Auto-Scoring:** Based on system inputs.
2.  **Hybrid:** Auto + Manual adjustments.

### 13.2 Enhanced Score Manager (New)
* **Mandatory Reason Logging:** The Score Manager **cannot** save a manual score change (e.g., awarding points for a verbal answer or applying a foul penalty) without typing a reason in a pop-up text field.
    * *Example Log:* "Adjustment: +10 | Reason: QM accepted partial answer."

---

## 14. Advanced Buzzer System
### 14.1 Core Logic
* Fastest-finger-first detection via WebSocket.

### 14.2 Customizable Rules (New)
Admin configures these rules per round:
* **Wrong Answer Penalty:** Define negative points (e.g., -5).
* **Bounce Rule:** If the 1st buzzer answers wrong, does the system auto-open for the 2nd buzzer? (Yes/No).
* **Lockout Time:** How long a team is locked out after a wrong buzz.
* **Max Attempts:** Limit how many teams can attempt one question.

---

## 15. Rapid Fire Round
* Standard rapid-fire logic.
* Scores recorded.
* Uses Step-by-Step reveal (Question -> Answer -> Next) rapidly.

---

## 16. Projector & Scoreboard (Dedicated Client)
### 16.1 Architecture
* Separated from the Django Admin/QM views.
* Built as a **lightweight, read-only frontend** (e.g., pure JS/Vue/React) that listens to the `quiz_<id>_scoreboard` WebSocket channel.
* **Benefit:** Allows the QM to perform complex admin tasks without disturbing the public visual feed.

### 16.2 Features
* Leaderboards (Simple/Detailed).
* Live Question View.
* "Winner" Animations.

---

## 17. Data Storage Model
* **Database:** SQLite (for portability) or PostgreSQL (for production robustness).
* **Global Bank:** Stored in a distinct table set, linked to Quizzes via Foreign Keys.
* **Audit Logs:** Stores `timestamp`, `user`, `action`, `target`, and `reason_comment`.

---

## 18. Data Export
* CSV/Excel/PDF.
* Includes **Time-Based Stats** (response times) for tie-break analysis.
* Includes **Audit Log Report** showing all manual score changes and reasons.

---

## 19. Real-Time Communication
* **Django Channels (WebSockets):**
    * `qm_control`: QM commands.
    * `team_pwa`: Push questions/feedback to mobile.
    * `projector_view`: Push display states to the big screen.

---

## 20. Tech Stack (Production)
### Backend
* **Python Django** + **Django Channels** (Daphne/Uvicorn).
* **Redis** (optional, for channel layer) or In-Memory Channel Layer (for pure offline simplicity).

### Frontend (Teams)
* **PWA:** HTML5, Service Workers (for caching assets), Manifest.json (for "Add to Home Screen").
* **HTMX:** For fluid interactions without full page reloads.

### Frontend (Projector)
* Dedicated Single Page Application (SPA) or optimized template.

---

## 21. System Modules
* **Global Question Bank**
* **Quiz Builder** (Links to Bank)
* **Live Engine** (WebSockets)
* **PWA Interface**
* **Projector Interface**
* **Audit & Reporting**

---

## 22. UI Overview
* **QM Dashboard:** Added "Step-by-Step" reveal controls.
* **Score Manager:** Added "Reason" input for overrides.
* **Team Mobile UI:** PWA enabled; "Performance Summary" screen added.
* **Projector UI:** Standalone clean interface.

---

## 23. Backup & Restore
* Full DB dump + Media folder.
* Includes Global Bank data.

---

## 24. Audit Logs (Enhanced)
* **Standard:** Login, Join, Start Round.
* **Critical:** Manual Score Change.
    * *Must record:* `Old Score`, `New Score`, `Modifier ID`, `Reason`.

---

## 25. Future Extensions
* AI-Question Generation (populating the Global Bank).
* Cloud Sync.
# AVAAS Employee & Executive Standup Dashboard

A modern, responsive, corporate dashboard website built for **AVAAS** leadership.

---

## 🌟 Features

- **Company Email Authentication**:
  - Restricts login strictly to official `@avaas.me` domain addresses.
  - Authorized executive roster:
    - 👑 `ceo@avaas.me` (Chief Executive Officer)
    - 💻 `cto@avaas.me` (Chief Technology Officer)
    - ⚙️ `coo@avaas.me` (Chief Operating Officer)
    - 📊 `cfo@avaas.me` (Chief Financial Officer)
    - 📢 `cmo@avaas.me` (Chief Marketing Officer)
    - 🚀 `cpro@avaas.me` (Chief Product / Public Relations Officer)
  - 1-Click quick login switcher to effortlessly test and navigate between executive profiles.

- **Daily Standup & Attendance Form**:
  - **1. Duration of your call in the meeting** (preset buttons: 15m, 30m, 45m, 60m, 90m, or custom input).
  - **2. What work did you do?** (tasks, commits, strategic milestones accomplished).
  - **3. What are you doing tomorrow?** (priorities, calls, deliverables).
  - **Dynamic Attendance Confirmation**: Upon clicking submit, displays a celebratory banner stating:
    > **"Attendance marked for [xxxx] date"** (e.g. *"Attendance marked for 23 October 2026 date"*).
  - Confetti celebration animation and real-time attendance status badge update.

- **Executive Board & CEO View**:
  - Live leadership attendance tracker (shows attendance rate, e.g., 5/6 checked in).
  - Shows each executive's meeting call duration, tasks completed, and tomorrow's plan.
  - One-click **Copy Summary** formatted for Slack/WhatsApp/Email sync meetings.
  - **Export JSON** option for company logs.
  - Persistent state in browser `localStorage`.

---

## 🚀 How to Run

### Method 1: Instant Browser View (Zero dependencies)
Double click `index.html` or run:
```bash
open index.html
```

### Method 2: Local Web Server
Run the included launcher script:
```bash
./start.sh
```
Or with Python:
```bash
python3 -m http.server 3000
```
Then visit [http://localhost:3000](http://localhost:3000) in your browser.

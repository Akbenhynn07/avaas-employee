#!/usr/bin/env python3
import http.server
import json
import os
import sqlite3
import sys
import urllib.parse
from http import HTTPStatus

PORT = 3000
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "avaas.db")
STATIC_DIR = os.path.dirname(os.path.abspath(__file__))

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY COLLATE NOCASE,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        title TEXT NOT NULL,
        dept TEXT NOT NULL,
        avatar_bg TEXT NOT NULL,
        initials TEXT NOT NULL,
        is_ceo INTEGER DEFAULT 0
    )
    """)

    # Attendance Table (starts completely empty, no dummy data)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attendance (
        id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL COLLATE NOCASE,
        user_name TEXT NOT NULL,
        role_title TEXT NOT NULL,
        date TEXT NOT NULL,
        formatted_date TEXT NOT NULL,
        meeting_duration TEXT NOT NULL,
        work_done TEXT NOT NULL,
        plan_tomorrow TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (user_email) REFERENCES users (email)
    )
    """)

    # Real Employee Roster with assigned passwords
    employees = [
        ('ceo@avaas.me', 'Akshay', 'akshay', 'CEO', 'Chief Executive Officer', 'Executive Leadership', 'bg-amber-500 text-white', 'AK', 1),
        ('cpro@avaas.me', 'Aaliya', 'aaliya', 'CPRO', 'Chief Product / PR Officer', 'Public Relations & Product', 'bg-cyan-600 text-white', 'AL', 0),
        ('coo@avaas.me', 'Varshini', 'varshini', 'COO', 'Chief Operating Officer', 'Operations & Strategy', 'bg-emerald-600 text-white', 'VA', 0),
        ('cmo@avaas.me', 'Anmol', 'anmol', 'CMO', 'Chief Marketing Officer', 'Growth & Brand', 'bg-rose-500 text-white', 'AN', 0),
        ('cto@avaas.me', 'Annu Kumar', 'annu kumar', 'CTO', 'Chief Technology Officer', 'Engineering & Tech', 'bg-blue-600 text-white', 'AK', 0),
        ('cfo@avaas.me', 'Koushik', 'koushik', 'CFO', 'Chief Financial Officer', 'Finance & Planning', 'bg-indigo-600 text-white', 'KO', 0)
    ]

    for emp in employees:
        cursor.execute("""
        INSERT INTO users (email, name, password, role, title, dept, avatar_bg, initials, is_ceo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
            name=excluded.name,
            password=excluded.password,
            role=excluded.role,
            title=excluded.title,
            dept=excluded.dept,
            avatar_bg=excluded.avatar_bg,
            initials=excluded.initials,
            is_ceo=excluded.is_ceo
        """, emp)

    conn.commit()
    conn.close()
    print("[DB] Initialized avaas.db with users table and empty attendance records.")

class AvaasHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def _send_json(self, data, status=HTTPStatus.OK):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(content_length) if content_length > 0 else b"{}"

        try:
            body = json.loads(raw_body.decode("utf-8"))
        except Exception:
            body = {}

        if parsed.path == "/api/login":
            email = body.get("email", "").strip().lower()
            password = body.get("password", "").strip()

            if not email or not password:
                return self._send_json({"error": "Email and password are required."}, status=HTTPStatus.BAD_REQUEST)

            conn = sqlite3.connect(DB_FILE)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", (email,))
            user = cur.fetchone()
            conn.close()

            if not user:
                return self._send_json({"error": f"The email '{email}' is not in the AVAAS executive directory."}, status=HTTPStatus.UNAUTHORIZED)

            if user["password"] != password:
                return self._send_json({"error": "Incorrect password. Access denied."}, status=HTTPStatus.UNAUTHORIZED)

            user_data = {
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
                "title": user["title"],
                "dept": user["dept"],
                "avatarBg": user["avatar_bg"],
                "initials": user["initials"],
                "isCeo": bool(user["is_ceo"]),
            }
            return self._send_json({"success": True, "user": user_data})

        elif parsed.path == "/api/attendance":
            # Save or update attendance entry
            entry_id = body.get("id")
            user_email = body.get("userEmail", "").strip().lower()
            user_name = body.get("userName", "").strip()
            role_title = body.get("roleTitle", "").strip()
            date = body.get("date", "").strip()
            formatted_date = body.get("formattedDate", "").strip()
            meeting_duration = body.get("meetingDuration", "").strip()
            work_done = body.get("workDone", "").strip()
            plan_tomorrow = body.get("planTomorrow", "").strip()
            timestamp = body.get("timestamp", 0)

            if not entry_id or not user_email or not date or not work_done or not plan_tomorrow:
                return self._send_json({"error": "Missing required standup fields."}, status=HTTPStatus.BAD_REQUEST)

            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("""
            INSERT INTO attendance (id, user_email, user_name, role_title, date, formatted_date, meeting_duration, work_done, plan_tomorrow, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                user_name=excluded.user_name,
                role_title=excluded.role_title,
                formatted_date=excluded.formatted_date,
                meeting_duration=excluded.meeting_duration,
                work_done=excluded.work_done,
                plan_tomorrow=excluded.plan_tomorrow,
                timestamp=excluded.timestamp
            """, (entry_id, user_email, user_name, role_title, date, formatted_date, meeting_duration, work_done, plan_tomorrow, timestamp))
            conn.commit()
            conn.close()

            return self._send_json({"success": True, "message": f"Attendance marked for {formatted_date} date"})

        return super().do_POST()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == "/api/users":
            conn = sqlite3.connect(DB_FILE)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT email, name, role, title, dept, avatar_bg, initials, is_ceo, password FROM users ORDER BY is_ceo DESC, role ASC")
            rows = cur.fetchall()
            conn.close()

            users = []
            for r in rows:
                users.append({
                    "email": r["email"],
                    "name": r["name"],
                    "password": r["password"],
                    "role": r["role"],
                    "title": r["title"],
                    "dept": r["dept"],
                    "avatarBg": r["avatar_bg"],
                    "initials": r["initials"],
                    "isCeo": bool(r["is_ceo"]),
                })
            return self._send_json({"users": users})

        elif parsed.path == "/api/attendance":
            query_params = urllib.parse.parse_qs(parsed.query)
            date_filter = query_params.get("date", [None])[0]

            conn = sqlite3.connect(DB_FILE)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()

            if date_filter:
                cur.execute("SELECT * FROM attendance WHERE date = ? ORDER BY timestamp DESC", (date_filter,))
            else:
                cur.execute("SELECT * FROM attendance ORDER BY timestamp DESC")

            rows = cur.fetchall()
            conn.close()

            entries = []
            for r in rows:
                entries.append({
                    "id": r["id"],
                    "userEmail": r["user_email"],
                    "userName": r["user_name"],
                    "roleTitle": r["role_title"],
                    "date": r["date"],
                    "formattedDate": r["formatted_date"],
                    "meetingDuration": r["meeting_duration"],
                    "workDone": r["work_done"],
                    "planTomorrow": r["plan_tomorrow"],
                    "timestamp": r["timestamp"]
                })
            return self._send_json({"entries": entries})

        # Static files fallback
        return super().do_GET()

if __name__ == "__main__":
    init_db()
    server_address = ("", PORT)
    httpd = http.server.ThreadingHTTPServer(server_address, AvaasHandler)
    print(f"[Server] AVAAS Fullstack Server running on http://127.0.0.1:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()

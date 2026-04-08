🎨 Sketchle

A high-performance drawing hub with a React frontend, Spring Boot API, and C++ Desktop integration.

🚀 Quick Start (Development)

We use a Hybrid Environment: The Backend and Database run in Docker for stability, while the Frontend runs Locally for instant UI hot-reloading.

1. Prerequisites
Docker & Docker Desktop installed.

Node.js (v20+) installed locally.

A Supabase project with a storage bucket named drawings.

2. Configure Environment
Create a .env file in the root directory:

Code snippet
SPRING_DATASOURCE_URL=jdbc:postgresql://your-supabase-db-url:5432/postgres

SPRING_DATASOURCE_USERNAME=postgres

SPRING_DATASOURCE_PASSWORD=your_password

SUPABASE_URL=https://your_project.supabase.co

SUPABASE_KEY=your_anon_key
3. Spin up the Backend (Docker)
From the root folder, run:

Bash
docker compose up backend -d
The API is now live at http://localhost:8080

4. Spin up the Frontend (Local)
For the best UI design experience with instant refreshes:

Bash
cd frontend
npm install
npm run dev
The UI is now live at http://localhost:5173

🛠 API for C++ Desktop App
Integration docs for the native client (using CPR or similar).

Authentication
POST /api/auth/login

Body: { "username": "...", "password": "..." }

Returns: { "token": "JWT_HERE" }

Daily Theme
GET /api/theme/daily

Returns: { "date": "2026-04-08", "word": "Space" }

Submit Drawing
POST /api/drawings/submit

Header: Authorization: Bearer <JWT_TOKEN>

Body: multipart/form-data (Key: file)

C++ Example (CPR Library):

C++
cpr::Response r = cpr::Post(
    cpr::Url{"http://localhost:8080/api/drawings/submit"},
    cpr::Header{{"Authorization", "Bearer " + jwt_token}},
    cpr::Multipart{{"file", cpr::Buffer{png_data.begin(), png_data.end(), "drawing.png"}}}
);
📦 Production Build
If you want to test the full containerized production stack (using Nginx):

Bash
docker compose up --build

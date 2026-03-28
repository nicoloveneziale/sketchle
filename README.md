# sketchle
A drawing app!

PrerequisitesJava 17 or 21 (JDK)Maven 3.8+Node.js (for the Web Gallery)
Supabase Account (Storage bucket named drawings must exist).

How to Run the Project

Backend (Spring Boot)

Navigate to the /backend folder.

Open src/main/resources/application.properties and fill in your Supabase credentials:

Properties

supabase.url=your_project_url

supabase.key=your_anon_key

spring.datasource.url=your_postgres_url

Run the application:

./mvnw spring-boot:run

The server will start at http://localhost:8080

Web Gallery (React)

Navigate to the /frontend folder.

Install dependencies:

npm install 

Start the development server:

npm run dev

The site will be available at http://localhost:5173

-----ROUTES FOR C++ APP-----

Login:
POST /api/auth/login
Request Body (JSON):
JSON
{
  "username": "your_username",
  "password": "your_password"
}
Success Response: 200 OK
JSON
{ "token": "eyJhbG..." }

Todays Theme:
Endpoint: GET /api/theme/daily
Authentication: Not required (Public)
Success Response: 200 OK
JSON
{
  "date": "2026-03-26",
  "word": "Cat"
}

Today's Submission:

Endpoint: POST /api/drawings/submit

Content-Type: multipart/form-data

Authentication: Required (Authorization: Bearer <JWT_TOKEN>)

Key: file

Value: The raw binary data of the image (PNG format recommended)

CPR??? 

cpr::Response r = cpr::Post( cpr::Url{"http://localhost:8080/api/drawings/submit"}

cpr::Header{{"Authorization", "Bearer " + jwt_token}}, 

cpr::Multipart{ {"file", cpr::Buffer{png_data.begin(), png_data.end(), "drawing.png"}} } );

Response (200 OK):
Plaintext
Drawing uploaded successfully! URL: https://[supabase-url]/.../image.png

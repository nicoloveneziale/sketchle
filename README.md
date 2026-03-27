# sketchle
A drawing app!

PrerequisitesJava 17 or 21 (JDK)Maven 3.8+Node.js (for the Web Gallery)
Supabase Account (Storage bucket named drawings must exist).

How to Run the Project

Backend (Spring Boot)

Navigate to the /backend folder.

Open src/main/resources/application.properties and fill in your Supabase credentials:

Propertiessupabase.url=your_project_url
supabase.key=your_anon_key
spring.datasource.url=your_postgres_url

Run the application:

./mvnw spring-boot:run

The server will start at http://localhost:8080.2.

Web Gallery (React)
Navigate to the /frontend folder.
Install dependencies:

npm install

Start the development server:

npm run dev

The site will be available at http://localhost:5173.
# Travel-Tracker-App

This project is a full-stack web application that allows users to track countries they have visited. Users can log in, add countries, and view their visited countries highlighted on a world map.

---

## Table of Contents
- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [How It Works](#how-it-works)
- [Sample Workflow](#sample-workflow)
- [Acknowledgements](#acknowledgements)

---

## Project Description
The Travel Tracker application allows users to:
- Register and log in securely using a username and password.
- Add countries they have visited by entering country names.
- Visualize visited countries on a world map, with visited countries highlighted.
- Keep track of the total number of visited countries.

---

## Features
1. **User Authentication**:
   - Secure user login and signup with hashed passwords.
   - JWT-based authentication to protect user data.
2. **Country Tracking**:
   - Add visited countries by name.
   - Ensure unique country entries for each user.
3. **Interactive Map**:
   - Displays a map where visited countries are highlighted dynamically.
4. **Error Handling**:
   - Handles cases like invalid country names, duplicate entries, and server errors gracefully.
5. **Logout Functionality**:
   - Users can log out securely by clearing the session.

---

## Technologies Used
- **Backend**:
  - Node.js and Express.js for server-side logic.
  - PostgreSQL as the database.
  - bcrypt for password hashing.
  - JSON Web Tokens (JWT) for authentication.
  - dotenv for managing environment variables.
- **Frontend**:
  - EJS templates for dynamic rendering.
  - HTML, CSS, and JavaScript for the user interface.
- **Map Visualization**:
  - SVG-based rendering to highlight countries on the map.

---

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/RahulRmCoder/Travel-Tracker-App.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Travel-Tracker-App
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file with the following keys:
     ```plaintext
     DB_USER=<your-database-username>
     DB_PASSWORD=<your-database-password>
     DB_HOST=<your-database-host>
     DB_PORT=<your-database-port>
     DB_DATABASE=<your-database-name>
     JWT_SECRET=<your-jwt-secret>
     ```
5. Start the server:
   ```bash
   npm start
   ```
6. Access the application in your browser:
   ```
   http://localhost:3000
   ```

---

## How It Works
1. **User Registration**:
   - Users can sign up with a unique username and password.
   - Passwords are hashed and stored securely in the database.

2. **Login and Authentication**:
   - Users log in with their credentials, and a JWT token is issued and stored as a cookie.
   - The token is verified for protected routes (e.g., adding countries).

3. **Adding Countries**:
   - Users enter the name of a country they have visited.
   - The server checks for validity and uniqueness before saving the entry in the database.

4. **Displaying the Map**:
   - The visited countries are dynamically highlighted on an SVG map using JavaScript.

5. **Logout**:
   - Clears the JWT token and redirects the user to the login page.

---

## Sample Workflow
1. **Signup/Login**:
   - Navigate to `/signup` or `/login` to create an account or log in.

2. **Add a Country**:
   - Enter a country name in the input field and submit.
   - If successful, the country will be added to the visited list and highlighted on the map.

3. **View Visited Countries**:
   - Check the highlighted countries on the map.
   - The total number of visited countries is displayed below the map.

4. **Logout**:
   - Click the "Logout" button to securely log out.

---

## Acknowledgements
This project was built as a demonstration of full-stack development using modern web technologies. Special thanks to the contributors of Node.js, PostgreSQL, and the open-source community for providing valuable resources and libraries.


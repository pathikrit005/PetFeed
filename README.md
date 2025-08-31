🐾 PetFeed

PetFeed is a community platform for pet lovers to share posts, connect, and explore pet-related content. Built with HTML, CSS, JavaScript (frontend) and Node.js + Express + MongoDB (backend).

✨ Features

🔐 User Authentication (Signup/Login with MongoDB)

🐶 Create Posts about your pets

📌 Save posts in MongoDB database

❤️ Like system (frontend logic implemented)

🏠 Home feed with posts

👤 Profile redirection (login required)

🛠️ Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express.js

Database: MongoDB

Version Control: Git + GitHub

⚙️ Installation

Clone the repository:

git clone https://github.com/pathikrit005/PetFeed.git
cd PetFeed


Install dependencies:

cd Backend
npm install


Create a .env file inside Backend/ with:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000


Run the backend server:

node server.js


Open index.html in your browser for the frontend.

📂 Project Structure
PetFeed/
│── Backend/           # Node.js + Express server
│   ├── server.js
│   ├── models/
│   ├── routes/
│   └── ...
│── Frontend/          # HTML, CSS, JS
│   ├── index.html
│   ├── style.css
│   └── script.js
│── README.md          # Project documentation

🚀 Deployment

You can deploy the backend on Render/Heroku/Vercel

Frontend can be hosted on GitHub Pages/Netlify/Vercel

👨‍💻 Author

Pathikrit Koner – BCA Student
Ankush Khan - BCA Student
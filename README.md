# 🧪 Code Lab

**Code Lab** is a collaborative online coding platform that enables real-time code sharing, editing, and terminal execution. Users can join or create rooms, interact via a shared terminal, and comes with many more featutes.

> 🚀 [Live App](https://code-lab-fty3.onrender.com/)

---

## ✨ Features

- ✅ Collaborative code editing with video-meeting and whiteboard feature
- ✅ Real-time terminal session per room
- ✅ WebSocket-powered live sync
- ✅ Room-based directory structure
- ✅ Vite + React frontend
- ✅ Node.js + Express + PTY backend

---

## 🧱 Folder Structure

```
Code-Lab/
├── public/                     # Public assets
├── server/                     # Backend
│   ├── node_modules/
│   ├── projects/               # Dynamic file/project storage
│   └── src/
│       ├── constants/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       ├── webSocket/
│       ├── app.js
│       └── index.js
├── src/                        # Frontend (React)
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── pages/
│   ├── providers/
│   ├── redux/
│   ├── services/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env                        # Environment variables (excluded in .gitignore)
├── .env.sample                 # Sample env file for reference
├── .gitignore
├── index.html
├── package.json                # Project metadata and frontend dependencies
├── package-lock.json
├── vite.config.js              # Vite configuration
└── eslint.config.js
```


---

## 🚀 Getting Started

### 1. Clone the Repository


git clone https://github.com/ayushmaangupta261/Code-Lab.git
cd Code-Lab


---

### 2. Install Dependencies

#### Frontend:


npm install


#### Backend:


cd server
npm install


---

### 3. Create `.env` File in `/server`

```env for backend
MONGO_URL = 
PORT = 4000

CORS_ORIGIN = *

CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 

ACCESS_TOKEN_SECRET = 
ACCESS_TOKEN_EXPIRY = 1d
REFRESH_TOKEN_SECRET = 
REFRESH_TOKEN_EXPIRY = 10d

GOOGLE_API_KEY = 
```

-----------------------------------

### 3. Create `.env` File in `./`


```env for frontent

#  Use in development

VITE_APP_BASE_URL = http://localhost:4000/api/v1

VITE_APP_SOCKET_URL = http://localhost:4000


# --------------------------------------------------------------

#  Use in production


#VITE_APP_BASE_URL = https://code-lab-duqw.onrender.com/api/v1

#VITE_APP_SOCKET_URL = https://code-lab-duqw.onrender.com
```


---

### 4. Run Locally

#### In one terminal (backend + frontend):

# The project uses run concurrently
npm run dev



---

## 🧠 Technologies Used

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, `node-pty`
- **WebSockets**: Socket.IO
- **Deployment**: Render

---


## 🙋 Author

**Ayushmaan Gupta**  
📧 ayush.261.gupta@gmail.com  
🔗 [GitHub](https://github.com/ayushmaangupta261)  
🔗 [LinkedIn](https://www.linkedin.com/in/ayushmaangupta261/)

---

## 📄 License

Self Owned

# 🧪 Code Lab

**Code Lab** is a collaborative online coding platform that enables real-time code sharing, editing, and terminal execution. Users can join or create rooms, interact via a shared terminal, and see updates instantly.

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
├── server/              # Backend (Express + PTY + Socket.io)
│   ├── index.js
│   ├── routes/
│   ├── controllers/
│   └── utils/
├── src/                 # Frontend (React)
│   ├── components/
│   ├── pages/
│   └── App.jsx
├── public/              # Static assets
├── index.html
├── package.json         # Frontend dependencies
├── vite.config.js       # Vite config
└── README.md
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

```env
PORT=5000
MONGODB_URI=mongodb+srv://<your-mongo-url>
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
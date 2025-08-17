# Real‑Time Collaboration Tool

A modern, real‑time chat app to collaborate with friends/teammates. Built with a classic **Frontend / Backend** split.

> Live demo: **real-time-collaboration-tool-livid.vercel.app** (if deployed)
> Repo folders: **Frontend/** and **Backend/**

---

## ✨ Features

* Real‑time 1‑to‑1 and/or group messaging (Socket-based)
* Message delivery and online presence indicators
* Typing indicator and unread counts
* Auth (signup/login) and protected routes
* Persistent conversations in a database
* Mobile‑responsive UI

> *Note:* Adjust this list to exactly match what you’ve implemented.

---

## 🧱 Tech Stack (typical)

**Frontend**: React + (Vite or CRA), Tailwind CSS
**Backend**: Node.js, Express, Socket.IO
**Database**: MongoDB (Mongoose)
**Auth**: JWT cookies or headers
**Deployment**: Vercel (frontend), Render/Railway (backend)

> Replace items if your stack differs.

---

## 📦 Project Structure

```
Real-Time-Collaboration-Tool/
├── Frontend/            # React app (UI)
│   ├── src/
│   ├── public/
│   └── package.json
└── Backend/             # API + WebSocket server
    ├── src/ or server.js
    ├── package.json
    └── .env (local only)
```

---

## ⚙️ Prerequisites

* Node.js LTS and npm/yarn
* (Optional) MongoDB running locally or a cloud URI (MongoDB Atlas)

---

## 🧪 Local Development

### 1) Clone and install

```bash
git clone https://github.com/Xabhi0811/Real-Time-Collaboration-Tool.git
cd Real-Time-Collaboration-Tool
```

#### Backend

```bash
cd Backend
npm install      # or yarn
```

Create **Backend/.env**:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=super_secret_key
CLIENT_URL=http://localhost:5173
# SOCKET_PATH=/socket.io  # if customized
```

Start backend:

```bash
npm run dev      # or: npm start
```

#### Frontend

```bash
cd ../Frontend
npm install
```

Create **Frontend/.env** (Vite syntax shown):

```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🔌 Environment Variables

**Backend**

* `PORT` – API/Socket server port
* `MONGODB_URI` – Mongo connection string
* `JWT_SECRET` – signing secret for access tokens
* `CLIENT_URL` – allowed CORS origin for the frontend

**Frontend** (Vite)

* `VITE_API_URL` – base URL for REST API
* `VITE_SOCKET_URL` – URL for Socket.IO client

> If you’re using CRA, change names to `REACT_APP_*`.

---

## 🚏 API (example skeleton)

> Replace with your actual routes & payloads

**Auth**

* `POST /api/auth/signup` – create user
* `POST /api/auth/login` – login, returns token/cookie
* `GET /api/auth/me` – current user

**Messages**

* `GET /api/conversations` – list conversations
* `GET /api/messages/:conversationId` – fetch messages
* `POST /api/messages` – send a message

---

## 🕸️ Socket Events (example)

> Replace with your actual events

**Client → Server**

* `join` {roomId}
* `typing` {conversationId, isTyping}
* `message:send` {conversationId, text}

**Server → Client**

* `presence:update` {userId, online}
* `message:new` {message}
* `typing:update` {conversationId, userId, isTyping}

---

## 🧱 Production Deployment

**Frontend (Vercel)**

* Set `VITE_API_URL` and `VITE_SOCKET_URL` to your backend URL

**Backend (Render/Railway/VPS)**

* Set `CLIENT_URL` to your deployed frontend origin
* Enable WebSockets on your host
* Configure CORS to allow your frontend domain

**MongoDB**

* Use a hosted MongoDB Atlas cluster and set `MONGODB_URI`

---

## 🧰 Scripts (fill as per your package.json)

**Backend**

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

**Frontend**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## ✅ Checklist

* [ ] Add exact routes and socket events
* [ ] Confirm ports and env variable names
* [ ] Paste real screenshots/GIFs in the section below
* [ ] Update license if needed

---

## 📸 Screenshots

> Add UI screenshots or short GIF demos here.

---

## 📄 License

Specify your license (e.g., MIT). Create a `LICENSE` file in the repo root.

---

## 🤝 Contributing

PRs welcome! Please open an issue to discuss major changes.

---

## 🙌 Acknowledgements

* Socket.IO for realtime communication
* MongoDB/Mongoose for data persistence
* Vercel/Render for simple deployment

---

## Troubleshooting

* **CORS errors**: ensure `CLIENT_URL` matches the frontend origin and that CORS is enabled on the backend
* **WebSocket not connecting on production**: make sure your host supports WebSockets and you’re using the correct `VITE_SOCKET_URL`
* **.env not loading**: verify `.env` placement and that your process manager (or host) has vars configured

---


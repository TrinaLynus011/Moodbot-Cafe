# **Moodbot Café**

*A Mindful Journaling and Emotional Support Web Application*

Moodbot Café is a web application that encourages users to reflect on their emotional well-being through daily journaling and mood tracking. The platform also provides a supportive community space where users can share reflections, interact respectfully, and observe emotional patterns over time.

This project is built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), focusing on user privacy, responsive design, and a clean, uplifting user experience.

---

## ✨ **Features**

| Feature                             | Description                                                       |
| ----------------------------------- | ----------------------------------------------------------------- |
| **Secure User Authentication**      | Email-based login/signup with encrypted passwords and JWT tokens. |
| **Mood-Based Journaling**           | Users can write journal entries and tag them with mood emojis.    |
| **Dashboard View**                  | View past entries organized by date and emotion.                  |
| **Community Wall (The Café Space)** | A moderated feed where users can share posts and interact.        |
| **Mood Analytics**                  | Graphs and charts visualizing emotional trends over time.         |
| **Responsive UI**                   | Works smoothly on desktop, tablet, and mobile screens.            |

---

## 🏗️ **Tech Stack**

| Layer          | Technology                                  | Purpose                                 |
| -------------- | ------------------------------------------- | --------------------------------------- |
| Frontend       | **React.js**, HTML5, CSS3, Bootstrap        | UI/UX, routing, state management        |
| Backend        | **Node.js**, Express.js                     | API routes, authentication, logic       |
| Database       | **MongoDB Atlas** + Mongoose                | Cloud storage of users and journal data |
| Authentication | **JWT + bcrypt.js**                         | Secure login and role-based access      |
| Deployment     | *Vercel / Render / Railway (as applicable)* | Hosting                                 |

---

## 📂 **Project Structure**

```
moodbot-cafe/
├── backend/
│   ├── server.js
│   ├── config/db.js
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── controllers/
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── App.js
```

---

## 🚀 **Getting Started (Local Setup)**

### **1. Clone Repository**

```bash
git clone https://github.com/your-username/moodbot-cafe.git
cd moodbot-cafe
```

### **2. Install Dependencies**

#### Backend:

```bash
cd backend
npm install
```

#### Frontend:

```bash
cd ../frontend
npm install
```

### **3. Create Environment Variables**

In `/backend/.env`:

```
MONGODB_URI=your-mongodb-atlas-url
JWT_SECRET=your-secret-key
PORT=5000
```

### **4. Start the Application**

Run backend:

```bash
cd backend
npm start
```

Run frontend:

```bash
cd frontend
npm start
```

Open in browser:

```
http://localhost:3000
```

---

## 🧠 **Core Modules**

| Module             | Purpose                                                  |
| ------------------ | -------------------------------------------------------- |
| `Auth Module`      | Handles signup/login and JWT verification.               |
| `Journal Module`   | Allows creation, editing, and retrieval of mood entries. |
| `Community Module` | Stores and displays shared posts.                        |
| `Analytics Module` | Generates mood trend visualizations.                     |

---

## 🔐 **Security Measures**

* Password hashing using `bcrypt.js`
* Protected routes with `JWT`
* Controlled community interactions to avoid toxicity
* No direct client-side database access

---

## 📸 **Screenshots** *(To be added after deployment)*

* Dashboard View
* Mood Entry Page
* Community Feed
* Analytics Chart

> These will be inserted later once you confirm deployment.

---

## 🌐 Deployment Links

| Resource               | Link          |
| ---------------------- | ------------- |
| Live Application       | *To be added* |
| GitHub Repository      | *https://github.com/TrinaLynus011/Moodbot-Cafe.git*|
| Demo/Walkthrough Video | *To be added* |

---

## 🤝 **Contributors**

| Name                 | Role                                |
| -------------------- | ----------------------------------- |
| **Trina Joan Lynus** | Developer / UI & UX / Documentation |

---

## 📜 **License**

This project is developed solely for academic and learning purposes.



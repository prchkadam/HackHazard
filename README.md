# Avati — Grow Together With Us

Avati is an **identity-first learning companion, AI mentor platform, and reflection system**. It is designed to replace traditional, stress-inducing productivity trackers with a calm, mindful, and concept-focused learning experience.

Avati guides users through a structured loop:
$$\text{Learn} \rightarrow \text{Focus} \rightarrow \text{Reflect}$$

---

## 🚀 Key Features

- **Guest & Google Authentication**: Seamless onboarding to jump straight into learning or focus.
- **AI Mentors**: Chat with three unique learning companion personalities (Ved, Kai, Ira) using **Gemini 2.5 Flash**. Switch guides anytime while keeping your learning context.
- **Calm Focus Sessions**: Intention-focused countdown timers. No game elements, XP, leaderboards, or coins.
- **AI Reflections & Journals**: Summarize sessions, key struggles, and motivational takeaways using tiny-footprint LLM calls.
- **Journey timeline**: A chronological feed of learning milestones, focus sessions, reflection journals, and weekly mentor letters.
- **Weekly Letters**: Mentor summaries of consistency, personalized encouragement, and key concepts.
- **Demo Mode**: One-tap demo seeder on the Profile page to populate timelines and companion growth indicators instantly for evaluation.

---

## 🛠 Tech Stack & Architecture

### Frontend (mobile/)
- **Framework**: React Native + Expo (v51) + Expo Router
- **State Management**: React Query (TanStack) & React Hooks
- **Styling**: Vanilla React Native StyleSheet with custom Design System tokens
- **Persistence**: Secure Store & AsyncStorage

### Backend (server/)
- **Framework**: Node.js + Express + TypeScript
- **Database**: Neo4j AuraDB (Graph Database for tracking concepts, focus sessions, mentors, and relationships)
- **AI Provider**: Google Gemini 2.5 Flash API (rest-client)
- **Architecture**: Controller ➔ Service ➔ Database (Graph)

---

## ⚙️ Environment Variables

### Frontend (`mobile/.env`)
```bash
EXPO_PUBLIC_API_URL=http://localhost:5000
```

### Backend (`server/.env`)
```bash
PORT=5000
JWT_SECRET=your_jwt_signing_key
NEO4J_URI=neo4j+s://your-db-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_neo4j_password
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🏁 Installation & Quickstart

### 1. Database Setup (Neo4j)
1. Create a free instance on [Neo4j AuraDB](https://neo4j.com/cloud/platform/aura-graph-database/).
2. Seed the initial mentor personalities by running the server (it automatically merges Ved, Kai, and Ira nodes on start).

### 2. Running the Backend Server
```bash
cd server
npm install
# Duplicate .env.example as .env and update connection URLs and API keys
npm run dev
```

### 3. Running the Expo App
```bash
cd mobile
npm install
# Duplicate .env.example as .env and verify EXPO_PUBLIC_API_URL points to your backend
npx expo start
```

---

## 📁 Repository Structure
```
├── mobile/                  # React Native/Expo Frontend Application
│   ├── app/                 # Expo Router routes (tabs, focus, onboarding)
│   ├── src/
│   │   ├── components/      # Reusable UI library (AppCard, AppButton, etc.)
│   │   ├── constants/       # Theme, color schemas, and static data
│   │   ├── features/        # Feature modules (learn, focus, journey, profile)
│   │   ├── services/        # API client connection layers
│   │   └── types/           # Unified TypeScript definitions
└── server/                  # Node.js/Express Backend Server
    ├── src/
    │   ├── controllers/     # Express route handlers (Zod validators)
    │   ├── database/        # Neo4j query drivers & seeders
    │   ├── routes/          # Express route registration
    │   ├── services/        # Domain service layer (AI, Focus, Mentors)
    │   └── utils/           # Auth and JWT helpers
```

---

## 📄 License
Avati is open-source under the MIT License.

# NeuroPlay-Pro 🧠🎮

**Adaptive Cognitive Grid Game** - A professional mini-project for brain training and cognitive assessment.

## 🧱 Architecture
- **Frontend**: React + Vite (Deployed on Vercel)
- **Backend**: Node.js + Express (Deployed on Render)
- **Engine**: C-based Scoring Logic (Compiled on Render)

## 🚀 Features
- **NxN Grid System**: Dynamically scaling difficulty.
- **Cognitive Evaluation**: Real-time analysis of memory, reaction speed, and decision consistency.
- **Premium Aesthetics**: Dark mode, glassmorphism, and smooth animations.
- **Adaptive Feedback**: Personalized suggestions based on performance.

## 🎮 How to Play
1. **Start Phase**: Click "START PHASE" to begin a level.
2. **Memorize Phase**: Watch the grid carefully. Random shapes (● ■ ▲ ★) and colors will appear for 1.5–3 seconds.
3. **Input Phase**: Once the patterns vanish, click the cells where you saw the elements as quickly as possible.
4. **Feedback Phase**: The system will analyze your:
   - **Accuracy**: Did you remember all positions?
   - **Reflex**: How fast was your first and subsequent clicks?
   - **Consistency**: Did you hesitate between choices?
5. **Level Up**: Score at least **80% accuracy** to progress to more complex grids and faster timers!

## 🛠️ Deployment Instructions

### Backend (Render)
1. Root directory: `backend/`
2. Build Command: `npm install && chmod +x build.sh && ./build.sh`
3. Start Command: `node server.js`

### Frontend (Vercel)
1. Root directory: `frontend/`
2. Environment Variable: `VITE_API_URL` pointing to your Render service.

## 📜 License
MIT

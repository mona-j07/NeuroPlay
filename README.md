# NeuroPlay-Pro 🧠🎮

**Adaptive Cognitive Grid Game** - A professional mini-project for brain training and cognitive assessment.

## 🚀 Features
- **NxN Grid System**: Dynamically scaling difficulty from 3x3 to 5x5.
- **Cognitive Evaluation**: Real-time analysis of memory, reaction speed, and decision consistency.
- **Premium Aesthetics**: Dark mode, glassmorphism, and smooth animations.
- **Adaptive Feedback**: Personalized suggestions based on performance.

## 🎮 How to Play

### 1. The Start Screen
When you launch the game, you'll see your current **Level** and **Total Score**. Click **"START PHASE"** to begin the challenge.

### 2. Memorize Phase (The "Flash")
- A grid will appear with random visual elements (dots, squares, triangles, or stars) in various colors.
- You have a limited time (shown by the **shrinking timer bar**) to memorize their positions.
- **Goal**: Take a mental snapshot of the entire grid.

### 3. Input Phase (The "Test")
- The elements will vanish, leaving an empty grid.
- **Reaction Timer**: The internal clock starts the moment the patterns hide.
- Click the cells where you saw the elements. 
- **Feedback**: 
    - 🟢 **Green Glow**: Correct cell! The element will reappear.
    - 🔴 **Red Glow**: Wrong cell! Level ends immediately.

---

## 📊 Interpreting Your Results

After each level, a **Visual Scorecard** appears. Here is how to read your cognitive performance:

### 🧠 Memory (Accuracy %)
- **What it means**: The percentage of elements you correctly identified.
- **Target**: You need **80% or higher** to advance to the next level.

### ⚡ Reflex (Avg Reaction)
- **What it means**: Your average time (in seconds) to click each cell.
- **Interpretation**: 
    - `< 0.4s`: Elite reflexes.
    - `0.4s - 0.7s`: Great focus.
    - `> 1.0s`: Careful but slow.

### 🎯 Consistency
- **What it means**: Measures the standard deviation between your clicks.
- **Levels**:
    - **Good**: You clicked at a steady, confident pace.
    - **Average**: Some slight hesitation detected.
    - **Erratic**: Significant pauses between clicks, indicating uncertainty.

### 🧾 Smart Feedback
The AI-driven engine provides personalized advice:
- *"Excellent Focus!"*: High accuracy + High speed.
- *"Careful Thinker"*: High accuracy + Lower speed.
- *"Impulsive"*: High speed but missed some cells.

---

## 📜 License
MIT

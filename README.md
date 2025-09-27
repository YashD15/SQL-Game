# 💡 SQL Murder Mystery Quest  
🚀 *Solve Mysteries with SQL Queries*  
**SQL Murder Mystery Quest** is an interactive web-based game where players solve a **murder mystery quest** using only **SQL queries**. Based on **questions and hints**, players must return a **single value** from the database table. The challenge tests both **logical reasoning** and **SQL skills** in a fun and gamified way.  

---

## 🔧 Features
- 🕵️ **Mystery Quest Theme** — Murder mystery story with SQL-based problem solving  
- ❓ **7 Question Sets** — Each set contains **5 unique questions**  
- 🎲 **Random Set Assignment** — Players are assigned 1 set (5 questions) per playthrough  
- ⏳ **Limited Attempts** — Each question has **5 lives (tries)**  
- 📊 **Points System** — Earn maximum points by solving all 5 questions correctly  
- 🗄️ **SQLite Integration** — Each question and answer stored in a local DB file  
- ⌨️ **SQL-only Input** — Queries must start with `SELECT` and return **exactly one value**  
- 🌐 **API Endpoint** — Send and temporarily store player results  

---

## 📋 How It Works
1. Player receives a **set of 5 questions** with hints.  
2. For each question, the player writes a **SQL query (SELECT only)**.  
3. The query runs against the local SQLite DB (via `better-sqlite3`).  
4. If the query returns the **exact single expected answer**, the player passes the question.  
5. Each wrong attempt costs 1 life (out of 5).  
6. Player’s results are sent to the **temporary API endpoint** for score analysis.  

---

## 🛠️ Tech Stack
- ⚛️ **React.js** — Frontend components  
- ▲ **Next.js** — Application framework  
- 🎨 **Tailwind CSS** — Styling and UI  
- 🗄️ **better-sqlite3** — In-directory SQL database for fast query execution  
- 🌐 **API Endpoint** — Handle player submissions & results  

---

## 👥 Collaborators
- [Yash Dhavde](https://github.com/YashD15)
- [Varad Khandare](https://github.com/Varad11220)

---

## 🚀 Deployment
[Visit SQL Game](https://sql-tatyawinchu.vercel.app/)

---

## 📦 Installation
```bash
# Clone the repository
git clone https://github.com/YashD15/SQL-Game.git
cd SQL-Game

# Install dependencies
npm install

# Run development server
npm run dev

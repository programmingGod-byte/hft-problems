# HFT Problem Tracker — Setup Guide

## Quick Start (3 steps)

**1. Install Node.js** if not already: https://nodejs.org

**2. Run these commands:**
```bash
npm install
node server.js
```

**3. Open browser at:** `http://localhost:3000`

First launch will seed all 400 problems into your Render DB automatically.

---

## What's included

- `server.js` — Express backend connecting to your PostgreSQL DB
- `index.html` — Full tracker UI (served by the backend)
- 150 LeetCode Hard problems pre-loaded
- 250 Codeforces problems pre-loaded

## Features

| Feature | Description |
|---------|-------------|
| ✅ Solve tracking | Check/uncheck problems, saved to DB |
| ⭐ Star problems | Mark important ones |
| 📝 Notes | Add approach notes per problem |
| 🔍 Search | Full-text search across name/topic/contest |
| 🔽 Filters | By type, phase, status, category |
| ➕ Add problem | Add custom problems |
| 📊 Progress bars | Visual progress per phase |

## Database Schema

```sql
problems (
  id, type, number, name, contest,
  rating, topic, hft_relevance,
  category, phase,
  solved, important, note,
  created_at, updated_at
)
```

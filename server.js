const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

const pool = new Pool({
  connectionString: 'postgresql://hft:kks9XdoLAu1epiWQqeddmMgV9wxg60qK@dpg-d75bt2chg0os73b8vj40-a.oregon-postgres.render.com/hft_soxh',
  ssl: { rejectUnauthorized: false }
});

// Init DB
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS problems (
      id SERIAL PRIMARY KEY,
      type VARCHAR(10) NOT NULL DEFAULT 'CF',
      number VARCHAR(30),
      name VARCHAR(300) NOT NULL,
      contest VARCHAR(300),
      rating VARCHAR(20),
      topic VARCHAR(200),
      hft_relevance VARCHAR(300),
      category VARCHAR(100),
      phase VARCHAR(50),
      solved BOOLEAN DEFAULT FALSE,
      important BOOLEAN DEFAULT FALSE,
      note TEXT DEFAULT '',
      code TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Add code column if it doesn't exist (for existing DBs)
  await pool.query(`
    ALTER TABLE problems ADD COLUMN IF NOT EXISTS code TEXT DEFAULT '';
  `).catch(() => {});

  console.log('DB ready');
}

// Seed problems if table is empty
async function seedProblems() {
  const { rows } = await pool.query('SELECT COUNT(*) FROM problems');
  if (parseInt(rows[0].count) > 0) return;
  console.log('Seeding problems...');

  const lcProblems = [
    // Category 1: DP (25)
    ['LC','10','Regular Expression Matching','','Hard','DP on strings','Pattern matching in market data','Dynamic Programming','LC Phase 1'],
    ['LC','32','Longest Valid Parentheses','','Hard','Stack + DP','Order validation sequences','Dynamic Programming','LC Phase 1'],
    ['LC','42','Trapping Rain Water','','Hard','Two pointer / Stack','Volume accumulation models','Dynamic Programming','LC Phase 1'],
    ['LC','44','Wildcard Matching','','Hard','2D DP','Flexible symbol matching','Dynamic Programming','LC Phase 1'],
    ['LC','72','Edit Distance','','Hard','Classic DP','Signal similarity scoring','Dynamic Programming','LC Phase 1'],
    ['LC','87','Scramble String','','Hard','3D DP / Memo','Permutation analysis','Dynamic Programming','LC Phase 1'],
    ['LC','97','Interleaving String','','Hard','2D DP','Merged stream validation','Dynamic Programming','LC Phase 1'],
    ['LC','115','Distinct Subsequences','','Hard','DP counting','Combinatorial trade counting','Dynamic Programming','LC Phase 1'],
    ['LC','123','Best Time to Buy/Sell Stock III','','Hard','State-machine DP','Directly models trading','Dynamic Programming','LC Phase 1'],
    ['LC','132','Palindrome Partitioning II','','Hard','DP + Manacher','String decomposition','Dynamic Programming','LC Phase 1'],
    ['LC','174','Dungeon Game','','Hard','Reverse DP','Risk-adjusted path finding','Dynamic Programming','LC Phase 1'],
    ['LC','188','Best Time to Buy/Sell Stock IV','','Hard','K-transaction DP','Core HFT portfolio logic','Dynamic Programming','LC Phase 1'],
    ['LC','312','Burst Balloons','','Hard','Interval DP','Optimal order execution','Dynamic Programming','LC Phase 1'],
    ['LC','329','Longest Increasing Path in Matrix','','Hard','DFS + Memo','Trend detection in grids','Dynamic Programming','LC Phase 1'],
    ['LC','354','Russian Doll Envelopes','','Hard','LIS + Binary Search','Nested constraint optimization','Dynamic Programming','LC Phase 1'],
    ['LC','403','Frog Jump','','Hard','DP on states','Discrete price jump models','Dynamic Programming','LC Phase 1'],
    ['LC','410','Split Array Largest Sum','','Hard','Binary Search + DP','Order splitting optimization','Dynamic Programming','LC Phase 1'],
    ['LC','514','Freedom Trail','','Hard','DP on ring','Circular buffer management','Dynamic Programming','LC Phase 1'],
    ['LC','664','Strange Printer','','Hard','Interval DP','Batch execution planning','Dynamic Programming','LC Phase 1'],
    ['LC','691','Stickers to Spell Word','','Hard','Bitmask DP','Combination optimization','Dynamic Programming','LC Phase 1'],
    ['LC','741','Cherry Pickup','','Hard','3D DP','Two-agent optimization','Dynamic Programming','LC Phase 1'],
    ['LC','879','Profitable Schemes','','Hard','Knapsack DP','Portfolio constraint modeling','Dynamic Programming','LC Phase 1'],
    ['LC','1000','Min Cost to Merge Stones','','Hard','Interval DP','Merge cost optimization','Dynamic Programming','LC Phase 1'],
    ['LC','1312','Minimum Insertion Steps to Make String Palindrome','','Hard','Interval DP','String transformation costs','Dynamic Programming','LC Phase 1'],
    ['LC','1547','Minimum Cost to Cut a Stick','','Hard','Interval DP','Optimal segmentation','Dynamic Programming','LC Phase 1'],
    // Category 2: Graphs (20)
    ['LC','127','Word Ladder','','Hard','BFS','State space exploration','Graphs','LC Phase 1'],
    ['LC','212','Word Search II','','Hard','Trie + DFS','Multi-pattern scan','Graphs','LC Phase 1'],
    ['LC','239','Sliding Window Maximum','','Hard','Deque','Rolling max bid/ask','Graphs','LC Phase 1'],
    ['LC','269','Alien Dictionary','','Hard','Topological Sort','Ordering constraints','Graphs','LC Phase 1'],
    ['LC','295','Find Median from Data Stream','','Hard','Two Heaps','Live P&L median','Graphs','LC Phase 1'],
    ['LC','297','Serialize/Deserialize Binary Tree','','Hard','BFS/DFS','State serialization','Graphs','LC Phase 1'],
    ['LC','332','Reconstruct Itinerary','','Hard','Eulerian Path','Order routing','Graphs','LC Phase 1'],
    ['LC','399','Evaluate Division','','Hard','Weighted Union-Find','Ratio arbitrage','Graphs','LC Phase 1'],
    ['LC','407','Trapping Rain Water II','','Hard','3D BFS/Heap','Multi-dim accumulation','Graphs','LC Phase 1'],
    ['LC','460','LFU Cache','','Hard','HashMap + DLL','Cache replacement in feeds','Graphs','LC Phase 1'],
    ['LC','675','Cut Off Trees for Golf Event','','Hard','BFS + Priority Queue','Prioritized path clearing','Graphs','LC Phase 1'],
    ['LC','778','Swim in Rising Water','','Hard','Binary Search + BFS','Threshold path finding','Graphs','LC Phase 1'],
    ['LC','847','Shortest Path Visiting All Nodes','','Hard','BFS + Bitmask','TSP-like routing','Graphs','LC Phase 1'],
    ['LC','1059','All Paths from Source Lead to Destination','','Hard','DFS / Topo Sort','Flow path validation','Graphs','LC Phase 1'],
    ['LC','1192','Critical Connections in a Network','','Hard','Tarjan Bridge','Network robustness','Graphs','LC Phase 1'],
    ['LC','1203','Sort Items by Groups Respecting Dependencies','','Hard','Topological Sort','Dependency scheduling','Graphs','LC Phase 1'],
    ['LC','1345','Jump Game IV','','Hard','BFS','Skip-connection routing','Graphs','LC Phase 1'],
    ['LC','1368','Minimum Cost to Make at Least One Valid Path','','Hard','BFS / Dijkstra','Cost optimization','Graphs','LC Phase 1'],
    ['LC','1489','Find Critical and Pseudo-Critical Edges in MST','','Hard','MST variants','Network edge importance','Graphs','LC Phase 1'],
    ['LC','1579','Remove Max Number of Edges to Keep Graph Fully Traversable','','Hard','Union-Find','Redundancy removal','Graphs','LC Phase 1'],
    // Category 3: Data Structures (20)
    ['LC','218','The Skyline Problem','','Hard','Segment Tree / Heap','Order book shape','Data Structures','LC Phase 1'],
    ['LC','315','Count of Smaller Numbers After Self','','Hard','BIT / Merge Sort','Rank queries on prices','Data Structures','LC Phase 1'],
    ['LC','327','Count of Range Sum','','Hard','Merge Sort / BIT','Profit range queries','Data Structures','LC Phase 1'],
    ['LC','336','Palindrome Pairs','','Hard','Trie','Symmetric signal detection','Data Structures','LC Phase 1'],
    ['LC','352','Data Stream as Disjoint Intervals','','Hard','TreeMap','Price interval tracking','Data Structures','LC Phase 1'],
    ['LC','381','Insert Delete GetRandom O(1) Duplicates allowed','','Hard','HashMap + Vector','Order book data structure','Data Structures','LC Phase 1'],
    ['LC','432','All O(1) Data Structure','','Hard','DLL + HashMap','Frequency tracking feeds','Data Structures','LC Phase 1'],
    ['LC','493','Reverse Pairs','','Hard','Merge Sort / BIT','Inversion counting','Data Structures','LC Phase 1'],
    ['LC','699','Falling Squares','','Hard','Segment Tree','Stacked position tracking','Data Structures','LC Phase 1'],
    ['LC','715','Range Module','','Hard','Segment Tree','Interval management','Data Structures','LC Phase 1'],
    ['LC','732','My Calendar III','','Hard','Segment Tree Lazy','Booking / exposure overlap','Data Structures','LC Phase 1'],
    ['LC','850','Rectangle Area II','','Hard','Coordinate Compress + ST','Area sweep','Data Structures','LC Phase 1'],
    ['LC','1157','Online Majority Element In Subarray','','Hard','Segment Tree + BS','Dominant asset detection','Data Structures','LC Phase 1'],
    ['LC','1649','Create Sorted Array through Instructions','','Hard','BIT','Online insertion rank','Data Structures','LC Phase 1'],
    ['LC','1707','Maximum XOR With an Element From Array','','Hard','Trie offline','Bitwise query answering','Data Structures','LC Phase 1'],
    ['LC','1724','Checking Existence of Edge Length Limited Paths II','','Hard','Union-Find','Connectivity queries','Data Structures','LC Phase 1'],
    ['LC','2013','Detect Squares','','Hard','HashMap counting','2D geometric structures','Data Structures','LC Phase 1'],
    ['LC','2040','Kth Smallest Product of Two Sorted Arrays','','Hard','Binary Search','Order statistics','Data Structures','LC Phase 1'],
    ['LC','2276','Count Integers in Intervals','','Hard','Segment Tree','Interval coverage','Data Structures','LC Phase 1'],
    ['LC','2286','Booking Concert Tickets in Groups','','Hard','Segment Tree','Real-time booking system','Data Structures','LC Phase 1'],
  ];

  const cfProblems = [
    ['CF','1033C','Checkpoints','Codeforces Round 500 (Div. 1, based on Div. 2)','1600','Greedy with conditions','','Greedy & Sorting','Phase A'],
    ['CF','1077C','Good Array','Codeforces Round 523 (Div. 2)','1600','Sorting + greedy','','Greedy & Sorting','Phase A'],
    ['CF','1118D','Coffee and Coursework','Codeforces Round 540 (Div. 3)','1700','Binary search on answer','','Binary Search','Phase A'],
    ['CF','1083D','The Fair Nut','Codeforces Round 523 (Div. 1)','1700','DP on array','','DP Basic','Phase A'],
    ['CF','1037D','Valid BFS?','Codeforces Round 504 (Div. 1, based on Div. 2)','1700','BFS tree validation','','Graphs BFS/DFS','Phase A'],
    ['CF','1105C','Ayoub and XOR','Codeforces Round 533 (Div. 2)','1700','XOR + Math','','Math & Number Theory','Phase A'],
    ['CF','1234D','Distinct Characters Queries','Codeforces Round 589 (Div. 2)','1700','Sorted set queries','','Data Structures Intro','Phase A'],
    ['CF','1335D','Anti-Sudoku','Codeforces Round 632 (Div. 2)','1600','Construction','','Mixed 1700-1800','Phase A'],
    ['CF','1076E','Vasya and Book','Codeforces Round 521 (Div. 3)','1900','DP on segments','','Advanced DP','Phase B'],
    ['CF','1092F','Tree with Maximum Cost','Codeforces Round 523 (Div. 2)','1900','Tree DP re-rooting','','Trees LCA/Euler','Phase B'],
    ['CF','1234E','Special Permutations','Codeforces Round 589 (Div. 2)','1900','Counting + segment tree','','Segment Tree & BIT','Phase B'],
    ['CF','1348D','Phoenix and Science','Codeforces Round 641 (Div. 2)','1900','Math + invariant','','Combinatorics & NT','Phase B'],
    ['CF','1321D','Navigation System','Codeforces Round 627 (Div. 2)','1900','Dijkstra','','Graph Dijkstra/SCC','Phase B'],
    ['CF','1515F','Phoenix and Earthquake','Codeforces Round 718 (Div. 1)','2100','DSU + merge','','Advanced Data Structures','Phase C'],
    ['CF','1788D','Moving Dots','Codeforces Round 847 (Div. 2)','2200','Counting + product','','Elite 2200+','Phase D'],
  ];

  const allProblems = [...lcProblems, ...cfProblems];
  for (const p of allProblems) {
    await pool.query(
      `INSERT INTO problems (type,number,name,contest,rating,topic,hft_relevance,category,phase) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      p
    );
  }
  console.log(`Seeded ${allProblems.length} problems`);
}

// Routes
app.get('/api/problems', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM problems ORDER BY type, phase, id');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/problems/:id', async (req, res) => {
  const { id } = req.params;
  const { solved, important, note, code } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE problems SET solved=COALESCE($1,solved), important=COALESCE($2,important), note=COALESCE($3,note), code=COALESCE($4,code), updated_at=NOW() WHERE id=$5 RETURNING *`,
      [solved, important, note, code, id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/problems', async (req, res) => {
  const { type, number, name, contest, rating, topic, hft_relevance, category, phase } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO problems (type,number,name,contest,rating,topic,hft_relevance,category,phase) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [type||'CF', number||'', name, contest||'', rating||'', topic||'', hft_relevance||'', category||'Custom', phase||'Custom']
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/problems/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM problems WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

initDB().then(seedProblems).then(() => {
  app.listen(3000, () => console.log('HFT Tracker running on http://localhost:3000'));
});

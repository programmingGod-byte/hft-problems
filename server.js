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

// ============================================================
// MASTER PROBLEM LIST — single source of truth
// ============================================================
const ALL_PROBLEMS = [
  // ---- LC CATEGORY: Dynamic Programming (25 original) ----
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

  // ---- LC CATEGORY: Graphs (20 original) ----
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

  // ---- LC CATEGORY: Data Structures (20 original) ----
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

  // ---- CF ORIGINAL (15) ----
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

  // ================================================================
  // 100 CF GRAPH PROBLEMS (1600–2400, ordered by difficulty)
  // ================================================================
  ['CF','277C','Game on Tree','Codeforces Round 169 (Div. 1)','1600','Tree + expected value','Graph theory fundamentals','CF Graphs 100','Phase A'],
  ['CF','1385C','Make It Good','Codeforces Round 655 (Div. 2)','1600','Greedy on array / graph insight','Prefix optimization','CF Graphs 100','Phase A'],
  ['CF','580C','Kefa and Park','Codeforces Round 321 (Div. 2)','1600','BFS / DFS on tree','BFS fundamentals','CF Graphs 100','Phase A'],
  ['CF','653C','Herd Sums','Codeforces Round 342 (Div. 2)','1600','Simple traversal','Graph traversal','CF Graphs 100','Phase A'],
  ['CF','847B','Weak Links','Codeforces Round 432 (Div. 2)','1600','Graph degree','Degree counting','CF Graphs 100','Phase A'],
  ['CF','939B','A Twist on Sorting','Codeforces Round 463 (Div. 2)','1600','Simple graph','Graph basics','CF Graphs 100','Phase A'],
  ['CF','1370C','Antichess','Codeforces Round 651 (Div. 2)','1700','Graph game theory','Game graphs','CF Graphs 100','Phase A'],
  ['CF','1369C','RationalLee','Codeforces Round 651 (Div. 2)','1700','Greedy + graph','Greedy graph','CF Graphs 100','Phase A'],
  ['CF','938G','Shortest Path Queries','Codeforces Round 463 (Div. 1)','1700','DSU + XOR graph','XOR shortest path','CF Graphs 100','Phase A'],
  ['CF','1093G','Multidimensional Queries','','1700','Segment tree on graph','Segment tree graph','CF Graphs 100','Phase A'],
  ['CF','893C','Rumor','Codeforces Round 447 (Div. 2)','1700','DSU / union find','Union Find basics','CF Graphs 100','Phase A'],
  ['CF','1033E','Hidden Bipartite Graph','Codeforces Round 500 (Div. 1)','1700','Bipartite check','Bipartite graphs','CF Graphs 100','Phase A'],
  ['CF','1294F','Three Paths on a Tree','Codeforces Round 614 (Div. 1)','1700','Tree diameter','Tree paths','CF Graphs 100','Phase A'],
  ['CF','1249C','Good Numbers','Codeforces Round 596 (Div. 2)','1700','Topological + DP','Topo DP','CF Graphs 100','Phase A'],
  ['CF','342E','Xenia and Tree','','1700','LCA + DSU on tree','LCA fundamentals','CF Graphs 100','Phase A'],
  ['CF','550E','Minimum Spanning Tree','Codeforces Round 307 (Div. 1)','1800','MST + BFS','MST variations','CF Graphs 100','Phase B'],
  ['CF','1051F','The Shortest Statement','Codeforces Round 512 (Div. 1)','1800','LCA + shortest path','LCA + Dijkstra','CF Graphs 100','Phase B'],
  ['CF','916E','Jamie and Tree','Codeforces Round 460 (Div. 1)','1800','HLD + LCA','Heavy-Light Decomp','CF Graphs 100','Phase B'],
  ['CF','1239D','Catowice City','Codeforces Round 590 (Div. 1)','1800','DSU / bipartite','Bipartite + DSU','CF Graphs 100','Phase B'],
  ['CF','1215F','Radio Stations','Codeforces Round 582 (Div. 1)','1800','Segment tree + events','Sweep line graph','CF Graphs 100','Phase B'],
  ['CF','773D','Libertad','Codeforces Round 400 (Div. 1)','1800','Tree diameter + DP','Tree DP','CF Graphs 100','Phase B'],
  ['CF','600E','Lomsat gelral','','1800','DSU on tree / small-to-large','Small to Large merging','CF Graphs 100','Phase B'],
  ['CF','1027F','Session in BerSU','Codeforces Round 505 (Div. 1)','1800','2-SAT','2-SAT fundamentals','CF Graphs 100','Phase B'],
  ['CF','1385E','Directing Edges','Codeforces Round 655 (Div. 2)','1800','Topological sort','Topo sort advanced','CF Graphs 100','Phase B'],
  ['CF','1033D','Divisors','Codeforces Round 500 (Div. 1)','1800','Divisor graph','Number theory graph','CF Graphs 100','Phase B'],
  ['CF','1209G','Into Blocks','Codeforces Round 579 (Div. 1)','1800','DSU intervals','Interval DSU','CF Graphs 100','Phase B'],
  ['CF','191C','Fools and Roads','','1800','LCA + difference array on tree','LCA queries','CF Graphs 100','Phase B'],
  ['CF','1042E','Vasya and Magic Matrix','Codeforces Round 510 (Div. 2)','1800','MST Kruskal like','MST structure','CF Graphs 100','Phase B'],
  ['CF','1239B','Walk the Line','Codeforces Round 590 (Div. 2)','1800','BFS + DP','BFS DP combination','CF Graphs 100','Phase B'],
  ['CF','1030E','Vasya and Good Sequences','Codeforces Round 508 (Div. 2)','1800','Graph modeling','Graph + math','CF Graphs 100','Phase B'],
  ['CF','835F','Roads in the Kingdom','','1800','Tree + spanning','Tree spanning','CF Graphs 100','Phase B'],
  ['CF','1037E','Trips','Codeforces Round 504 (Div. 1, based on Div. 2)','1900','DSU + bridges','Bridge finding','CF Graphs 100','Phase B'],
  ['CF','1060F','Shrinking Tree','Codeforces Round 511 (Div. 1)','1900','Tree DP + sorting','Tree DP advanced','CF Graphs 100','Phase B'],
  ['CF','1187E','Tree Painting','Codeforces Round 570 (Div. 1)','1900','Rerooting DP on tree','Rerooting technique','CF Graphs 100','Phase B'],
  ['CF','1336F','Journey','Codeforces Round 634 (Div. 1)','1900','DP on tree','Tree DP paths','CF Graphs 100','Phase B'],
  ['CF','1244F','Chips','Codeforces Round 593 (Div. 1)','1900','Graphs + XOR','XOR on graph','CF Graphs 100','Phase B'],
  ['CF','1326F','Wise Men','Codeforces Round 628 (Div. 1)','1900','Graph coloring','Graph coloring','CF Graphs 100','Phase B'],
  ['CF','1369E','DeadLee','Codeforces Round 651 (Div. 2)','1900','Bipartite matching','Bipartite matching','CF Graphs 100','Phase B'],
  ['CF','1344F','Middle Duplication','Codeforces Round 638 (Div. 1)','1900','Tree structure','Tree queries','CF Graphs 100','Phase B'],
  ['CF','1033F','Topforces','Codeforces Round 500 (Div. 1)','1900','Min cut on graph','Min cut','CF Graphs 100','Phase B'],
  ['CF','1238F','The Maximum Subtree','Codeforces Round 590 (Div. 2)','1900','Tree DP + rerooting','Subtree max','CF Graphs 100','Phase B'],
  ['CF','1028F','Make Symmetrical','Codeforces Round 505 (Div. 2)','1900','Graph + geometry','Symmetric graph','CF Graphs 100','Phase B'],
  ['CF','877F','Ann and Books','','1900','DSU + sqrt decomp','Sqrt decomp graph','CF Graphs 100','Phase B'],
  ['CF','1286E','Fedya the Potter','Codeforces Round 611 (Div. 1)','2000','Tree query','Tree queries','CF Graphs 100','Phase C'],
  ['CF','1239E','Turtle Migration','Codeforces Round 590 (Div. 1)','2000','BFS + graph modeling','Graph modeling','CF Graphs 100','Phase C'],
  ['CF','1033G','Chip Defects','Codeforces Round 500 (Div. 1)','2000','Virtual tree','Virtual tree technique','CF Graphs 100','Phase C'],
  ['CF','1207G','Indie Album','Codeforces Round 580 (Div. 1)','2000','Aho-Corasick + tree','String graph','CF Graphs 100','Phase C'],
  ['CF','1264F','Beautiful Fibonacci','Codeforces Round 601 (Div. 1)','2000','Graph DP advanced','DP on graph','CF Graphs 100','Phase C'],
  ['CF','1286F','Harry The Potter','Codeforces Round 611 (Div. 1)','2000','Spanning tree variants','MST advanced','CF Graphs 100','Phase C'],
  ['CF','1316G','Conway Sequence','Codeforces Round 626 (Div. 1)','2000','Graph + sequences','Graph sequences','CF Graphs 100','Phase C'],
  ['CF','1368G','Shifting Dominoes','Codeforces Round 650 (Div. 1)','2000','BFS + segment tree','BFS segment tree','CF Graphs 100','Phase C'],
  ['CF','1341F','Nastia and a Tree','Codeforces Round 636 (Div. 1)','2000','DSU + tree','DSU on tree','CF Graphs 100','Phase C'],
  ['CF','1033B','Meeting','Codeforces Round 500 (Div. 2)','2000','Graph meet-in-middle','Meet in middle','CF Graphs 100','Phase C'],
  ['CF','1097G','Vladik and a Great Legend','','2000','DP on DAG','DAG DP','CF Graphs 100','Phase C'],
  ['CF','1043F','Make It One','Codeforces Round 510 (Div. 1)','2000','Graph + GCD','Number theory graph','CF Graphs 100','Phase C'],
  ['CF','1156G','Two Fairs','Codeforces Round 551 (Div. 2)','2000','Dominator tree','Dominator tree','CF Graphs 100','Phase C'],
  ['CF','1335F','Robots on a Grid','Codeforces Round 632 (Div. 2)','2000','Functional graph','Functional graphs','CF Graphs 100','Phase C'],
  ['CF','1349F','Slime and Sequences','Codeforces Round 640 (Div. 1)','2000','DP + generating functions','Generating func','CF Graphs 100','Phase C'],
  ['CF','1370F','The Hidden Pair','Codeforces Round 651 (Div. 2)','2000','Binary lifting on tree','Binary lifting','CF Graphs 100','Phase C'],
  ['CF','1265F','Reachability','Codeforces Round 601 (Div. 2)','2100','SCC + topo','SCC condensation','CF Graphs 100','Phase C'],
  ['CF','1249F','Maximum Weight Subset','Codeforces Round 596 (Div. 2)','2100','DP on tree','Heavy DP tree','CF Graphs 100','Phase C'],
  ['CF','1093F','Vasya and Array','Codeforces Round 526 (Div. 1)','2100','Segment tree on graph','Seg tree graph','CF Graphs 100','Phase C'],
  ['CF','1209H','Moving Walkways','Codeforces Round 579 (Div. 1)','2100','Sweep + graph','Sweep graph','CF Graphs 100','Phase C'],
  ['CF','1209F','Koala and Notebook','Codeforces Round 579 (Div. 1)','2100','BFS + graph compression','Graph compression','CF Graphs 100','Phase C'],
  ['CF','1111E','Tree Queries','Codeforces Round 537 (Div. 1)','2100','HLD + lazy seg tree','HLD advanced','CF Graphs 100','Phase C'],
  ['CF','1172F','Nauuo and Sum','Codeforces Round 558 (Div. 1)','2100','Graph + inversions','Graph inversions','CF Graphs 100','Phase C'],
  ['CF','1205F','Beauty of a Permutation','Codeforces Round 579 (Div. 2)','2100','Graph coloring + DP','Coloring DP','CF Graphs 100','Phase C'],
  ['CF','1239G','Game of Stones','Codeforces Round 590 (Div. 1)','2100','Nim + graph','Grundy values','CF Graphs 100','Phase C'],
  ['CF','1286G','Belarusian SU','Codeforces Round 611 (Div. 1)','2100','Forest DP','Forest structure','CF Graphs 100','Phase C'],
  ['CF','1316F','Battalion Coloring','Codeforces Round 626 (Div. 1)','2100','Graph + matching','Matching advanced','CF Graphs 100','Phase C'],
  ['CF','1335G','Maximize the Score','Codeforces Round 632 (Div. 2)','2100','Greedy + graph','Greedy graph','CF Graphs 100','Phase C'],
  ['CF','1345F','dp + graph','Codeforces Round 639 (Div. 1)','2100','DP on graph paths','Path DP','CF Graphs 100','Phase C'],
  ['CF','1109F','Sasha and Algorithm','Codeforces Round 537 (Div. 2)','2100','Graph + XOR trie','XOR trie graph','CF Graphs 100','Phase C'],
  ['CF','1188F','Sasha and a Bit of Magic','Codeforces Round 571 (Div. 1)','2100','Graph + bitmask','Bitmask DP graph','CF Graphs 100','Phase C'],
  ['CF','1239H','Entertainment in BerSU','Codeforces Round 590 (Div. 1)','2200','Optimal matching on graph','Graph matching','CF Graphs 100','Phase D'],
  ['CF','1265G','Multidimensional Turbidity','Codeforces Round 601 (Div. 2)','2200','Graph flows','Max flow','CF Graphs 100','Phase D'],
  ['CF','1286H','Apple Tree','Codeforces Round 611 (Div. 1)','2200','Heavy tree queries','Tree segment tree','CF Graphs 100','Phase D'],
  ['CF','1320E','Treeland and Viruses','Codeforces Round 626 (Div. 2)','2200','Virtual tree + DP','Virtual tree DP','CF Graphs 100','Phase D'],
  ['CF','1335E','Three Paths on a Tree II','Codeforces Round 632 (Div. 1)','2200','Tree path cover','Path cover tree','CF Graphs 100','Phase D'],
  ['CF','1344G','Quantifier Question','Codeforces Round 638 (Div. 1)','2200','2-SAT + graph','2-SAT advanced','CF Graphs 100','Phase D'],
  ['CF','1366F','Reverses','Codeforces Round 649 (Div. 1)','2200','Graph + strings','String graph','CF Graphs 100','Phase D'],
  ['CF','1368F','Non-intersecting Subpermutations','Codeforces Round 650 (Div. 1)','2200','Graph + hash','Hash graph','CF Graphs 100','Phase D'],
  ['CF','1369F','Vasya and Endless Credits','Codeforces Round 651 (Div. 1)','2200','Bipartite + assignment','Assignment problem','CF Graphs 100','Phase D'],
  ['CF','1370G','Marketing Scheme','Codeforces Round 651 (Div. 1)','2200','Segment tree + graph','Seg tree flows','CF Graphs 100','Phase D'],
  ['CF','1371G','Raining season','Codeforces Round 652 (Div. 1)','2200','Merge sort tree + graph','Offline graph','CF Graphs 100','Phase D'],
  ['CF','1372G','Omkar and Pies','Codeforces Round 652 (Div. 2)','2200','Graph coloring','Coloring hard','CF Graphs 100','Phase D'],
  ['CF','1374G','Springs Heating','Codeforces Round 653 (Div. 1)','2200','Convex hull + graph','CH trick graph','CF Graphs 100','Phase D'],
  ['CF','1375G','Tree Modification','Codeforces Round 655 (Div. 1)','2200','Bipartite tree','Tree bipartite','CF Graphs 100','Phase D'],
  ['CF','1385G','Phegor and Big MOD','Codeforces Round 655 (Div. 1)','2300','Graph + number theory','NT graph','CF Graphs 100','Phase D'],
  ['CF','1386F','Hotelier Alf','Codeforces Round 656 (Div. 1)','2300','Flow network','Min cost flow','CF Graphs 100','Phase D'],
  ['CF','1388E','Reduce the Multiples','Codeforces Round 659 (Div. 1)','2300','Graph + sieve','Sieve graph','CF Graphs 100','Phase D'],
  ['CF','1392F','Omkar and Majesty','Codeforces Round 660 (Div. 1)','2300','HLD + queries','HLD queries','CF Graphs 100','Phase D'],
  ['CF','1396E','Distance Matching','Codeforces Round 663 (Div. 1)','2300','Tree + matching','Tree matching','CF Graphs 100','Phase D'],
  ['CF','1399E','Weights','Codeforces Round 665 (Div. 1)','2300','Dijkstra + LCA','Dijkstra LCA','CF Graphs 100','Phase D'],
  ['CF','1400F','x-prime Substrings','Codeforces Round 666 (Div. 1)','2400','Aho-Corasick + graph','String automaton','CF Graphs 100','Phase D'],
  ['CF','1404E','Bricks','Codeforces Round 666 (Div. 2)','2400','Flow + graph','Network flow','CF Graphs 100','Phase D'],
  ['CF','1408G','Clusterization Counting','Codeforces Round 668 (Div. 1)','2400','Clique + tree','Clique graph','CF Graphs 100','Phase D'],
  ['CF','1420F','Fruit Flies','Codeforces Round 672 (Div. 1)','2400','Graph + convex','Convex graph','CF Graphs 100','Phase D'],

  // ================================================================
  // 100 CF DP PROBLEMS (1600–2400, ordered by difficulty)
  // ================================================================
  ['CF','1353D','Constructing the Array','Codeforces Round 642 (Div. 1)','1600','Greedy DP','DP greedy','CF DP 100','Phase A'],
  ['CF','1328D','Carousel','Codeforces Round 630 (Div. 1)','1700','DP on array','Linear DP','CF DP 100','Phase A'],
  ['CF','1324E','Sleeping Schedule','Codeforces Round 628 (Div. 2)','1700','Linear DP','Simple DP','CF DP 100','Phase A'],
  ['CF','1359D','Yet Another Array Restoration','Codeforces Round 644 (Div. 1)','1700','DP + binary search','DP + BS','CF DP 100','Phase A'],
  ['CF','1365D','Solve The Maze','Codeforces Round 648 (Div. 2)','1700','DP + BFS','DP BFS','CF DP 100','Phase A'],
  ['CF','1373E','Sum of Cubes','Codeforces Round 653 (Div. 2)','1700','DP + math','DP math','CF DP 100','Phase A'],
  ['CF','1382C','Prefix Flip','Codeforces Round 655 (Div. 2)','1700','Constructive DP','Constructive','CF DP 100','Phase A'],
  ['CF','1383D','Forces of Nature','Codeforces Round 654 (Div. 1)','1700','DP + probability','Probability DP','CF DP 100','Phase A'],
  ['CF','1385D','a-Good String','Codeforces Round 655 (Div. 2)','1700','Divide and conquer DP','DC DP','CF DP 100','Phase A'],
  ['CF','1393D','Rarity and New Dress','Codeforces Round 661 (Div. 1)','1700','DP + hashing','DP hashing','CF DP 100','Phase A'],
  ['CF','1398D','Colored Rectangles','Codeforces Round 665 (Div. 2)','1700','DP on multisets','Multiset DP','CF DP 100','Phase A'],
  ['CF','1399D','Binary String to Subsequences','Codeforces Round 665 (Div. 2)','1700','Greedy DP','Greedy DP','CF DP 100','Phase A'],
  ['CF','1406D','Three Sequences','Codeforces Round 667 (Div. 2)','1700','DP on sequence','Sequence DP','CF DP 100','Phase A'],
  ['CF','1408D','Xenia and Colorful Gems','Codeforces Round 668 (Div. 2)','1700','DP + two pointers','DP 2P','CF DP 100','Phase A'],
  ['CF','1326D','Ternary String','Codeforces Round 628 (Div. 2)','1700','DP sliding window','Sliding window DP','CF DP 100','Phase A'],
  ['CF','1060C','Maximum Subrectangle','Codeforces Round 511 (Div. 2)','1800','2D DP','2D DP','CF DP 100','Phase B'],
  ['CF','1099D','Sum in the Tree','Codeforces Round 529 (Div. 2)','1800','Greedy tree DP','Tree greedy DP','CF DP 100','Phase B'],
  ['CF','1107E','Vasya and Binary String','Codeforces Round 536 (Div. 2)','1800','DP on string','String DP','CF DP 100','Phase B'],
  ['CF','1109D','Sasha and Interesting Fact','Codeforces Round 537 (Div. 2)','1800','DP counting','Counting DP','CF DP 100','Phase B'],
  ['CF','1118F','Cities','Codeforces Round 540 (Div. 3)','1800','DP on tree path','Path DP','CF DP 100','Phase B'],
  ['CF','1132E','Knapsack','Codeforces Round 541 (Div. 2)','1800','Knapsack DP','Knapsack','CF DP 100','Phase B'],
  ['CF','1139D','Differentely Increased Sequence','','1800','DP + math','DP math','CF DP 100','Phase B'],
  ['CF','1142D','Foreigner Labyrinth','','1800','DP on grid','Grid DP','CF DP 100','Phase B'],
  ['CF','1143D','The Beatles','','1800','DP + number theory','NT DP','CF DP 100','Phase B'],
  ['CF','1146D','Frog Jumps','','1800','DP greedy','Greedy DP','CF DP 100','Phase B'],
  ['CF','1156D','0-1-2 MST','Codeforces Round 551 (Div. 2)','1800','DP + counting','Counting DP','CF DP 100','Phase B'],
  ['CF','1159E','Permutation recovery','','1800','DP + segment tree','Seg tree DP','CF DP 100','Phase B'],
  ['CF','1166D','Cute graph','','1800','DP game theory','Game DP','CF DP 100','Phase B'],
  ['CF','1168C','And Reachability','','1800','Bitmask DP','Bitmask DP','CF DP 100','Phase B'],
  ['CF','1172E','Nauuo and Draw','Codeforces Round 558 (Div. 2)','1800','DP on cards','Combinatorial DP','CF DP 100','Phase B'],
  ['CF','1187D','Almost Increasing Sequence','Codeforces Round 570 (Div. 2)','1800','DP on subsequences','Subsequence DP','CF DP 100','Phase B'],
  ['CF','1196F','K-th Path','Codeforces Round 572 (Div. 1)','1800','DP + Dijkstra','Dijkstra DP','CF DP 100','Phase B'],
  ['CF','1206D','Shortest Cycle','Codeforces Round 581 (Div. 1)','1900','Girth + DP','Girth DP','CF DP 100','Phase B'],
  ['CF','1209E','Rotate Columns','Codeforces Round 579 (Div. 1)','1900','Bitmask DP','Bitmask DP hard','CF DP 100','Phase B'],
  ['CF','1214E','Petya and Exam','','1900','DP + binary search','BS DP','CF DP 100','Phase B'],
  ['CF','1216E','Competitive Programmer','','1900','DP + bitmask','Bitmask DP','CF DP 100','Phase B'],
  ['CF','1217F','Forced Online Queries','Codeforces Round 584 (Div. 1)','1900','Offline DP','Offline DP','CF DP 100','Phase B'],
  ['CF','1221F','Choose a Square','Codeforces Round 585 (Div. 1)','1900','DP + segment tree','Seg tree DP','CF DP 100','Phase B'],
  ['CF','1225D','Power Products','Codeforces Round 586 (Div. 1)','1900','DP + prime','Prime DP','CF DP 100','Phase B'],
  ['CF','1228F','One Tough Nut','','1900','DP competitive','Hard DP','CF DP 100','Phase B'],
  ['CF','1232G','Palindrome Partition','Codeforces Round 587 (Div. 1)','1900','Palindrome DP','Palindrome DP','CF DP 100','Phase B'],
  ['CF','1243F','The Largest Magic Square','Codeforces Round 591 (Div. 1)','1900','2D prefix DP','2D DP','CF DP 100','Phase B'],
  ['CF','1249E','By Elevator or Stairs?','Codeforces Round 596 (Div. 1)','1900','DP path','Path DP','CF DP 100','Phase B'],
  ['CF','1253F','Designer Tiles','Codeforces Round 597 (Div. 1)','2000','DP counting','Counting DP','CF DP 100','Phase C'],
  ['CF','1256F','Equalizing','Codeforces Round 598 (Div. 1)','2000','DP + frequency','Frequency DP','CF DP 100','Phase C'],
  ['CF','1263F','Economic Difficulties','Codeforces Round 600 (Div. 1)','2000','Tree DP complex','Complex tree DP','CF DP 100','Phase C'],
  ['CF','1270H','Number of Components','Codeforces Round 603 (Div. 1)','2000','DP + sweepline','Sweep DP','CF DP 100','Phase C'],
  ['CF','1272G','Lexicographically Smallest Permutation','','2000','DP + graph','Graph DP','CF DP 100','Phase C'],
  ['CF','1278F','Cards','Codeforces Round 606 (Div. 1)','2000','Expected value DP','Expected DP','CF DP 100','Phase C'],
  ['CF','1282E','The Cake Is a Lie','Codeforces Round 609 (Div. 1)','2000','DP + observation','Observation DP','CF DP 100','Phase C'],
  ['CF','1285F','Classical?','Codeforces Round 610 (Div. 1)','2000','DP + LCM','LCM DP','CF DP 100','Phase C'],
  ['CF','1290F','Making Shapes','Codeforces Round 614 (Div. 2)','2000','Digit DP','Digit DP','CF DP 100','Phase C'],
  ['CF','1292F','Nora\'s Toy Boxes','Codeforces Round 616 (Div. 1)','2000','Bitmask DP on sets','Set DP','CF DP 100','Phase C'],
  ['CF','1295F','Good Contest','Codeforces Round 617 (Div. 1)','2000','DP + Stirling','Stirling DP','CF DP 100','Phase C'],
  ['CF','1296E','String Coloring','Codeforces Round 618 (Div. 2)','2000','DP + graph coloring','Coloring DP','CF DP 100','Phase C'],
  ['CF','1303E','Erase Subsequences','Codeforces Round 620 (Div. 2)','2000','Bitmask DP','Bitmask advanced','CF DP 100','Phase C'],
  ['CF','1305F','Coupling Requests','Codeforces Round 621 (Div. 1)','2100','DP + matching','Matching DP','CF DP 100','Phase C'],
  ['CF','1307G','Cow and Exercise','Codeforces Round 622 (Div. 1)','2100','DP + flow','Flow DP','CF DP 100','Phase C'],
  ['CF','1310F','Loving Bacteria','Codeforces Round 623 (Div. 2)','2100','DP + game','Game DP','CF DP 100','Phase C'],
  ['CF','1315F','Geoguessr','Codeforces Round 625 (Div. 1)','2100','DP + hashing','Hash DP','CF DP 100','Phase C'],
  ['CF','1318F','Make It Increasing','Codeforces Round 626 (Div. 2)','2100','DP + LIS','LIS advanced','CF DP 100','Phase C'],
  ['CF','1321F','Ehab\'s Last Theorem','Codeforces Round 627 (Div. 1)','2100','DP + SCC','SCC DP','CF DP 100','Phase C'],
  ['CF','1325F','Ehab\'s Last Meal','Codeforces Round 629 (Div. 1)','2100','DP on segments','Segment DP','CF DP 100','Phase C'],
  ['CF','1330G','Spices','Codeforces Round 631 (Div. 1)','2100','DP + MST','MST DP','CF DP 100','Phase C'],
  ['CF','1333G','Underscores','Codeforces Round 632 (Div. 1)','2100','DP + construction','Construction DP','CF DP 100','Phase C'],
  ['CF','1338F','F – Phoenix and Memory','Codeforces Round 634 (Div. 2)','2100','DP + segment tree','Seg tree DP','CF DP 100','Phase C'],
  ['CF','1342F','Make It Increasing','Codeforces Round 636 (Div. 2)','2100','DP + coordinate compress','CC DP','CF DP 100','Phase C'],
  ['CF','1350G','Orac Visits Lime Trees','Codeforces Round 640 (Div. 1)','2100','Interval DP','Interval DP','CF DP 100','Phase C'],
  ['CF','1355G','Tiles','Codeforces Round 644 (Div. 2)','2100','DP + combinatorics','Combinatorial DP','CF DP 100','Phase C'],
  ['CF','1359F','RC Kaboom','Codeforces Round 644 (Div. 1)','2200','DP + geometry','Geometry DP','CF DP 100','Phase D'],
  ['CF','1363F','Rotating Substrings','Codeforces Round 647 (Div. 1)','2200','DP on strings','String DP advanced','CF DP 100','Phase D'],
  ['CF','1366G','Rooks Making Shuffles','Codeforces Round 649 (Div. 2)','2200','DP counting','Hard counting DP','CF DP 100','Phase D'],
  ['CF','1372F','Omkar and Landslide','Codeforces Round 652 (Div. 1)','2200','DP + convex hull trick','CHT DP','CF DP 100','Phase D'],
  ['CF','1375F','Integer Points','Codeforces Round 655 (Div. 1)','2200','DP + geometry','Geometric DP','CF DP 100','Phase D'],
  ['CF','1382F','Knapsack 2','Codeforces Round 655 (Div. 1)','2200','Knapsack hard','Knapsack hard','CF DP 100','Phase D'],
  ['CF','1388F','Apple Tree','Codeforces Round 659 (Div. 2)','2200','DP + tree','Tree DP hard','CF DP 100','Phase D'],
  ['CF','1393E','Pointing Lazerbeam','Codeforces Round 661 (Div. 2)','2200','DP + observation','Observation DP','CF DP 100','Phase D'],
  ['CF','1398G','Running Competition','Codeforces Round 665 (Div. 1)','2200','DP + FFT','FFT DP','CF DP 100','Phase D'],
  ['CF','1405G','Stones','Codeforces Round 667 (Div. 1)','2200','DP game','Game DP hard','CF DP 100','Phase D'],
  ['CF','1407G','Tasty Cookie','Codeforces Round 668 (Div. 2)','2300','DP + continued fraction','Continued frac DP','CF DP 100','Phase D'],
  ['CF','1415G','Bicycles','Codeforces Round 672 (Div. 2)','2300','DP + Dijkstra','Dijkstra DP hard','CF DP 100','Phase D'],
  ['CF','1418G','Three Occurrences','Codeforces Round 671 (Div. 1)','2300','DP + hashing','Hash DP hard','CF DP 100','Phase D'],
  ['CF','1422F','Boring Partition','Codeforces Round 673 (Div. 1)','2300','DP + segment','Segment DP','CF DP 100','Phase D'],
  ['CF','1427G','One-Dimensional Pigeons','Codeforces Round 676 (Div. 1)','2300','DP + combinatorics','Comb DP hard','CF DP 100','Phase D'],
  ['CF','1434G','Reverse and Swap','Codeforces Round 680 (Div. 1)','2300','DP + segment tree','Seg tree DP hard','CF DP 100','Phase D'],
  ['CF','1437G','Death DBMS','Codeforces Round 681 (Div. 2)','2300','DP + Aho-Corasick','AC DP','CF DP 100','Phase D'],
  ['CF','1442F','Adam\'s Task','Codeforces Round 683 (Div. 2)','2300','DP + bitset','Bitset DP','CF DP 100','Phase D'],
  ['CF','1444G','Tiles','Codeforces Round 684 (Div. 2)','2300','DP counting','Counting DP hard','CF DP 100','Phase D'],
  ['CF','1447H','Fantasy','Codeforces Round 685 (Div. 1)','2400','DP + segment tree','Seg tree DP 2400','CF DP 100','Phase D'],
  ['CF','1450G','Xor-ranges','Codeforces Round 687 (Div. 1)','2400','XOR DP','XOR DP hard','CF DP 100','Phase D'],
  ['CF','1453F','Even-Odd Game','Codeforces Round 688 (Div. 1)','2400','Game DP','Game theory DP','CF DP 100','Phase D'],
  ['CF','1455F','String and Operations','Codeforces Round 689 (Div. 1)','2400','String DP','String DP 2400','CF DP 100','Phase D'],
];

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
  await pool.query(`ALTER TABLE problems ADD COLUMN IF NOT EXISTS code TEXT DEFAULT '';`).catch(() => {});

  // Topic Notes table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS topic_notes (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      category VARCHAR(100) DEFAULT 'General',
      content TEXT DEFAULT '',
      color VARCHAR(20) DEFAULT 'blue',
      pinned BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log('DB ready');
}

// Sync: ensure DB has exactly ALL_PROBLEMS (by name+number combo, no duplicates)
async function syncProblems() {
  const { rows } = await pool.query('SELECT name, number, type FROM problems');
  const dbSet = new Set(rows.map(r => `${r.type}|${r.number}|${r.name}`));
  const scriptSet = new Set(ALL_PROBLEMS.map(p => `${p[0]}|${p[1]}|${p[2]}`));

  let added = 0;
  for (const p of ALL_PROBLEMS) {
    const key = `${p[0]}|${p[1]}|${p[2]}`;
    if (!dbSet.has(key)) {
      await pool.query(
        `INSERT INTO problems (type,number,name,contest,rating,topic,hft_relevance,category,phase) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        p
      );
      added++;
    }
  }

  const { rows: countRow } = await pool.query('SELECT COUNT(*) FROM problems');
  console.log(`DB sync: ${added} added. DB total: ${countRow[0].count}, Script total: ${ALL_PROBLEMS.length}`);
  if (parseInt(countRow[0].count) !== ALL_PROBLEMS.length) {
    console.warn(`⚠️  MISMATCH: DB has ${countRow[0].count} problems but script defines ${ALL_PROBLEMS.length}`);
  } else {
    console.log(`✅ DB in sync: ${countRow[0].count} problems`);
  }
}

// ============================================================
// ROUTES — Problems
// ============================================================
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

// Sync status endpoint
app.get('/api/sync-status', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM problems');
    res.json({ db_count: parseInt(rows[0].count), script_count: ALL_PROBLEMS.length, in_sync: parseInt(rows[0].count) === ALL_PROBLEMS.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ============================================================
// ROUTES — Topic Notes
// ============================================================
app.get('/api/notes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM topic_notes ORDER BY pinned DESC, updated_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/notes', async (req, res) => {
  const { title, category, content, color } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO topic_notes (title, category, content, color) VALUES ($1,$2,$3,$4) RETURNING *`,
      [title, category||'General', content||'', color||'blue']
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, category, content, color, pinned } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE topic_notes SET 
        title=COALESCE($1,title), 
        category=COALESCE($2,category), 
        content=COALESCE($3,content),
        color=COALESCE($4,color),
        pinned=COALESCE($5,pinned),
        updated_at=NOW() 
       WHERE id=$6 RETURNING *`,
      [title, category, content, color, pinned, id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM topic_notes WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

initDB().then(syncProblems).then(() => {
  app.listen(3000, () => console.log('HFT Tracker running on http://localhost:3000'));
});

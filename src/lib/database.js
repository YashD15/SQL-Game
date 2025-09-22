import Database from 'better-sqlite3';
import path from 'path';

let db = null;

export function getDatabase() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'game.db');
    db = new Database(dbPath);
    
    // Create tables and insert sample data
    initializeGameDatabase();
  }
  return db;
}

function initializeGameDatabase() {
  // Create table for exorcism game
  db.exec(`
    CREATE TABLE IF NOT EXISTS exorcism_items (
      id INTEGER PRIMARY KEY,
      item_name TEXT NOT NULL,
      item_type TEXT NOT NULL,
      ritual_day_used INTEGER,
      used_count INTEGER,
      offered_in_ritual INTEGER DEFAULT 0,   -- 0=false, 1=true
      burn_count INTEGER DEFAULT 0,
      location_used TEXT,
      ritual_use INTEGER DEFAULT 0,          -- 0=false, 1=true
      blessed INTEGER DEFAULT 0,             -- 0=false, 1=true
      used_with_mantra INTEGER DEFAULT 0,    -- 0=false, 1=true
      chant_count INTEGER DEFAULT 0,
      success_count INTEGER DEFAULT 0,
      always_held INTEGER DEFAULT 0,         -- 0=false, 1=true
      condition TEXT,
      scattered_location TEXT
    );
  `);

  const insertItems = db.prepare(`
    INSERT OR IGNORE INTO exorcism_items 
    (id, item_name, item_type, ritual_day_used, used_count, offered_in_ritual, burn_count, location_used, ritual_use, blessed, used_with_mantra, chant_count, success_count, always_held, condition, scattered_location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const items = [
    // --- Set 1 ---
    [1, 'Coconut', 'fruit', 1, 15, 1, 0, null, 1, 0, 0, 0, 0, 0, null, null],
    [2, 'Banana', 'fruit', 1, 10, 1, 0, null, 1, 0, 0, 0, 0, 0, null, null],
    [3, 'Mango', 'fruit', 2, 5, 1, 0, null, 1, 0, 0, 0, 0, 0, null, null],
    [4, 'Rosary', 'rosary', 1, 20, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [5, 'Tulsi Mala', 'rosary', 1, 10, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [6, 'Neem Leaf', 'leaf', 1, 0, 1, 30, null, 0, 0, 0, 0, 0, 0, null, null],
    [7, 'Peepal Leaf', 'leaf', 2, 0, 1, 15, null, 0, 0, 0, 0, 0, 0, null, null],
    [8, 'Holy Water', 'holy_water', 1, 0, 1, 0, 'altar', 0, 0, 0, 0, 0, 0, null, null],
    [9, 'Silver Thread', 'ornament', 3, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],

    // --- Set 2 ---
    [10, 'Lemon', 'fruit', 1, 0, 0, 0, null, 1, 0, 0, 0, 0, 0, null, null],
    [11, 'Orange', 'fruit', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [12, 'Mustard Oil', 'oil', 1, 0, 0, 0, 'circle', 0, 0, 0, 0, 0, 0, null, null],
    [13, 'Olive Oil', 'oil', 1, 0, 0, 0, 'altar', 0, 0, 0, 0, 0, 0, null, null],
    [14, 'Blessed Salt', 'sacramental', 1, 0, 0, 0, null, 0, 1, 1, 0, 0, 0, null, null],
    [15, 'Normal Salt', 'sacramental', 1, 0, 0, 0, null, 0, 0, 1, 0, 0, 0, null, null],
    [16, 'Cow Horn', 'animal', 2, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [17, 'Charcoal Dust', 'dust', 2, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],

    // --- Set 3 ---
    [18, 'Crow Bone', 'animal_product', 1, 0, 0, 0, 'altar', 0, 0, 0, 0, 0, 0, null, null],
    [19, 'Rudra Ashtak', 'mantra', 1, 0, 0, 0, null, 0, 0, 0, 3, 2, 0, null, null],
    [20, 'Traveler’s Crucifix', 'crucifix', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 1, null, null],
    [21, 'Clay Figurine', 'artifact', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [22, 'Fake Bell', 'ornament', 2, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],

    // --- Set 4 ---
    [23, 'Lemon', 'fruit', 1, 0, 0, 0, null, 1, 0, 0, 0, 0, 0, null, null],
    [24, 'Sandalwood Oil', 'oil', 1, 0, 0, 0, null, 0, 0, 1, 0, 0, 0, null, null],
    [25, 'Rusty Axe', 'tool', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, 'rusty', null],
    [26, 'Silver Knife', 'tool', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, 'sharp', null],
    [27, 'Mango Leaf', 'leaf', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],

    // --- Set 5 ---
    [28, 'Goat Horn', 'animal_product', 1, 0, 1, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [29, 'Pocket Crucifix', 'crucifix', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 1, null, null],
    [30, 'Mustard Oil', 'oil', 1, 0, 0, 0, 'circle', 0, 0, 0, 0, 0, 0, null, null],
    [31, 'Charcoal Dust', 'dust', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [32, 'Red Cloth', 'cloth', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],

    // --- Set 6 ---
    [33, 'Narasimha Kavach', 'mantra', 1, 0, 0, 0, null, 0, 0, 0, 1, 1, 0, null, null],
    [34, 'Broken Rosary', 'rosary', 1, null, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [35, 'Blessed Salt', 'sacramental', 1, 0, 0, 0, null, 0, 1, 1, 0, 0, 0, null, null],
    [36, 'Clay Idol', 'artifact', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [37, 'Garlic Paste', 'ingredient', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],

    // --- Set 7 ---
    [38, 'Tulsi Leaf', 'leaf', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null], // scattered_location IS NULL
    [39, 'Full Moon Robe', 'vestment', 15, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [40, 'Pomegranate', 'fruit', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null], // offered_in_ritual = 0
    [41, 'Wooden Beads', 'wooden', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [42, 'Cow Horn', 'animal', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null]
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) insertItems.run(...item);
  });

  insertMany(items);
}



//FUNCTION TO EXECUTE AND TEST QUERY
export function executeQuery(query) {
  try {
    const db = getDatabase();
    
    // Security: Only allow SELECT queries
    const trimmedQuery = query.trim().toUpperCase();
    if (!trimmedQuery.startsWith('SELECT')) {
      throw new Error('Only SELECT queries are allowed');
    }
    
    // Execute query
    const stmt = db.prepare(query);
    const result = stmt.all();
    
    return {
      success: true,
      data: result,
      columns: result.length > 0 ? Object.keys(result[0]) : []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
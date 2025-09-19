import Database from 'better-sqlite3';
import path from 'path';

let db = null;

export function getDatabase() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'game.db');
    db = new Database(dbPath);
    
    // Create tables and insert sample data
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  // Create sample tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      salary INTEGER NOT NULL,
      hire_date DATE NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      manager_id INTEGER,
      budget INTEGER NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      department_id INTEGER,
      start_date DATE,
      end_date DATE,
      FOREIGN KEY (department_id) REFERENCES departments(id)
    );
  `);
  
  // Insert sample data
  const insertEmployees = db.prepare(`
    INSERT OR IGNORE INTO employees (id, name, department, salary, hire_date) 
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const employees = [
    [1, 'John Doe', 'Engineering', 75000, '2020-01-15'],
    [2, 'Jane Smith', 'Marketing', 65000, '2019-03-20'],
    [3, 'Bob Johnson', 'Engineering', 80000, '2021-06-10'],
    [4, 'Alice Brown', 'HR', 55000, '2018-11-05'],
    [5, 'Charlie Wilson', 'Marketing', 70000, '2020-09-12']
  ];
  
  employees.forEach(emp => insertEmployees.run(...emp));
  
  // Similar for departments and projects...
  const insertDepartments = db.prepare(`
    INSERT OR IGNORE INTO departments (id, name, manager_id, budget) 
    VALUES (?, ?, ?, ?)
  `);
  
  const departments = [
    [1, 'Engineering', 1, 500000],
    [2, 'Marketing', 2, 200000],
    [3, 'HR', 4, 150000]
  ];
  
  departments.forEach(dept => insertDepartments.run(...dept));
}

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
import mysql from 'mysql2/promise';

let pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      // uri: process.env.DATABASE_URL,
      // Atau pakai individual config:
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

    pool.on('connection', (connection) => {
      console.log('New MySQL connection established');
    });
  }

  return pool;
}

export async function query(text, params = []) {
  const pool = getPool();
  const start = Date.now();
  
  try {
    // Convert PostgreSQL-style $1, $2 to MySQL-style ?
    const mysqlQuery = text.replace(/\$(\d+)/g, '?');
     
    const [rows] = await pool.execute(mysqlQuery, params);
    const duration = Date.now() - start;
    
    console.log('Executed query', { 
      text: mysqlQuery, 
      duration, 
      rows: Array.isArray(rows) ? rows.length : 1 
    });
    
    return { rows };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getConnection() {
  const pool = getPool();
  return await pool.getConnection();
}
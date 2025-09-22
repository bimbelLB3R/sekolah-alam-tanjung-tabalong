import mysql from "mysql2/promise";

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: process.env.NODE_ENV === "production" ? 50 : 20,
    queueLimit: 0,
  });
}

let pool;

if (!globalThis._mysqlPool) {
  globalThis._mysqlPool = createPool();
} else {
  try {
    await globalThis._mysqlPool.query("SELECT 1"); // test
  } catch (err) {
    if (err.message.includes("Pool is closed")) {
      globalThis._mysqlPool = createPool(); // re-init kalau sudah closed
    }
  }
}

pool = globalThis._mysqlPool;

export default pool;

// lib/db.js
import mysql from "mysql2/promise";

// Define config sebagai object terpisah
export const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: process.env.NODE_ENV === "production" ? 50 : 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000,
  charset: 'utf8mb4',
};

function createPool() {
  return mysql.createPool(poolConfig);
}

let pool;

// Initialize pool dengan async check
async function initPool() {
  if (!globalThis._mysqlPool) {
    globalThis._mysqlPool = createPool();
  } else {
    try {
      await globalThis._mysqlPool.query("SELECT 1");
    } catch (err) {
      if (err.message.includes("Pool is closed")) {
        globalThis._mysqlPool = createPool();
      }
    }
  }
  return globalThis._mysqlPool;
}

// Untuk sync access, langsung create jika belum ada
if (!globalThis._mysqlPool) {
  globalThis._mysqlPool = createPool();
}

pool = globalThis._mysqlPool;

export default pool;
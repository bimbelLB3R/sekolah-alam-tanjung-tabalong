// lib/db.js
import mysql from "mysql2/promise";

export const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  waitForConnections: true,

  // ✅ AMAN UNTUK VPS / VERCEL
  connectionLimit: process.env.NODE_ENV === "production" ? 10 : 5, //Jumlah pintu masuk DB

  // ✅ ANTRIAN DIBATASI BIAR TIDAK MAKAN RAM
  queueLimit: 50, //jumlah antrian maks per pintu masuk

  // ✅ SOCKET STABIL
  enableKeepAlive: true,
  keepAliveInitialDelay: 3000,

  connectTimeout: 10000,
  charset: "utf8mb4",
};

function createPool() {
  const pool = mysql.createPool(poolConfig);

  // ✅ LOG ERROR AGAR TIDAK DIAM-DIAM LEAK
  pool.on("error", (err) => {
    console.error("❌ MySQL Pool Error:", err);
  });

  return pool;
}

if (!globalThis._mysqlPool) {
  globalThis._mysqlPool = createPool();
}

const pool = globalThis._mysqlPool;

export default pool;

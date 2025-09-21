import mysql from "mysql2/promise";

// Ganti dengan konfigurasi Aurora AWS-mu
const pool = mysql.createPool({
  host: process.env.DB_HOST,      // endpoint Aurora
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,  // contoh: satt01
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
export default pool;

export async function getConnection() {
  const connection = await mysql.createConnection({
     host: process.env.DB_HOST,      // endpoint Aurora
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,  // contoh: satt01
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  });
  return connection;
}




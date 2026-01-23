// lib/queries.js
// Helper functions untuk execute query dengan error handling yang baik

import pool from '@/lib/db';

/**
 * Execute query dengan auto connection management
 * @param {string} query - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise<array>} Query results
 */
export async function executeQuery(query, params = []) {
  let connection;
  
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error('❌ Database Query Error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Execute query dengan retry logic untuk handle connection issues
 * @param {string} query - SQL query
 * @param {array} params - Query parameters
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<array>} Query results
 */
export async function executeQueryWithRetry(query, params = [], maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await executeQuery(query, params);
    } catch (error) {
      // Retry hanya untuk connection errors
      const isConnectionError = 
        error.code === 'ECONNREFUSED' || 
        error.code === 'ETIMEDOUT' ||
        error.code === 'PROTOCOL_CONNECTION_LOST';

      if (attempt === maxRetries || !isConnectionError) {
        throw error;
      }

      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.warn(`⚠️ Query failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Execute transaction
 * @param {Function} callback - Function that receives connection and performs queries
 * @returns {Promise<any>} Transaction result
 */
export async function executeTransaction(callback) {
  let connection;
  
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    const result = await callback(connection);
    
    await connection.commit();
    return result;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('❌ Transaction Error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Check database connection health
 * @returns {Promise<boolean>} Connection status
 */
export async function checkDatabaseHealth() {
  try {
    const results = await executeQuery('SELECT 1 as health');
    return results.length > 0 && results[0].health === 1;
  } catch (error) {
    console.error('❌ Database Health Check Failed:', error);
    return false;
  }
}
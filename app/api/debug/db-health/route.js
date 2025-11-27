// app/api/debug/db-health/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const startTime = Date.now();
  let connection;
  
  try {
    // Test 1: Simple query
    const queryStart = Date.now();
    const [rows] = await pool.query('SELECT 1 as test, NOW() as db_time');
    const queryTime = Date.now() - queryStart;
    
    // Test 2: Get connection
    const connStart = Date.now();
    connection = await pool.getConnection();
    const connectionTime = Date.now() - connStart;
    
    // Test 3: Database info
    const conn2Start = Date.now();
    const [result] = await connection.query('SELECT DATABASE() as db_name, VERSION() as db_version');
    const conn2Time = Date.now() - conn2Start;
    
    // Test 4: Posts table check
    const tableStart = Date.now();
    const [tableCheck] = await connection.query(
      "SELECT COUNT(*) as total FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'posts'"
    );
    const tableTime = Date.now() - tableStart;
    
    // Test 5: Posts count if table exists
    let postsCount = 0;
    let postsCountTime = 0;
    if (tableCheck[0].total === 1) {
      const countStart = Date.now();
      const [count] = await connection.query("SELECT COUNT(*) as total FROM posts");
      postsCount = count[0].total;
      postsCountTime = Date.now() - countStart;
    }
    
    const totalTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      performance: {
        totalTime: `${totalTime}ms`,
        breakdown: {
          simpleQuery: `${queryTime}ms`,
          getConnection: `${connectionTime}ms`,
          databaseInfo: `${conn2Time}ms`,
          tableCheck: `${tableTime}ms`,
          postsCount: `${postsCountTime}ms`,
        },
        evaluation: {
          simpleQuery: queryTime < 50 ? '✅ excellent' : queryTime < 100 ? '⚠️ fair' : '❌ slow',
          getConnection: connectionTime < 10 ? '✅ excellent' : connectionTime < 50 ? '⚠️ fair' : '❌ slow',
          overall: totalTime < 500 ? '✅ excellent' : totalTime < 1000 ? '⚠️ fair' : '❌ slow',
        }
      },
      database: {
        name: result[0].db_name,
        version: result[0].db_version,
        serverTime: rows[0].db_time,
        tables: {
          postsExists: tableCheck[0].total === 1,
          totalPosts: postsCount,
        }
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        dbHost: process.env.DB_HOST || 'not set',
        dbName: process.env.DB_NAME || 'not set',
      }
    });
    
  } catch (error) {
    const totalTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      performance: {
        failedAfter: `${totalTime}ms`,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
      }
    }, { status: 500 });
    
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// saya sudah ubah region di vercel ke singapura
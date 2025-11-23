import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import pool from '../db';

export async function getServerUser(request = null) {
  try {
    let token = null;

    // Try to get token from cookie first
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value;

    // If no cookie, try Authorization header (fallback)
    if (!token && request) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    console.log('🔍 Debug getServerUser:');
    console.log('- Token exists:', !!token);
    console.log('- Token value:', token ? token.substring(0, 20) + '...' : 'null');

    if (!token) {
      console.log('❌ No token found');
      return null;
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    console.log('✅ Token verified, payload:', payload);

    // Return user data dari JWT payload
    return {
      id: payload.id,
      name: payload.name,
      role_id: payload.role_id,
      role_name: payload.role_name,
    };
  } catch (error) {
    // Token invalid atau expired
    console.error('❌ getServerUser error:', error.message);
    console.error('Error code:', error.code);
    return null;
  }
}

// Optional: Jika butuh data user lengkap dari database
export async function getServerUserFull() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Query database untuk data lengkap
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role_id, r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [payload.id]
    );

    return rows[0] || null;
  } catch (error) {
    console.error('getServerUserFull error:', error.message);
    return null;
  }
}

// Helper untuk check role
export async function requireAuth(allowedRoles = []) {
  const user = await getServerUser();
  
  if (!user) {
    return { error: 'Unauthorized', status: 401 };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role_name)) {
    return { error: 'Forbidden', status: 403 };
  }
  
  return { user };
}
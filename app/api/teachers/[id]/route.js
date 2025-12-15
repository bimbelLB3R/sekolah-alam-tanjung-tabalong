import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } =await params;

    const query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.created_at,
        r.id as role_id,
        r.name as role_name,
        up.phone,
        up.address,
        up.city,
        up.province,
        up.postal_code,
        up.birth_date,
        up.birth_place,
        up.gender,
        up.photo,
        up.bio,
        up.education,
        up.specialization,
        up.experience_years,
        up.updated_at as profile_updated_at
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = ?
        AND (LOWER(r.name) = 'guru' OR LOWER(r.name) = 'manajemen')
      LIMIT 1
    `;

    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Guru tidak ditemukan'
      }, { status: 404 });
    }

    const row = rows[0];
    const teacher = {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_at,
      role: {
        id: row.role_id,
        name: row.role_name
      },
      profile: {
        phone: row.phone,
        address: row.address,
        city: row.city,
        province: row.province,
        postalCode: row.postal_code,
        birthDate: row.birth_date,
        birthPlace: row.birth_place,
        gender: row.gender,
        photo: row.photo,
        bio: row.bio,
        education: row.education,
        specialization: row.specialization,
        experienceYears: row.experience_years,
        updatedAt: row.profile_updated_at
      }
    };

    return NextResponse.json({
      success: true,
      data: teacher
    }, { status: 200 });

  } catch (error) {
    console.error('Database error:', error);
    
    return NextResponse.json({ 
      success: false,
      message: 'Gagal mengambil data guru',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
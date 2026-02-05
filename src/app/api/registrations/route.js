// app/api/registrations/route.js
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const {
      event_id,
      name,
      email,
      phone,
      company,
      custom_data  // optional, misal JSON { "pesan": "..." }
    } = await request.json();

    // Optional: validasi sederhana
    if (!event_id || !name || !email) {
      return Response.json({ error: 'Field wajib: event_id, name, email' }, { status: 400 });
    }

    const [result] = await pool.query(
      `INSERT INTO event_registrations (
        event_id, name, email, phone, company, custom_data
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        event_id,
        name,
        email,
        phone || null,
        company || null,
        custom_data ? JSON.stringify(custom_data) : null
      ]
    );

    return Response.json({
      success: true,
      message: 'Pendaftaran berhasil! Terima kasih.',
      registration_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return Response.json({ error: 'Email sudah terdaftar untuk event ini' }, { status: 409 });
    }
    return Response.json({ error: 'Gagal mendaftar, coba lagi nanti' }, { status: 500 });
  }
}
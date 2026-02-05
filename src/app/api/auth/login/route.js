import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND status = "active"',
      [email]
    );

    if (rows.length === 0) {
      return Response.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return Response.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const token = signToken(user);
    setAuthCookie(token);

    return Response.json({ success: true, user: { id: user.id, email: user.email, full_name: user.full_name } });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
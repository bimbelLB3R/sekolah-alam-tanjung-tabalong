import pool from "@/lib/db";
import crypto from "crypto";
import { sendEmail, resetPasswordTemplate } from "@/lib/email";

export async function POST(req) {
  const { email } = await req.json();

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  if (rows.length === 0) {
    return new Response(JSON.stringify({ message: "Email tidak ditemukan" }), { status: 404 });
  }

  const user = rows[0];
  const token = crypto.randomBytes(32).toString("hex");
  const expiredAt = new Date(Date.now() + 1000 * 60 * 60);

  await pool.query(
    "INSERT INTO password_reset_token (user_id, token, expired_at) VALUES (?, ?, ?)",
    [user.id, token, expiredAt]
  );

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  const html = resetPasswordTemplate({ name: user.name, link: resetLink });

  await sendEmail({
    to: email,
    subject: "Reset Password Akun Anda",
    html,
  });

  return Response.json({ message: "Cek email untuk link reset password" });
}

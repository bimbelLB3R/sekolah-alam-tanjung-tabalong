import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function resetPasswordTemplate({ name, link }) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body { font-family: Arial, sans-serif; background: #f9fafb; padding: 20px; }
      .container {
        max-width: 480px; 
        margin: auto; 
        background: white; 
        border-radius: 10px; 
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      h2 { color: #1e3a8a; }
      p { color: #374151; font-size: 14px; }
      a.button {
        display: inline-block;
        margin-top: 16px;
        padding: 12px 20px;
        background: #2563eb;
        color: white !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        margin-top: 20px;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Reset Password</h2>
      <p>Halo <strong>${name}</strong>,</p>
      <p>Kami menerima permintaan untuk reset password akun Anda. Silakan klik tombol di bawah untuk melanjutkan:</p>
      <a href="${link}" class="button">Reset Password</a>
      <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
      <div class="footer">
        © ${new Date().getFullYear()} SATT member of JSAN • Semua Hak Dilindungi
      </div>
    </div>
  </body>
  </html>
  `;
}

export async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Admin SATT" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email terkirim:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Gagal kirim email:", error);
    return { success: false, error };
  }
}

// Export template agar bisa dipakai di API
export { resetPasswordTemplate };

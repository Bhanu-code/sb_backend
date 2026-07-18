import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `${otp} is your Bandhan verification code`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #D4537E; margin-bottom: 8px;">Bandhan</h2>
        <p style="color: #888; margin-bottom: 32px;">Find your life partner</p>

        <p style="color: #1a1a1a; font-size: 16px;">
          Your verification code is:
        </p>

        <div style="
          background: #FBEAF0;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          margin: 24px 0;
        ">
          <span style="
            font-size: 40px;
            font-weight: 700;
            color: #D4537E;
            letter-spacing: 12px;
          ">${otp}</span>
        </div>

        <p style="color: #888; font-size: 14px;">
          This code expires in <strong>10 minutes</strong>.
          Do not share this with anyone.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />

        <p style="color: #bbb; font-size: 12px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
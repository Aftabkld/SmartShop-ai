// utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
  const {
    SMTP_SERVICE,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_EMAIL,
    SMTP_PASSWORD,
    SMTP_FROM_NAME,
  } = process.env;

  const transportOptions = SMTP_SERVICE
    ? { service: SMTP_SERVICE }
    : {
        host: SMTP_HOST || 'smtp.gmail.com',
        port: Number(SMTP_PORT) || 587,
        secure: SMTP_SECURE === 'true' || Number(SMTP_PORT) === 465,
      };

  const transporter = nodemailer.createTransport({
    ...transportOptions,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  const fromName = SMTP_FROM_NAME || 'SmartShop AI';

  const mailOptions = {
    from: `${fromName} <${SMTP_EMAIL}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;

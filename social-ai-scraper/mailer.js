// mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Sends an email alert to the specified recipient with a given message.
 *
 * @param {string} to - Recipient email address.
 * @param {string} message - The plain text message to be sent.
 */
export async function sendAlertEmail(to, message) {
  try {
    // Set up the email transport using Gmail and environment credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,       // Gmail address (e.g., yourbot@gmail.com)
        pass: process.env.EMAIL_PASS,       // Gmail App Password (not your login password)
      },
    });

    // Define the email content and send it
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: '🔥 Alert: Relevant Post Detected',
      text: message,
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

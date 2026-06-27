/**
 * BRODONAM — outbound email
 *
 * If SMTP_HOST is configured, uses nodemailer.
 * Otherwise, logs the message to stdout — perfect for dev, never silent.
 */

const nodemailer = require('nodemailer');
const log        = require('./logger');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || 'Brodonam <hello@brodonam.local>';
const APP_URL   = process.env.APP_URL || `http://localhost:${process.env.PORT || 3001}`;

let transporter = null;
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST, port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  log.info({ host: SMTP_HOST, port: SMTP_PORT }, 'SMTP configured');
} else {
  log.info('SMTP not configured — magic links will be printed to stdout (dev mode)');
}

async function sendMagicLink(email, token) {
  const url = `${APP_URL}/auth/verify?token=${token}`;

  const subject = 'Your sign-in link for Brodonam';
  const text = [
    `Hi,`,
    ``,
    `Click here to sign in to Brodonam:`,
    url,
    ``,
    `This link expires in 15 minutes and can only be used once. If you didn't request it, you can ignore this email.`,
    ``,
    `— Brodonam`,
  ].join('\n');

  const html = `
<div style="font-family:Inter,system-ui,sans-serif;font-weight:300;color:#1a1a20;max-width:480px;margin:40px auto;padding:0 24px">
  <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C09060;margin-bottom:24px">◆ Brodonam</div>
  <div style="font-size:16px;line-height:1.6;color:#33333a;margin-bottom:20px">Welcome back. Use the link below to sign in.</div>
  <a href="${url}" style="display:inline-block;padding:14px 28px;background:#1a1a20;color:#f4f0e8;text-decoration:none;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:24px">Sign in to Brodonam</a>
  <div style="font-size:12px;line-height:1.6;color:#888892;margin-bottom:8px">Or paste this into your browser:</div>
  <div style="font-size:11px;color:#aaaab2;word-break:break-all;margin-bottom:24px">${url}</div>
  <div style="font-size:11px;color:#aaaab2;line-height:1.6;border-top:1px solid #e8e8ec;padding-top:16px">
    This link expires in 15 minutes and can only be used once. If you didn't request it, you can safely ignore this email.
  </div>
</div>`;

  if (!transporter) {
    log.info({ to: email, link: url }, 'MAGIC LINK (dev mode)');
    return { delivered: 'console' };
  }

  await transporter.sendMail({ from: SMTP_FROM, to: email, subject, text, html });
  return { delivered: 'smtp' };
}

module.exports = { sendMagicLink };

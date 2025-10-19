import nodemailer from 'nodemailer';
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from '@/lib/nodemailer/templates';

const { NODEMAILER_EMAIL, NODEMAILER_PASSWORD } = process.env;

if (!NODEMAILER_EMAIL || !NODEMAILER_PASSWORD) {
  throw new Error('NODEMAILER_EMAIL and NODEMAILER_PASSWORD must be set');
}

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
});

const htmlEscape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replaceAll('{{name}}', htmlEscape(name)).replaceAll('{{intro}}', intro);

  const mailOptions = {
    from: `"Signalix" <${NODEMAILER_EMAIL}>`,
    to: email,
    subject: `Welcome to Signalix - your stock market toolkit is ready!`,
    text: 'Thanks for joining Signalix',
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export const sendNewsSummaryEmail = async ({
  email,
  date,
  newsContent,
}: {
  email: string;
  date: string;
  newsContent: string;
}): Promise<void> => {
  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace('{{date}}', date).replace('{{newsContent}}', newsContent);

  const mailOptions = {
    from: `"Signalist News" <signalist@jsmastery.pro>`,
    to: email,
    subject: `📈 Market News Summary Today - ${date}`,
    text: `Today's market news summary from Signalist`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

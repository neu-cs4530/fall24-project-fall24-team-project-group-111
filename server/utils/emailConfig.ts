import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const { GMAIL_USER, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = process.env;

let factoryTransporter: nodemailer.Transporter | null = null;

/**
 * Creates a new transporter instance for sending emails.
 *
 * @returns {Promise<nodemailer.Transporter>} - The created transporter instance.
 */
const createTransporter = async (): Promise<nodemailer.Transporter> => {
  if (!GMAIL_USER || !GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    throw new Error('Missing required environment variable(s) for email configuration');
  }

  const oAuth2Client = new google.auth.OAuth2(
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground',
  );

  oAuth2Client.setCredentials({
    refresh_token: GMAIL_REFRESH_TOKEN,
  });

  const accessToken = await oAuth2Client.getAccessToken();
  if (!accessToken.token) {
    throw new Error('Failed to obtain access token');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: GMAIL_USER,
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  return transporter;
};

/**
 * Returns the transporter instance for sending emails by creating a new one if it doesn't exist.
 *
 * @returns {Promise<nodemailer.Transporter>} - The created or existing transporter instance.
 */
const getTransporter = async (): Promise<nodemailer.Transporter> => {
  if (!factoryTransporter) {
    factoryTransporter = await createTransporter();
  }
  return factoryTransporter;
};

/**
 * Sends an email to the specified recipient.
 *
 * @param {string} to - The email address of the recipient.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The text content of the email.
 *
 * @returns {Promise<nodemailer.SentMessageInfo>} - The result of the email sending operation.
 */
const sendMail = async (
  to: string,
  subject: string,
  text: string,
): Promise<nodemailer.SentMessageInfo> => {
  try {
    const transporter = await getTransporter();
    const sentEmailInfo = await transporter.sendMail({
      from: GMAIL_USER,
      to,
      subject,
      text,
    });
    return sentEmailInfo;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error sending email: ${error.message}`);
    }
    throw new Error('Error sending email');
  }
};

export default sendMail;

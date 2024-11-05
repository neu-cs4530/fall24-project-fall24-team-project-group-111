import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const { GMAIL_USER, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, CLIENT_URL } =
  process.env;

// Create a new OAuth2 client using credentials from the GCP project
const oAuth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  CLIENT_URL, // Redirect URL
);

oAuth2Client.setCredentials({
  refresh_token: GMAIL_REFRESH_TOKEN,
});

// Initialize the transporter in an immediately invoked async function
let transporter: nodemailer.Transporter;
(async () => {
  const accessToken = await oAuth2Client.getAccessToken();

  transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: GMAIL_USER,
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  } as nodemailer.TransportOptions);
})();

/**
 * Sends an email to the specified recipient.
 *
 * @param to The email address of the recipient.
 * @param subject The subject of the email.
 * @param text The text content of the email.
 */
const sendMail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: GMAIL_USER,
    to,
    subject,
    text,
  });
};

export default sendMail;

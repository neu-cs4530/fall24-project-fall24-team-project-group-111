import express, { Response } from 'express';
import { google } from 'googleapis';
import { GoogleOAuthCallbackRequest } from '../types';

const googleAuthController = () => {
  const router = express.Router();

  const handleGoogleOAuthCallback = async (
    req: GoogleOAuthCallbackRequest,
    res: Response,
  ): Promise<void> => {
    const { code } = req.query;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URI,
    );

    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
      });

      const { data } = await oauth2.userinfo.get();

      // Handle user data (e.g., create or update user in your database)
      // Example:
      // const user = await User.findOrCreate({ googleId: data.id, ... });

      res.redirect('/home'); // Redirect to your home page or wherever you want
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error during Google OAuth callback:', err);
      // res.status(500).send('Internal Server Error');
    }
  };

  router.get('/auth/google/callback', handleGoogleOAuthCallback);
  return router;
};

export default googleAuthController;

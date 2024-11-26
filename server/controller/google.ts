import express, { Response } from 'express';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { GoogleOAuthCallbackRequest } from '../types';
import { findOrSaveGoogleUser } from '../models/userOperations';

const googleAuthController = (JWT_SECRET: string) => {
  const router = express.Router();

  const handleGoogleOAuthCallback = async (
    req: GoogleOAuthCallbackRequest,
    res: Response,
  ): Promise<void> => {
    if (!req.query.code) {
      res.status(400).send('Invalid request');
      return;
    }
    const { code } = req.query;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      `${process.env.CLIENT_URL}/auth/google/callback`,
    );

    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
      });

      const { data } = await oauth2.userinfo.get();
      if (!data || !data.id || !data.email) {
        throw new Error('Invalid Google OAuth response');
      }

      const googleUserFromDb = await findOrSaveGoogleUser(data.id, data.email);
      if ('error' in googleUserFromDb) {
        throw new Error(googleUserFromDb.error);
      }
      const token = jwt.sign({ userId: googleUserFromDb._id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Authentication with Google successful', token, user: googleUserFromDb });
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  };

  router.get('/auth/google/callback', handleGoogleOAuthCallback);
  return router;
};

export default googleAuthController;

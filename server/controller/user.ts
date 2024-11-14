import express, { Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  User,
  EmailVerificationRequest,
  AddUserRequest,
  LoginUserRequest,
  SendPasswordResetRequest,
  ResetPasswordRequest,
  UpdateThemeRequest,
  FakeSOSocket,
  UpdateFontRequest,
  UpdateLineSpacingRequest,
  UpdateTextBoldnessRequest,
  UpdateTextSizeRequest,
} from '../types';
import {
  sendEmailVerification,
  saveUser,
  loginUser,
  sendPasswordReset,
  resetPassword,
  changeTheme,
  changeFont,
  changeLineSpacing,
  changeTextBoldness,
  changeTextSize,
} from '../models/userOperations';
import UserModel from '../models/users';
import { app } from '../app';

const userController = (socket: FakeSOSocket, JWT_SECRET: string) => {
  const router = express.Router();

  /**
   * Validates the user object to ensure it contains all the necessary fields.
   *
   * @param user The user object to validate.
   *
   * @returns `true` if the user is valid, otherwise `false`.
   */
  const isUserBodyValid = (user: User): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      user.username !== undefined &&
      user.username !== '' &&
      user.email !== undefined &&
      emailRegex.test(user.email) &&
      user.password !== undefined &&
      user.password !== '' &&
      user.creationDateTime !== undefined &&
      user.creationDateTime !== null
    );
  };

  /**
   * Handles sending a new user an email verification.
   * If the user is invalid or sending the email verification fails, the HTTP response status is updated.
   *
   * @param req The EmailVerificationRequest object containing the user data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const emailVerificationRoute = async (
    req: EmailVerificationRequest,
    res: Response,
  ): Promise<void> => {
    if (!isUserBodyValid(req.body)) {
      res.status(400).send('Invalid request');
      return;
    }
    const user: User = req.body;

    try {
      const result = await sendEmailVerification(user);
      if ('error' in result) {
        if (result.error === 'Username is already taken') {
          res.status(409).send(result.error);
          return;
        }
        throw new Error(result.error);
      }
      res.json({
        message: 'Email verification successfully sent',
        emailRecipient: result.emailRecipient,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when sending email verification: ${err.message}`);
      } else {
        res.status(500).send(`Error when sending email verification`);
      }
    }
  };

  /**
   * Handles adding a new user. The user is saved and a JWT token is generated.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The AddUserRequest object containing the query parameter `token`.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addUserRoute = async (req: AddUserRequest, res: Response): Promise<void> => {
    if (!req.body.token) {
      res.status(400).send('Invalid request');
      return;
    }
    const { token } = req.body;

    try {
      const userFromDb = await saveUser(token);
      if ('error' in userFromDb) {
        if (userFromDb.error === 'Username is already taken') {
          res.status(409).send(userFromDb.error);
          return;
        }
        if (userFromDb.error === 'Email verification token is invalid or has expired') {
          res.status(400).send(userFromDb.error);
          return;
        }
        throw new Error(userFromDb.error);
      }
      const jwtToken = jwt.sign({ userId: userFromDb._id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token: jwtToken, user: userFromDb });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving user: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving user`);
      }
    }
  };

  /**
   * Handles logging in a user. The user is first authenticated and then a token is generated.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The LoginUserRequest object containing the query parameters `username` and `password`.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const loginUserRoute = async (req: LoginUserRequest, res: Response): Promise<void> => {
    if (!req.body.username || !req.body.password) {
      res.status(400).send('Invalid request');
      return;
    }
    const { username, password } = req.body;

    try {
      const userFromDb = await loginUser(username, password);
      if ('error' in userFromDb) {
        if (
          userFromDb.error === 'Username does not exist' ||
          userFromDb.error === 'Incorrect password'
        ) {
          res.status(401).send(userFromDb.error);
          return;
        }
        throw new Error(userFromDb.error);
      }
      const token = jwt.sign({ userId: userFromDb._id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token, user: userFromDb });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when logging in: ${err.message}`);
      } else {
        res.status(500).send(`Error when logging in`);
      }
    }
  };

  /**
   * Handles sending a password reset request for a user.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The SendPasswordResetRequest object containing the query parameter `username`.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const sendPasswordResetRoute = async (
    req: SendPasswordResetRequest,
    res: Response,
  ): Promise<void> => {
    if (!req.body.username) {
      res.status(400).send('Invalid request');
      return;
    }
    const { username } = req.body;

    try {
      const result = await sendPasswordReset(username);
      if ('error' in result) {
        if (result.error === 'Username does not exist') {
          res.status(404).send(result.error);
          return;
        }
        throw new Error(result.error);
      }
      res.json({
        message: 'Password reset email successfully sent',
        emailRecipient: result.emailRecipient,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when sending password reset: ${err.message}`);
      } else {
        res.status(500).send(`Error when sending password reset`);
      }
    }
  };

  /**
   * Handles resetting a user's password.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The ResetPasswordRequest object containing the query parameters `token` and `newPassword`.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const resetPasswordRoute = async (req: ResetPasswordRequest, res: Response): Promise<void> => {
    if (!req.body.token || !req.body.newPassword) {
      res.status(400).send('Invalid request');
      return;
    }
    const { token, newPassword } = req.body;

    try {
      const userFromDb = await resetPassword(token, newPassword);
      if ('error' in userFromDb) {
        if (userFromDb.error === 'Password reset token is invalid or has expired') {
          res.status(401).send(userFromDb.error);
          return;
        }
        throw new Error(userFromDb.error);
      }
      res.json({ message: 'Password reset successfully', user: userFromDb });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when resetting password: ${err.message}`);
      } else {
        res.status(500).send(`Error when resetting password`);
      }
    }
  };

  /**
   * Handles changing the saved theme of the currently logged in user. If successful, the most
   * recently saved theme will be accessed when logged back in.
   *
   * @param req The UpdateThemeRequest object containing the query parameters `username` and `theme`.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const changeThemeRoute = async (req: UpdateThemeRequest, res: Response): Promise<void> => {
    if (!req.body.username || !req.body.theme) {
      res.status(400).send('Invalid request');
      return;
    }
    const { username, theme } = req.body;

    try {
      const userFromDb = await changeTheme(username, theme);
      if ('error' in userFromDb) {
        throw new Error(userFromDb.error);
      }
      res.json({ message: 'Theme update successful', user: userFromDb });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when updating theme: ${err.message}`);
      } else {
        res.status(500).send(`Error when updating theme`);
      }
    }
  };

  /**
   * Handles changing the font style of the currently logged in user. If successful, the most
   * recently saved font style will be accessed when logged back in.
   *
   * @param req The UpdateFontRequest object containing the query parameters `username` and `font`.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const changeFontRoute = async (req: UpdateFontRequest, res: Response): Promise<void> => {
    if (!req.body.username || !req.body.font) {
      res.status(400).send('Invalid request');
      return;
    }
    const { username, font } = req.body;

    try {
      const userFromDb = await changeFont(username, font);
      if ('error' in userFromDb) {
        throw new Error(userFromDb.error);
      }
      res.json({ message: 'Font update successful', user: userFromDb });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when updating font: ${err.message}`);
      } else {
        res.status(500).send(`Error when updating font`);
      }
    }
  };

  /**
   * Handles changing the text size of the currently logged in user. If successful, the most
   * recently saved text size will be accessed when logged back in.
   *
   * @param req The UpdateTextSizeRequest object containing the query parameters `username` and `textSize`.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const changeTextSizeRoute = async (req: UpdateTextSizeRequest, res: Response): Promise<void> => {
    if (!req.body.username || !req.body.textSize) {
      res.status(400).send('Invalid request');
      return;
    }
    const { username, textSize } = req.body;

    try {
      const userFromDb = await changeTextSize(username, textSize);
      if ('error' in userFromDb) {
        throw new Error(userFromDb.error);
      }
      res.json({ message: 'Text size update successful', user: userFromDb });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when updating text size: ${err.message}`);
      } else {
        res.status(500).send(`Error when updating text size`);
      }
    }
  };

  /**
   * Handles changing the text boldness of the currently logged in user. If successful, the most
   * recently saved text boldness will be accessed when logged back in.
   *
   * @param req The UpdateTextBoldnessRequest object containing the query parameters `username` and `textBoldness`.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const changeTextBoldnessRoute = async (
    req: UpdateTextBoldnessRequest,
    res: Response,
  ): Promise<void> => {
    if (!req.body.username || !req.body.textBoldness) {
      res.status(400).send('Invalid request');
      return;
    }
    const { username, textBoldness } = req.body;

    try {
      const userFromDb = await changeTextBoldness(username, textBoldness);
      if ('error' in userFromDb) {
        throw new Error(userFromDb.error);
      }
      res.json({ message: 'Text boldness update successful', user: userFromDb });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when updating text boldness: ${err.message}`);
      } else {
        res.status(500).send(`Error when updating text boldness`);
      }
    }
  };

  /**
   * Handles changing the line spacing of the currently logged in user. If successful, the most
   * recently saved line spacing will be accessed when logged back in.
   *
   * @param req The UpdateLineSpacingRequest object containing the query parameters `username` and `lineSpacing`.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const changeLineSpacingRoute = async (
    req: UpdateLineSpacingRequest,
    res: Response,
  ): Promise<void> => {
    if (!req.body.username || !req.body.lineSpacing) {
      res.status(400).send('Invalid request');
      return;
    }
    const { username, lineSpacing } = req.body;

    try {
      const userFromDb = await changeLineSpacing(username, lineSpacing);
      if ('error' in userFromDb) {
        throw new Error(userFromDb.error);
      }
      res.json({ message: 'Line spacing update successful', user: userFromDb });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when updating line spacing: ${err.message}`);
      } else {
        res.status(500).send(`Error when updating line spacing`);
      }
    }
  };

  /**
 * Handles retrieving the settings of the currently logged in user.
 * If the user doesn't exist or there is an error, a proper response is returned.
 *
 * @param req The request object containing the `username` in the query.
 * @param res The HTTP response object used to send back the result of the operation.
 *
 * @returns A Promise that resolves to the user's settings or an error message.
 */
  const getUserSettings = async (req: AddUserRequest, res: Response): Promise<void> => {
  const { username } = req.params;  // Retrieve username from the URL parameters

  if (!username) {
    res.status(400).send('Username is required');
    return;
  }

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    res.json({ settings: user.settings });
  } catch (error) {
    res.status(500).send('Error retrieving user settings');
  }
};

  router.post('/emailVerification', emailVerificationRoute);
  router.post('/addUser', addUserRoute);
  router.post('/loginUser', loginUserRoute);
  router.post('/sendPasswordReset', sendPasswordResetRoute);
  router.post('/resetPassword', resetPasswordRoute);
  router.post('/changeTheme', changeThemeRoute);
  router.post('/changeFont', changeFontRoute);
  router.post('/changeTextSize', changeTextSizeRoute);
  router.post('/changeTextBoldness', changeTextBoldnessRoute);
  router.post('/changeLineSpacing', changeLineSpacingRoute);

  app.get('/getUserSettings/:username', getUserSettings);
  
  return router;
};

export default userController;

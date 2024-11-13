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
} from '../types';
import {
  sendEmailVerification,
  saveUser,
  loginUser,
  sendPasswordReset,
  resetPassword,
  changeTheme,
} from '../models/userOperations';

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

  router.post('/emailVerification', emailVerificationRoute);
  router.post('/addUser', addUserRoute);
  router.post('/loginUser', loginUserRoute);
  router.post('/sendPasswordReset', sendPasswordResetRoute);
  router.post('/resetPassword', resetPasswordRoute);
  router.post('/changeTheme', changeThemeRoute);

  return router;
};

export default userController;

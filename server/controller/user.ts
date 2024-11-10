import express, { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, AddUserRequest, LoginUserRequest, FakeSOSocket, UpdateThemeRequest } from '../types';
import { saveUser, loginUser, changeTheme } from '../models/userOperations';

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
   * Handles adding a new user. The user is first validated and then saved, with a token generated.
   * If the user is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The AddUserRequest object containing the user data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addUserRoute = async (req: AddUserRequest, res: Response): Promise<void> => {
    if (!isUserBodyValid(req.body)) {
      res.status(400).send('Invalid user body');
      return;
    }
    const user: User = req.body;

    try {
      const userFromDb = await saveUser(user);
      if ('error' in userFromDb) {
        if (userFromDb.error === 'Username is already taken') {
          res.status(409).send(userFromDb.error);
          return;
        }
        throw new Error(userFromDb.error);
      }
      const token = jwt.sign({ userId: userFromDb._id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token });
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

  router.post('/addUser', addUserRoute);
  router.post('/loginUser', loginUserRoute);
  router.post('/changeTheme', changeThemeRoute);

  return router;
};

export default userController;

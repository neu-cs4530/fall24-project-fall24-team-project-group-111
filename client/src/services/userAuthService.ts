import { User } from '../types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Function to add a new user, returning a JWT.
 *
 * @param user - The User object to add.
 * @throws Error if there is an issue creating the new user.
 */
const addUser = async (user: User): Promise<{ message: string; token: string }> => {
  const res = await api.post(`${USER_API_URL}/addUser`, user);

  if (res.status !== 200) {
    const errorMessage = res.data?.message || 'Error while creating a new user';
    throw new Error(errorMessage);
  }

  return res.data;
};

/**
 * Function to login a user, returning a JWT.
 *
 * @param username - The username of the user.
 * @param password - The password of the user.
 * @throws Error if there is an issue logging in the user.
 */
const loginUser = async (
  username: string,
  password: string,
): Promise<{ message: string; token: string; user: User }> => {
  const res = await api.post(`${USER_API_URL}/loginUser`, { username, password });

  if (res.status !== 200) {
    const errorMessage = res.data?.message || 'Error when logging in user';
    throw new Error(errorMessage);
  }

  return res.data;
};

/**
 * Function to change a user's theme.
 *
 * @param username - the username of the person editing their settings
 * @param theme - the theme to change to
 * @throws Error if there is an issue changing theme
 */
const changeTheme = async (username: string, theme: string) => {
  const data = { username, theme };
  const res = await api.post(`${USER_API_URL}/changeTheme`, data);
  if (res.status !== 200) {
    throw new Error('Error while changing theme');
  }
  return res.data;
};

export { addUser, loginUser, changeTheme };

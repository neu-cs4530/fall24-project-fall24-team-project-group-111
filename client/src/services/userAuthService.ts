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
 * Function to send a password reset email, returning the recipient email address.
 *
 * @param username - The username of the user to sent the password reset email to.
 * @throws Error if there is an issue sending the password reset email.
 */
const sendPasswordReset = async (
  username: string,
): Promise<{ message: string; emailRecipient: string }> => {
  const res = await api.post(`${USER_API_URL}/sendPasswordReset`, { username });

  if (res.status !== 200) {
    const errorMessage = res.data?.message || 'Error sending password reset email';
    throw new Error(errorMessage);
  }

  return res.data;
};

/**
 * Function to reset a user's password, returning the updated user.
 *
 * @param token - The token used to determine which user to reset the password for.
 * @param newPassword - The new password to set.
 * @throws Error if there is an issue resetting the password.
 */
const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<{ message: string; user: User }> => {
  const res = await api.post(`${USER_API_URL}/resetPassword`, { token, newPassword });

  if (res.status !== 200) {
    const errorMessage = res.data?.message || 'Error sending password reset email';
    throw new Error(errorMessage);
  }

  return res.data;
};

export { addUser, loginUser, sendPasswordReset, resetPassword };

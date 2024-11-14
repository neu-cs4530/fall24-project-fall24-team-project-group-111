import { FontType, LineSpacingType, TextBoldnessType, TextSizeType, User } from '../types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Function to send an email verification to a new user, returning the recipient email address.
 *
 * @param user - The user to send the email verification to.
 * @throws Error if there is an issue sending the email verification.
 */
const sendEmailVerification = async (
  user: User,
): Promise<{ message: string; emailRecipient: string }> => {
  const res = await api.post(`${USER_API_URL}/emailVerification`, user);

  if (res.status !== 200) {
    const errorMessage = res.data?.message || 'Error while sending an email verification';
    throw new Error(errorMessage);
  }

  return res.data;
};

/**
 * Function to add a new user, returning a JWT.
 *
 * @param token - The token used to determine which user to create.
 * @throws Error if there is an issue creating the new user.
 */
const addUser = async (token: string): Promise<{ message: string; token: string; user: User }> => {
  const res = await api.post(`${USER_API_URL}/addUser`, { token });

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

/**
 * Updates the text size setting for a specific user.
 *
 * @param username - The username of the user whose text size is being updated.
 * @param textSize - The new text size to be set.
 * @throws Error if the backend update fails.
 */
const changeTextSize = async (username: string, textSize: TextSizeType) => {
  const data = { username, textSize };
  const res = await api.post(`${USER_API_URL}/changeTextSize`, { username, textSize });
  if (res.status !== 200) {
    throw new Error('Error while updating text size');
  }
};

/**
 * Updates the text boldness setting for a specific user.
 *
 * @param username - The username of the user whose text boldness is being updated.
 * @param textBoldness - The new text boldness to be set.
 * @throws Error if the backend update fails.
 */
const changeTextBoldness = async (username: string, textBoldness: TextBoldnessType) => {
  const data = { username, textBoldness };
  const res = await api.post(`${USER_API_URL}/changeTextBoldness`, data);
  if (res.status !== 200) {
    throw new Error('Error while updating text boldness');
  }
};

/**
 * Updates the font style setting for a specific user.
 *
 * @param username - The username of the user whose font style is being updated.
 * @param font - The new font style to be set.
 * @throws Error if the backend update fails.
 */
const changeFont = async (username: string, font: FontType) => {
  const data = { username, font };
  const res = await api.post(`${USER_API_URL}/changeFont`, data);
  if (res.status !== 200) {
    throw new Error('Error while updating font style');
  }
};

/**
 * Updates the line spacing setting for a specific user.
 *
 * @param username - The username of the user whose line spacing is being updated.
 * @param lineSpacing - The new line spacing to be set.
 * @throws Error if the backend update fails.
 */
const changeLineSpacing = async (username: string, lineSpacing: LineSpacingType) => {
  const data = { username, lineSpacing };
  const res = await api.post(`${USER_API_URL}/changeLineSpacing`, data);
  if (res.status !== 200) {
    throw new Error('Error while updating line spacing');
  }
};

export {
  sendEmailVerification,
  addUser,
  loginUser,
  sendPasswordReset,
  resetPassword,
  changeTheme,
  changeTextSize,
  changeTextBoldness,
  changeFont,
  changeLineSpacing,
};

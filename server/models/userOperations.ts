import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { MongoServerError } from 'mongodb';
import UserModel from './users';
import UnverifiedUserModel from './unverifiedUsers';
import { User, UserResponse, EmailResponse, UnverifiedUser } from '../types';
import sendMail from '../utils/emailConfig';

/**
 * Hashes a password using bcrypt.
 *
 * @param {string} password - The password to hash.
 *
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Checks if the error is a duplicate key error.
 *
 * @param {unknown} error - The error to check.
 *
 * @returns {boolean} `true` if the error is a duplicate key error, otherwise `false`.
 */
function isMongoDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as MongoServerError).code === 11000
  );
}

/**
 * Sends an email verification to a new user.
 *
 * @param {User} user - The user requesting to be verified.
 *
 * @returns {Promise<EmailResponse>} - The email address that the email verification was sent to, or an error message if the operation failed.
 */
export const sendEmailVerification = async (user: User): Promise<EmailResponse> => {
  try {
    const existingUser = await UserModel.findOne({ username: user.username });
    if (existingUser) {
      return { error: 'Username is already taken' };
    }

    const emailRecipient = user.email;
    const hashedPassword = await hashPassword(user.password); // Hash the password before saving the unverified user
    const emailVerificationToken = crypto.randomBytes(20).toString('hex');
    const unverifiedUser: UnverifiedUser = {
      ...user,
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationExpires: new Date(Date.now() + 86400000), // expires in 24 hours
    };
    await UnverifiedUserModel.create(unverifiedUser);

    await sendMail(
      emailRecipient,
      'Activate your CodeFlow Account',
      `Thank you for signing up for CodeFlow! Use this token to verify your email: ${emailVerificationToken}\n
This token will expire in 24 hours. If you did not sign up for a CodeFlow account, you can safely ignore this email.`,
    );
    return { emailRecipient };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Error sending email verification' };
  }
};

/**
 * Saves a new user in the database.
 *
 * @param {string} token - The token used to verify the user.
 *
 * @returns {Promise<UserResponse>} - The saved user, or an error message if the save failed
 */
export const saveUser = async (token: string): Promise<UserResponse> => {
  try {
    const unverifiedUser = await UnverifiedUserModel.findOneAndDelete({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });
    if (!unverifiedUser) {
      return { error: 'Email verification token is invalid or has expired' };
    }

    const newUser: User = {
      username: unverifiedUser.username,
      email: unverifiedUser.email,
      password: unverifiedUser.password,
      creationDateTime: unverifiedUser.creationDateTime,
      settings: {
        theme: 'LightMode',
        textSize: 'medium',
        textBoldness: 'normal',
        font: 'Arial',
        lineSpacing: '1',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        buttonColor: '#5c0707',
      },
    };
    const result = await UserModel.create(newUser);
    return result;
  } catch (error) {
    if (isMongoDuplicateKeyError(error)) {
      return { error: 'Username is already taken' };
    }
    return { error: 'Error when creating a user' };
  }
};

/**
 * Attempts to log into an existing user in the database.
 *
 * @param {string} username - The username of the user to log in.
 * @param {string} password - The password to compare.
 *
 * @returns {Promise<UserResponse>} - The authenticated user, or an error message if the authentication failed
 */
export const loginUser = async (username: string, password: string): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return { error: 'Username does not exist' };
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { error: 'Incorrect password' };
    }
    return user;
  } catch (error) {
    return { error: 'Error logging in user' };
  }
};

/**
 * Sends an email for a user to reset their password.
 *
 * @param {string} username - The username of the user.
 *
 * @returns {Promise<EmailResponse>} - The email address that the password reset was sent to, or an error message if the operation failed.
 */
export const sendPasswordReset = async (username: string): Promise<EmailResponse> => {
  try {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      {
        resetPasswordToken: resetToken,
        resetPasswordExpires: Date.now() + 3600000, // expires in 1 hour
      },
    );
    if (updatedUser === null) {
      throw new Error('Username does not exist');
    }

    const emailRecipient = updatedUser.email;
    await sendMail(
      emailRecipient,
      'CodeFlow Password Reset Request',
      `A password reset was requested for ${username}. Use this token to reset your password: ${resetToken}. This token will expire in 1 hour.`,
    );
    return { emailRecipient };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Error sending password reset email' };
  }
};

/**
 * Resets the password for a user.
 *
 * @param {string} token - The token used to reset the password.
 * @param {string} newPassword - The new password to set.
 *
 * @returns {Promise<UserResponse>} - The user with the updated password, or an error message if the operation failed.
 */
export const resetPassword = async (token: string, newPassword: string): Promise<UserResponse> => {
  try {
    const hashedPassword = await hashPassword(newPassword);
    const user = await UserModel.findOneAndUpdate(
      {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      },
      {
        $set: { password: hashedPassword },
        $unset: { resetPasswordToken: '', resetPasswordExpires: '' },
      },
      { new: true },
    );

    if (!user) {
      return { error: 'Password reset token is invalid or has expired' };
    }

    return user;
  } catch (error) {
    return { error: 'Error resetting password' };
  }
};

/**
 * Attempts to change the theme of a user in the database.
 *
 * @param {string} username - The username of the user for the theme change.
 * @param {string} theme - The theme to change to.
 *
 * @returns {Promise<UserResponse>} - The changed user, or an error message if the theme change failed.
 */
export const changeTheme = async (username: string, theme: string): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { username },
      { $set: { 'settings.theme': theme } }, // only update the theme field
      { new: true },
    );
    if (!user) {
      return { error: 'Username does not exist' };
    }
    return user;
  } catch (error) {
    return { error: 'Error changing user theme' };
  }
};

/**
 * Attempts to change the background color on the custom theme of a user in the database.
 *
 * @param {string} username - The username of the user for the background color change.
 * @param {string} backgroundColor - The background color to change to.
 *
 * @returns {Promise<UserResponse>} - The changed user, or an error message if the background color change failed.
 */
export const changeBackgroundColor = async (
  username: string,
  backgroundColor: string,
): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { username },
      { $set: { 'settings.backgroundColor': backgroundColor } },
      { new: true },
    );
    if (!user) {
      return { error: 'Username does not exist' };
    }
    return user;
  } catch (error) {
    return { error: 'Error changing user background color' };
  }
};

/**
 * Attempts to change the text color on the custom theme of a user in the database.
 *
 * @param {string} username - The username of the user for the text color change.
 * @param {string} textColor - The text color to change to.
 *
 * @returns {Promise<UserResponse>} - The changed user, or an error message if the text color change failed.
 */
export const changeTextColor = async (
  username: string,
  textColor: string,
): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { username },
      { $set: { 'settings.textColor': textColor } },
      { new: true },
    );
    if (!user) {
      return { error: 'Username does not exist' };
    }
    return user;
  } catch (error) {
    return { error: 'Error changing user text color' };
  }
};

/**
 * Attempts to change the button color on the custom theme of a user in the database.
 *
 * @param {string} username - the username of the user for the button color change.
 * @param {string} buttonColor - the button color to change to.
 *
 * @returns {Promise<UserResponse>} - The changed user, or an error message if the button color change failed.
 */
export const changeButtonColor = async (
  username: string,
  buttonColor: string,
): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { username },
      { $set: { 'settings.buttonColor': buttonColor } },
      { new: true },
    );
    if (!user) {
      return { error: 'Username does not exist' };
    }
    return user;
  } catch (error) {
    return { error: 'Error changing user button color' };
  }
};

/**
 * Attempts to change the text size of a user in the database.
 *
 * @param {string} username - The username of the user for the text size change.
 * @param {string} textSize - The text size to change to.
 *
 * @returns {Promise<UserResponse>} - The changed user, or an error message if the text size change failed.
 */
export const changeTextSize = async (username: string, textSize: string): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { username },
      { $set: { 'settings.textSize': textSize } },
      { new: true },
    );
    if (!user) {
      return { error: 'Username does not exist' };
    }
    return user;
  } catch (error) {
    return { error: 'Error changing user text size' };
  }
};

/**
 * Attempts to change the text boldness of a user in the database.
 *
 * @param {string} username - The username of the user for the text boldness change.
 * @param {string} textBoldness - The text boldness to change to.
 *
 * @returns {Promise<UserResponse>} - The changed user, or an error message if the text boldness change failed.
 */
export const changeTextBoldness = async (
  username: string,
  textBoldness: string,
): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { username },
      { $set: { 'settings.textBoldness': textBoldness } },
      { new: true },
    );
    if (!user) {
      return { error: 'Username does not exist' };
    }
    return user;
  } catch (error) {
    return { error: 'Error changing user text boldness' };
  }
};

/**
 * Attempts to change the font style of a user in the database.
 *
 * @param {string} username - The username of the user for the font change.
 * @param {string} font - The font style to change to.
 *
 * @returns {Promise<UserResponse>} - The changed user, or an error message if the font change failed.
 */
export const changeFont = async (username: string, font: string): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { username },
      { $set: { 'settings.font': font } },
      { new: true },
    );
    if (!user) {
      return { error: 'Username does not exist' };
    }
    return user;
  } catch (error) {
    return { error: 'Error changing user font style' };
  }
};

/**
 * Attempts to change the line spacing of a user in the database.
 *
 * @param {string} username - The username of the user for the line spacing change.
 * @param {string} lineSpacing - The line spacing to change to.
 *
 * @returns {Promise<UserResponse>} - The changed user, or an error message if the line spacing change failed.
 */
export const changeLineSpacing = async (
  username: string,
  lineSpacing: string,
): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { username },
      { $set: { 'settings.lineSpacing': lineSpacing } },
      { new: true },
    );
    if (!user) {
      return { error: 'Username does not exist' };
    }
    return user;
  } catch (error) {
    return { error: 'Error changing user line spacing' };
  }
};

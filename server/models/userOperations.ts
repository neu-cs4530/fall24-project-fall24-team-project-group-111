import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { MongoServerError } from 'mongodb';
import UserModel from './users';
import { User, UserResponse, PasswordResetResponse } from '../types';
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
 * Saves a new user in the database.
 *
 * @param {User} user - The user to save
 *
 * @returns {Promise<UserResponse>} - The saved user, or an error message if the save failed
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  try {
    user.password = await hashPassword(user.password); // Hash the password before saving the user
    const result = await UserModel.create(user);
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
 * @returns {Promise<PasswordResetResponse>} - The result of the password reset email sending operation, or an error message if the operation failed.
 */
export const sendPasswordReset = async (username: string): Promise<PasswordResetResponse> => {
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

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const sentEmailInfo = await sendMail(
      updatedUser.email,
      'FakeStackOverflow Password Reset Request',
      `A password reset was requested for ${username}. Click the link to reset your password: ${resetURL}`,
    );
    return sentEmailInfo;
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
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
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

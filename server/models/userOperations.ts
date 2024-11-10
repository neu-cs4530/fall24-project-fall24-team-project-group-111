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

    const verificationURL = `${process.env.CLIENT_URL}/verify-email/${emailVerificationToken}`;
    await sendMail(
      emailRecipient,
      'Activate your FakeStackOverflow Account',
      `Thank you for signing up for FakeStackOverflow! Click the link to verify your email: ${verificationURL}.\n
This link will expire in 24 hours. If you did not sign up for a FakeStackOverflow account, you can safely ignore this email.`,
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
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendMail(
      emailRecipient,
      'FakeStackOverflow Password Reset Request',
      `A password reset was requested for ${username}. Click the link to reset your password: ${resetURL}. This link will expire in 1 hour.`,
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

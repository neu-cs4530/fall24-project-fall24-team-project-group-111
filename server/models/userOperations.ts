import bcrypt from 'bcrypt';
import { MongoServerError } from 'mongodb';
import UserModel from './users';
import { User, UserResponse } from '../types';

/**
 * Checks if the error is a duplicate key error.
 *
 * @param error - The error to check.
 *
 * @returns `true` if the error is a duplicate key error, otherwise `false`.
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
    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
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
 * Attempts change the theme of a user in the database.
 *
 * @param {string} username - The username of the user for the theme change.
 * @param {string} theme - The theme to change to.
 *
 * @returns {Promise<UserResponse>} - The changed user, or an error message if the theme change failed.
 */
export const changeTheme = async (username: string, theme: string): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOneAndUpdate({ username }, { settings: { theme } });
    if (!user) {
      return { error: 'Username does not exist' };
    }
    return user;
  } catch (error) {
    return { error: 'Error changing user theme' };
  }
};

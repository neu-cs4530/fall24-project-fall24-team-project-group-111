import { Schema } from 'mongoose';
import settingsSchema from './settings';

/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure for storing users in the database.
 * Each user includes the following fields:
 * - `username`: A unique title which can be used to identify the user.
 * - `email`: The email address of the user.
 * - `password`: The password of the user.
 * - `creationDateTime`: The date and time when the user was created.
 * - 'settings': The settings information saved for the user.
 * Users optionally include the following fields:
 * - `resetPasswordToken`: A token used to reset the user's password.
 * - `resetPasswordExpires`: The expiration date for the reset password token.
 * - `googleId`: The Google ID of the user if it was created using Google OAuth.
 */
const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    creationDateTime: {
      type: Date,
    },
    settings: {
      type: settingsSchema,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    googleId: {
      type: String,
    },
  },
  { collection: 'User' },
);

export default userSchema;

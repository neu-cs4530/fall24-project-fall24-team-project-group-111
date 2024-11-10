import { Schema } from 'mongoose';

/**
 * Mongoose schema for the UnverifiedUser collection.
 *
 * This schema defines the structure for storing unverified users in the database.
 * Each unverified user includes the following fields:
 * - `username`: A title which can be used to identify the unverified user.
 * - `email`: The email address of the unverified user.
 * - `password`: The password of the unverified user.
 * - `creationDateTime`: The date and time when the unverified user was created.
 */
const unverifiedUserSchema: Schema = new Schema(
  {
    username: {
      type: String,
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
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
  },
  { collection: 'UnverifiedUser' },
);

export default unverifiedUserSchema;

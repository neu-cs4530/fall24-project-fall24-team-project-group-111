import mongoose, { Model } from 'mongoose';
import unverifiedUserSchema from './schema/unverifiedUser';
import { UnverifiedUser } from '../types';

/**
 * Mongoose model for the `UnverifiedUser` collection.
 *
 * This model is created using the `UnverifiedUser` interface and the `unverifiedUserSchema`, representing the
 * `UnverifiedUser` collection in the MongoDB database, and provides an interface for interacting with
 * the stored unverified users.
 *
 * @type {Model<UnverifiedUser>}
 */
const UnverifiedUserModel: Model<UnverifiedUser> = mongoose.model<UnverifiedUser>(
  'UnverifiedUser',
  unverifiedUserSchema,
);

export default UnverifiedUserModel;

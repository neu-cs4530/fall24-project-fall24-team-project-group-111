import bcrypt from 'bcrypt';
import { MongoServerError } from 'mongodb';
import { saveUser, loginUser, sendPasswordReset, resetPassword } from '../models/userOperations';
import UserModel from '../models/users';
import sendMail from '../utils/emailConfig';
import { User } from '../types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

jest.mock('../utils/emailConfig');
jest.mock('bcrypt');

const mockUser = {
  username: 'fakeUser',
  email: 'fakeEmail@email.com',
  password: 'fakepassword',
  creationDateTime: new Date('2024-06-03'),
  resetPasswordToken: undefined,
  resetPasswordExpires: undefined,
};

describe('User model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveUser', () => {
    test('saveUser should return the saved user', async () => {
      mockingoose(UserModel).toReturn(mockUser, 'create');

      const result = (await saveUser(mockUser)) as User;
      expect(result._id).toBeDefined();
      expect(result.username).toEqual(mockUser.username);
      expect(result.email).toEqual(mockUser.email);
      expect(result.password).toEqual(mockUser.password);
      expect(result.creationDateTime).toEqual(mockUser.creationDateTime);
    });

    test('saveUser should return an object with error if create throws an error', async () => {
      jest.spyOn(UserModel, 'create').mockImplementationOnce(() => {
        throw new Error('Error when creating a user');
      });

      const result = await saveUser(mockUser);
      expect(result).toEqual({ error: 'Error when creating a user' });
    });

    test('saveUser should return an object with error if user already exists', async () => {
      jest.spyOn(UserModel, 'create').mockImplementationOnce(() => {
        throw new MongoServerError({
          message: 'E11000 duplicate key error collection',
          code: 11000,
        });
      });

      const result = await saveUser(mockUser);
      expect(result).toEqual({ error: 'Username is already taken' });
    });

    test('saveUser should return an object with error if bcrypt.hash throws an error', async () => {
      (bcrypt.hash as jest.Mock).mockRejectedValueOnce(new Error('Error hashing password'));

      const result = await saveUser(mockUser);
      expect(result).toEqual({ error: 'Error when creating a user' });
    });
  });

  describe('loginUser', () => {
    test('loginUser should return the user attempting to log in', async () => {
      mockingoose(UserModel).toReturn(mockUser, 'findOne');
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = (await loginUser('fakeUser', 'fakepassword')) as User;
      expect(result._id).toBeDefined();
      expect(result.username).toEqual(mockUser.username);
      expect(result.email).toEqual(mockUser.email);
      expect(result.password).toEqual(mockUser.password);
      expect(result.creationDateTime).toEqual(mockUser.creationDateTime);
    });

    test('loginUser should return an object with error if findOne returns null', async () => {
      mockingoose(UserModel).toReturn(null, 'findOne');

      const result = await loginUser('fakeUser', 'fakepassword');
      expect(result).toEqual({ error: 'Username does not exist' });
    });

    test('loginUser should return an object with error if findOne throws an error', async () => {
      mockingoose(UserModel).toReturn(new Error('Error logging in user'), 'findOne');

      const result = await loginUser('fakeUser', 'fakepassword');
      expect(result).toEqual({ error: 'Error logging in user' });
    });

    test('loginUser should return an object with error if the password is incorrect', async () => {
      mockingoose(UserModel).toReturn(mockUser, 'findOne');
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await loginUser('fakeUser', 'fakepassword');
      expect(result).toEqual({ error: 'Incorrect password' });
    });

    test('loginUser should return an object with error if bcrypt.compare throws an error', async () => {
      mockingoose(UserModel).toReturn(mockUser, 'findOne');
      (bcrypt.compare as jest.Mock).mockRejectedValueOnce(new Error('Error comparing password'));

      const result = await loginUser('fakeUser', 'fakepassword');
      expect(result).toEqual({ error: 'Error logging in user' });
    });
  });

  describe('sendPasswordReset', () => {
    test('sendPasswordReset should return a confirmation message on success', async () => {
      mockingoose(UserModel).toReturn(mockUser, 'findOneAndUpdate');
      (sendMail as jest.Mock).mockResolvedValueOnce('Password reset email successfully sent');

      const result = await sendPasswordReset('fakeUser');
      expect(result).toEqual('Password reset email successfully sent');
    });

    test('sendPasswordReset should return an object with error if findOneAndUpdate returns null', async () => {
      mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

      const result = await sendPasswordReset('fakeUser');
      expect(result).toEqual({ error: 'Username does not exist' });
    });

    test('sendPasswordReset should return an object with error if findOneAndUpdate throws an error', async () => {
      mockingoose(UserModel).toReturn(
        new Error('Error sending password reset email'),
        'findOneAndUpdate',
      );

      const result = await sendPasswordReset('fakeUser');
      expect(result).toEqual({ error: 'Error sending password reset email' });
    });

    test('sendPasswordReset should return an object with error if sendMail throws an error', async () => {
      mockingoose(UserModel).toReturn(mockUser, 'findOneAndUpdate');
      (sendMail as jest.Mock).mockRejectedValueOnce(new Error('Error sending email'));

      const result = await sendPasswordReset('fakeUser');
      expect(result).toEqual({ error: 'Error sending email' });
    });
  });

  describe('resetPassword', () => {
    test('resetPassword should return the updated user with password on success', async () => {
      mockingoose(UserModel).toReturn(mockUser, 'findOneAndUpdate');

      const result = (await resetPassword('fakeToken', 'newPassword')) as User;
      expect(result._id).toBeDefined();
      expect(result.username).toEqual(mockUser.username);
      expect(result.email).toEqual(mockUser.email);
      expect(result.password).toEqual(mockUser.password);
      expect(result.resetPasswordToken).toEqual(mockUser.resetPasswordToken);
      expect(result.resetPasswordExpires).toEqual(mockUser.resetPasswordExpires);
    });

    test('resetPassword should return an object with error if findOneAndUpdate returns null', async () => {
      mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

      const result = await resetPassword('fakeToken', 'newPassword');
      expect(result).toEqual({ error: 'Password reset token is invalid or has expired' });
    });

    test('resetPassword should return an object with error if findOneAndUpdate throws an error', async () => {
      mockingoose(UserModel).toReturn(new Error('Error resetting password'), 'findOneAndUpdate');

      const result = await resetPassword('fakeToken', 'newPassword');
      expect(result).toEqual({ error: 'Error resetting password' });
    });

    test('resetPassword should return an object with error if bcrypt.hash throws an error', async () => {
      (bcrypt.hash as jest.Mock).mockRejectedValueOnce(new Error('Error hashing password'));

      const result = await resetPassword('fakeToken', 'newPassword');
      expect(result).toEqual({ error: 'Error resetting password' });
    });
  });
});

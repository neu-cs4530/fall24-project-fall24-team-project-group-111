import { sendPasswordReset, resetPassword } from '../models/userOperations';
import UserModel from '../models/users';
import sendMail from '../utils/emailConfig';
import { User } from '../types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

jest.mock('../utils/emailConfig');

describe('User model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('sendPasswordReset', () => {
    test('sendPasswordReset should return a confirmation message on success', async () => {
      const mockUser = {
        username: 'fakeUser',
        email: 'fakeEmail',
      };

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
      const mockUser = {
        username: 'fakeUser',
        email: 'fakeEmail',
      };

      mockingoose(UserModel).toReturn(mockUser, 'findOneAndUpdate');

      (sendMail as jest.Mock).mockRejectedValueOnce(new Error('Error sending email'));

      const result = await sendPasswordReset('fakeUser');
      expect(result).toEqual({ error: 'Error sending email' });
    });
  });

  describe('resetPassword', () => {
    test('resetPassword should return the updated user with password on success', async () => {
      const mockUser = {
        username: 'fakeUser',
        email: 'fakeEmail',
        password: 'newPassword',
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      };

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
  });
});

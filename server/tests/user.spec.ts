import mongoose from 'mongoose';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../app';
import * as util from '../models/userOperations';
import { loginUser, saveUser } from '../models/userOperations';
import { User } from '../types';
import UserModel from '../models/users';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const saveUserSpy = jest.spyOn(util, 'saveUser');
const loginUserSpy = jest.spyOn(util, 'loginUser');
const sendPasswordResetSpy = jest.spyOn(util, 'sendPasswordReset');
const resetPasswordSpy = jest.spyOn(util, 'resetPassword');
const jwtSignSpy = jest.spyOn(jwt, 'sign');

describe('POST /addUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new user', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      email: 'j2002dl@gmail.com',
      password: 'fakepassword',
      creationDateTime: new Date('2024-06-03'),
    };

    const mockResponse = {
      message: 'User created successfully',
      token: 'fakeToken',
    };

    saveUserSpy.mockResolvedValueOnce(mockReqBody);
    (jwtSignSpy as jest.Mock).mockReturnValue('fakeToken');

    const response = await supertest(app).post('/user/addUser').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.token).toBe(mockResponse.token);
  });

  it('it should return a bad request error if the user is invalid', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      password: 'fakepassword',
      creationDateTime: new Date('2024-06-03'),
    };

    const response = await supertest(app).post('/user/addUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('it should return a 409 error if the saveUser method throws and error', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      email: 'j2002dl@gmail.com',
      password: 'fakepassword',
      creationDateTime: new Date('2024-06-03'),
    };

    saveUserSpy.mockResolvedValueOnce({ error: 'Username is already taken' });
    (jwtSignSpy as jest.Mock).mockReturnValue('fakeToken');

    const response = await supertest(app).post('/user/addUser').send(mockReqBody);

    expect(response.status).toBe(409);
  });

  it('should log into an existing user', async () => {
    const mockUser = {
      username: 'fakeUser',
      email: 'j2002dl@gmail.com',
      password: 'fakepassword',
      creationDateTime: new Date('2024-06-03'),
    };

    const mockResponse = {
      message: 'Login successful',
      token: 'fakeToken',
      user: mockUser,
    };

    const mockLoginRequest = {
      username: 'fakeUser',
      password: 'fakepassword',
    };

    await UserModel.create(mockUser);

    loginUserSpy.mockResolvedValueOnce(mockUser);
    (jwtSignSpy as jest.Mock).mockReturnValue('fakeToken');

    const response = await supertest(app).post('/user/loginUser').send(mockLoginRequest);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBe(mockResponse.token);
  });

  it('it should return a bad request error if the login request is invalid', async () => {
    const mockLoginRequest = {
      username: 'fakeUser',
    };

    const response = await supertest(app).post('/user/loginUser').send(mockLoginRequest);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('it should return a 409 error if the loginUser method throws and error', async () => {
    const mockLoginRequest = {
      username: 'fakeUser',
      password: 'fakepassword',
    };

    loginUserSpy.mockResolvedValueOnce({ error: 'Username does not exist' });

    const response = await supertest(app).post('/user/loginUser').send(mockLoginRequest);

    expect(response.status).toBe(401);
  });
});

describe('userOperations', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  describe('saveUser', () => {
    test('saveUser should return the saved user', async () => {
      const mockUser = {
        username: 'fakeUser',
        email: 'j2002dl@gmail.com',
        password: 'fakepassword',
        creationDateTime: new Date('2024-06-03'),
      };

      const result = (await saveUser(mockUser)) as User;

      expect(result.username).toEqual(mockUser.username);
      expect(result.email).toEqual(mockUser.email);
      expect(result.password).toEqual(mockUser.password);
      expect(result.creationDateTime).toEqual(mockUser.creationDateTime);
    });

    // test('saveUser should return an error if user already exists', async () => {
    //     const mockUser = {
    //         username: "fakeUser",
    //         email: "j2002dl@gmail.com",
    //         password: "fakepassword",
    //         creationDateTime: new Date('2024-06-03'),
    //     };

    //     mockingoose(UserModel).toReturn(mockUser, 'findOne');

    //     const result = await saveUser(mockUser);

    //     if (result && 'error' in result) {
    //         expect(true).toBeTruthy();
    //     } else {
    //         expect(false).toBeTruthy();
    //     }
    // });
  });

  describe('loginUser', () => {
    // test('loginUser should return the user attempting to log in', async () => {
    //     const mockUser = {
    //         username: 'fakeUser',
    //         email: 'j2002dl@gmail.com',
    //         password: 'fakepassword',
    //         creationDateTime: new Date('2024-06-03'),
    //       };

    //     mockingoose(UserModel).toReturn(mockUser, 'findOne');

    //     const result = (await loginUser(mockUser.username, mockUser.password)) as User;

    //     expect(result._id).toBeDefined;
    //     expect(result.username).toEqual(mockUser.username);
    //     expect(result.email).toEqual(mockUser.email);
    //     expect(result.password).toEqual(mockUser.password);
    //     expect(result.creationDateTime).toEqual(mockUser.creationDateTime);

    // });

    test('loginUser should return an error if the user does not exist', async () => {
      const mockUser = {
        username: 'fakeUser',
        email: 'j2002dl@gmail.com',
        password: 'fakepassword',
        creationDateTime: new Date('2024-06-03'),
      };

      const result = (await loginUser(mockUser.username, mockUser.password)) as User;

      if (result && 'error' in result) {
        expect(true).toBeTruthy();
      } else {
        expect(false).toBeTruthy();
      }
    });

    test('loginUser should return an error if the password is incorrect', async () => {
      const mockUser = {
        username: 'fakeUser',
        email: 'j2002dl@gmail.com',
        password: 'fakepassword',
        creationDateTime: new Date('2024-06-03'),
      };

      mockingoose(UserModel).toReturn(mockUser, 'findOne');

      const result = (await loginUser(mockUser.username, '123')) as User;

      if (result && 'error' in result) {
        expect(true).toBeTruthy();
      } else {
        expect(false).toBeTruthy();
      }
    });
  });
});

describe('POST /sendPasswordReset', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should send a successful password reset', async () => {
    const mockReqBody = {
      username: 'fakeUser',
    };

    sendPasswordResetSpy.mockResolvedValueOnce({ result: 'Email successfully sent' });

    const response = await supertest(app).post('/user/sendPasswordReset').send(mockReqBody);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password reset email successfully sent');
  });

  it('should return a bad request error if the request body is missing', async () => {
    const response = await supertest(app).post('/user/sendPasswordReset');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return a bad request error if the username string is empty', async () => {
    const mockReqBody = {
      username: '',
    };

    const response = await supertest(app).post('/user/sendPasswordReset').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return a 404 not found error if the sendPasswordReset method does not find the username', async () => {
    const mockReqBody = {
      username: 'fakeUser',
    };

    sendPasswordResetSpy.mockResolvedValueOnce({ error: 'Username does not exist' });
    const response = await supertest(app).post('/user/sendPasswordReset').send(mockReqBody);
    expect(response.status).toBe(404);
    expect(response.text).toBe('Error when sending password reset: Username does not exist');
  });

  it('should return error in response if sendPasswordReset method throws an error', async () => {
    const mockReqBody = {
      username: 'fakeUser',
    };

    sendPasswordResetSpy.mockResolvedValueOnce({ error: 'Error sending password reset email' });

    const response = await supertest(app).post('/user/sendPasswordReset').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe(
      'Error when sending password reset: Error sending password reset email',
    );
  });
});

describe('POST /sendPasswordReset', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should successfully reset a password', async () => {
    const mockReqBody = {
      token: 'fakeToken',
      newPassword: 'newPassword',
    };

    const mockResponse = {
      username: 'fakeUser',
      email: 'fakeEmail@email.com',
      password: 'newPassword',
      creationDateTime: new Date('2024-06-06'),
    };

    resetPasswordSpy.mockResolvedValueOnce(mockResponse);

    const response = await supertest(app).post('/user/resetPassword').send(mockReqBody);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password reset successfully');
  });

  it('should return a bad request error if the request body is missing', async () => {
    const response = await supertest(app).post('/user/resetPassword');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if token property missing', async () => {
    const mockReqBody = {
      newPassword: 'newPassword',
    };

    const response = await supertest(app).post('/user/resetPassword').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if newPassword property missing', async () => {
    const mockReqBody = {
      token: 'fakeToken',
    };

    const response = await supertest(app).post('/user/resetPassword').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if token property is empty', async () => {
    const mockReqBody = {
      token: 'newPassword',
      newPassword: '',
    };

    const response = await supertest(app).post('/user/resetPassword').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if newPassword property is empty', async () => {
    const mockReqBody = {
      token: 'fakeToken',
      newPassword: '',
    };

    const response = await supertest(app).post('/user/resetPassword').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return a 401 unauthorized error if the resetPassword method determines the token is invalid or expired', async () => {
    const mockReqBody = {
      token: 'fakeToken',
      newPassword: 'newPassword',
    };

    resetPasswordSpy.mockResolvedValueOnce({
      error: 'Password reset token is invalid or has expired',
    });
    const response = await supertest(app).post('/user/resetPassword').send(mockReqBody);
    expect(response.status).toBe(401);
    expect(response.text).toBe(
      'Error when resetting password: Password reset token is invalid or has expired',
    );
  });

  it('should return error in response if sendPasswordReset method throws an error', async () => {
    const mockReqBody = {
      token: 'fakeToken',
      newPassword: 'newPassword',
    };

    resetPasswordSpy.mockResolvedValueOnce({ error: 'Error resetting password' });

    const response = await supertest(app).post('/user/resetPassword').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when resetting password: Error resetting password');
  });
});

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
const jwtSignSpy = jest.spyOn(jwt, 'sign');

describe('POST /addUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new user', async () => {
    const mockSettingsInfo = {
      theme: 'LightMode',
      textSize: 'medium',
      textBoldness: 'normal',
      font: 'Arial',
      lineSpacing: 'normal',
    };

    const mockReqBody = {
      username: 'fakeUser',
      email: 'j2002dl@gmail.com',
      password: 'fakepassword',
      creationDateTime: new Date('2024-06-03'),
      settings: mockSettingsInfo,
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
      settings: {
        theme: 'LightMode',
        textSize: 'medium',
        textBoldness: 'normal',
        font: 'Arial',
        lineSpacing: 'normal',
      },
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
        settings: {
          theme: 'LightMode',
          textSize: 'medium',
          textBoldness: 'normal',
          font: 'Arial',
          lineSpacing: 'normal',
        },
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

import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { app } from '../app';
import * as util from '../models/userOperations';

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
    const validUserid = new mongoose.Types.ObjectId();

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
    expect(response.body).toEqual(mockResponse);
  });
});

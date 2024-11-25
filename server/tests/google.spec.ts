import mongoose from 'mongoose';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../app';
import * as util from '../models/userOperations';
import { User } from '../types';

const findOrSaveGoogleUserSpy = jest.spyOn(util, 'findOrSaveGoogleUser');
const jwtSignSpy = jest.spyOn(jwt, 'sign');

const mockSettingsInfo = {
  theme: 'LightMode',
  textSize: 'medium',
  textBoldness: 'normal',
  font: 'Arial',
  lineSpacing: '1',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  buttonColor: '#5c0707',
};

const mockGoogleUser: User = {
  username: 'fakeEmail_012345',
  email: 'fakeEmail@email.com',
  password: '313233343536',
  creationDateTime: new Date('2024-06-03'),
  settings: mockSettingsInfo,
};

jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        getToken: jest.fn().mockResolvedValue({ tokens: { access_token: 'fake-access-token' } }),
        setCredentials: jest.fn(),
      })),
    },
    oauth2: jest.fn().mockReturnValue({
      userinfo: {
        get: jest.fn().mockResolvedValue({
          data: { id: 'fake-google-id', email: 'fake-email@gmail.com' },
        }),
      },
    }),
  },
}));

describe('GET /auth/google/callback', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should authenticate user with Google', async () => {
    findOrSaveGoogleUserSpy.mockResolvedValueOnce(mockGoogleUser);
    (jwtSignSpy as jest.Mock).mockReturnValue('fakeJwtToken');

    const response = await supertest(app)
      .get('/api/auth/google/callback')
      .query({ code: 'fake-code' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Authentication with Google successful');
    expect(response.body.token).toBe('fakeJwtToken');
    expect(response.body.user).toEqual({
      ...mockGoogleUser,
      creationDateTime: mockGoogleUser.creationDateTime.toISOString(),
    });
  });

  it('should return a bad request error if the request query is missing', async () => {
    const response = await supertest(app).get('/api/auth/google/callback');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if code is empty', async () => {
    const response = await supertest(app).get('/api/auth/google/callback').query({ code: '' });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return error in response if jwt.sign method throws an error', async () => {
    findOrSaveGoogleUserSpy.mockResolvedValueOnce(mockGoogleUser);
    (jwtSignSpy as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Error signing token');
    });

    const response = await supertest(app)
      .get('/api/auth/google/callback')
      .query({ code: 'fake-code' });
    expect(response.status).toBe(500);
    expect(response.text).toBe('Internal Server Error');
  });

  it('should return error in response if saveUser method throws an error', async () => {
    findOrSaveGoogleUserSpy.mockResolvedValueOnce({
      error: 'Error when retrieving or creating a Google user',
    });

    const response = await supertest(app)
      .get('/api/auth/google/callback')
      .query({ code: 'fake-code' });
    expect(response.status).toBe(500);
    expect(response.text).toBe('Internal Server Error');
  });

  it('should return a generic 500 error if an unknown error occurs', async () => {
    findOrSaveGoogleUserSpy.mockRejectedValueOnce('Unexpected error');

    const response = await supertest(app)
      .get('/api/auth/google/callback')
      .query({ code: 'fake-code' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Internal Server Error');
  });
});

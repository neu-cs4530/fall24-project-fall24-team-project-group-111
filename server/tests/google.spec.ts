import mongoose from 'mongoose';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../app';
import * as util from '../models/userOperations';
import { User } from '../types';

process.env.GMAIL_CLIENT_ID = 'fake-client-id';
process.env.GMAIL_CLIENT_SECRET = 'fake-client-secret';
process.env.CLIENT_URL = 'http://localhost:3000';

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
  // beforeAll(() => {
  //   app.use('/api', googleAuthController(JWT_SECRET));
  // });

  afterEach(async () => {
    // jest.clearAllMocks();
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
});

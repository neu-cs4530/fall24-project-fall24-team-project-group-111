import mongoose from 'mongoose';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../app';
import * as util from '../models/userOperations';
import { User } from '../types';

const sendEmailVerificationSpy = jest.spyOn(util, 'sendEmailVerification');
const saveUserSpy = jest.spyOn(util, 'saveUser');
const loginUserSpy = jest.spyOn(util, 'loginUser');
const sendPasswordResetSpy = jest.spyOn(util, 'sendPasswordReset');
const resetPasswordSpy = jest.spyOn(util, 'resetPassword');
const jwtSignSpy = jest.spyOn(jwt, 'sign');
const changeThemeSpy = jest.spyOn(util, 'changeTheme');
const changeFontSpy = jest.spyOn(util, 'changeFont');
const changeTextSizeSpy = jest.spyOn(util, 'changeTextSize');
const changeTextBoldnessSpy = jest.spyOn(util, 'changeTextBoldness');
const changeLineSpacingSpy = jest.spyOn(util, 'changeTextBoldness');

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

const mockUser: User = {
  username: 'fakeUser',
  email: 'fakeEmail@email.com',
  password: 'fakepassword',
  creationDateTime: new Date('2024-06-03'),
  settings: mockSettingsInfo,
};

describe('POST /emailVerification', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should send an email verification', async () => {
    sendEmailVerificationSpy.mockResolvedValueOnce({ emailRecipient: 'fakeEmail@email.com' });

    const response = await supertest(app).post('/user/emailVerification').send(mockUser);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email verification successfully sent');
    expect(response.body.emailRecipient).toBe('fakeEmail@email.com');
  });

  it('should return a bad request error if the request body is missing', async () => {
    const response = await supertest(app).post('/user/emailVerification');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if username property missing', async () => {
    const mockReqBody = {
      email: 'fakeEmail@email.com',
      password: 'fakepassword',
      creationDateTime: new Date('2024-06-03'),
    };

    const response = await supertest(app).post('/user/emailVerification').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if email property missing', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      password: 'fakepassword',
      creationDateTime: new Date('2024-06-03'),
    };

    const response = await supertest(app).post('/user/emailVerification').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if password property missing', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      email: 'fakeEmail@email.com',
      creationDateTime: new Date('2024-06-03'),
    };

    const response = await supertest(app).post('/user/emailVerification').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if creationDateTime property missing', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      email: 'fakeEmail@email.com',
      password: 'fakepassword',
    };

    const response = await supertest(app).post('/user/emailVerification').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if username property is empty', async () => {
    const mockReqBody = {
      username: '',
      email: 'fakeEmail@email.com',
      password: 'fakepassword',
      creationDateTime: new Date('2024-06-03'),
    };

    const response = await supertest(app).post('/user/emailVerification').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if email property is not formatted correctly', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      email: 'fakeEmail',
      password: 'fakepassword',
      creationDateTime: new Date('2024-06-03'),
      settings: {
        theme: 'LightMode',
        textSize: 'medium',
        textBoldness: 'normal',
        font: 'Arial',
        lineSpacing: '1',
      },
    };

    const response = await supertest(app).post('/user/emailVerification').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if password property is empty', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      email: 'fakeEmail@email.com',
      password: '',
      creationDateTime: new Date('2024-06-03'),
    };

    const response = await supertest(app).post('/user/emailVerification').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('it should return a 409 error if the sendEmailVerification method determines the username already exists', async () => {
    sendEmailVerificationSpy.mockResolvedValueOnce({ error: 'Username is already taken' });

    const response = await supertest(app).post('/user/emailVerification').send(mockUser);
    expect(response.status).toBe(409);
    expect(response.text).toBe('Username is already taken');
  });

  it('should return error in response if sendEmailVerification method throws an error', async () => {
    sendEmailVerificationSpy.mockResolvedValueOnce({ error: 'Error sending email verification' });

    const response = await supertest(app).post('/user/emailVerification').send(mockUser);
    expect(response.status).toBe(500);
    expect(response.text).toBe(
      'Error when sending email verification: Error sending email verification',
    );
  });
  it('should return a generic 500 error if an unknown error occurs', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      email: 'fakeEmail@email.com',
      password: 'fakepassword',
      creationDateTime: new Date('2024-06-03'),
    };

    sendEmailVerificationSpy.mockRejectedValue('Unexpected failure');
    const response = await supertest(app).post('/user/emailVerification').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when sending email verification');
  });
});

describe('POST /addUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new user', async () => {
    saveUserSpy.mockResolvedValueOnce(mockUser);
    (jwtSignSpy as jest.Mock).mockReturnValue('fakeJwtToken');

    const response = await supertest(app).post('/user/addUser').send({ token: 'fakeToken' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.token).toBe('fakeJwtToken');
    expect(response.body.user).toEqual({
      ...mockUser,
      creationDateTime: mockUser.creationDateTime.toISOString(),
    });
  });

  it('should return a bad request error if the request body is missing', async () => {
    const response = await supertest(app).post('/user/addUser');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if token property is empty', async () => {
    const response = await supertest(app).post('/user/addUser').send({ token: '' });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('it should return a 409 error if the saveUser method determines the username already exists', async () => {
    saveUserSpy.mockResolvedValueOnce({ error: 'Username is already taken' });

    const response = await supertest(app).post('/user/addUser').send({ token: 'fakeToken' });
    expect(response.status).toBe(409);
    expect(response.text).toBe('Username is already taken');
  });

  it('it should return a 400 error if the saveUser method does not accept the token', async () => {
    saveUserSpy.mockResolvedValueOnce({
      error: 'Email verification token is invalid or has expired',
    });

    const response = await supertest(app).post('/user/addUser').send({ token: 'fakeToken' });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Email verification token is invalid or has expired');
  });

  it('should return error in response if saveUser method throws an error', async () => {
    saveUserSpy.mockResolvedValueOnce({ error: 'Error when creating a user' });

    const response = await supertest(app).post('/user/addUser').send({ token: 'fakeToken' });
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when saving user: Error when creating a user');
  });

  it('should return error in response if jwt.sign method throws an error', async () => {
    saveUserSpy.mockResolvedValueOnce(mockUser);
    (jwtSignSpy as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Error signing token');
    });

    const response = await supertest(app).post('/user/addUser').send({ token: 'fakeToken' });
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when saving user: Error signing token');
  });
  it('should return a generic 500 error if an unknown error occurs', async () => {
    saveUserSpy.mockRejectedValueOnce('Unexpected error');
    const response = await supertest(app).post('/user/addUser').send({ token: 'fakeToken' });
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when saving user');
  });
});

describe('POST /loginUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should log into an existing user', async () => {
    const mockLoginRequest = {
      username: 'fakeUser',
      password: 'fakepassword',
    };

    loginUserSpy.mockResolvedValueOnce(mockUser);
    (jwtSignSpy as jest.Mock).mockReturnValue('fakeToken');

    const response = await supertest(app).post('/user/loginUser').send(mockLoginRequest);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBe('fakeToken');
    expect(response.body.user).toEqual({
      ...mockUser,
      creationDateTime: mockUser.creationDateTime.toISOString(),
    });
  });

  it('should return a bad request error if the request body is missing', async () => {
    const response = await supertest(app).post('/user/loginUser');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if username property missing', async () => {
    const mockReqBody = {
      password: 'fakepassword',
    };

    const response = await supertest(app).post('/user/loginUser').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if password property missing', async () => {
    const mockReqBody = {
      username: 'fakeUser',
    };

    const response = await supertest(app).post('/user/loginUser').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if username property is empty', async () => {
    const mockReqBody = {
      username: '',
      password: 'fakepassword',
    };

    const response = await supertest(app).post('/user/loginUser').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if password property is empty', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      password: '',
    };

    const response = await supertest(app).post('/user/loginUser').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return a 401 unauthorized error if the loginUser method determines the user does not exist', async () => {
    const mockLoginRequest = {
      username: 'fakeUser',
      password: 'fakepassword',
    };

    loginUserSpy.mockResolvedValueOnce({ error: 'Username does not exist' });

    const response = await supertest(app).post('/user/loginUser').send(mockLoginRequest);
    expect(response.status).toBe(401);
    expect(response.text).toBe('Username does not exist');
  });

  it('should return a 401 unauthorized error if the loginUser method determines the password is incorrect', async () => {
    const mockLoginRequest = {
      username: 'fakeUser',
      password: 'fakepassword',
    };

    loginUserSpy.mockResolvedValueOnce({ error: 'Incorrect password' });

    const response = await supertest(app).post('/user/loginUser').send(mockLoginRequest);
    expect(response.status).toBe(401);
    expect(response.text).toBe('Incorrect password');
  });

  it('should return error in response if loginUser method throws an error', async () => {
    const mockLoginRequest = {
      username: 'fakeUser',
      password: 'fakepassword',
    };

    loginUserSpy.mockResolvedValueOnce({ error: 'Error logging in user' });

    const response = await supertest(app).post('/user/loginUser').send(mockLoginRequest);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when logging in: Error logging in user');
  });

  it('should return error in response if jwt.sign method throws an error', async () => {
    const mockLoginRequest = {
      username: 'fakeUser',
      password: 'fakepassword',
    };

    loginUserSpy.mockResolvedValueOnce(mockUser);
    (jwtSignSpy as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Error signing token');
    });

    const response = await supertest(app).post('/user/loginUser').send(mockLoginRequest);
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when logging in: Error signing token');
  });
  it('should return a 500 error with a generic message if an unknown error occurs in the catch block', async () => {
    loginUserSpy.mockRejectedValueOnce({});
    const mockReqBody = {
      username: 'fakeUser',
      password: 'fakePassword',
    };

    const response = await supertest(app).post('/user/loginUser').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when logging in');
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

    sendPasswordResetSpy.mockResolvedValueOnce({ emailRecipient: 'fakeEmail@email.com' });

    const response = await supertest(app).post('/user/sendPasswordReset').send(mockReqBody);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password reset email successfully sent');
    expect(response.body.emailRecipient).toBe('fakeEmail@email.com');
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
    expect(response.text).toBe('Username does not exist');
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
  it('should return a 500 error with a generic message if an unknown error occurs in the catch block', async () => {
    sendPasswordResetSpy.mockRejectedValueOnce({});
    const mockReqBody = {
      username: 'fakeUser',
    };
    const response = await supertest(app).post('/user/sendPasswordReset').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when sending password reset');
  });
});

describe('POST /resetPassword', () => {
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
    expect(response.text).toBe('Password reset token is invalid or has expired');
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
  it('should return a 500 error with a generic message if an unknown error occurs in the catch block', async () => {
    resetPasswordSpy.mockRejectedValueOnce({});
    const mockReqBody = {
      token: 'fakeToken',
      newPassword: 'newPassword',
    };
    const response = await supertest(app).post('/user/resetPassword').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when resetting password');
  });
});
describe('POST /changeTheme', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should return a 400 error if username or theme is missing', async () => {
    // missing both username and theme
    const response1 = await supertest(app).post('/user/changeTheme').send({});
    expect(response1.status).toBe(400);
    expect(response1.text).toBe('Invalid request');

    // missing just username
    const response2 = await supertest(app).post('/user/changeTheme').send({ theme: 'darkMode' });
    expect(response2.status).toBe(400);
    expect(response2.text).toBe('Invalid request');
    // missing just theme
    const response3 = await supertest(app).post('/user/changeTheme').send({ username: 'fakeUser' });
    expect(response3.status).toBe(400);
    expect(response3.text).toBe('Invalid request');
  });

  it('should return a success message and updated user if theme update is successful', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      theme: 'dark',
    };

    const mockResponse = {
      username: 'fakeUser',
      theme: 'dark',
      email: 'fakeEmail@email.com',
      password: 'password',
      creationDateTime: new Date(),
    };

    changeThemeSpy.mockResolvedValueOnce(mockResponse);
    const response = await supertest(app).post('/user/changeTheme').send(mockReqBody);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Theme update successful');
    expect(response.body.user.theme).toBe('dark');
  });
  it('should return a 500 error with the correct message if changeTheme throws an error', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      theme: 'dark',
    };
    changeThemeSpy.mockResolvedValueOnce({ error: 'User not found' });
    const response = await supertest(app).post('/user/changeTheme').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when updating theme: User not found');
  });

  it('should return a 500 error with a generic message if an unknown error occurs in the catch block', async () => {
    changeThemeSpy.mockRejectedValueOnce({});
    const mockReqBody = {
      username: 'fakeUser',
      theme: 'dark',
    };
    const response = await supertest(app).post('/user/changeTheme').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when updating theme');
  });
});

describe('POST /changeFont', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should successfully update the font', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      font: 'Arial',
    };

    const mockResponse = {
      username: 'fakeUser',
      email: 'fakeEmail@email.com',
      font: 'Arial',
      password: 'password',
      creationDateTime: new Date(),
    };
    changeFontSpy.mockResolvedValueOnce(mockResponse);
    const response = await supertest(app).post('/user/changeFont').send(mockReqBody);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Font update successful');
    expect(response.body.user.font).toBe('Arial');
  });
  it('should return a 400 error if the request body is missing required fields', async () => {
    const response = await supertest(app).post('/user/changeFont');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });
  it('should return a 400 error if the username field is missing', async () => {
    const mockReqBody = {
      font: 'Arial',
    };

    const response = await supertest(app).post('/user/changeFont').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });
  it('should return a 400 error if the font field is missing', async () => {
    const mockReqBody = {
      username: 'fakeUser',
    };

    const response = await supertest(app).post('/user/changeFont').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });
  it('should return a 500 error if an unknown error occurs in the changeFont function', async () => {
    changeFontSpy.mockRejectedValueOnce(new Error('Database connection failed'));
    const mockReqBody = {
      username: 'fakeUser',
      font: 'Arial',
    };

    const response = await supertest(app).post('/user/changeFont').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when updating font: Database connection failed');
  });
  it('should return a 500 error with a generic message if an unknown error occurs', async () => {
    changeFontSpy.mockRejectedValueOnce({});

    const mockReqBody = {
      username: 'fakeUser',
      font: 'Arial',
    };
    const response = await supertest(app).post('/user/changeFont').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when updating font');
  });
  it('should throw an error if userFromDb contains an error property', async () => {
    const mockErrorResponse = {
      error: 'Font change failed due to some issue',
    };

    changeFontSpy.mockResolvedValueOnce(mockErrorResponse);
    const mockReqBody = {
      username: 'fakeUser',
      font: 'Arial',
    };
    const response = await supertest(app).post('/user/changeFont').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when updating font: Font change failed due to some issue');
  });
});

describe('POST /changeTextSize', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should return a 400 error when the request body is missing username or textSize', async () => {
    const mockReqBody1 = {
      textSize: '16px',
    };
    const response1 = await supertest(app).post('/user/changeTextSize').send(mockReqBody1);
    expect(response1.status).toBe(400);
    expect(response1.text).toBe('Invalid request');
    const mockReqBody2 = {
      username: 'fakeUser',
    };
    const response2 = await supertest(app).post('/user/changeTextSize').send(mockReqBody2);
    expect(response2.status).toBe(400);
    expect(response2.text).toBe('Invalid request');
  });

  it('should proceed when both username and textSize are provided', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      textSize: '16px',
    };
    const mockResponse = {
      username: 'fakeUser',
      email: 'fakeEmail@email.com',
      font: 'Arial',
      password: 'password',
      creationDateTime: new Date(),
    };
    changeTextSizeSpy.mockResolvedValueOnce(mockResponse);
    const response = await supertest(app).post('/user/changeTextSize').send(mockReqBody);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Text size update successful');
  });

  it('should throw an error when userFromDb contains an error', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      textSize: '16px',
    };
    const mockErrorResponse = { error: 'Invalid text size' };
    changeTextSizeSpy.mockResolvedValueOnce(mockErrorResponse);

    const response = await supertest(app).post('/user/changeTextSize').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when updating text size: Invalid text size');
  });
  it('should return a 500 error with the error message if err is an instance of Error', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      textSize: '16px',
    };
    const mockError = new Error('Some unexpected error');
    changeTextSizeSpy.mockRejectedValueOnce(mockError);

    const response = await supertest(app).post('/user/changeTextSize').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when updating text size: Some unexpected error');
  });
  it('should return a 500 error with a generic message if err is not an instance of Error', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      textSize: '16px',
    };
    const mockNonError = {};
    changeTextSizeSpy.mockRejectedValueOnce(mockNonError);

    const response = await supertest(app).post('/user/changeTextSize').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when updating text size');
  });
});
describe('POST /changeTextBoldness', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should return a 400 error if username or textBoldness is missing', async () => {
    const mockReqBody = {
      username: 'fakeUser',
    };

    const response = await supertest(app).post('/user/changeTextBoldness').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return a 500 error when the response includes an error field', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      textBoldness: 'bold',
    };
    const mockErrorResponse = {
      error: 'Database update failed',
    };

    changeTextBoldnessSpy.mockResolvedValueOnce(mockErrorResponse);
    const response = await supertest(app).post('/user/changeTextBoldness').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when updating text boldness: Database update failed');
  });
  it('should return a 500 error with a generic message if an unknown error occurs', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      textBoldness: 'bold',
    };
    changeTextBoldnessSpy.mockRejectedValueOnce({});

    const response = await supertest(app).post('/user/changeTextBoldness').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when updating text boldness');
  });
});

describe('POST /changeLineSpacing', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should return a 400 error if username or line spacing is missing', async () => {
    const mockReqBody = {
      username: 'fakeUser',
    };

    const response = await supertest(app).post('/user/changeLineSpacing').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return a 500 error when the response includes an error field', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      lineSpacing: '1',
    };
    const mockErrorResponse = {
      error: 'Database update failed',
    };

    changeLineSpacingSpy.mockResolvedValueOnce(mockErrorResponse);
    const response = await supertest(app).post('/user/changeLineSpacing').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe(
      'Error when updating line spacing: Error changing user line spacing',
    );
  });
  it('should return a 500 error with a generic message if an unknown error occurs', async () => {
    const mockReqBody = {
      username: 'fakeUser',
      lineSpacing: '3',
    };
    changeLineSpacingSpy.mockRejectedValueOnce({});

    const response = await supertest(app).post('/user/changeLineSpacing').send(mockReqBody);
    expect(response.status).toBe(500);
    expect(response.text).toBe(
      'Error when updating line spacing: Error changing user line spacing',
    );
  });
});

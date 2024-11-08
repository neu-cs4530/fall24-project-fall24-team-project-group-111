import nodemailer from 'nodemailer';
import sendMail from '../utils/emailConfig';

jest.mock('nodemailer');
jest.mock('googleapis', () => {
  const originalModule = jest.requireActual('googleapis');
  return {
    ...originalModule,
    google: {
      ...originalModule.google,
      auth: {
        OAuth2: jest.fn().mockImplementation(() => ({
          setCredentials: jest.fn(),
          getAccessToken: jest.fn().mockResolvedValue({ token: 'fakeAccessToken' }),
        })),
      },
    },
  };
});

describe('Email Config', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe('sendMail', () => {
    test('sendMail should return the sent email info on success', async () => {
      const sendMailMock = jest.fn().mockResolvedValueOnce('Email sent');
      (nodemailer.createTransport as jest.Mock).mockReturnValueOnce({ sendMail: sendMailMock });

      const result = await sendMail('fakerecipient@email.com', 'Fake Subject', 'Fake Text');
      expect(result).toBe('Email sent');
    });
  });
});

describe('Email errors', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe('errors', () => {
    test('sendMail should throw an error if nodemailer.createTransport throws an error', async () => {
      (nodemailer.createTransport as jest.Mock).mockRejectedValueOnce(
        new Error('Error creating transporter'),
      );
      // const rejectPromise = () => Promise.reject(new Error('Error creating transporter'));
      // (nodemailer.createTransport as jest.Mock).mockReturnValueOnce(rejectPromise);

      await expect(
        sendMail('fakerecipient@email.com', 'Fake Subject', 'Fake Text'),
      ).rejects.toThrow('Error sending email: Error creating transporter');
    });

    test('sendMail should throw an error if transporter.sendMail throws an error', async () => {
      const sendMailMock = jest.fn().mockRejectedValueOnce(new Error('Error sending email'));
      (nodemailer.createTransport as jest.Mock).mockReturnValueOnce({ sendMail: sendMailMock });

      await expect(
        sendMail('fakerecipient@email.com', 'Fake Subject', 'Fake Text'),
      ).rejects.toThrow('Error sending email: Error sending email');
    });
  });
});

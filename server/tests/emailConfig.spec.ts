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
  test('sendMail should return the sent email info on success', async () => {
    const sendMailMock = jest.fn().mockResolvedValueOnce('Email sent');
    (nodemailer.createTransport as jest.Mock).mockReturnValueOnce({ sendMail: sendMailMock });
    (nodemailer.createTransport as jest.Mock).mockImplementationOnce(() => ({
      sendMail: sendMailMock,
    }));

    const result = await sendMail('fakerecipient@email.com', 'Fake Subject', 'Fake Text');
    expect(result).toBe('Email sent');
  });
});

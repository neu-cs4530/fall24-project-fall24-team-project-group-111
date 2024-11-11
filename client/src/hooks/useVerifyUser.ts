import { useState } from 'react';
import { AxiosError } from 'axios';
import { sendEmailVerification } from '../services/userAuthService';
import { User } from '../types';

/**
 * Custom hook to handle sending an email verification to a new user and form validation
 *
 * @returns username - The current value of the username input.
 * @returns setUsername - Function to set the username input.
 * @returns email - The current value of the email input.
 * @returns setEmail - Function to set the email input.
 * @returns password - The current value of the password input.
 * @returns setPassword - Function to set the password input.
 * @returns usernameErr - Error message for the username field, if any.
 * @returns emailErr - Error message for the email field, if any.
 * @returns passwordErr - Error message for the password field, if any.
 * @returns postEmailVerification - Function to validate the form and send an email verification to a new user.
 * @returns emailRecipient - The email address to which the email verification was sent.
 */
const useVerifyUser = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailRecipient, setEmailRecipient] = useState<string>('');

  const [usernameErr, setUsernameErr] = useState<string>('');
  const [emailErr, setEmailErr] = useState<string>('');
  const [passwordErr, setPasswordErr] = useState<string>('');
  const [postEmailVerificationErr, setPostEmailVerificationErr] = useState<string>('');

  /**
   * Function to validate the form before sending the email verification.
   *
   * @returns boolean - True if the form is valid, false otherwise.
   */
  const validateForm = (): boolean => {
    let isValid = true;

    if (!username) {
      setUsernameErr('Username cannot be empty');
      isValid = false;
    } else {
      setUsernameErr('');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailErr('Email cannot be empty');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailErr(
        'Invalid email format. Please enter a valid email address (e.g., user@example.com).',
      );
      isValid = false;
    } else {
      setEmailErr('');
    }

    if (!password) {
      setPasswordErr('Password cannot be empty');
      isValid = false;
    } else {
      setPasswordErr('');
    }

    return isValid;
  };

  /**
   * Function to post a request to send an email verification to the server.
   */
  const postEmailVerification = async () => {
    setPostEmailVerificationErr('');

    if (!validateForm()) return;

    const user: User = {
      username,
      email,
      password,
      creationDateTime: new Date(),
    };

    try {
      const res = await sendEmailVerification(user);
      if (res && res.emailRecipient) {
        setEmailRecipient(res.emailRecipient);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage = axiosError.response?.data || 'Error sending email verification';
      setPostEmailVerificationErr(
        typeof errorMessage === 'string' ? errorMessage : 'Error sending email verification',
      );
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    usernameErr,
    emailErr,
    passwordErr,
    postEmailVerification,
    postEmailVerificationErr,
    emailRecipient,
  };
};

export default useVerifyUser;

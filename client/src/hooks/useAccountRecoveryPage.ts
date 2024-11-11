import { useState } from 'react';
import { AxiosError } from 'axios';
import { sendPasswordReset } from '../services/userAuthService';

/**
 * Custom hook to handle sending email for account recovery and form validation
 *
 * @returns username - The current value of the username input.
 * @returns setUsername - Function to set the username input.
 * @returns usernameErr - Error message for the username field, if any.
 * @returns postSendPasswordReset - Function to validate the form and request for a password reset email to be sent.
 * @returns postSendPasswordResetErr - Error message for the password reset request, if any.
 * @returns emailRecipient - The email address to which the password reset email was sent.
 */
const useAccountRecoveryPage = () => {
  const [username, setUsername] = useState<string>('');
  const [usernameErr, setUsernameErr] = useState<string>('');
  const [postSendPasswordResetErr, setPostSendPasswordResetErr] = useState<string>('');
  const [emailRecipient, setEmailRecipient] = useState<string>('');

  /**
   * Function to validate the form before submitting the request for a password reset email to be sent.
   *
   * @returns boolean - True if the form is valid, false otherwise.
   */
  const validateForm = (): boolean => {
    if (!username) {
      setUsernameErr('Username cannot be empty');
      return false;
    }
    setUsernameErr('');
    return true;
  };

  /**
   * Function to post a request for a password reset email to be sent to the server.
   */
  const postSendPasswordReset = async () => {
    setPostSendPasswordResetErr('');

    if (!validateForm()) return;

    try {
      const res = await sendPasswordReset(username);
      if (res && res.emailRecipient) {
        setEmailRecipient(res.emailRecipient);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage = axiosError.response?.data || 'Error sending password reset email';
      setPostSendPasswordResetErr(
        typeof errorMessage === 'string' ? errorMessage : 'Error sending password reset email',
      );
    }
  };

  return {
    username,
    setUsername,
    usernameErr,
    postSendPasswordReset,
    postSendPasswordResetErr,
    emailRecipient,
  };
};

export default useAccountRecoveryPage;

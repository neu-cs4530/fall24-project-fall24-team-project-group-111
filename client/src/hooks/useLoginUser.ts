import { useState } from 'react';
import { AxiosError } from 'axios';
import { loginUser } from '../services/userAuthService';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to handle new user submission and form validation
 *
 * @returns username - The current value of the username input.
 * @returns setUsername - Function to set the username input.
 * @returns password - The current value of the password input.
 * @returns setPassword - Function to set the password input.
 * @returns usernameErr - Error message for the username field, if any.
 * @returns passwordErr - Error message for the password field, if any.
 * @returns postLoginUser - Function to validate the form and submit a user login request.
 */
const useLoginUser = () => {
  const { setUser } = useLoginContext();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [usernameErr, setUsernameErr] = useState<string>('');
  const [passwordErr, setPasswordErr] = useState<string>('');
  const [postLoginErr, setPostLoginErr] = useState<string>('');

  /**
   * Function to validate the form before submitting the user login request.
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

    if (!password) {
      setPasswordErr('Password cannot be empty');
      isValid = false;
    } else {
      setPasswordErr('');
    }

    return isValid;
  };

  /**
   * Function to post a user login request to the server.
   *
   * @returns boolean - True if the user login was successful, false otherwise.
   */
  const postLoginUser = async (): Promise<boolean> => {
    if (!validateForm()) return false;

    try {
      const res = await loginUser(username, password);
      if (res && res.token && res.user) {
        setUser(res.user);
        return true;
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage = axiosError.response?.data || 'Error creating user';
      setPostLoginErr(typeof errorMessage === 'string' ? errorMessage : 'Error creating user');
    }
    return false;
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    usernameErr,
    passwordErr,
    postLoginErr,
    postLoginUser,
  };
};

export default useLoginUser;

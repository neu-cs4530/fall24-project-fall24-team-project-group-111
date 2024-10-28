import { useState } from 'react';
import { AxiosError } from 'axios';
import { addUser } from '../services/userAuthService';
import { User } from '../types';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to handle new user submission and form validation
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
 * @returns postNewUser - Function to validate the form and submit a new user.
 */
const useAddUser = () => {
  const { setUser } = useLoginContext();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [usernameErr, setUsernameErr] = useState<string>('');
  const [emailErr, setEmailErr] = useState<string>('');
  const [passwordErr, setPasswordErr] = useState<string>('');
  const [postUserErr, setPostUserErr] = useState<string>('');

  /**
   * Function to validate the form before submitting the request to add the user.
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
   * Function to post a new user request to the server.
   *
   * @returns boolean - True if the user was successfully added, false otherwise.
   */
  const postNewUser = async (): Promise<boolean> => {
    if (!validateForm()) return false;

    const user: User = {
      username,
      email,
      password,
      creationDateTime: new Date(),
    };

    try {
      const res = await addUser(user);
      if (res && res.token) {
        setUser(user);
        return true;
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage = axiosError.response?.data || 'Error creating user';
      setPostUserErr(typeof errorMessage === 'string' ? errorMessage : 'Error creating user');
    }
    return false;
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
    postUserErr,
    postNewUser,
  };
};

export default useAddUser;

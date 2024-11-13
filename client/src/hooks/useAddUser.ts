import { useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../services/userAuthService';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to handle new user submission and form validation
 *
 * @returns token - The current value of the token input.
 * @returns setToken - Function to set the token input.
 * @returns tokenErr - Error message for the token field, if any.
 * @returns postNewUser - Function to submit request to create a new user.
 * @returns postUserErr - Error message for the new user request, if any.
 * @returns successMessage - Success message for the new user creation, if any.
 */
const useAddUser = () => {
  const navigate = useNavigate();
  const { setUser } = useLoginContext();
  const [token, setToken] = useState<string>('');
  const [tokenErr, setTokenErr] = useState<string>('');
  const [postUserErr, setPostUserErr] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  /**
   * Function to post a new user request to the server.
   */
  const postNewUser = async () => {
    setPostUserErr('');

    if (!token) {
      setTokenErr('Token cannot be empty');
      return;
    }
    setTokenErr('');

    try {
      const res = await addUser(token);
      if (res && res.token && res.user) {
        setUser(res.user);
        setSuccessMessage('Account created successfully!');
        setTimeout(() => {
          navigate('/home');
        }, 3000);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage = axiosError.response?.data || 'Error creating user';
      setPostUserErr(typeof errorMessage === 'string' ? errorMessage : 'Error creating user');
    }
  };

  return {
    token,
    setToken,
    tokenErr,
    postNewUser,
    postUserErr,
    successMessage,
  };
};

export default useAddUser;

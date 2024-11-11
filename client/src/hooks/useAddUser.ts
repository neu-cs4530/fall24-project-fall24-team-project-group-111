import { useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { addUser } from '../services/userAuthService';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to handle new user submission
 *
 * @returns postNewUser - Function to submit request to create a new user.
 * @returns postUserErr - Error message for the new user request, if any.
 */
const useAddUser = () => {
  const navigate = useNavigate();
  const { setUser } = useLoginContext();
  const { token } = useParams<{ token: string }>();
  const [postUserErr, setPostUserErr] = useState<string>('');

  /**
   * Function to post a new user request to the server.
   */
  const postNewUser = async () => {
    if (!token) {
      setPostUserErr('Invalid or missing token');
      return;
    }

    try {
      const res = await addUser(token);
      if (res && res.token && res.user) {
        setUser(res.user);
        navigate('/home');
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage = axiosError.response?.data || 'Error creating user';
      setPostUserErr(typeof errorMessage === 'string' ? errorMessage : 'Error creating user');
    }
  };

  return {
    postNewUser,
    postUserErr,
  };
};

export default useAddUser;

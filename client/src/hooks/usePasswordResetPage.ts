import { useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/userAuthService';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to handle a password reset request and form validation
 *
 * @returns token - The current value of the token input.
 * @returns setToken - Function to set the token input.
 * @returns tokenErr - Error message for the token field, if any.
 * @returns newPassword - The current value of the newPassword input.
 * @returns setNewPassword - Function to set the newPassword input.
 * @returns newPasswordErr - Error message for the newPassword field, if any.
 * @returns confirmPassword - The current value of the confirmPassword input.
 * @returns setConfirmPassword - Function to set the confirmPassword input.
 * @returns confirmPasswordErr - Error message for the confirmPassword field, if any.
 * @returns postPasswordReset - Function to validate the form and submit a password reset request.
 * @returns postPasswordResetErr - Error message for the password reset request, if any.
 * @returns successMessage - Success message for the password reset request, if any.
 */
const usePasswordResetPage = () => {
  const navigate = useNavigate();
  const { setUser } = useLoginContext();
  const [token, setToken] = useState<string>('');
  const [tokenErr, setTokenErr] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordErr, setNewPasswordErr] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [confirmPasswordErr, setConfirmPasswordErr] = useState<string>('');
  const [postPasswordResetErr, setPostPasswordResetErr] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  /**
   * Function to validate the form before submitting the password reset request.
   *
   * @returns boolean - True if the form is valid, false otherwise.
   */
  const validateForm = (): boolean => {
    let isValid = true;

    if (!token) {
      setTokenErr('Token cannot be empty');
      isValid = false;
    } else {
      setTokenErr('');
    }

    if (!newPassword) {
      setNewPasswordErr('Password cannot be empty');
      isValid = false;
    } else {
      setNewPasswordErr('');
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordErr('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordErr('');
    }

    return isValid;
  };

  /**
   * Function to post a password reset request to the server.
   */
  const postPasswordReset = async () => {
    setPostPasswordResetErr('');

    if (!validateForm()) return;

    try {
      const res = await resetPassword(token, newPassword);
      if (res && res.user) {
        setUser(res.user);
        setSuccessMessage('Password successfully reset!');
        setTimeout(() => {
          navigate('/home');
        }, 3000);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage = axiosError.response?.data || 'Error resetting password';
      setPostPasswordResetErr(
        typeof errorMessage === 'string' ? errorMessage : 'Error resetting password',
      );
    }
  };

  return {
    token,
    setToken,
    tokenErr,
    newPassword,
    setNewPassword,
    newPasswordErr,
    confirmPassword,
    setConfirmPassword,
    confirmPasswordErr,
    postPasswordReset,
    postPasswordResetErr,
    successMessage,
  };
};

export default usePasswordResetPage;

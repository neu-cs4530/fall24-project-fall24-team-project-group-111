import React from 'react';
import './index.css';
import LoginInput from '../inputComponent';
import usePasswordResetPage from '../../../hooks/usePasswordResetPage';

/**
 * PasswordResetPage Component contains a form that allows the user to submit a password reset request.
 */
const PasswordResetPage = () => {
  const {
    newPassword,
    setNewPassword,
    newPasswordErr,
    confirmPassword,
    setConfirmPassword,
    confirmPasswordErr,
    postPasswordReset,
    postPasswordResetErr,
    successMessage,
  } = usePasswordResetPage();

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await postPasswordReset();
  };

  return (
    <div className='container'>
      <h3>Reset your password</h3>
      <form onSubmit={handleSubmit}>
        <LoginInput
          title={'New Password'}
          id={'newPasswordInput'}
          val={newPassword}
          setState={setNewPassword}
          err={newPasswordErr}
          type='password'
        />
        <LoginInput
          title={'Confirm Password'}
          id={'confirmPasswordInput'}
          val={confirmPassword}
          setState={setConfirmPassword}
          err={confirmPasswordErr}
          type='password'
        />
        {postPasswordResetErr && <div className='error-text'>{postPasswordResetErr}</div>}
        <button type='submit' className='login-button'>
          Update password
        </button>
      </form>
      {successMessage && <div className='success_message'>{successMessage}</div>}
    </div>
  );
};

export default PasswordResetPage;

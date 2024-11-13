import React from 'react';
import './index.css';
import LoginInput from '../inputComponent';
import usePasswordResetPage from '../../../hooks/usePasswordResetPage';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';

/**
 * PasswordResetPage Component contains a form that allows the user to submit a password reset request.
 */
const PasswordResetPage = () => {
  const {
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
      <HoverToPlayTTSWrapper text={'Reset your password'}>
        <h3>Reset your password</h3>
      </HoverToPlayTTSWrapper>
      <form onSubmit={handleSubmit}>
        <LoginInput
          title={'Password Reset Token (from email)'}
          id={'passwordResetTokenInput'}
          val={token}
          setState={setToken}
          err={tokenErr}
          type='text'
        />
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
        {postPasswordResetErr && (
          <HoverToPlayTTSWrapper text={postPasswordResetErr}>
            <div className='error-text'>{postPasswordResetErr}</div>
          </HoverToPlayTTSWrapper>
        )}
        <HoverToPlayTTSWrapper text={'Button to update password.'}>
          <button type='submit' className='login-button'>
            Update password
          </button>
        </HoverToPlayTTSWrapper>
      </form>
      {successMessage && (
        <HoverToPlayTTSWrapper text={successMessage}>
          <div className='success_message'>{successMessage}</div>
        </HoverToPlayTTSWrapper>
      )}
    </div>
  );
};

export default PasswordResetPage;

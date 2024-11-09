import React from 'react';
import './index.css';
import LoginInput from '../inputComponent';
import useAccountRecoveryPage from '../../../hooks/useAccountRecoveryPage';

/**
 * AccountRecoveryPage Component contains a form that allows the user to request a password reset email.
 */
const AccountRecoveryPage = () => {
  const {
    username,
    setUsername,
    usernameErr,
    postSendPasswordReset,
    postSendPasswordResetErr,
    emailRecipient,
  } = useAccountRecoveryPage();

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await postSendPasswordReset();
  };

  return (
    <div className='container'>
      {emailRecipient ? (
        <h3>Password reset email sent to {emailRecipient}</h3>
      ) : (
        <div>
          <div className='account_recovery_text_container'>
            <div className='account_recovery_text'>
              Forgot your account’s password? Enter your username to send a password reset link to
              the email linked to your account.
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <LoginInput
              title={'Username'}
              id={'usernameInput'}
              val={username}
              setState={setUsername}
              err={usernameErr}
              type='text'
            />
            {postSendPasswordResetErr && (
              <div className='error-text'>{postSendPasswordResetErr}</div>
            )}
            <button type='submit' className='login-button'>
              Send password reset email
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountRecoveryPage;

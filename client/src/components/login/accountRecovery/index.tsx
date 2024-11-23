import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import LoginInput from '../inputComponent';
import useAccountRecoveryPage from '../../../hooks/useAccountRecoveryPage';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';
import ToggleTextToSpeech from '../../textToSpeech/toggleTSS';

/**
 * AccountRecoveryPage Component contains a form that allows the user to request a password reset email.
 */
const AccountRecoveryPage = () => {
  const navigate = useNavigate();
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

  const recoveryText =
    'Forgot your account’s password? Enter your username to send a password reset link to the email linked to your account.';

  return (
    <div>
      {emailRecipient ? (
        <div className='container'>
          <HoverToPlayTTSWrapper text={`Password reset email sent to ${emailRecipient}`}>
            <h3>Password reset email sent to {emailRecipient}</h3>
          </HoverToPlayTTSWrapper>
          <button onClick={() => navigate('/reset-password')} className='login-button'>
            Reset password
          </button>
        </div>
      ) : (
        <div className='container'>
          <div className='account_recovery_text_container'>
            <HoverToPlayTTSWrapper text={recoveryText}>
              <div className='account_recovery_text'>{recoveryText}</div>
            </HoverToPlayTTSWrapper>
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
              <HoverToPlayTTSWrapper text={postSendPasswordResetErr}>
                <div className='error-text'>{postSendPasswordResetErr}</div>
              </HoverToPlayTTSWrapper>
            )}
            <HoverToPlayTTSWrapper text={'Button to send password reset email.'}>
              <button type='submit' className='login-button'>
                Send password reset email
              </button>
            </HoverToPlayTTSWrapper>
          </form>
        </div>
      )}
      <ToggleTextToSpeech isThemed={false} />
    </div>
  );
};

export default AccountRecoveryPage;

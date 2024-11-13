import React from 'react';
import LoginInput from '../inputComponent';
import useAddUser from '../../../hooks/useAddUser';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';

/**
 * Component that displays the email verification page and creates a new user.
 */
const EmailVerificationPage = () => {
  const { token, setToken, tokenErr, postNewUser, postUserErr, successMessage } = useAddUser();

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await postNewUser();
  };

  return (
    <div className='container'>
      <HoverToPlayTTSWrapper text={'Verify your account'}>
        <h3>Verify your account</h3>
      </HoverToPlayTTSWrapper>
      <form onSubmit={handleSubmit}>
        <LoginInput
          title={'Verification Token (from email)'}
          id={'verificationTokenInput'}
          val={token}
          setState={setToken}
          err={tokenErr}
          type='text'
        />
        {postUserErr && (
          <HoverToPlayTTSWrapper text={postUserErr}>
            <div className='error-text'>{postUserErr}</div>
          </HoverToPlayTTSWrapper>
        )}
        <HoverToPlayTTSWrapper text={'Button to verify account.'}>
          <button type='submit' className='login-button'>
            Verify account
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

export default EmailVerificationPage;

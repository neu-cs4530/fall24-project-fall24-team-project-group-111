import React from 'react';
import useVerifyUser from '../../../hooks/useVerifyUser';
import LoginInput from '../inputComponent';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';

/**
 * Component that allows for the verification of new users during signup.
 *
 * @param onSwitch - Function to switch between login and signup.
 */
const SignUp = ({ onSwitch }: { onSwitch: () => void }) => {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    usernameErr,
    emailErr,
    passwordErr,
    postEmailVerification,
    postEmailVerificationErr,
    emailRecipient,
  } = useVerifyUser();

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await postEmailVerification();
  };

  return (
    <div className='login-input-container'>
      <HoverToPlayTTSWrapper text={'Create an account'}>
        <h3>Create an account</h3>
      </HoverToPlayTTSWrapper>
      <form onSubmit={handleSubmit}>
        <LoginInput
          title={'Username'}
          id={'usernameInput'}
          val={username}
          setState={setUsername}
          err={usernameErr}
          type='text'
        />
        <LoginInput
          title={'Email'}
          id={'emailInput'}
          val={email}
          setState={setEmail}
          err={emailErr}
          type='text'
        />
        <LoginInput
          title={'Password'}
          id={'passwordInput'}
          val={password}
          setState={setPassword}
          err={passwordErr}
          type='password'
        />
        {postEmailVerificationErr && <div className='error-text'>{postEmailVerificationErr}</div>}
        <HoverToPlayTTSWrapper text={'Button to complete Sign up'}>
          <button type='submit' className='login-button'>
            Sign up
          </button>
        </HoverToPlayTTSWrapper>
      </form>
      {emailRecipient && (
        <HoverToPlayTTSWrapper
          text={`A verification email has been sent to ${emailRecipient}. Please follow the instructions to complete your sign up process.`}>
          <div className='success_message'>
            A verification email has been sent to {emailRecipient}. Please follow the instructions
            to complete your sign up process.
          </div>
        </HoverToPlayTTSWrapper>
      )}
      <HoverToPlayTTSWrapper text={'Already have an account? Click here to sign in.'}>
        <h5>
          Already have an account?{' '}
          <button onClick={onSwitch} className='link-button'>
            Sign in
          </button>
        </h5>
      </HoverToPlayTTSWrapper>
    </div>
  );
};

export default SignUp;

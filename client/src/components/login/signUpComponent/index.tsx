import React from 'react';
import { useNavigate } from 'react-router-dom';
import useVerifyUser from '../../../hooks/useVerifyUser';
import LoginInput from '../inputComponent';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';
import ToggleTextToSpeech from '../../textToSpeech/toggleTSS';

/**
 * Component that allows for the verification of new users during signup.
 *
 * @param onSwitch - Function to switch between login and signup.
 */
const SignUp = ({ onSwitch }: { onSwitch: () => void }) => {
  const navigate = useNavigate();
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
    <div>
      {emailRecipient ? (
        <div className='login-input-container'>
          <HoverToPlayTTSWrapper
            text={`A verification email has been sent to ${emailRecipient} containing a verification token.`}>
            <h3 className='success_message'>
              A verification email has been sent to {emailRecipient} containing a verification
              token.
            </h3>
          </HoverToPlayTTSWrapper>
          <button onClick={() => navigate('/verify-email')} className='login-button'>
            Verify Account
          </button>
        </div>
      ) : (
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
            {postEmailVerificationErr && (
              <HoverToPlayTTSWrapper text={postEmailVerificationErr}>
                <div className='error-text'>{postEmailVerificationErr}</div>
              </HoverToPlayTTSWrapper>
            )}
            <HoverToPlayTTSWrapper text={'Button to complete Sign up'}>
              <button type='submit' className='login-button'>
                Sign up
              </button>
            </HoverToPlayTTSWrapper>
          </form>
          <HoverToPlayTTSWrapper text={'Already have an account? Click here to sign in.'}>
            <h5>
              Already have an account?{' '}
              <button onClick={onSwitch} className='link-button'>
                Sign in
              </button>
            </h5>
          </HoverToPlayTTSWrapper>
        </div>
      )}
      <ToggleTextToSpeech isThemed={false} />
    </div>
  );
};

export default SignUp;

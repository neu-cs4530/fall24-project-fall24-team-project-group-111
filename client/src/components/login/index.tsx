import React, { useState } from 'react';
import './index.css';
import useGuestLogin from '../../hooks/useGuestLogin';
import SignIn from './signInComponent';
import SignUp from './signUpComponent';
import HoverToPlayTTSWrapper from '../textToSpeech/textToSpeechComponent';
import ToggleTextToSpeech from '../textToSpeech/toggleTSS';

/**
 * Login Component contains forms that allow the user sign in or sign up for a new account.
 * A sign in submits the user to the application's context through the useLoginContext hook.
 */
const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const { handleSubmit } = useGuestLogin();

  /**
   * Function to switch between the sign in and sign up forms.
   */
  const handleSwitch = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className='container'>
      <HoverToPlayTTSWrapper text={'welcome to Code Flow!'}>
        <h2>Welcome to CodeFlow!</h2>
      </HoverToPlayTTSWrapper>
      {isSignIn ? <SignIn onSwitch={handleSwitch} /> : <SignUp onSwitch={handleSwitch} />}
      <form onSubmit={handleSubmit}>
        <HoverToPlayTTSWrapper text={'Button to continue as a guest.'}>
          <div>
            <button type='submit' className='link-button'>
              Continue as a guest
            </button>
          </div>
        </HoverToPlayTTSWrapper>
      </form>
      <ToggleTextToSpeech isThemed={false} />
    </div>
  );
};

export default Login;

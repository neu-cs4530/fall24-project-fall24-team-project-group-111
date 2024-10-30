import React, { useState } from 'react';
import './index.css';
import useGuestLogin from '../../hooks/useGuestLogin';
import SignIn from './signInComponent';
import AddUser from './addUserComponent';

/**
 * Login Component contains forms that allow the user sign in or create a user,
 * which is then submitted to the application's context through the useLoginContext hook.
 */
const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const { handleSubmit } = useGuestLogin();

  /**
   * Function to switch between the sign in and add user forms.
   */
  const handleSwitch = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      {isSignIn ? <SignIn onSwitch={handleSwitch} /> : <AddUser onSwitch={handleSwitch} />}
      <form onSubmit={handleSubmit}>
        <button type='submit' className='link-button'>
          Continue as a guest
        </button>
      </form>
    </div>
  );
};

export default Login;

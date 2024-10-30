import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLoginUser from '../../../hooks/useLoginUser';
import LoginInput from '../inputComponent';

/**
 * Component that allows users to sign in to their account.
 *
 * @param onSwitch - Function to switch between login and signup.
 */
const SignIn = ({ onSwitch }: { onSwitch: () => void }) => {
  const navigate = useNavigate();
  const {
    username,
    setUsername,
    password,
    setPassword,
    usernameErr,
    passwordErr,
    postLoginErr,
    postLoginUser,
  } = useLoginUser();

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const loginSuccessful = await postLoginUser();
    if (loginSuccessful) {
      navigate('/home');
    }
  };

  return (
    <div className='login-input-container'>
      <h3>Sign in to your account</h3>
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
          title={'Password'}
          id={'passwordInput'}
          val={password}
          setState={setPassword}
          err={passwordErr}
          type='password'
        />
        {postLoginErr && <div className='error-text'>{postLoginErr}</div>}
        <button type='submit' className='login-button'>
          Sign In
        </button>
      </form>
      <h5>
        Don’t have an account?{' '}
        <button onClick={onSwitch} className='link-button'>
          Sign up
        </button>
      </h5>
    </div>
  );
};

export default SignIn;

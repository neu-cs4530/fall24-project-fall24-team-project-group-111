import React from 'react';
import './index.css';
import useLogin from '../../../hooks/useLogin';

const SignIn = ({ onSwitch }: { onSwitch: () => void }) => {
  const { username, handleSubmit, handleInputChange } = useLogin();

  return (
    <div>
      <form onSubmit={handleSubmit} className='login-input-container'>
        <input
          type='text'
          value={username}
          onChange={handleInputChange}
          placeholder='Username'
          required
          className='input-text'
          id={'usernameInput'}
        />
        <input
          type='password'
          placeholder='Password'
          required
          className='input-text'
          id={'passwordInput'}
        />
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

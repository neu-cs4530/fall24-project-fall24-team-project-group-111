import React from 'react';
import './index.css';
import useLogin from '../../../hooks/useLogin';

const AddUser = ({ onSwitch }: { onSwitch: () => void }) => {
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
        <input type='text' placeholder='Email' required className='input-text' id={'emailInput'} />
        <button type='submit' className='login-button'>
          Sign up
        </button>
      </form>
      <h5>
        Already have an account?{' '}
        <button onClick={onSwitch} className='link-button'>
          Sign in
        </button>
      </h5>
    </div>
  );
};

export default AddUser;

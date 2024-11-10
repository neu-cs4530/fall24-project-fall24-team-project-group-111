import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAddUser from '../../../hooks/useAddUser';
import LoginInput from '../inputComponent';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';

/**
 * Component that allows users to create an account.
 *
 * @param onSwitch - Function to switch between login and signup.
 */
const AddUser = ({ onSwitch }: { onSwitch: () => void }) => {
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
    postUserErr,
    postNewUser,
  } = useAddUser();

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const postSuccessful = await postNewUser();
    if (postSuccessful) {
      navigate('/home');
    }
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
        {postUserErr && <div className='error-text'>{postUserErr}</div>}
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
  );
};

export default AddUser;

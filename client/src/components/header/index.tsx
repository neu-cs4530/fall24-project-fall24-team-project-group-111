import React from 'react';
import { useNavigate } from 'react-router-dom';
import useHeader from '../../hooks/useHeader';
import useUserContext from '../../hooks/useUserContext';
import './index.css';
import UserMenu from './userMenu';
import HoverToPlayTTSWrapper from '../textToSpeech/textToSpeechComponent';

/**
 * Header component that renders the main title, a search bar, and a Sign In button
 * for guests or a User Menu for signed in users.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown } = useHeader();
  const navigate = useNavigate();
  const { user } = useUserContext();

  /**
   * Function to handle navigation to the login page.
   */
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div id='header' className='header'>
      <div></div>
      <HoverToPlayTTSWrapper text={'Fake Stack Overflow'}>
        <div className='title'>Fake Stack Overflow</div>
      </HoverToPlayTTSWrapper>
      <HoverToPlayTTSWrapper text={'Search bar'}>
        <input
          id='searchBar'
          placeholder='Search ...'
          type='text'
          value={val}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </HoverToPlayTTSWrapper>
      {user.username === 'Guest' ? (
        <button className='menubtn' onClick={handleLogout}>
          Sign In
        </button>
      ) : (
        <UserMenu username={user.username} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Header;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import useHeader from '../../hooks/useHeader';
import useUserContext from '../../hooks/useUserContext';
import './index.css';
import UserMenu from './userMenu';
import HoverToPlayTTSWrapper from '../textToSpeech/textToSpeechComponent';
import ToggleTextToSpeech from '../textToSpeech/toggleTSS';

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
      <HoverToPlayTTSWrapper text={'Code FLow'}>
        <div className='title'>CodeFlow</div>
      </HoverToPlayTTSWrapper>
      <div className='search-container'>
        <i className='fas fa-search search-icon'></i>
        <input
          id='searchBar'
          className='search-bar'
          placeholder='Search...'
          type='text'
          value={val}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      {user.username === 'Guest' ? (
        <HoverToPlayTTSWrapper text='Sign In'>
          <button className='menubtn' onClick={handleLogout}>
            Sign In
          </button>
        </HoverToPlayTTSWrapper>
      ) : (
        <UserMenu username={user.username} onLogout={handleLogout} />
      )}
      <ToggleTextToSpeech />
    </div>
  );
};

export default Header;

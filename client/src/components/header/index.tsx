import React from 'react';
import { useNavigate } from 'react-router-dom';
import useHeader from '../../hooks/useHeader';
import './index.css';
import HoverToPlayTTSWrapper from '../textToSpeech/textToSpeechComponent';
import ToggleTextToSpeech from '../textToSpeech/toggleTSS';

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown } = useHeader();
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the "Settings" page.
   */
  const handleNavigateSetting = () => {
    navigate('/settings');
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
      <HoverToPlayTTSWrapper text={'Button for settings page'}>
        <button
          className='bluebtn'
          onClick={() => {
            handleNavigateSetting();
          }}>
          Settings
        </button>
      </HoverToPlayTTSWrapper>
      <ToggleTextToSpeech />
    </div>
  );
};

export default Header;

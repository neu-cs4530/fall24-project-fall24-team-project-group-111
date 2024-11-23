import React from 'react';
import { useNavigate } from 'react-router-dom';
import useHeader from '../../hooks/useHeader';
import './index.css';
import HoverToPlayTTSWrapper from '../textToSpeech/textToSpeechComponent';
import { useTheme } from '../../contexts/ThemeContext';
import ToggleTextToSpeech from '../textToSpeech/toggleTSS';

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown } = useHeader();
  const navigate = useNavigate();
  const { theme } = useTheme();

  /**
   * Function to handle navigation to the "Settings" page.
   */
  const handleNavigateSetting = () => {
    navigate('/settings');
  };
  let logo: string;
  switch (theme) {
    case 'Autumn':
      logo = '/LightLogo.png';
      break;
    case 'DarkMode':
      logo = '/LightLogo.png';
      break;
    default:
      logo = '/darkLogo.png'; // Optional default case
  }
  return (
    <div id='header' className='header'>
      <img className='SiteLogo' src={logo} alt='Logo' />
      <HoverToPlayTTSWrapper text={'Code Flow'}>
        <div className='title'>Code Flow</div>
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

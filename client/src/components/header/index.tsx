import React from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import useHeader from '../../hooks/useHeader';
import useUserContext from '../../hooks/useUserContext';
import './index.css';
import UserMenu from './userMenu';
import HoverToPlayTTSWrapper from '../textToSpeech/textToSpeechComponent';
import ToggleTextToSpeech from '../textToSpeech/toggleTSS';
import { useTheme } from '../../contexts/ThemeContext';
import getContrastRatio from '../../utils/color.utils';

const Header = () => {
  const { val, handleInputChange, handleKeyDown } = useHeader();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { buttonColor } = useTheme();

  const lightLogoColor = '#FFFFFF';
  const darkLogoColor = '#3A3E45';

  const lightLogoContrast = getContrastRatio(buttonColor, lightLogoColor);
  const darkLogoContrast = getContrastRatio(buttonColor, darkLogoColor);

  const logo = darkLogoContrast > lightLogoContrast ? '/darkLogo.png' : '/LightLogo.png';

  /**
   * Function to handle navigation to the login page.
   */
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div id='header' className='header'>
      <div className='logo-title-container'>
        <img className='SiteLogo' src={logo} alt='Logo' />
      </div>

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

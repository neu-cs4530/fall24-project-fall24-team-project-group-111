import { useState } from 'react';
import './index.css';
import { ThemeType } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import { changeTheme } from '../../../services/userAuthService';
import { useTheme } from '../../../contexts/ThemeContext';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';

/**
 * Settings page component that displays the content of the settings page and handles
 * adjusting theme, text boldness, size, and font
 */
const SettingsPage = () => {
  const { user } = useUserContext();
  const { theme, setTheme } = useTheme();
  const [textSize, setTextSize] = useState('medium');
  const [textBoldness, setTextBoldness] = useState('normal');
  const [font, setFont] = useState('Arial');

  // text color based on theme
  const getTextColor = () => {
    switch (theme) {
      case 'LightMode':
        return 'black';
      case 'DarkMode':
        return 'white';
      case 'Pastel':
        return '#333';
      case 'Autumn':
        return '#f4a300';
      default:
        return 'black';
    }
  };

  // font size switch made for preview
  let fontSize;
  switch (textSize) {
    case 'small':
      fontSize = '12px';
      break;
    case 'medium':
      fontSize = '16px';
      break;
    default:
      fontSize = '20px';
      break;
  }

  const saveSettings = () => {
    const themeSettings = {
      LightMode: {
        backgroundColor: '#ffffff',
        primaryColor: '#3089e8',
        secondaryColor: '#0056b3',
        headerBackground: '#b2b2b2',
        borderColor: '#000000',
        orderButton: '#ffffff',
        commentSectionBackground: '#c2c2c2',
        commentItemBackground: '#fff',
        commentTextAreaColor: '#fff',
        tagLabel: '#3c4776',
      },
      DarkMode: {
        backgroundColor: '#090822',
        primaryColor: '#bb86fc',
        secondaryColor: '#03dac6',
        headerBackground: '#2c2d5d',
        borderColor: '#efefeff3',
        orderButton: '#efefeff3',
        commentSectionBackground: '#2c2d5d',
        commentItemBackground: '#505180',
        commentTextAreaColor: '#505180',
        tagLabel: '#aebcf9',
      },
      Pastel: {
        backgroundColor: '#f2a4f8',
        primaryColor: '#FFB5E8',
        secondaryColor: '#000000',
        headerBackground: '#A5E3F8',
        borderColor: '#A5E3FF',
        orderButton: '#A79AFF',
        commentSectionBackground: '#a4f9bf',
        commentItemBackground: '#f483e5',
        commentTextAreaColor: '#f2df9b',
        tagLabel: '#890000',
      },
      Autumn: {
        backgroundColor: '#7A1825',
        primaryColor: '#842C5C',
        secondaryColor: '#E2BF84',
        headerBackground: '#4e1119',
        borderColor: '#395A42',
        orderButton: '#D23735',
        commentSectionBackground: '#1b2E26',
        commentItemBackground: '#474c32',
        commentTextAreaColor: '#f2df9b',
        tagLabel: '#ffecec',
      },
    };

    const currentThemeSettings = themeSettings[theme] || themeSettings.LightMode;
    localStorage.setItem('theme', theme);
    localStorage.setItem('textSize', textSize);
    localStorage.setItem('textBoldness', textBoldness);
    localStorage.setItem('font', font);

    document.documentElement.style.setProperty('--font-size', fontSize);
    document.documentElement.style.setProperty(
      '--font-weight',
      textBoldness === 'bold' ? 'bold' : 'normal',
    );
    document.documentElement.style.setProperty('--font-family', font);
    document.documentElement.style.setProperty('--text-color', getTextColor());

    Object.entries(currentThemeSettings).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key.toLowerCase()}`, value);
    });

    changeTheme(user.username, theme);
  };

  const handleThemeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as ThemeType;
    setTheme(newTheme);

    // const textColor = getTextColor();
    const textColor =
      newTheme === 'LightMode'
        ? 'black'
        : newTheme === 'DarkMode'
          ? 'white'
          : newTheme === 'Pastel'
            ? '#000000'
            : '#DDC084';

    const backgroundColor =
      newTheme === 'LightMode'
        ? '#fff'
        : newTheme === 'DarkMode'
          ? '#333'
          : newTheme === 'Pastel'
            ? '#f2a4f8'
            : '#7A1825';

    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--background-color', backgroundColor);

    await changeTheme(user.username, newTheme);
  };

  const handleTextSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = event.target.value;
    setTextSize(newSize);

    document.documentElement.style.setProperty('--font-size', newSize);
  };

  const handleTextBoldnessChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newBoldness = event.target.value;
    setTextBoldness(newBoldness);

    document.documentElement.style.setProperty(
      '--font-weight',
      newBoldness === 'bold' ? 'bold' : 'normal',
    );
  };

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFont = event.target.value;
    setFont(newFont);

    document.documentElement.style.setProperty('--font-family', newFont);
  };

  return (
    <>
      <HoverToPlayTTSWrapper text={'Settings'}>
        <h1 className='settings-title'>Settings</h1>
      </HoverToPlayTTSWrapper>
      <div className='settings-container'>
        <HoverToPlayTTSWrapper text={'Change theme'}>
          <div className='settings-row'>
            <label htmlFor='theme-select' className='theme-label'>
              Change theme
            </label>
            <select
              id='theme-select'
              value={theme}
              onChange={handleThemeChange}
              className='theme-select'>
              <option value='' disabled>
                Select a theme
              </option>
              <option value='LightMode'>Light Mode</option>
              <option value='DarkMode'>Dark Mode</option>
              <option value='Pastel'>Pastel Mode</option>
              <option value='Autumn'>Autumn Mode</option>
            </select>
          </div>
        </HoverToPlayTTSWrapper>
        <HoverToPlayTTSWrapper text={'Adjust text size'}>
          <div className='settings-row'>
            <label htmlFor='text-size-select' style={{ marginRight: '10px' }}>
              Text Size:
            </label>
            <select
              id='text-size-select'
              value={textSize}
              onChange={handleTextSizeChange}
              style={{ padding: '5px', fontSize: '16px' }}>
              <option value='small'>Small</option>
              <option value='medium'>Medium</option>
              <option value='large'>Large</option>
            </select>
          </div>
        </HoverToPlayTTSWrapper>
        <HoverToPlayTTSWrapper text={'Adjust text boldness'}>
          <div className='settings-row'>
            <label htmlFor='text-boldness-select' style={{ marginRight: '10px' }}>
              Text Boldness:
            </label>
            <select
              id='text-boldness-select'
              value={textBoldness}
              onChange={handleTextBoldnessChange}
              style={{ padding: '5px', fontSize: '16px' }}>
              <option value='normal'>Normal</option>
              <option value='bold'>Bold</option>
            </select>
          </div>
        </HoverToPlayTTSWrapper>
        <HoverToPlayTTSWrapper text={'Change font'}>
          <div className='settings-row'>
            <label htmlFor='font-select' style={{ marginRight: '10px' }}>
              Font:
            </label>
            <select
              id='font-select'
              value={font}
              onChange={handleFontChange}
              style={{ padding: '5px', fontSize: '16px' }}>
              <option value='Arial'>Arial</option>
              <option value='Times New Roman'>Times New Roman</option>
              <option value='Courier New'>Courier New</option>
            </select>
          </div>
        </HoverToPlayTTSWrapper>

        {/* save button */}
        <button onClick={saveSettings} className='save-button'>
          Save Settings
        </button>

        {/* preview for text */}
        <div className='preview-container'>
          <p
            className='preview-text'
            style={{
              fontSize,
              fontWeight: textBoldness === 'bold' ? 'bold' : 'normal',
              fontFamily: font,
              color: getTextColor(),
            }}>
            Preview Text: This is how your selected settings will look!
          </p>
        </div>
      </div>
    </>
  );
};
export default SettingsPage;

import { useState } from 'react';
import './index.css';
import { FontType, TextBoldnessType, TextSizeType, ThemeType } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import { changeTheme } from '../../../services/userAuthService';
import { useTheme } from '../../../contexts/ThemeContext';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';
import { useFont } from '../../../contexts/FontContext';

/**
 * Settings page component that displays the content of the settings page and handles
 * adjusting theme, text boldness, size, and font
 */
const SettingsPage = () => {
  const { user } = useUserContext();
  const { theme, setTheme } = useTheme();
  const { font, setFont, textSize, setTextSize, textBoldness, setTextBoldness } = useFont();
  //const [textSize, setTextSize] = useState('medium');
  //const [textBoldness, setTextBoldness] = useState('normal');
 // const [font, setFont] = useState('Arial');

    // // saves the settings 
    // const saveSettings = () => { //rn this is to local storage (?) cold change to smthn else??
    //   localStorage.setItem('theme', theme);
    //   localStorage.setItem('textSize', textSize);
    //   localStorage.setItem('textBoldness', textBoldness);
    //   localStorage.setItem('font', font);
  
    //   document.documentElement.style.setProperty('--theme-color', getTextColor());
    //   document.documentElement.style.setProperty('--font-size', textSize === 'small' ? '12px' : textSize === 'medium' ? '16px' : '20px');
    //   document.documentElement.style.setProperty('--font-weight', textBoldness === 'bold' ? 'bold' : 'normal');
    //   document.documentElement.style.setProperty('--font-family', font);
  
    //   changeTheme(user.username, theme); 
    // };
  

    //text color based on theme
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

  const handleThemeChange = async (Event: { target: { value: unknown } }) => {
    setTheme(Event.target.value as ThemeType);
    await changeTheme(user.username, Event.target.value as ThemeType); // alters back-end user data to save theme
  };

  const handleTextSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTextSize(event.target.value as TextSizeType);
  };

  const handleTextBoldnessChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTextBoldness(event.target.value as TextBoldnessType);
  };

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(event.target.value as FontType);
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

       {/*preview for text*/}
        <div className="preview-container">
          <p
            className="preview-text"
            style={{
              fontSize: textSize === 'small' ? '12px' : textSize === 'medium' ? '16px' : '20px',
              fontWeight: textBoldness === 'bold' ? 'bold' : 'normal',
              fontFamily: font,
              color: getTextColor(),
            }}
          >
            Preview Text: This is how your selected settings will look!
          </p>
        </div>
      </div>
    </>
  );
};
export default SettingsPage;

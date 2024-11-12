import './index.css';
import {
  FontType,
  LineSpacingType,
  TextBoldnessType,
  TextSizeType,
  ThemeType,
} from '../../../types';
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
  const {
    font,
    setFont,
    textSize,
    setTextSize,
    textBoldness,
    setTextBoldness,
    lineSpacing,
    setLineSpacing,
  } = useFont();

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

  const handleLineSpacingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLineSpacing(event.target.value as LineSpacingType);
  };

  return (
    <>
      <HoverToPlayTTSWrapper text={'Settings'}>
        <h1 className='settings-title'>User Settings</h1>
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
            <select id='text-size-select' value={textSize} onChange={handleTextSizeChange}>
              <option value='small'>Small</option>
              <option value='medium'>Medium</option>
              <option value='large'>Large</option>
              <option value='x-large'>X-Large</option>
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
              onChange={handleTextBoldnessChange}>
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
            <select id='font-select' value={font} onChange={handleFontChange}>
              <option value='Arial'>Arial</option>
              <option value='Times New Roman'>Times New Roman</option>
              <option value='Courier New'>Courier New</option>
            </select>
          </div>
        </HoverToPlayTTSWrapper>
        <HoverToPlayTTSWrapper text={'Adjust line spacing'}>
          <div className='settings-row'>
            <label htmlFor='font-select' style={{ marginRight: '10px' }}>
              Line Spacing:
            </label>
            <select id='font-select' value={lineSpacing} onChange={handleLineSpacingChange}>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
            </select>
          </div>
        </HoverToPlayTTSWrapper>

        {/* preview for text */}
        <div className='preview-container'>
          <HoverToPlayTTSWrapper
            text={
              'This is an example preview text that says: This is how your selected settings will look!'
            }>
            <p>
              Preview Text: <br /> This is how your selected settings will look!
            </p>
          </HoverToPlayTTSWrapper>
        </div>
      </div>
    </>
  );
};
export default SettingsPage;

import './index.css';
import { useNavigate } from 'react-router-dom';
import { FontType, TextBoldnessType, TextSizeType, ThemeType } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import { changeTheme } from '../../../services/userAuthService';
import { useTheme } from '../../../contexts/ThemeContext';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';
import { useFont } from '../../../contexts/FontContext';
import useAccountRecoveryPage from '../../../hooks/useAccountRecoveryPage';

/**
 * Settings page component that displays the content of the settings page and handles
 * adjusting theme, text boldness, size, and font
 */
const SettingsPage = () => {
  const { user } = useUserContext();
  const { theme, setTheme } = useTheme();
  const { font, setFont, textSize, setTextSize, textBoldness, setTextBoldness } = useFont();
  const navigate = useNavigate();

  const { username, setUsername, postSendPasswordReset } = useAccountRecoveryPage();

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

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handlePwdResetSubmit = async () => {
    setUsername(user.username);
    if (username) {
      await postSendPasswordReset();
      navigate('/reset-password/invalidtoken');
    }
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

        {/* preview for text */}
        <div className='preview-container'>
          <p>Preview Text: This is how your selected settings will look!</p>
        </div>
        {user.username !== 'Guest' && (
          <HoverToPlayTTSWrapper text={'Button to send password reset email.'}>
            <button
              type='submit'
              className='reset-pwd-button'
              onClick={() => handlePwdResetSubmit()}>
              Send email to reset password
            </button>
          </HoverToPlayTTSWrapper>
        )}
      </div>
    </>
  );
};
export default SettingsPage;

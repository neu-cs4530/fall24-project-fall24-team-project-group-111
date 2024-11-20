import './index.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCallback, useEffect } from 'react';
import {
  FontType,
  LineSpacingType,
  TextBoldnessType,
  TextSizeType,
  ThemeType,
} from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import {
  changeFont,
  changeLineSpacing,
  changeTextBoldness,
  changeTextSize,
  changeTheme,
} from '../../../services/userAuthService';
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
  const navigate = useNavigate();

  const { username, setUsername, postSendPasswordReset } = useAccountRecoveryPage();

  const themeCustomizers = document.querySelectorAll('span');
  const dynamicInputs = document.querySelectorAll('input.input-color-picker');

  const handleThemeUpdate = (cssVars: { [x: string]: string | null }) => {
    const root = document.querySelector(':root') as HTMLElement;
    const keys = Object.keys(cssVars);
    keys.forEach(key => {
      if (root) {
        root.style.setProperty(key, cssVars[key]);
      }
    });
  };

  themeCustomizers.forEach(item => {
    item.addEventListener('click', e => {
      const bgColor = (e.target as HTMLElement)?.getAttribute('data-background-color');
      const textColor = (e.target as HTMLElement)?.getAttribute('data-text-color');
      const buttonColor = (e.target as HTMLElement)?.getAttribute('data-button-background');

      handleThemeUpdate({
        '--custom-background-color': bgColor,
        '--custom-text-color': textColor,
        '--custom-button-background': buttonColor,
      });

      $("input.input-color-picker[data-id='button-background']").val(buttonColor!);
      $("input.input-color-picker[data-id='text-color']").val(textColor!);
      $("input.input-color-picker[data-id='background-color']").val(bgColor!);
    });
  });

  dynamicInputs.forEach(item => {
    item.addEventListener('input', e => {
      const cssPropName = `--custom-${(e.target as HTMLElement)?.getAttribute('data-id')}`;
      handleThemeUpdate({
        [cssPropName]: (e.target as HTMLInputElement)?.value,
      });
    });
  });

  const handleThemeChange = async (Event: { target: { value: unknown } }) => {
    setTheme(Event.target.value as ThemeType);
    await changeTheme(user.username, Event.target.value as ThemeType); // alters back-end user data to save theme
  };

  const handleTextSizeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTextSize(event.target.value as TextSizeType);
    await changeTextSize(user.username, event.target.value as TextSizeType); // alters back-end user data
  };

  const handleTextBoldnessChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTextBoldness(event.target.value as TextBoldnessType);
    await changeTextBoldness(user.username, event.target.value as TextBoldnessType); // alters back-end user data
  };

  const handleFontChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(event.target.value as FontType);
    await changeFont(user.username, event.target.value as FontType); // alters back-end user data
  };

  const handleLineSpacingChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLineSpacing(event.target.value as LineSpacingType);
    await changeLineSpacing(user.username, event.target.value as LineSpacingType); // alters back-end user data
  };

  /**
   * Memoized function to load user settings.
   *
   * This function fetches user settings from the `/getUserSettings/{username}` endpoint,
   * and upon a successful response, updates the state variables for theme, text size,
   * text boldness, font, and line spacing.
   *
   * @param {string} username - The username of the user whose settings are to be loaded.
   * @returns {Promise<void>} - This function does not return a value but performs state updates.
   */
  const loadSettings = useCallback(
    async (_userUsername: string) => {
      try {
        const response = await axios.get(`/getUserSettings/${_userUsername}`);
        const { settings } = response.data;

        setTheme(settings.theme);
        setTextSize(settings.textSize);
        setTextBoldness(settings.textBoldness);
        setFont(settings.font);
        setLineSpacing(settings.lineSpacing);
      } catch (error) {
        // console.error('Failed to load user settings:', error);
      }
    },
    [setFont, setLineSpacing, setTextBoldness, setTextSize, setTheme],
  ); // Add the set functions as dependencies

  /**
   * Effect hook that triggers when the user object changes.
   *
   * This hook will call `loadSettings` to fetch and apply the settings of the newly
   * logged-in user, or when the user object is updated.
   *
   * @effect This hook will re-run when the `user` object changes (e.g., after login).
   */
  useEffect(() => {
    if (user) {
      loadSettings(user.username);
    }
  }, [user, loadSettings]); // Now loadSettings has the correct dependencies

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handlePwdResetSubmit = async () => {
    setUsername(user.username);
    if (username) {
      await postSendPasswordReset();
      navigate('/reset-password');
    }
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
              Theme:
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
              <option value='Custom'>Custom Mode</option>
            </select>
          </div>
        </HoverToPlayTTSWrapper>
        <div className='settings-row'>
          <div>
            <label>Background: </label>
            <input
              className='input-color-picker'
              type='color'
              data-id='background-color'
              name='Background'
            />
          </div>
          <div>
            <label>Accent Color 2: </label>
            <input className='input-color-picker' type='color' data-id='text-color' name='Text' />
          </div>
          <div>
            <label>Accent Color 1: </label>
            <input
              className='input-color-picker'
              type='color'
              data-id='button-background'
              name='Button'
            />
          </div>
        </div>
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
        {user.username !== 'Guest' && user.email && (
          <HoverToPlayTTSWrapper text={'Button to send password reset email.'}>
            <button
              type='submit'
              className='reset-pwd-button'
              onClick={() => handlePwdResetSubmit()}>
              Send password reset email to {user.email}
            </button>
          </HoverToPlayTTSWrapper>
        )}
      </div>
    </>
  );
};
export default SettingsPage;

import { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import './index.css';
import { ThemeType } from '../../../types';

/**
 * Settings page component that displays the content of the settings page and handles
 * adjusting theme, text boldness, size, and font
 */
const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [textSize, setTextSize] = useState('medium');
  const [textBoldness, setTextBoldness] = useState('normal');
  const [font, setFont] = useState('Arial');

  const handleThemeChange = (Event: { target: { value: unknown } }) => {
    setTheme(Event.target.value as ThemeType);
  };

  const handleTextSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTextSize(event.target.value);
  };

  const handleTextBoldnessChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTextBoldness(event.target.value);
  };

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(event.target.value);
  };

  return (
    <>
      <h1 className='settings-title'>Settings</h1>

      <div className='settings-container'>
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
          </select>
        </div>
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
      </div>
    </>
  );
};
export default SettingsPage;

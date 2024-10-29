import { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import './index.css';

const SettingsPage = () => {
  type ThemeTypes = 'LightMode' | 'DarkMode';
  const { theme, setTheme } = useTheme();

  // state variables
  const [textSize, setTextSize] = useState('medium');
  const [textBoldness, setTextBoldness] = useState('normal');
  const [font, setFont] = useState('Arial');

  const handleThemeChange = (Event: { target: { value: unknown } }) => {
    setTheme(Event.target.value as ThemeTypes);
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

      <div style={{ fontSize: textSize, fontWeight: textBoldness, fontFamily: font, marginTop: '20px', marginLeft: '20px' }}>
        Sample text preview
      </div>
    </>
  );
};
export default SettingsPage;
import { useTheme } from '../../../contexts/ThemeContext';
import './index.css';

const SettingsPage = () => {
  type ThemeTypes = 'LightMode' | 'DarkMode';
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (Event: { target: { value: unknown } }) => {
    setTheme(Event.target.value as ThemeTypes);
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
    </>
  );
};

export default SettingsPage;

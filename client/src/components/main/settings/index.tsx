import { useState } from 'react';

const SettingsPage = () => {
  type ThemeTypes = 'LightMode' | 'DarkMode';
  const [theme, setTheme] = useState<ThemeTypes>();

  const handleThemeChange = (Event: { target: { value: unknown } }) => {
    setTheme(Event.target.value as ThemeTypes);
  };

  return (
    <>
      <h1
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
          marginLeft: '20px',
        }}>
        Settings
      </h1>

      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginLeft: '20px' }}>
        <label htmlFor='theme-select' style={{ marginRight: '10px' }}>
          Change theme
        </label>
        <select
          id='theme-select'
          value={theme}
          onChange={handleThemeChange}
          style={{ padding: '5px', fontSize: '16px' }}>
          <option value='' disabled>
            Select a theme
          </option>
          <option value='light'>LightMode</option>
          <option value='dark'>DarkMode</option>
        </select>
      </div>
    </>
  );
};
export default SettingsPage;

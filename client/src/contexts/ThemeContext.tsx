import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ThemeType } from '../types';
import useUserContext from '../hooks/useUserContext';

/**
 * Context used to set the theme when the theme is changed, as well as the background color and text color
 * for Custom Theme
 * Default to light mode.
 * State used to track and set theme.
 */
type ThemeContextType = {
  theme: ThemeType;
  setTheme: Dispatch<SetStateAction<ThemeType>>;
  backgroundColor: string;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  textColor: string;
  setTextColor: Dispatch<SetStateAction<string>>;
  buttonColor: string;
  setButtonColor: Dispatch<SetStateAction<string>>;
};
const ThemeContext = createContext<ThemeContextType>({
  theme: 'LightMode',
  setTheme: () => {},
  backgroundColor: '#ffffff',
  setBackgroundColor: () => {},
  textColor: '#000000',
  setTextColor: () => {},
  buttonColor: '#5c0707',
  setButtonColor: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext();
  const [theme, setTheme] = useState<ThemeType>(user?.settings?.theme || 'LightMode');
  const [backgroundColor, setBackgroundColor] = useState<string>(
    user?.settings?.backgroundColor || '#ffffff',
  );
  const [textColor, setTextColor] = useState<string>(user?.settings?.textColor || '#000000');
  const [buttonColor, setButtonColor] = useState<string>(user?.settings?.buttonColor || '#5c0707');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    const root = document.querySelector(':root') as HTMLElement;

    root.style.setProperty('--custom-background-color', backgroundColor);
    root.style.setProperty('--custom-text-color', textColor);
    root.style.setProperty('--custom-button-background', buttonColor);
  }, [theme, backgroundColor, textColor, buttonColor]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        backgroundColor,
        setBackgroundColor,
        textColor,
        setTextColor,
        buttonColor,
        setButtonColor,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => useContext(ThemeContext);

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

/**
 * Context used to set the theme when the theme is changed
 * Default to light mode.
 * State used to track and set theme.
 */
type ThemeContextType = {
  theme: ThemeType;
  setTheme: Dispatch<SetStateAction<ThemeType>>;
};
const ThemeContext = createContext<ThemeContextType>({ theme: 'LightMode', setTheme: () => {} });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>(
    () => (localStorage.getItem('theme') as ThemeType) || 'LightMode',
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => useContext(ThemeContext);

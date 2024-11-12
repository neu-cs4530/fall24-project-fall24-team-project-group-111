import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
  } from 'react';
  
  type FontContextType = {
    font: string;
    setFont: Dispatch<SetStateAction<string>>;
  };
  
  const FontContext = createContext<FontContextType>({ font: 'Arial', setFont: () => {} });
  
  export const FontProvider = ({ children }: { children: ReactNode }) => {
    const [font, setFont] = useState<string>('Arial');
  
    useEffect(() => {
      document.documentElement.style.setProperty('--font-family', font);
    }, [font]);
  
    return <FontContext.Provider value={{ font, setFont }}>{children}</FontContext.Provider>;
  };
  
  export const useFont = () => useContext(FontContext);
  
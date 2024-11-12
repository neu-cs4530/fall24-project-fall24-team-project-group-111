import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TextSizeType, TextBoldnessType } from '../types';

type FontContextType = {
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
  textSize: TextSizeType;
  setTextSize: Dispatch<SetStateAction<TextSizeType>>;
  textBoldness: TextBoldnessType;
  setTextBoldness: Dispatch<SetStateAction<TextBoldnessType>>;
};

// const FontContext = createContext<FontContextType>({ font: 'Arial', setFont: () => {} });

const FontContext = createContext<FontContextType>({
  font: 'Arial',
  setFont: () => {},
  textSize: 'medium',
  setTextSize: () => {},
  textBoldness: 'normal',
  setTextBoldness: () => {},
});

export const FontProvider = ({ children }: { children: ReactNode }) => {
  const [font, setFont] = useState<string>('Arial');
  const [textSize, setTextSize] = useState<TextSizeType>('medium');
  const [textBoldness, setTextBoldness] = useState<TextBoldnessType>('normal');

  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', font);
    document.documentElement.style.setProperty('--font-size', textSize);
    document.documentElement.style.setProperty('--font-weight', textBoldness);
  }, [font, textSize, textBoldness]);

  return (
    <FontContext.Provider
      value={{ font, setFont, textSize, setTextSize, textBoldness, setTextBoldness }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => useContext(FontContext);

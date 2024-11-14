import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TextSizeType, TextBoldnessType, FontType, LineSpacingType } from '../types';
import useUserContext from '../hooks/useUserContext';

type FontContextType = {
  font: FontType;
  setFont: Dispatch<SetStateAction<FontType>>;
  textSize: TextSizeType;
  setTextSize: Dispatch<SetStateAction<TextSizeType>>;
  textBoldness: TextBoldnessType;
  setTextBoldness: Dispatch<SetStateAction<TextBoldnessType>>;
  lineSpacing: LineSpacingType;
  setLineSpacing: Dispatch<SetStateAction<LineSpacingType>>;
};

const FontContext = createContext<FontContextType>({
  font: 'Arial',
  setFont: () => {},
  textSize: 'medium',
  setTextSize: () => {},
  textBoldness: 'normal',
  setTextBoldness: () => {},
  lineSpacing: '1',
  setLineSpacing: () => {},
});

export const FontProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext();
  const [font, setFont] = useState<FontType>('Arial');
  const [textSize, setTextSize] = useState<TextSizeType>('medium');
  const [textBoldness, setTextBoldness] = useState<TextBoldnessType>('normal');
  const [lineSpacing, setLineSpacing] = useState<LineSpacingType>('1');

  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', font);
    document.documentElement.style.setProperty('--font-size', textSize);
    document.documentElement.style.setProperty('--font-weight', textBoldness);
    document.documentElement.style.setProperty('--line-height', lineSpacing);
  }, [font, textSize, textBoldness, lineSpacing]);

  return (
    <FontContext.Provider
      value={{
        font,
        setFont,
        textSize,
        setTextSize,
        textBoldness,
        setTextBoldness,
        lineSpacing,
        setLineSpacing,
      }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => useContext(FontContext);

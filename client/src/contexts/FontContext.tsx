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

const mapTextSizeToCSSValue = (textSize: TextSizeType): string => {
  switch (textSize) {
    case 'small':
      return '12px';
    case 'medium':
      return '16px';
    case 'large':
      return '20px';
    case 'x-large':
      return '24px';
    default:
      return '16px'; // Default to medium if the value is not recognized
  }
};

export const FontProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext();
  const [font, setFont] = useState<FontType>(user?.settings?.font || 'Arial');
  const [textSize, setTextSize] = useState<TextSizeType>(user?.settings?.textSize || 'medium');
  const [textBoldness, setTextBoldness] = useState<TextBoldnessType>(
    user?.settings?.textBoldness || 'normal',
  );
  const [lineSpacing, setLineSpacing] = useState<LineSpacingType>(
    user?.settings?.lineSpacing || '1',
  );

  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', font);
    document.documentElement.style.setProperty('--font-size', mapTextSizeToCSSValue(textSize));
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

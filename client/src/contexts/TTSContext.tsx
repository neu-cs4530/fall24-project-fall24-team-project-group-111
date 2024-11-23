import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

/**
 * Context used to set whether text to speech is enabled
 */
type TTSContextType = {
  ttsEnabled: boolean;
  setTTSEnabled: Dispatch<SetStateAction<boolean>>;
};
const TTSContext = createContext<TTSContextType>({ ttsEnabled: false, setTTSEnabled: () => {} });
export const TTSProvider = ({ children }: { children: ReactNode }) => {
  const [ttsEnabled, setTTSEnabled] = useState<boolean>(false);

  return (
    <TTSContext.Provider value={{ ttsEnabled, setTTSEnabled }}>{children}</TTSContext.Provider>
  );
};
export const useTTSEnabled = () => useContext(TTSContext);

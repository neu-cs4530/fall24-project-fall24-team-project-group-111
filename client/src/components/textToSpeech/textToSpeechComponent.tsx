import React, { useState, useEffect } from 'react';
import textToSpeech from '../../utils/textToSpeech';
import { useTTSEnabled } from '../../contexts/TTSContext';

/**
 * Text to speech component that users use to hear the text that it is on.
 * isOnRight determines which side of the object it should show up on.
 * is enabled/disabled by toggling the toggleTTS component.
 */
interface HoverToPlayTTSWrapperProps {
  children: React.ReactNode;
  text: string;
  isOnRight?: boolean;
}

/**
 * Function to allow the option to select "play" when the user is hovering over the object.
 */
const HoverToPlayTTSWrapper = ({
  children,
  text,
  isOnRight = true,
}: HoverToPlayTTSWrapperProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { ttsEnabled } = useTTSEnabled();

  const handleButtonClick = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      textToSpeech(text);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const handleSpeechEnd = () => setIsPlaying(false);

    window.speechSynthesis.addEventListener('end', handleSpeechEnd);
    return () => {
      window.speechSynthesis.removeEventListener('end', handleSpeechEnd);
    };
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: isOnRight ? 'row' : 'row-reverse',
        alignItems: 'center',
        gap: '8px',
        position: 'relative',
      }}>
      {children}
      {isHovered && ttsEnabled && (
        <button
          className='playTTSButton'
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            borderRadius: '5px',
            transition: 'opacity 0.3s',
          }}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            handleButtonClick();
          }}>
          {isPlaying ? '⏹️ Stop' : '🔊 Play'}
        </button>
      )}
    </div>
  );
};

export default HoverToPlayTTSWrapper;

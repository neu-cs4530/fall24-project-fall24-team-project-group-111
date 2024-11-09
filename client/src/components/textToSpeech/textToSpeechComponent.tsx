import React, { useState, useEffect } from 'react';
import textToSpeech from '../../utils/textToSpeech';

interface HoverToPlayTTSWrapperProps {
  children: React.ReactNode;
  text: string;
  isOnRight?: boolean;
}

const HoverToPlayTTSWrapper = ({
  children,
  text,
  isOnRight = true,
}: HoverToPlayTTSWrapperProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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
      {children} {}
      {isHovered && (
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

import { useTTSEnabled } from '../../contexts/TTSContext';
import './toggleTSS.css';

const ToggleTextToSpeech = ({ isThemed = true }: { isThemed?: boolean }) => {
  const { ttsEnabled, setTTSEnabled } = useTTSEnabled();

  const handleToggle = () => {
    setTTSEnabled(!ttsEnabled);
  };

  return (
    <div className={`${isThemed ? '' : 'toggle-container-top-right'}`}>
      <div className={`ttsLabel ${isThemed ? 'styled-ttsLabel' : ''}`}>Enable text to speech</div>
      <div
        className={`toggle-container ${isThemed ? '' : 'toggle-container-background-color'} ${isThemed ? 'styled-container' : ''}`}
        onClick={handleToggle}>
        <div
          className={`toggle-button ${ttsEnabled ? 'on' : 'off'} ${isThemed ? 'styled-button' : ''}`}>
          <div className={`circle ${isThemed ? 'styled-circle' : ''}`} />
          <span
            className={`text ${ttsEnabled ? 'right' : 'left'} ${isThemed ? 'styled-text' : ''}`}>
            {ttsEnabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ToggleTextToSpeech;

import { useTTSEnabled } from '../../contexts/TTSContext';
import './toggleTSS.css';

/**
 * The toggle component that allows users to select whether or not they want to use the text to speech feature
 * Can be turned on and off everywhere throughout the site.
 * isThemed is used to determine what colors are used for the component (based on whether or not we want it to follow the theme of the page).
 */
const ToggleTextToSpeech = ({ isThemed = true }: { isThemed?: boolean }) => {
  const { ttsEnabled, setTTSEnabled } = useTTSEnabled();

  const handleToggle = () => {
    setTTSEnabled(!ttsEnabled);
  };

  return (
    <div className={`${isThemed ? '' : 'toggle-container-top-right'}`}>
      <div className={`ttsLabel ${isThemed ? 'styled-ttsLabel' : ''}`}>Text to Speech</div>
      <div
        className={`toggle-container ${isThemed ? '' : 'toggle-container-background-color'}`}
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

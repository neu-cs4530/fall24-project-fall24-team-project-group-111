import { useNavigate } from 'react-router-dom';
import useLoginContext from './useLoginContext';
import { SettingsInfo } from '../types';

/**
 * Custom hook to handle logging in as a guest.
 *
 * @returns handleSubmit - Function to handle submission of guest login request.
 */
const useGuestLogin = () => {
  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const defaultSettings: SettingsInfo = {
      theme: 'LightMode',
      testSize: 'medium',
      textBoldness: 'normal',
      font: 'Arial',
      lineSpacing: 'normal',
    };
    setUser({ username: 'Guest', settings: defaultSettings });
    navigate('/home');
  };

  return { handleSubmit };
};

export default useGuestLogin;

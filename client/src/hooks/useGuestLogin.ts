import { useNavigate } from 'react-router-dom';
import useLoginContext from './useLoginContext';

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
    setUser({ username: 'Guest' });
    navigate('/home');
  };

  return { handleSubmit };
};

export default useGuestLogin;

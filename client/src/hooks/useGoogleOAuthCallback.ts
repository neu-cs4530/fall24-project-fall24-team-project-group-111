import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authenticateWithGoogle } from '../services/userAuthService';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to handle the Google OAuth callback.
 */
const useGoogleOAuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useLoginContext();
  const [error, setError] = useState<string>('');

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const executeCallback = async () => {
      const code = searchParams.get('code');

      if (code) {
        try {
          const res = await authenticateWithGoogle(code);
          if (res && res.token && res.user) {
            setUser(res.user);
            navigate('/home');
          }
        } catch (err) {
          setError('Error authenticating with Google');
        }
      }
    };

    executeCallback();
  }, [searchParams, setUser, navigate]);

  return { error };
};

export default useGoogleOAuthCallback;

import React from 'react';
import useGoogleOAuthCallback from '../../../../hooks/useGoogleOAuthCallback';
import './index.css';

const GoogleOAuthCallback = () => {
  const { error } = useGoogleOAuthCallback();

  return (
    <div className='container'>
      {error ? (
        <p className='error'>{error}</p>
      ) : (
        <p className='message'>Authenticating with Google...</p>
      )}
    </div>
  );
};

export default GoogleOAuthCallback;

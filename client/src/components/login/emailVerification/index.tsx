import React, { useEffect } from 'react';
import useAddUser from '../../../hooks/useAddUser';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';

/**
 * Component that displays the email verification page and creates a new user.
 */
const EmailVerificationPage = () => {
  const { postNewUser, postUserErr } = useAddUser();

  useEffect(() => {
    postNewUser();
  }, [postNewUser]);

  return (
    <div className='container'>
      {postUserErr && (
        <HoverToPlayTTSWrapper text={postUserErr}>
          <div className='error-text'>{postUserErr}</div>
        </HoverToPlayTTSWrapper>
      )}
    </div>
  );
};

export default EmailVerificationPage;

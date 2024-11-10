import React from 'react';
import { useNavigate } from 'react-router-dom';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';

/**
 * AskQuestionButton component that renders a button for navigating to the
 * "New Question" page. When clicked, it redirects the user to the page
 * where they can ask a new question.
 */
const AskQuestionButton = () => {
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the "New Question" page.
   */
  const handleNewQuestion = () => {
    navigate('/new/question');
  };

  return (
    <HoverToPlayTTSWrapper text={'button to Ask a Question'} isOnRight={false}>
      <button
        className='bluebtn'
        onClick={() => {
          handleNewQuestion();
        }}>
        Ask a Question
      </button>
    </HoverToPlayTTSWrapper>
  );
};

export default AskQuestionButton;

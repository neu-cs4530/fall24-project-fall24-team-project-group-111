import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { getMetaData } from '../../../../tool';
import { Question } from '../../../../types';
import HoverToPlayTTSWrapper from '../../../textToSpeech/textToSpeechComponent';
import formatDateToHumanReadable from '../../../../utils/date.utils';
import '@fortawesome/fontawesome-free/css/all.min.css';

/**
 * Interface representing the props for the Question component.
 *
 * q - The question object containing details about the question.
 */
interface QuestionProps {
  q: Question;
}

/**
 * Question component renders the details of a question including its title, tags, author, answers, and views.
 * Clicking on the component triggers the handleAnswer function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param q - The question object containing question details.
 */
const QuestionView = ({ q }: QuestionProps) => {
  const navigate = useNavigate();

  /**
   * Function to navigate to the home page with the specified tag as a search parameter.
   *
   * @param tagName - The name of the tag to be added to the search parameters.
   */
  const clickTag = (tagName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tag', tagName);

    navigate(`/home?${searchParams.toString()}`);
  };

  /**
   * Function to navigate to the specified question page based on the question ID.
   *
   * @param questionID - The ID of the question to navigate to.
   */
  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };
  const qTagsNames = q.tags.map(tag => tag.name);
  const concatTagName = qTagsNames.join(', ');

  const questionTTS = `${q.askedBy} asked a question about ${q.title} on ${formatDateToHumanReadable(q.askDateTime)}. Question has ${q.views.length} views, ${q.answers.length} answers, and tags, ${concatTagName}.`;
  return (
    <div
      className='question right_padding'
      onClick={() => {
        if (q._id) {
          handleAnswer(q._id);
        }
      }}>
      <div className='postStats'>
        <div>
          {q.answers.length || 0} answers
          <i className='fas fa-comments'></i>
        </div>
        <div>
          {q.views.length} views
          <i className='fas fa-eye'></i>
        </div>
        <div>
          {q.upVotes.length} upvotes
          <i className='fas fa-thumbs-up'></i>
        </div>
        <div>
          {q.downVotes.length} downvotes
          <i className='fas fa-thumbs-down'></i>
        </div>
      </div>
      <div className='question_info_container'>
        <div className='question_main_info'>
          <HoverToPlayTTSWrapper text={questionTTS}>
            <div className='postTitle'>{q.title}</div>
          </HoverToPlayTTSWrapper>
          <div className='question_text'>{q.text}</div>
        </div>
        <div className='question_additional_info'>
          <div className='question_tags'>
            {q.tags.map((tag, idx) => (
              <button
                key={idx}
                className='question_tag_button'
                onClick={e => {
                  e.stopPropagation();
                  clickTag(tag.name);
                }}>
                {tag.name}
              </button>
            ))}
          </div>
          <div className='lastActivity'>
            <div className='question_author'>{q.askedBy}</div>
            <div>&nbsp;</div>
            <div className='question_meta'>asked {getMetaData(new Date(q.askDateTime))}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionView;

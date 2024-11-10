import { useState } from 'react';
import { getMetaData } from '../../../tool';
import { Comment } from '../../../types';
import './index.css';
import useUserContext from '../../../hooks/useUserContext';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';
import formatDateToHumanReadable from '../../../utils/date.utils';

/**
 * Interface representing the props for the Comment Section component.
 *
 * - comments - list of the comment components
 * - handleAddComment - a function that handles adding a new comment, taking a Comment object as an argument
 */
interface CommentSectionProps {
  comments: Comment[];
  handleAddComment: (comment: Comment) => void;
}

/**
 * CommentSection component shows the users all the comments and allows the users add more comments.
 *
 * @param comments: an array of Comment objects
 * @param handleAddComment: function to handle the addition of a new comment
 */
const CommentSection = ({ comments, handleAddComment }: CommentSectionProps) => {
  const { user } = useUserContext();
  const [text, setText] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);

  /**
   * Function to handle the addition of a new comment.
   */
  const handleAddCommentClick = () => {
    if (text.trim() === '' || user.username.trim() === '') {
      setTextErr(text.trim() === '' ? 'Comment text cannot be empty' : '');
      return;
    }

    const newComment: Comment = {
      text,
      commentBy: user.username,
      commentDateTime: new Date(),
    };

    handleAddComment(newComment);
    setText('');
    setTextErr('');
  };

  return (
    <div className='comment-section'>
      <HoverToPlayTTSWrapper text={showComments ? 'Hide Comments' : 'Show Comments'}>
        <button className='toggle-button' onClick={() => setShowComments(!showComments)}>
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </HoverToPlayTTSWrapper>

      {showComments && (
        <div className='comments-container'>
          <ul className='comments-list'>
            {comments.length > 0 ? (
              comments.map((comment, index) => {
                const commentTTS = `Comment by ${comment.commentBy} on ${formatDateToHumanReadable(comment.commentDateTime)} says ${comment.text}}`;
                return (
                  <HoverToPlayTTSWrapper key={index} text={commentTTS}>
                    <li key={index} className='comment-item'>
                      <p className='comment-text'>{comment.text}</p>
                      <small className='comment-meta'>
                        {comment.commentBy}, {getMetaData(new Date(comment.commentDateTime))}
                      </small>
                    </li>
                  </HoverToPlayTTSWrapper>
                );
              })
            ) : (
              <p className='no-comments'>No comments yet.</p>
            )}
          </ul>

          <div className='add-comment'>
            <div className='input-row'>
              <textarea
                placeholder='Comment'
                value={text}
                onChange={e => setText(e.target.value)}
                className='comment-textarea'
              />
              <HoverToPlayTTSWrapper text='Button For Add Comment'>
                <button className='add-comment-button' onClick={handleAddCommentClick}>
                  Add Comment
                </button>
              </HoverToPlayTTSWrapper>
            </div>
            {textErr && (
              <HoverToPlayTTSWrapper text={`Error, ${textErr}`}>
                <small className='error'>{textErr}</small>
              </HoverToPlayTTSWrapper>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;

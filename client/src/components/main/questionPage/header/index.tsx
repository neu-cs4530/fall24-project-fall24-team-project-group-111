import React from 'react';
import './index.css';
import OrderButton from './orderButton';
import { OrderType, orderTypeDisplayName } from '../../../../types';
import AskQuestionButton from '../../askQuestionButton';
import HoverToPlayTTSWrapper from '../../../textToSpeech/textToSpeechComponent';

/**
 * Interface representing the props for the QuestionHeader component.
 *
 * titleText - The title text displayed at the top of the header.
 * qcnt - The number of questions to be displayed in the header.
 * setQuestionOrder - A function that sets the order of questions based on the selected message.
 */
interface QuestionHeaderProps {
  titleText: string;
  qcnt: number;
  setQuestionOrder: (order: OrderType) => void;
}

/**
 * QuestionHeader component displays the header section for a list of questions.
 * It includes the title, a button to ask a new question, the number of the quesions,
 * and buttons to set the order of questions.
 *
 * @param titleText - The title text to display in the header.
 * @param qcnt - The number of questions displayed in the header.
 * @param setQuestionOrder - Function to set the order of questions based on input message.
 */
const QuestionHeader = ({ titleText, qcnt, setQuestionOrder }: QuestionHeaderProps) => {
  const orderOptions = Object.values(orderTypeDisplayName).join(', ');
  return (
    <div>
      <div className='space_between right_padding'>
        <HoverToPlayTTSWrapper text={titleText}>
          <div className='bold_title'>{titleText}</div>
        </HoverToPlayTTSWrapper>
        <AskQuestionButton />
      </div>
      <div className='space_between right_padding'>
        <HoverToPlayTTSWrapper text={`${qcnt} questions`}>
          <div className='count_label' id='question_count'>
            {qcnt} questions
          </div>
        </HoverToPlayTTSWrapper>
        <HoverToPlayTTSWrapper text={`The sort by options are: ${orderOptions}`} isOnRight={false}>
          <div className='btns'>
            {Object.keys(orderTypeDisplayName).map((order, idx) => (
              <OrderButton
                key={idx}
                orderType={order as OrderType}
                setQuestionOrder={setQuestionOrder}
              />
            ))}
          </div>
        </HoverToPlayTTSWrapper>
      </div>
    </div>
  );
};
export default QuestionHeader;

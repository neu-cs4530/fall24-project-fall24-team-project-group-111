import React, { useState } from 'react';
import useNewQuestion from '../../../hooks/useNewQuestion';
import Form from '../baseComponents/form';
import TextArea from '../baseComponents/textarea';
import './index.css';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';
import sendPrompt from '../../../services/chatbotServic';

/**
 * NewQuestionPage component allows users to submit a new question with a title,
 * description, tags, and username.
 */
const NewQuestionPage = () => {
  const {
    title,
    setTitle,
    text,
    setText,
    tagNames,
    setTagNames,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
  } = useNewQuestion();

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('Hello! What topic would you like to explore?');

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await sendPrompt(prompt);
    setResponse(res);
    setPrompt('');
  };

  const handlePrompt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  return (
    <div>
      <Form>
        <TextArea
          title={'Question Title'}
          hint={'Limit title to 100 characters or less'}
          id={'formTitleInput'}
          val={title}
          setState={setTitle}
          err={titleErr}
        />
        <TextArea
          title={'Question Text'}
          hint={'Add details'}
          id={'formTextInput'}
          val={text}
          setState={setText}
          err={textErr}
        />
        <TextArea
          title={'Tags'}
          hint={'Add keywords separated by whitespace'}
          id={'formTagInput'}
          val={tagNames}
          setState={setTagNames}
          err={tagErr}
        />
        <div className='btn_indicator_container'>
          <HoverToPlayTTSWrapper text='Button to Post Question'>
            <button
              className='form_postBtn'
              onClick={() => {
                postQuestion();
              }}>
              Post Question
            </button>
          </HoverToPlayTTSWrapper>
          <div className='mandatory_indicator'>* indicates mandatory fields</div>
        </div>
      </Form>
      <div>
        <form className='form' onSubmit={handleSubmit}>
          <div>
            <HoverToPlayTTSWrapper text='Need help forming a question? Brainstorm with our chatbot!'>
              <label className='input-title'>
                Need help forming a question? Brainstorm with our chatbot!
              </label>
            </HoverToPlayTTSWrapper>
            <br />
            <br />
            <input className='input-text' type='text' value={prompt} onChange={handlePrompt} />
          </div>
        </form>
        <HoverToPlayTTSWrapper text={response}>
          <form className='form'>
            <p>{response}</p>
          </form>
        </HoverToPlayTTSWrapper>
      </div>
    </div>
  );
};

export default NewQuestionPage;

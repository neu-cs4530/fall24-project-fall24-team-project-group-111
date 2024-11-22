import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Spinner from 'react-bootstrap/Spinner';
import useNewQuestion from '../../../hooks/useNewQuestion';
import Form from '../baseComponents/form';
import TextArea from '../baseComponents/textarea';
import './index.css';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';
import sendPrompt from '../../../services/chatbotServic';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    posting,
  } = useNewQuestion();

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('Hello! What topic would you like to explore?');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResponse('');
    const res = await sendPrompt(prompt);
    setResponse(res);
    setPrompt('');
    setLoading(false);
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
            {posting && <Spinner animation='grow' variant='light' />}
          </HoverToPlayTTSWrapper>
          <div className='mandatory_indicator'>* indicates mandatory fields</div>
        </div>
      </Form>
      <div>
        <form className='form' onSubmit={handleSubmit}>
          <div>
            <HoverToPlayTTSWrapper
              text='Need help forming a question? Brainstorm with our chatbot! Please enter the topic
                you are interested in:'>
              <label>
                Need help forming a question? Brainstorm with our chatbot! Please enter the topic
                you are interested in:
              </label>
            </HoverToPlayTTSWrapper>
            <input className='input-text' type='text' value={prompt} onChange={handlePrompt} />
            <button className='form_postBtn' type='submit'>
              Brainstorm!
            </button>
          </div>
        </form>
        <HoverToPlayTTSWrapper text={response}>
          <form className='form'>
            {loading && (
              <div className='spinner-container'>
                <Spinner animation='grow' variant='light' />
              </div>
            )}
            <ReactMarkdown>{response}</ReactMarkdown>
          </form>
        </HoverToPlayTTSWrapper>
      </div>
    </div>
  );
};

export default NewQuestionPage;

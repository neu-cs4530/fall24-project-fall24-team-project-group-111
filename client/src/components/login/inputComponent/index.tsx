import React from 'react';
import './index.css';
import HoverToPlayTTSWrapper from '../../textToSpeech/textToSpeechComponent';

/**
 * Interface representing the props for the LoginInput component.
 *
 * - title - The label to display
 * - link - An optional link to display next to the title.
 * - onLinkClick - An optional function to call when the link is clicked.
 * - hint - An optional hint or description displayed below the title.
 * - id - The unique identifier for the input field.
 * - val - The current value of the input field.
 * - setState - Callback function to update the state with the input field's value.
 * - err - An optional error message to display if there is an error with the input.
 * - type - The type of input field, either 'text' or 'password'.
 */
interface InputProps {
  title: string;
  link?: string;
  onLinkClick?: () => void;
  hint?: string;
  id: string;
  val: string;
  setState: (value: string) => void;
  err?: string;
  type: 'text' | 'password';
}

/**
 * LoginInput component that renders a labeled text input field with optional hint, link, and error message.
 * It also displays an asterisk if the field is mandatory.
 *
 * @param title The label for the input field.
 * @param link Optional link to display next to the title.
 * @param onLinkClick Optional function to call when the link is clicked.
 * @param hint Optional hint or description for the input field.
 * @param id The unique identifier for the input field.
 * @param val The current value of the input field.
 * @param setState Callback function to update the value of the input field.
 * @param err Optional error message to display below the input field.
 * @param type The type of input field, either 'text' or 'password'.
 */
const LoginInput = ({
  title,
  link,
  onLinkClick,
  hint,
  id,
  val,
  setState,
  err,
  type,
}: InputProps) => (
  <>
    <div className='input_header'>
      <HoverToPlayTTSWrapper text={title}>
        <div className='input_header_title'>{title}</div>
      </HoverToPlayTTSWrapper>
      <button onClick={onLinkClick} className='input_header_link'>
        {link}
      </button>
    </div>
    {hint && <div className='input_hint'>{hint}</div>}
    <input
      id={id}
      className='input_input'
      type={type}
      value={val}
      required
      onInput={e => {
        setState(e.currentTarget.value);
      }}
    />
    {err && <div className='input_error'>{err}</div>}
  </>
);

export default LoginInput;

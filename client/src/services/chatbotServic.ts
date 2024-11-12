import api from './config';

const CHAT_API_URL = `${process.env.REACT_APP_SERVER_URL}`;

/**
 * Sends user created prompt to Open AI API.
 *
 * @param prompt - the prompt to provide the API call.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */

const sendPrompt = async (prompt: string) => {
  const res = await api.post(`${CHAT_API_URL}/chat`, { prompt });
  if (res.status !== 200) {
    throw new Error('Error while acessing chatbot');
  }
  return res.data;
};

export default sendPrompt;

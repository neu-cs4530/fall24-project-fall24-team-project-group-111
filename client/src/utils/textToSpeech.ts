export default function textToSpeech(text: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  } else {
    // eslint-disable-next-line no-alert
    alert('Text-to-Speech is not supported in this browser.');
  }
}

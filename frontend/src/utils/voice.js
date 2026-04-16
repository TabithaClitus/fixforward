export const speak = (text, lang = 'en') => {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find a Tamil voice if requested
  if (lang === 'ta') {
    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find(v => v.lang.startsWith('ta'));
    if (tamilVoice) {
      utterance.voice = tamilVoice;
    }
    utterance.lang = 'ta-IN';
  } else {
    utterance.lang = 'en-US';
  }

  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};

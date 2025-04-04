import React, { useEffect, useRef } from 'react';
import { VolumeIcon, PauseIcon, PlayIcon, XIcon } from 'lucide-react';
const TTSButton = ({
  active,
  setActive,
  playing,
  setPlaying
}) => {
  const synth = useRef(window.speechSynthesis);
  const utterance = useRef(null);
  const toggleTTS = () => {
    if (!active) {
      setActive(true);
      setPlaying(true);
      startReading();
    } else {
      if (playing) {
        pauseReading();
      } else {
        resumeReading();
      }
    }
  };
  const stopReading = () => {
    if (synth.current) {
      synth.current.cancel();
    }
    setActive(false);
    setPlaying(false);
  };
  const startReading = () => {
    if (synth.current) {
      // Get all text content from the page
      const textToRead = document.querySelector('.prose').textContent;
      utterance.current = new SpeechSynthesisUtterance(textToRead);
      utterance.current.rate = 0.9; // Slightly slower rate for better comprehension
      utterance.current.pitch = 1;
      // Try to find an Indian English voice if available
      const voices = synth.current.getVoices();
      const indianVoice = voices.find(voice => voice.name.includes('Indian') || voice.lang === 'en-IN');
      if (indianVoice) {
        utterance.current.voice = indianVoice;
      }
      utterance.current.onend = () => {
        setPlaying(false);
        setActive(false);
      };
      synth.current.speak(utterance.current);
    }
  };
  const pauseReading = () => {
    if (synth.current) {
      synth.current.pause();
      setPlaying(false);
    }
  };
  const resumeReading = () => {
    if (synth.current) {
      synth.current.resume();
      setPlaying(true);
    }
  };
  useEffect(() => {
    return () => {
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);
  return <div className="fixed bottom-8 right-8 flex flex-col gap-2">
      {active && <button className="w-12 h-12 rounded-full bg-[#0F52BA] text-[#F5F5DC] flex items-center justify-center shadow-lg hover:bg-[#0F52BA]/90 transition-colors" onClick={stopReading} aria-label="Stop reading">
          <XIcon size={20} />
        </button>}
      <button className="w-14 h-14 rounded-full bg-[#0F52BA] text-[#F5F5DC] flex items-center justify-center shadow-lg hover:bg-[#0F52BA]/90 transition-colors" onClick={toggleTTS} aria-label={active ? playing ? 'Pause reading' : 'Resume reading' : 'Start reading'}>
        {active ? playing ? <PauseIcon size={24} /> : <PlayIcon size={24} /> : <VolumeIcon size={24} />}
      </button>
    </div>;
};
export default TTSButton;
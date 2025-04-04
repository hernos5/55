import React, { useState, Children } from 'react';
import TopBar from './components/TopBar';
import BookReader from './components/BookReader';
import TTSButton from './components/TTSButton';
import WordDefinition from './components/WordDefinition';
export function App() {
  const [selectedWord, setSelectedWord] = useState(null);
  const [ttsActive, setTtsActive] = useState(false);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const handleWordClick = (word, event) => {
    const rect = event.target.getBoundingClientRect();
    setSelectedWord({
      word,
      position: {
        x: rect.left,
        y: rect.bottom
      }
    });
  };
  const closeDefinition = () => {
    setSelectedWord(null);
  };
  return <div className="min-h-screen w-full bg-[#0D0F1F] text-[#F5F5DC] font-serif">
      <TopBar title="Midnight's Children" />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <BookReader onWordClick={handleWordClick} ttsActive={ttsActive} />
      </main>
      <TTSButton active={ttsActive} setActive={setTtsActive} playing={ttsPlaying} setPlaying={setTtsPlaying} />
      {selectedWord && <WordDefinition word={selectedWord.word} position={selectedWord.position} onClose={closeDefinition} />}
    </div>;
}
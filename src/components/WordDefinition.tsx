import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
const WordDefinition = ({
  word,
  position,
  onClose
}) => {
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(true);
  // Mock data for demonstration purposes
  const mockDefinitions = {
    born: {
      definition: 'To come into existence by birth.',
      example: 'She was born in a small village in Kerala.',
      translation: 'जन्म लेना (Hindi) / জন্ম নেওয়া (Bengali)'
    },
    midnight: {
      definition: "The middle of the night; twelve o'clock at night.",
      example: 'The new year begins at the stroke of midnight.',
      translation: 'आधी रात (Hindi) / মধ্যরাত (Bengali)'
    },
    independence: {
      definition: 'Freedom from control or influence of another or others.',
      example: 'India gained independence from British rule in 1947.',
      translation: 'स्वतंत्रता (Hindi) / স্বাধীনতা (Bengali)'
    },
    destiny: {
      definition: 'The predetermined course of events considered as something beyond human power or control.',
      example: 'He believed meeting her was his destiny.',
      translation: 'नियति (Hindi) / ভাগ্য (Bengali)'
    },
    soothsayer: {
      definition: 'A person who predicts the future by magical, intuitive, or more rational means.',
      example: 'The soothsayer warned Caesar about the Ides of March.',
      translation: 'भविष्यवक्ता (Hindi) / ভবিষ্যদ্বক্তা (Bengali)'
    }
  };
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
      if (mockDefinitions[cleanWord]) {
        setDefinition(mockDefinitions[cleanWord]);
      } else {
        // Default definition for words not in our mock database
        setDefinition({
          definition: 'Definition not available for this word.',
          example: '',
          translation: ''
        });
      }
      setLoading(false);
    }, 300);
  }, [word]);
  // Calculate position for the popup
  const popupStyle = {
    left: `${Math.min(position.x, window.innerWidth - 320)}px`,
    top: `${Math.min(position.y + 10, window.innerHeight - 200)}px`
  };
  return <div className="fixed z-20 w-80 bg-[#0D0F1F] border border-[#0F52BA] rounded-md shadow-lg p-4" style={popupStyle}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[#FFD700] font-medium">{word}</h3>
        <button onClick={onClose} className="text-[#F5F5DC] hover:text-[#FFD700] transition-colors" aria-label="Close definition">
          <XIcon size={16} />
        </button>
      </div>
      {loading ? <div className="py-4 text-center">Loading...</div> : <>
          <div className="mb-2">
            <p className="text-sm text-[#F5F5DC]">{definition.definition}</p>
          </div>
          {definition.example && <div className="mb-2">
              <p className="text-xs italic text-[#F5F5DC]/80">
                "{definition.example}"
              </p>
            </div>}
          {definition.translation && <div className="pt-2 border-t border-[#0F52BA]/30">
              <p className="text-xs text-[#FFD700]">{definition.translation}</p>
            </div>}
        </>}
    </div>;
};
export default WordDefinition;
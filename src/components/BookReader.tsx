import React, { Fragment } from 'react';
const BookReader = ({
  onWordClick,
  ttsActive
}) => {
  const handleTextClick = e => {
    if (e.target.tagName.toLowerCase() === 'span') {
      onWordClick(e.target.textContent, e);
    }
  };
  // Wrap each word in a span for click detection
  const processText = text => {
    return text.split(' ').map((word, index) => <Fragment key={index}>
        <span className={`cursor-pointer hover:text-[#FFD700] transition-colors ${ttsActive ? 'pointer-events-none' : ''}`}>
          {word}
        </span>{' '}
      </Fragment>);
  };
  return <div className="prose prose-lg prose-invert max-w-none" onClick={handleTextClick}>
      <p className="text-justify leading-[1.8] text-[18px] mb-6">
        {processText("I was born in the city of Bombay… once upon a time. No, that won't do, there's no getting away from the date: I was born in Doctor Narlikar's Nursing Home on August 15th, 1947. And the time? The time matters, too. Well then: at night. No, it's important to be more… On the stroke of midnight, as a matter of fact. Clock-hands joined palms in respectful greeting as I came. Oh, spell it out, spell it out: at the precise instant of India's arrival at independence, I tumbled forth into the world.")}
      </p>
      <p className="text-justify leading-[1.8] text-[18px] mb-6">
        {processText('There were gasps. And, outside the window, fireworks and crowds. A few seconds later, my father broke his big toe; but his accident was a mere trifle when set beside what had befallen me in that benighted moment, because thanks to the occult tyrannies of those blandly saluting clocks I had been mysteriously handcuffed to history, my destinies indissolubly chained to those of my country.')}
      </p>
      <p className="text-justify leading-[1.8] text-[18px] mb-6">
        {processText("For the next three decades, there was to be no escape. Soothsayers had prophesied me, newspapers celebrated my arrival, politicos ratified my authenticity. I was left entirely without a say in the matter. I, Saleem Sinai, later variously called Snotnose, Stainface, Baldy, Sniffer, Buddha and even Piece-of-the-Moon, had become heavily embroiled in Fate — at the best of times a dangerous sort of involvement. And I couldn't even wipe my own nose at the time.")}
      </p>
    </div>;
};
export default BookReader;
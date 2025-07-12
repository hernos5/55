import React from 'react';

const AskQuestion: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Ask a Question</h1>
        <p className="text-gray-600">
          This page will contain a form to create new questions.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          This component will include:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-1">
          <li>Question title input</li>
          <li>Rich text editor for description</li>
          <li>Tag input with suggestions</li>
          <li>Preview functionality</li>
          <li>Form validation</li>
        </ul>
      </div>
    </div>
  );
};

export default AskQuestion;


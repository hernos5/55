import React from 'react';
import { useParams } from 'react-router-dom';

const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Question Detail</h1>
        <p className="text-gray-600">
          This page will show the full question details and answers for question ID: {id}
        </p>
        <p className="text-sm text-gray-500 mt-4">
          This component will be implemented with full Q&A functionality including:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-1">
          <li>Question content with voting</li>
          <li>List of answers with voting</li>
          <li>Answer submission form</li>
          <li>Accept answer functionality</li>
          <li>Comments system</li>
        </ul>
      </div>
    </div>
  );
};

export default QuestionDetail;


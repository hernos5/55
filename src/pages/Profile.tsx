import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">User Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <p className="text-gray-900">{user?.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="text-gray-900 capitalize">{user?.role}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reputation</label>
            <p className="text-gray-900">{user?.reputation}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          This component will include:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-1">
          <li>Profile editing form</li>
          <li>User statistics</li>
          <li>Question and answer history</li>
          <li>Notification settings</li>
          <li>Password change form</li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;


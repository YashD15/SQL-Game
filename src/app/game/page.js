'use client';
import { useState } from 'react';
import SecurityWrapper from '@/components/SecurityWrapper';
import GameInterface from '@/components/GameInterface';

export default function GamePage() {
  const [gameEnded, setGameEnded] = useState(false);
  const [violationReason, setViolationReason] = useState('');
  
  const handleSecurityViolation = (reason) => {
    setViolationReason(reason);
    setGameEnded(true);
  };
  
  if (gameEnded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Game Ended</h2>
          <p className="text-gray-700 mb-4">
            Security violation detected: {violationReason}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <SecurityWrapper onSecurityViolation={handleSecurityViolation}>
      <div className="min-h-screen bg-gray-50 py-8">
        <GameInterface />
      </div>
    </SecurityWrapper>
  );
}
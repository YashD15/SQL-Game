'use client';
import { useState } from 'react';

export default function QueryEditor({ onSubmitQuery, currentQuestion, isLoading }) {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmitQuery(query.trim());
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">SQL Query Editor</h3>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Available tables: {currentQuestion?.tables?.join(', ')}
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Executing...' : 'Execute Query'}
          </button>
        </div>
      </form>
      
      {currentQuestion?.hint && (
        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-sm text-yellow-800">
            <strong>Hint:</strong> {currentQuestion.hint}
          </p>
        </div>
      )}
    </div>
  );
}
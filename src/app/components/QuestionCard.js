// src/components/QuestionCard.jsx
'use client';

import React from 'react';
import { CheckCircle, Circle, AlertCircle, Play, XCircle, Lock, Heart } from 'lucide-react';
import { getAttemptsMessage } from '../../utils/gameValidation';

const QuestionCard = ({
  question,
  query,
  result,
  validationStatus,
  error,
  loading,
  showHint,
  attempts,
  onQueryChange,
  onExecuteQuery,
  onToggleHint,
  validationMessage
}) => {
  const isBlocked = attempts >= question.maxAttempts;
  const isCorrect = validationStatus === 'correct';

  const res = '[{"col_name":"Answer"}]';

  // Render hearts for attempts
  const renderHearts = (attempts, maxAttempts = 5) => {
    const usedAttempts = attempts || 0;
    const remainingAttempts = Math.max(0, maxAttempts - usedAttempts);
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(maxAttempts)].map((_, index) => (
          <Heart
            key={index}
            className={`w-4 h-4 ${
              index < remainingAttempts
                ? 'text-red-500 fill-red-500' // Red filled heart for remaining attempts
                : 'text-gray-600 fill-gray-600' // Gray/black heart for used attempts
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusIcon = () => {
    if (loading) {
      return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    }
    
    if (isBlocked && !isCorrect) {
      return <Lock className="w-5 h-5 text-red-600" />;
    }
    
    switch (validationStatus) {
      case 'correct':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'incorrect':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCardBorderClass = () => {
    if (isCorrect) return 'border-green-500/50 bg-green-900/10';
    if (isBlocked) return 'border-red-600/50 bg-red-900/20';
    if (validationStatus === 'incorrect' || validationStatus === 'error') {
      return 'border-red-500/50 bg-red-900/10';
    }
    return 'border-purple-500/30';
  };

  const getInputBorderClass = () => {
    if (isCorrect) return 'border-green-500 focus:ring-green-500/30';
    if (isBlocked) return 'border-red-600 focus:ring-red-600/30';
    if (validationStatus === 'incorrect' || validationStatus === 'error') {
      return 'border-red-500 focus:ring-red-500/30';
    }
    return 'border-purple-500/50 focus:ring-purple-500/30';
  };

  return (
    <div className={`bg-black/20 rounded-lg p-6 border transition-all duration-300 ${getCardBorderClass()}`}>
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg mb-2">
              Q{question.id}: {question.question}
            </h3>
            {/* Hearts Display - aligned to the right */}
            <div className="flex items-center gap-2">
              {renderHearts(attempts, question.maxAttempts || 5)}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">Tables: {question.tables.join(', ')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {getStatusIcon()}
          {/* <button
            onClick={onToggleHint}
            className="text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <AlertCircle className="w-5 h-5" />
          </button> */}
        </div>
      </div>

      {/* Blocked Message */}
      {isBlocked && !isCorrect && (
        <div className="mb-4 bg-red-900/30 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-300">
            <Lock className="w-5 h-5" />
            <span className="font-medium">Question Locked</span>
          </div>
          <p className="text-red-200 text-sm mt-1">
            You&apos;ve exceeded the maximum number of attempts ({question.maxAttempts || 5}) for this question.
          </p>
        </div>
      )}

      {/* SQL Query Input */}
      {(!isBlocked || isCorrect) && (
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            SQL Query:
          </label>
          <div className="relative">
            <textarea
              value={query || ''}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="SELECT item_name FROM exorcism_items WHERE..."
              disabled={isCorrect || loading}
              className={`w-full px-4 py-3 rounded-lg bg-black/30 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all font-mono text-sm min-h-[100px] resize-y disabled:opacity-60 disabled:cursor-not-allowed ${getInputBorderClass()}`}
              rows={4}
            />
            <button
              onClick={() => onExecuteQuery(query)}
              disabled={!query?.trim() || loading || isCorrect || isBlocked}
              className="absolute bottom-3 right-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm flex items-center gap-1 transition-colors"
            >
              <Play className="w-3 h-3" />
              {loading ? 'Running...' : isCorrect ? 'Solved' : 'Run Query'}
            </button>
          </div>
        </div>
      )}

      {/* Query Results */}
      {result && result.length > 0 && (
        <div className="mb-4 bg-gray-900/50 rounded-lg p-4 border border-gray-600/30">
          <h4 className="text-white text-sm font-medium mb-2">
            Query Result ({result.length} row{result.length > 1 ? 's' : ''}):
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-gray-300">
              <thead>
                <tr className="border-b border-gray-600">
                  {result.length > 0 && Object.keys(result[0]).map(col => (
                    <th key={col} className="text-left p-2 font-medium text-gray-200">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.slice(0, 45).map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-700/50">
                    {Object.values(row).map((val, colIdx) => (
                      <td key={colIdx} className="p-2">{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty Results */}
      {result && result.length === 0 && (
        <div className="mb-4 bg-gray-900/50 rounded-lg p-4 border border-gray-600/30">
          <p className="text-gray-400 text-sm">No results returned by query.</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-300 text-sm">
            ❌ <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Validation Message for Incorrect Answers */}
      {validationStatus === 'incorrect' && validationMessage && (
        <div className="mb-4 bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
          <p className="text-orange-300 text-sm">
            📝 <strong>Validation Details:</strong> {validationMessage}
          </p>
        </div>
      )}

      {/* Hint */}
      {showHint && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
          <p className="text-yellow-200 text-sm">
            💡 <strong>Hint:</strong> {question.hint}
          </p>
        </div>
      )}

      {/* Success Message */}
      {validationStatus === 'correct' && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
          <p className="text-green-300 text-sm">
            ✅ Perfect! Your query returned the correct result: <strong>{question.expectedOutput[0].item_name}</strong>
          </p>
        </div>
      )}
      
      {/* Incorrect Answer Feedback */}
      {validationStatus === 'incorrect' && !isBlocked && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-300 text-sm">
            ❌ The query result doesn&apos;t match the expected answer exactly.
          </p>
          <p className="text-red-200 text-xs mt-1">
            {/* Expected: <strong>{JSON.stringify(question.expectedOutput)}</strong> */}
            Expected: <strong>{res}</strong>
          </p>
          <p className="text-red-200 text-xs">
            Your result must match exactly in structure, column names, values, and row count.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
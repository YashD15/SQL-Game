"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const QuizResultsDashboard = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // const response = await fetch('https://nse-stock-api.onrender.com/getresults'); // Replace with your actual API endpoint
        const response = await fetch('/results.json');
        const data = await response.json();
        
        // Sort results by success rate in ascending order
        const sortedResults = data.results.sort((a, b) => {
          return parseFloat(b.successRate) - parseFloat(a.successRate);
        });
        
        setResults(sortedResults);
        setError(null);
      } catch (err) {
        setError('Failed to fetch quiz results');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSuccessRateColor = (rate) => {
    const numRate = parseFloat(rate);
    if (numRate >= 70) return 'text-green-600';
    if (numRate >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Quiz Results</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {results.map((result, teamIndex) => (
            <div key={teamIndex} className="bg-white rounded-lg shadow-sm border">
              {/* Team Header */}
              <div className="bg-gray-800 text-white p-3 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg">{result.teamName}</h2>
                  <div className="flex gap-4 text-sm">
                    <span>Score: {result.score}/{result.totalQuestions}</span>
                    <span className={getSuccessRateColor(result.successRate)}>
                      {result.successRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Questions Grid */}
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-3 gap-2">
                  {result.questions.map((question) => (
                    <div key={question.id} className="border rounded-lg p-2 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded font-medium">
                            Q{question.id}
                          </span>
                          {question.status === 'correct' ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-600" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {question.attempts}
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 mb-2 line-clamp-2 leading-tight">
                        {question.questionText}
                      </p>

                      <div className="mb-2">
                        <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded block truncate">
                          {question.expectedOutput[0]?.item_name}
                        </span>
                      </div>

                      {/* Hint - Always visible */}
                      <div className="bg-blue-50 border border-blue-200 rounded p-2">
                        <p className="text-xs text-blue-800 leading-tight">{question.questionHint}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Stats Footer */}
              <div className="bg-gray-50 p-3 rounded-b-lg border-t">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Attempts: {result.totalAttempts}</span>
                  <span>Efficiency: {result.efficiency}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizResultsDashboard;
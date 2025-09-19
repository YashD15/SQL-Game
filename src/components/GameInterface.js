'use client';
import { useState, useEffect } from 'react';
import QueryEditor from './QueryEditor';

export default function GameInterface() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchQuestions();
  }, []);
  
  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };
  
  const handleSubmitQuery = async (query) => {
    setIsLoading(true);
    setGameResult(null);
    
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: questions[currentQuestionIndex].id,
          query: query
        })
      });
      
      const result = await response.json();
      
      if (result.type === 'syntax_error') {
        setGameResult({
          type: 'error',
          message: `SQL Error: ${result.error}`
        });
      } else if (result.type === 'correct') {
        setScore(score + 1);
        setGameResult({
          type: 'success',
          message: 'Correct! Well done!'
        });
        
        // Move to next question after a delay
        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setGameResult(null);
          } else {
            setGameResult({
              type: 'complete',
              message: `Game Complete! Final Score: ${score + 1}/${questions.length}`
            });
          }
        }, 2000);
        
      } else if (result.type === 'wrong_output') {
        setGameResult({
          type: 'wrong',
          message: 'Query executed successfully but output is incorrect.',
          userOutput: result.userOutput
        });
      }
      
    } catch (error) {
      setGameResult({
        type: 'error',
        message: 'Failed to execute query'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (questions.length === 0) {
    return <div className="text-center">Loading questions...</div>;
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">SQL Query Game</h1>
          <div className="text-lg">
            Score: {score}/{questions.length} | 
            Question: {currentQuestionIndex + 1}/{questions.length}
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Question {currentQuestionIndex + 1}</h2>
          <p className="text-gray-800">{currentQuestion.question}</p>
        </div>
      </div>
      
      <QueryEditor
        onSubmitQuery={handleSubmitQuery}
        currentQuestion={currentQuestion}
        isLoading={isLoading}
      />
      
      {gameResult && (
        <div className={`mt-6 p-4 rounded-lg ${
          gameResult.type === 'success' ? 'bg-green-100 border border-green-400' :
          gameResult.type === 'error' ? 'bg-red-100 border border-red-400' :
          gameResult.type === 'wrong' ? 'bg-yellow-100 border border-yellow-400' :
          'bg-blue-100 border border-blue-400'
        }`}>
          <p className={`font-semibold ${
            gameResult.type === 'success' ? 'text-green-800' :
            gameResult.type === 'error' ? 'text-red-800' :
            gameResult.type === 'wrong' ? 'text-yellow-800' :
            'text-blue-800'
          }`}>
            {gameResult.message}
          </p>
          
          {gameResult.userOutput && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Your query output:</p>
              <div className="bg-white p-3 rounded border overflow-auto">
                <pre className="text-xs">
                  {JSON.stringify(gameResult.userOutput, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
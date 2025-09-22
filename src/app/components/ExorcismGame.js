// src/components/ExorcismGame.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Database, Skull, Heart } from 'lucide-react';
import { questionSets } from '../../data/randQuestions'; // Updated import
import { validateQueryResult, getValidationMessage, hasExceededMaxAttempts } from '../../utils/gameValidation';
import { executeSQLQuery } from '../../services/databaseService';
import QuestionCard from './QuestionCard';

const ExorcismGame = () => {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentSetInfo, setCurrentSetInfo] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null); // New state for selected question
  
  // Team
  const [teamName, setTeamName] = useState('');
  const [teamInput, setTeamInput] = useState('');
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  
  // Game state
  const [queries, setQueries] = useState({});
  const [results, setResults] = useState({});
  const [validationStatus, setValidationStatus] = useState({});
  const [validationMessages, setValidationMessages] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({});
  const [attempts, setAttempts] = useState({});
  const [showHints, setShowHints] = useState({});

  // Game state
  const [isGameFinished, setIsGameFinished] = useState(false);

  // Helpers for persistence
  const getTeamStorageKey = (name) => `sqlGameState_${name}`;
  const TEAM_NAME_KEY = 'sqlTeamName';

  const initializeRandomSet = () => {
    const setKeys = Object.keys(questionSets);
    const randomSetKey = setKeys[Math.floor(Math.random() * setKeys.length)];
    const selectedSet = questionSets[randomSetKey];
    if (selectedSet && selectedSet.questions) {
      setCurrentQuestions(selectedSet.questions);
      setCurrentSetInfo(selectedSet);
      setSelectedQuestionId(selectedSet.questions[0]?.id);
    }
  };

  const loadPersistedState = (name) => {
    if (typeof window === 'undefined' || !name) return false;
    try {
      const raw = localStorage.getItem(getTeamStorageKey(name));
      if (!raw) return false;
      const saved = JSON.parse(raw);
      // Load set
      const savedSetId = saved?.currentSetInfo?.id;
      const selectedSet = savedSetId && questionSets[savedSetId] ? questionSets[savedSetId] : null;
      if (selectedSet) {
        setCurrentQuestions(selectedSet.questions);
        setCurrentSetInfo(selectedSet);
      }
      // Load game states
      setSelectedQuestionId(saved.selectedQuestionId ?? selectedSet?.questions[0]?.id ?? null);
      setQueries(saved.queries || {});
      setResults(saved.results || {});
      setValidationStatus(saved.validationStatus || {});
      setValidationMessages(saved.validationMessages || {});
      setErrors(saved.errors || {});
      setLoading({}); // do not persist loading
      setAttempts(saved.attempts || {});
      setShowHints(saved.showHints || {});
      setIsGameFinished(!!saved.isGameFinished);
      return true;
    } catch (e) {
      return false;
    }
  };

  const persistState = (name) => {
    if (typeof window === 'undefined' || !name) return;
    const payload = {
      currentSetInfo: currentSetInfo ? { id: currentSetInfo.id } : null,
      selectedQuestionId,
      queries,
      results,
      validationStatus,
      validationMessages,
      errors: {},
      attempts,
      showHints,
      isGameFinished,
    };
    try {
      localStorage.setItem(getTeamStorageKey(name), JSON.stringify(payload));
    } catch {}
  };

  // On first mount, get team name or ask for it
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTeam = localStorage.getItem(TEAM_NAME_KEY);
    if (savedTeam) {
      setTeamName(savedTeam);
    } else {
      setIsTeamModalOpen(true);
    }
  }, []);

  // When teamName becomes available, load saved game or start new random set
  useEffect(() => {
    if (!teamName) return;
    const loaded = loadPersistedState(teamName);
    if (!loaded) {
      initializeRandomSet();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamName]);

  // Persist on key state changes
  useEffect(() => {
    if (!teamName) return;
    persistState(teamName);
  }, [teamName, currentSetInfo, selectedQuestionId, queries, results, validationStatus, validationMessages, attempts, showHints, isGameFinished]);

  // Derived state
  const score = Object.values(validationStatus).filter(status => status === 'correct').length;
  const totalQuestions = currentQuestions.length;
  const isGameCompleted = totalQuestions > 0 && score === totalQuestions;
  const blockedQuestions = currentQuestions.filter(q => 
    hasExceededMaxAttempts(attempts[q.id] || 0, q.maxAttempts || 5) && validationStatus[q.id] !== 'correct'
  ).length;

  // Get currently selected question
  const selectedQuestion = currentQuestions.find(q => q.id === selectedQuestionId);

  // Handle question selection
  const selectQuestion = (questionId) => {
    setSelectedQuestionId(questionId);
  };

  // Execute query for a specific question
  const executeQueryHandler = async (questionId, query) => {
    if (!query?.trim()) return;

    const question = currentQuestions.find(q => q.id === questionId);
    const currentAttempts = attempts[questionId] || 0;

    // Check if question is blocked
    if (hasExceededMaxAttempts(currentAttempts, question.maxAttempts || 5) && validationStatus[questionId] !== 'correct') {
      return;
    }

    // Set loading state
    setLoading(prev => ({ ...prev, [questionId]: true }));
    setErrors(prev => ({ ...prev, [questionId]: null }));
    setResults(prev => ({ ...prev, [questionId]: null }));
    setValidationMessages(prev => ({ ...prev, [questionId]: null }));

    try {
      // Execute query using your database service
      const result = await executeSQLQuery(query);

      if (result.success) {
        setResults(prev => ({ ...prev, [questionId]: result.data }));
        
        // Validate the result with strict matching
        const isCorrect = validateQueryResult(questionId, result.data, question.expectedOutput);
        const message = getValidationMessage(result.data, question.expectedOutput);
        
        setValidationStatus(prev => ({ ...prev, [questionId]: isCorrect ? 'correct' : 'incorrect' }));
        setValidationMessages(prev => ({ ...prev, [questionId]: message }));
        
        // Increment attempts only for incorrect answers
        if (!isCorrect) {
          setAttempts(prev => ({ ...prev, [questionId]: currentAttempts + 1 }));
        }
      } else {
        // Handle SQL errors
        setErrors(prev => ({ ...prev, [questionId]: result.error }));
        setValidationStatus(prev => ({ ...prev, [questionId]: 'error' }));
        setAttempts(prev => ({ ...prev, [questionId]: currentAttempts + 1 }));
      }
      
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        [questionId]: `Execution Error: ${error.message}` 
      }));
      setValidationStatus(prev => ({ ...prev, [questionId]: 'error' }));
      setAttempts(prev => ({ ...prev, [questionId]: currentAttempts + 1 }));
    } finally {
      setLoading(prev => ({ ...prev, [questionId]: false }));
    }
  };

  // Handle query input change
  const handleQueryChange = (questionId, value) => {
    setQueries(prev => ({ ...prev, [questionId]: value }));
  };

  // Toggle hint visibility
  const toggleHint = (questionId) => {
    setShowHints(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  // Render hearts for attempts
  const renderHearts = (questionId, maxAttempts = 5) => {
    const usedAttempts = attempts[questionId] || 0;
    const remainingAttempts = Math.max(0, maxAttempts - usedAttempts);
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(maxAttempts)].map((_, index) => (
          <Heart
            key={index}
            className={`w-3 h-3 ${
              index < remainingAttempts
                ? 'text-red-500 fill-red-500' // Red filled heart for remaining attempts
                : 'text-gray-600 fill-gray-600' // Gray/black heart for used attempts
            }`}
          />
        ))}
      </div>
    );
  };

  // Reset game
  const resetGame = () => {
    // Load a new random set
    initializeRandomSet();
    
    // Reset all game state
    setQueries({});
    setResults({});
    setValidationStatus({});
    setValidationMessages({});
    setErrors({});
    setLoading({});
    setAttempts({});
    setShowHints({});
    setIsGameFinished(false);

    // Clear persisted state for this team (but keep team name)
    try {
      if (teamName) localStorage.removeItem(getTeamStorageKey(teamName));
    } catch {}
  };

  // Finish game manually
  const finishGame = () => {
    setIsGameFinished(true);
  };

  // Get game statistics
  const getGameStats = () => {
    const correctAnswers = score;
    const incorrectAttempts = Object.values(attempts).reduce((sum, att) => sum + att, 0) - correctAnswers;
    const totalAttempts = Object.values(attempts).reduce((sum, att) => sum + att, 0);
    const averageAttemptsPerQuestion = totalAttempts > 0 ? (totalAttempts / totalQuestions).toFixed(1) : 0;
    const successRate = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : 0;
    const efficiency = totalAttempts > 0 ? ((correctAnswers / totalAttempts) * 100).toFixed(1) : 0;
    
    return {
      correctAnswers,
      incorrectAttempts,
      totalAttempts,
      blockedQuestions,
      averageAttemptsPerQuestion,
      successRate,
      efficiency
    };
  };

  const stats = getGameStats();

  // Get detailed question results for final summary
  const getQuestionResults = () => {
    return currentQuestions.map(question => ({
      ...question,
      status: validationStatus[question.id] || 'not_attempted',
      attempts: attempts[question.id] || 0,
      query: queries[question.id] || '',
      result: results[question.id] || null,
      isBlocked: hasExceededMaxAttempts(attempts[question.id] || 0, question.maxAttempts || 5) && validationStatus[question.id] !== 'correct'
    }));
  };

  // Logout / Switch Team
  const logoutTeam = () => {
    try {
      if (teamName) localStorage.removeItem(getTeamStorageKey(teamName));
      localStorage.removeItem(TEAM_NAME_KEY);
    } catch {}

    // Clear in-memory state
    setTeamName('');
    setTeamInput('');
    setIsTeamModalOpen(true);

    setCurrentQuestions([]);
    setCurrentSetInfo(null);
    setSelectedQuestionId(null);
    setQueries({});
    setResults({});
    setValidationStatus({});
    setValidationMessages({});
    setErrors({});
    setLoading({});
    setAttempts({});
    setShowHints({});
    setIsGameFinished(false);
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
      {/* Team Name Modal */}
      {isTeamModalOpen && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-red-900 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-red-400 mb-4">Enter Team Name</h2>
            <input
              autoFocus
              value={teamInput}
              onChange={(e) => setTeamInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && teamInput.trim()) {
                  try { localStorage.setItem(TEAM_NAME_KEY, teamInput.trim()); } catch {}
                  setTeamName(teamInput.trim());
                  setIsTeamModalOpen(false);
                }
              }}
              placeholder="Type your team name and press Enter"
              className="w-full px-4 py-2 rounded bg-black/40 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-700"
            />
            <button
              className="mt-4 w-full px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded font-medium disabled:opacity-60"
              disabled={!teamInput.trim()}
              onClick={() => {
                if (!teamInput.trim()) return;
                try { localStorage.setItem(TEAM_NAME_KEY, teamInput.trim()); } catch {}
                setTeamName(teamInput.trim());
                setIsTeamModalOpen(false);
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-gray-900 border-b border-red-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skull className="w-8 h-8 text-red-500" />
          <h1 className="text-2xl font-bold text-red-400">
            🔍 Murder Mystery SQL Investigation
          </h1>
          {/* Show current question number in header */}
          {selectedQuestion && !isGameFinished && (
            <span className="text-yellow-400 text-sm font-medium px-3 py-1 bg-yellow-900/20 rounded border border-yellow-700">
              Case #{selectedQuestion.id}
            </span>
          )}
        </div>
        
        {/* Stats Bar */}
        <div className="flex items-center gap-6">
          {teamName && (
            <div className="flex items-center gap-1">
              <span className="text-gray-400 text-sm">Team:</span>
              <span className="text-white font-bold">{teamName}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span className="text-gray-400 text-sm">Solved:</span>
            <span className="text-green-400 font-bold">{score}/{totalQuestions}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400 text-sm">Attempts:</span>
            <span className="text-yellow-400 font-bold">{stats.totalAttempts}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400 text-sm">Failed:</span>
            <span className="text-red-400 font-bold">{stats.incorrectAttempts}</span>
          </div>
          {blockedQuestions > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-gray-400 text-sm">Cold Cases:</span>
              <span className="text-red-600 font-bold">{blockedQuestions}</span>
            </div>
          )}
          <button
            onClick={logoutTeam}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm font-medium transition-colors"
          >
            Logout / Switch Team
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Questions List or Results */}
        <div className="w-1/3 bg-gray-950 border-r border-red-900 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-red-400 flex items-center gap-2">
                🗂️ Case Files
              </h2>
              {!isGameFinished && (
                <button
                  onClick={finishGame}
                  className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
                >
                  Close Investigation
                </button>
              )}
            </div>

            {/* Game Status Messages */}
            {totalQuestions > 0 && isGameCompleted && !isGameFinished && (
              <div className="bg-green-900/30 border border-green-700 px-4 py-3 rounded mb-4">
                <span className="text-green-300 font-medium text-sm">
                  ✅ All cases solved! Close investigation to see full report.
                </span>
              </div>
            )}
            
            {blockedQuestions > 0 && !isGameCompleted && !isGameFinished && (
              <div className="bg-red-900/30 border border-red-700 px-4 py-3 rounded mb-4">
                <span className="text-red-300 font-medium text-sm">
                  💀 {blockedQuestions} case{blockedQuestions > 1 ? 's' : ''} gone cold
                </span>
              </div>
            )}

            {/* Cases List */}
            {!isGameFinished ? (
              <div className="space-y-3">
                {currentQuestions.map((question) => {
                  const status = validationStatus[question.id];
                  const isBlocked = hasExceededMaxAttempts(attempts[question.id] || 0, question.maxAttempts || 5) && status !== 'correct';
                  const isSelected = selectedQuestionId === question.id;
                  
                  return (
                    <div 
                      key={question.id}
                      onClick={() => selectQuestion(question.id)}
                      className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-900/30 ring-1 ring-blue-500/50'
                          : status === 'correct' 
                          ? 'border-green-700 bg-green-900/20 hover:bg-green-900/30'
                          : isBlocked
                          ? 'border-red-700 bg-red-900/20 hover:bg-red-900/30'
                          : status === 'incorrect' || status === 'error'
                          ? 'border-yellow-700 bg-yellow-900/20 hover:bg-yellow-900/30'
                          : 'border-gray-700 bg-gray-900/50 hover:bg-gray-900/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium text-sm ${isSelected ? 'text-blue-300' : 'text-white'}`}>
                          Case #{question.id}
                        </span>
                        <div className="flex items-center gap-2">
                          {isSelected && <span className="text-blue-400 text-xs">👁️ ACTIVE</span>}
                          {status === 'correct' && <span className="text-green-400 text-xs">✅ SOLVED</span>}
                          {isBlocked && <span className="text-red-400 text-xs">💀 COLD</span>}
                          {status === 'incorrect' && !isBlocked && <span className="text-yellow-400 text-xs">🔍 INVESTIGATING</span>}
                          {status === 'error' && !isBlocked && <span className="text-orange-400 text-xs">⚠️ ERROR</span>}
                          {!status && !isSelected && <span className="text-gray-400 text-xs">📋 NEW</span>}
                        </div>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {question.question}
                      </p>
                      {/* Hearts display for attempts */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs">Lives:</span>
                          {renderHearts(question.id, question.maxAttempts || 5)}
                        </div>
                        {(attempts[question.id] || 0) > 0 && (
                          <span className="text-gray-500 text-xs">
                            {attempts[question.id]}/{question.maxAttempts || 5}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Final Results Summary
              <div className="space-y-4">
                <div className={`border rounded-lg p-4 text-center ${
                  isGameCompleted 
                    ? 'border-green-700 bg-green-900/20' 
                    : stats.successRate >= 60
                    ? 'border-blue-700 bg-blue-900/20'
                    : 'border-red-700 bg-red-900/20'
                }`}>
                  <h3 className={`text-xl font-bold mb-2 ${
                    isGameCompleted ? 'text-green-300' 
                    : stats.successRate >= 60 ? 'text-blue-300'
                    : 'text-red-300'
                  }`}>
                    {isGameCompleted ? '🏆 Case Closed!' 
                    : stats.successRate >= 60 ? '🎯 Good Detective Work!'
                    : '💀 Investigation Incomplete'}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-black/30 rounded p-2">
                      <div className="text-lg font-bold text-white">{score}/{totalQuestions}</div>
                      <div className="text-xs text-gray-400">Cases Solved</div>
                    </div>
                    <div className="bg-black/30 rounded p-2">
                      <div className="text-lg font-bold text-white">{stats.successRate}%</div>
                      <div className="text-xs text-gray-400">Success Rate</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={resetGame}
                    className="w-full px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded font-medium transition-colors"
                  >
                    🔄 New Investigation
                  </button>
                </div>
                
                {/* Detailed Results */}
                <div>
                  <h4 className="text-white font-medium mb-3">📊 Case Details</h4>
                  <div className="space-y-2">
                    {getQuestionResults().map((question) => (
                      <div 
                        key={question.id}
                        className={`border rounded p-3 ${
                          question.status === 'correct' 
                            ? 'border-green-700 bg-green-900/10'
                            : question.isBlocked
                            ? 'border-red-700 bg-red-900/10'
                            : question.status === 'incorrect' || question.status === 'error'
                            ? 'border-orange-700 bg-orange-900/10'
                            : 'border-gray-700 bg-gray-900/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm font-medium">Case #{question.id}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            question.status === 'correct' 
                              ? 'bg-green-800/30 text-green-300'
                              : question.isBlocked
                              ? 'bg-red-800/30 text-red-300'
                              : question.status === 'incorrect'
                              ? 'bg-orange-800/30 text-orange-300'
                              : 'bg-gray-800/30 text-gray-300'
                          }`}>
                            {question.status === 'correct' ? 'SOLVED' 
                            : question.isBlocked ? 'COLD CASE'
                            : question.status === 'incorrect' ? 'FAILED'
                            : 'NOT ATTEMPTED'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mb-1">{question.question}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs">Lives:</span>
                            {renderHearts(question.id, question.maxAttempts || 5)}
                          </div>
                          <span className="text-xs text-gray-500">
                            {question.attempts}/{question.maxAttempts || 5}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Question Details */
        }
        <div className="flex-1 bg-black overflow-y-auto">
          {!isGameFinished ? (
            <div className="p-6">
              {!currentQuestions.length ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-400">
                    <Skull className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Loading Crime Scene...</p>
                    <p className="text-sm text-gray-500">Preparing murder mystery files...</p>
                  </div>
                </div>
              ) : selectedQuestion ? (
                <QuestionCard
                  key={selectedQuestion.id}
                  question={selectedQuestion}
                  query={queries[selectedQuestion.id]}
                  result={results[selectedQuestion.id]}
                  validationStatus={validationStatus[selectedQuestion.id]}
                  validationMessage={validationMessages[selectedQuestion.id]}
                  error={errors[selectedQuestion.id]}
                  loading={loading[selectedQuestion.id]}
                  showHint={showHints[selectedQuestion.id]}
                  attempts={attempts[selectedQuestion.id] || 0}
                  onQueryChange={(value) => handleQueryChange(selectedQuestion.id, value)}
                  onExecuteQuery={(query) => executeQueryHandler(selectedQuestion.id, query)}
                  onToggleHint={() => toggleHint(selectedQuestion.id)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-400">
                    <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Select a case from the left to start investigating</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Detailed Performance Analysis
            <div className="p-6 space-y-6">
              <div className="bg-gray-900 border border-red-900 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
                  📈 Investigation Report
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">📊 Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cases Solved:</span>
                        <span className="text-white font-medium">{stats.correctAnswers}/{totalQuestions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-white font-medium">{stats.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Attempts:</span>
                        <span className="text-white font-medium">{stats.totalAttempts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Failed Attempts:</span>
                        <span className="text-white font-medium">{stats.incorrectAttempts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Attempts/Case:</span>
                        <span className="text-white font-medium">{stats.averageAttemptsPerQuestion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Efficiency Rate:</span>
                        <span className="text-white font-medium">{stats.efficiency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cold Cases:</span>
                        <span className="text-white font-medium">{stats.blockedQuestions}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-3">🎯 Detective Skills</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Investigation Skills</span>
                          <span className="text-white">{stats.successRate >= 80 ? 'Expert Detective' : stats.successRate >= 60 ? 'Good Detective' : stats.successRate >= 40 ? 'Rookie Detective' : 'Needs Training'}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              stats.successRate >= 80 ? 'bg-green-500' 
                              : stats.successRate >= 60 ? 'bg-blue-500'
                              : stats.successRate >= 40 ? 'bg-yellow-500' 
                              : 'bg-red-500'
                            }`}
                            style={{width: `${Math.min(stats.successRate, 100)}%`}}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Query Efficiency</span>
                          <span className="text-white">{stats.efficiency >= 80 ? 'Master Investigator' : stats.efficiency >= 60 ? 'Skilled Investigator' : stats.efficiency >= 40 ? 'Learning Investigator' : 'Needs Practice'}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              stats.efficiency >= 80 ? 'bg-green-500' 
                              : stats.efficiency >= 60 ? 'bg-blue-500'
                              : stats.efficiency >= 40 ? 'bg-yellow-500' 
                              : 'bg-red-500'
                            }`}
                            style={{width: `${Math.min(stats.efficiency, 100)}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-800">
                      <p className="text-red-300 text-sm">
                        <strong>💡 Detective&apos;s Note:</strong> {
                          stats.successRate >= 80 ? 'Outstanding detective work! Ready for the most complex cases.'
                          : stats.successRate >= 60 ? 'Good investigation skills! Try tackling more complex murder cases.'
                          : stats.successRate >= 40 ? 'Keep practicing! Focus on evidence analysis and witness interrogation.'
                          : 'Start with basic crime scene investigation and simple evidence gathering.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auto Complete Detection */}
      {totalQuestions > 0 && (isGameCompleted || blockedQuestions === totalQuestions) && !isGameFinished && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className={`border rounded-lg p-8 max-w-md w-full mx-4 ${
            isGameCompleted 
              ? 'bg-green-900/20 border-green-700' 
              : 'bg-red-900/20 border-red-700'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 text-center ${
              isGameCompleted ? 'text-green-300' : 'text-red-300'
            }`}>
              {isGameCompleted ? '🎊 All Cases Solved! 🎊' : '💀 Investigation Stalled 💀'}
            </h2>
            <p className={`mb-6 text-center ${
              isGameCompleted ? 'text-green-200' : 'text-red-200'
            }`}>
              {isGameCompleted 
                ? `Outstanding detective work! You've solved all ${totalQuestions} murder mysteries!`
                : `All cases have gone cold. You solved ${score} out of ${totalQuestions} mysteries.`
              }
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={finishGame}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
              >
                📋 View Full Report
              </button>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-red-800 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                🔄 New Investigation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExorcismGame;
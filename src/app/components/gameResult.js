/**
 * Game Results Generator for SQL Murder Mystery
 * Generates comprehensive results including question solutions and player performance
 */

export const generateGameResults = (gameState) => {
  const {
    teamName,
    currentQuestions,
    currentSetInfo,
    queries,
    results,
    validationStatus,
    validationMessages,
    errors,
    attempts,
    showHints,
    isGameFinished,
    score,
    totalQuestions,
    blockedQuestions
  } = gameState;

  // Helper function to get current timestamp
  const getCurrentTimestamp = () => new Date().toISOString();

  // Helper function to get question status
  const getQuestionStatus = (questionId) => {
    const status = validationStatus[questionId];
    const questionAttempts = attempts[questionId] || 0;
    const question = currentQuestions.find(q => q.id === questionId);
    const maxAttempts = question?.maxAttempts || 5;
    
    if (status === 'correct') return 'SOLVED';
    if (questionAttempts >= maxAttempts) return 'COLD_CASE';
    if (status === 'incorrect') return 'FAILED_ATTEMPT';
    if (status === 'error') return 'ERROR';
    return 'NOT_ATTEMPTED';
  };

  // Helper function to calculate time efficiency (mock calculation)
  const calculateTimeEfficiency = () => {
    // Since we don't track actual time, we'll calculate based on attempts
    const totalAttempts = Object.values(attempts).reduce((sum, att) => sum + att, 0);
    const efficiency = totalAttempts > 0 ? ((score / totalAttempts) * 100).toFixed(1) : 0;
    return parseFloat(efficiency);
  };

  // Generate detailed question results
  const questionResults = currentQuestions.map(question => {
    const questionId = question.id;
    const playerQuery = queries[questionId] || '';
    const playerResult = results[questionId];
    const questionStatus = getQuestionStatus(questionId);
    const questionAttempts = attempts[questionId] || 0;
    const usedHint = showHints[questionId] || false;
    const errorMessage = errors[questionId];
    const validationMsg = validationMessages[questionId];

    return {
      questionId: questionId,
      questionText: question.question || question.text || '',
      difficulty: question.difficulty || 'medium',
      maxAttempts: question.maxAttempts || 5,
      category: question.category || 'general',
      
      // Expected solution
      expectedSolution: {
        query: question.solution || question.expectedQuery || 'Not available',
        output: question.expectedOutput || [],
        explanation: question.explanation || question.hint || 'No explanation provided'
      },
      
      // Player's performance
      playerPerformance: {
        status: questionStatus,
        attempts: questionAttempts,
        finalQuery: playerQuery,
        finalResult: playerResult || null,
        usedHint: usedHint,
        errorMessage: errorMessage || null,
        validationMessage: validationMsg || null,
        isCorrect: questionStatus === 'SOLVED',
        isBlocked: questionStatus === 'COLD_CASE',
        livesRemaining: Math.max(0, (question.maxAttempts || 5) - questionAttempts)
      },
      
      // Analysis
      analysis: {
        queryComplexity: playerQuery.length > 100 ? 'high' : playerQuery.length > 50 ? 'medium' : 'low',
        solutionAccuracy: questionStatus === 'SOLVED' ? 100 : 0,
        attemptsEfficiency: questionAttempts > 0 ? ((questionStatus === 'SOLVED' ? 1 : 0) / questionAttempts * 100).toFixed(1) : 0
      }
    };
  });

  // Calculate comprehensive statistics
  const calculateStats = () => {
    const solvedQuestions = questionResults.filter(q => q.playerPerformance.isCorrect).length;
    const coldCases = questionResults.filter(q => q.playerPerformance.isBlocked).length;
    const totalAttempts = questionResults.reduce((sum, q) => sum + q.playerPerformance.attempts, 0);
    const incorrectAttempts = totalAttempts - solvedQuestions;
    const hintsUsed = questionResults.filter(q => q.playerPerformance.usedHint).length;
    
    return {
      overview: {
        totalQuestions: totalQuestions,
        solvedQuestions: solvedQuestions,
        coldCases: coldCases,
        notAttempted: totalQuestions - solvedQuestions - coldCases - questionResults.filter(q => 
          q.playerPerformance.status === 'FAILED_ATTEMPT' || q.playerPerformance.status === 'ERROR'
        ).length,
        successRate: totalQuestions > 0 ? ((solvedQuestions / totalQuestions) * 100).toFixed(1) : 0
      },
      
      attempts: {
        total: totalAttempts,
        correct: solvedQuestions,
        incorrect: incorrectAttempts,
        efficiency: totalAttempts > 0 ? ((solvedQuestions / totalAttempts) * 100).toFixed(1) : 0
      },
      
      hints: {
        totalUsed: hintsUsed,
        usage: totalQuestions > 0 ? ((hintsUsed / totalQuestions) * 100).toFixed(1) : 0
      },
      
      difficulty: {
        easy: questionResults.filter(q => q.difficulty === 'easy').length,
        medium: questionResults.filter(q => q.difficulty === 'medium').length,
        hard: questionResults.filter(q => q.difficulty === 'hard').length,
        easySolved: questionResults.filter(q => q.difficulty === 'easy' && q.playerPerformance.isCorrect).length,
        mediumSolved: questionResults.filter(q => q.difficulty === 'medium' && q.playerPerformance.isCorrect).length,
        hardSolved: questionResults.filter(q => q.difficulty === 'hard' && q.playerPerformance.isCorrect).length
      }
    };
  };

  // Generate performance analysis
  const generatePerformanceAnalysis = (stats) => {
    const successRate = parseFloat(stats.overview.successRate);
    const efficiency = parseFloat(stats.attempts.efficiency);
    
    let skillLevel = 'Rookie Detective';
    let recommendation = 'Start with basic SQL queries and crime scene investigation.';
    let badge = '🔍';
    
    if (successRate >= 90 && efficiency >= 80) {
      skillLevel = 'Master Detective';
      recommendation = 'Outstanding work! Ready for the most complex murder mysteries.';
      badge = '🏆';
    } else if (successRate >= 75 && efficiency >= 70) {
      skillLevel = 'Expert Detective';
      recommendation = 'Excellent detective skills! Try more advanced SQL challenges.';
      badge = '🥇';
    } else if (successRate >= 60 && efficiency >= 60) {
      skillLevel = 'Senior Detective';
      recommendation = 'Good investigation skills! Focus on query optimization.';
      badge = '🥈';
    } else if (successRate >= 40 && efficiency >= 40) {
      skillLevel = 'Detective';
      recommendation = 'Solid progress! Practice more complex JOIN operations.';
      badge = '🥉';
    }
    
    return {
      skillLevel,
      badge,
      recommendation,
      strengths: generateStrengths(stats),
      weaknesses: generateWeaknesses(stats),
      nextSteps: generateNextSteps(stats)
    };
  };

  const generateStrengths = (stats) => {
    const strengths = [];
    
    if (parseFloat(stats.attempts.efficiency) >= 70) {
      strengths.push('High query efficiency - gets results with fewer attempts');
    }
    
    if (parseFloat(stats.hints.usage) <= 30) {
      strengths.push('Independent problem solving - minimal hint usage');
    }
    
    if (stats.difficulty.hardSolved > 0) {
      strengths.push('Can handle complex SQL challenges');
    }
    
    if (stats.overview.coldCases === 0) {
      strengths.push('Persistent investigator - no cold cases');
    }
    
    if (strengths.length === 0) {
      strengths.push('Shows determination in tackling SQL challenges');
    }
    
    return strengths;
  };

  const generateWeaknesses = (stats) => {
    const weaknesses = [];
    
    if (parseFloat(stats.attempts.efficiency) < 50) {
      weaknesses.push('Query efficiency could be improved');
    }
    
    if (parseFloat(stats.hints.usage) > 70) {
      weaknesses.push('High dependency on hints');
    }
    
    if (stats.overview.coldCases > stats.overview.totalQuestions * 0.3) {
      weaknesses.push('Tendency to give up on difficult cases');
    }
    
    if (stats.difficulty.hardSolved === 0 && stats.difficulty.hard > 0) {
      weaknesses.push('Struggles with complex SQL operations');
    }
    
    return weaknesses;
  };

  const generateNextSteps = (stats) => {
    const steps = [];
    
    if (parseFloat(stats.overview.successRate) < 60) {
      steps.push('Practice basic SELECT, WHERE, and JOIN operations');
      steps.push('Review SQL fundamentals and syntax');
    }
    
    if (stats.difficulty.hardSolved === 0 && stats.difficulty.hard > 0) {
      steps.push('Study advanced SQL topics like subqueries and window functions');
    }
    
    if (parseFloat(stats.attempts.efficiency) < 60) {
      steps.push('Plan queries before executing - think through the logic first');
    }
    
    if (steps.length === 0) {
      steps.push('Try more advanced SQL murder mystery cases');
      steps.push('Challenge yourself with real-world database scenarios');
    }
    
    return steps;
  };

  // Compile comprehensive results
  const stats = calculateStats();
  const performance = generatePerformanceAnalysis(stats);
  
  const fullResults = {
    metadata: {
      gameVersion: '1.0.0',
      completedAt: getCurrentTimestamp(),
      gameType: 'SQL Murder Mystery',
      questionSet: currentSetInfo?.name || currentSetInfo?.id || 'Unknown Set',
      teamName: teamName || 'Anonymous Detective'
    },
    
    gameSession: {
      isCompleted: isGameFinished,
      completionType: stats.overview.successRate >= 100 ? 'PERFECT_COMPLETION' : 
                      stats.overview.coldCases === stats.overview.totalQuestions ? 'TOTAL_FAILURE' :
                      'PARTIAL_COMPLETION',
      duration: 'N/A', // Could be tracked in future versions
      timestamp: getCurrentTimestamp()
    },
    
    statistics: stats,
    
    performance: performance,
    
    questionDetails: questionResults,
    
    summary: {
      title: `Investigation Report - Team ${teamName}`,
      outcome: stats.overview.successRate >= 80 ? 'Case Closed Successfully' : 
               stats.overview.successRate >= 50 ? 'Partial Investigation Success' : 
               'Investigation Needs Improvement',
      highlights: [
        `Solved ${stats.overview.solvedQuestions}/${stats.overview.totalQuestions} cases`,
        `${stats.attempts.efficiency}% query efficiency`,
        `${stats.overview.coldCases} cold cases`,
        `Earned ${performance.badge} ${performance.skillLevel} rank`
      ]
    }
  };

  return fullResults;
};

// Console logging functions
export const logGameResults = (gameState) => {
  const results = generateGameResults(gameState);
  
  console.log('🔍 ========== SQL MURDER MYSTERY - INVESTIGATION COMPLETE ==========');
  console.log(`👥 Team: ${results.metadata.teamName}`);
  console.log(`📅 Completed: ${results.metadata.completedAt}`);
  console.log(`🎯 Question Set: ${results.metadata.questionSet}`);
  console.log('');
  
  // Performance Summary
  console.log('📊 INVESTIGATION SUMMARY:');
  console.log(`   🎯 Cases Solved: ${results.statistics.overview.solvedQuestions}/${results.statistics.overview.totalQuestions} (${results.statistics.overview.successRate}%)`);
  console.log(`   💀 Cold Cases: ${results.statistics.overview.coldCases}`);
  console.log(`   🔄 Total Attempts: ${results.statistics.attempts.total}`);
  console.log(`   ⚡ Query Efficiency: ${results.statistics.attempts.efficiency}%`);
  console.log(`   💡 Hints Used: ${results.statistics.hints.totalUsed} (${results.statistics.hints.usage}%)`);
  console.log('');
  
  // Skill Assessment
  console.log('🏆 DETECTIVE ASSESSMENT:');
  console.log(`   ${results.performance.badge} Rank: ${results.performance.skillLevel}`);
  console.log(`   📝 Recommendation: ${results.performance.recommendation}`);
  console.log('');
  
  // Strengths and Weaknesses
  if (results.performance.strengths.length > 0) {
    console.log('💪 STRENGTHS:');
    results.performance.strengths.forEach(strength => {
      console.log(`   ✅ ${strength}`);
    });
    console.log('');
  }
  
  if (results.performance.weaknesses.length > 0) {
    console.log('⚠️ AREAS FOR IMPROVEMENT:');
    results.performance.weaknesses.forEach(weakness => {
      console.log(`   📈 ${weakness}`);
    });
    console.log('');
  }
  
  // Next Steps
  console.log('🎯 NEXT STEPS:');
  results.performance.nextSteps.forEach(step => {
    console.log(`   📌 ${step}`);
  });
  console.log('');
  
  // Detailed Question Results
  console.log('📋 DETAILED CASE RESULTS:');
  results.questionDetails.forEach(question => {
    const status = question.playerPerformance.status;
    const statusEmoji = {
      'SOLVED': '✅',
      'COLD_CASE': '💀',
      'FAILED_ATTEMPT': '❌',
      'ERROR': '⚠️',
      'NOT_ATTEMPTED': '➖'
    }[status] || '❓';
    
    console.log(`   ${statusEmoji} Case #${question.questionId} - ${status}`);
    console.log(`      📝 Question: ${question.questionText.substring(0, 100)}${question.questionText.length > 100 ? '...' : ''}`);
    console.log(`      🎯 Attempts: ${question.playerPerformance.attempts}/${question.maxAttempts}`);
    console.log(`      💡 Hint Used: ${question.playerPerformance.usedHint ? 'Yes' : 'No'}`);
    
    if (question.playerPerformance.finalQuery) {
      console.log(`      🔍 Player Query: ${question.playerPerformance.finalQuery}`);
    }
    
    if (status !== 'SOLVED' && question.expectedSolution.query !== 'Not available') {
      console.log(`      ✨ Solution: ${question.expectedSolution.query}`);
    }
    
    if (question.playerPerformance.errorMessage) {
      console.log(`      ❌ Error: ${question.playerPerformance.errorMessage}`);
    }
    
    console.log('');
  });
  
  console.log('🔍 ========== END INVESTIGATION REPORT ==========');
  
  // Return the full results object for further use
  return results;
};

// Function to save results to a downloadable file
export const downloadGameResults = (gameState, filename = null) => {
  const results = generateGameResults(gameState);
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  const defaultFilename = `sql-mystery-results-${results.metadata.teamName || 'anonymous'}-${timestamp}.json`;
  
  const dataStr = JSON.stringify(results, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  // Create download link
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(dataBlob);
  downloadLink.download = filename || defaultFilename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  console.log(`📁 Results saved as: ${filename || defaultFilename}`);
  return results;
};

// Hook for React component
export const useGameResults = () => {
  const generateResults = (gameState) => generateGameResults(gameState);
  const logResults = (gameState) => logGameResults(gameState);
  const downloadResults = (gameState, filename) => downloadGameResults(gameState, filename);
  
  return {
    generateResults,
    logResults,
    downloadResults
  };
};
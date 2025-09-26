// finalResultGenerator.js

/**
 * Generates final game result JSON.
 * Only stores 'correct' or 'wrong' for each question instead of raw SQL output.
 *
 * @param {Object} params
 * @param {Array} params.questions - currentQuestions array
 * @param {Object} params.queries - user's queries
 * @param {Object} params.validationStatus - question validation statuses
 * @param {Object} params.attempts - attempts per question
 * @param {Object} params.showHints - hints toggled
 * @param {String} params.teamName - current team name
 * @param {Object} params.stats - game statistics (score, efficiency, etc.)
 * @returns {Object} final game result
 */
export const generateFinalResult = ({
  questions,
  queries,
  validationStatus,
  attempts,
  showHints,
  teamName,
  stats
}) => {
  const finalResult = questions.map((question) => ({
    id: question.id,
    questionText: question.question || 'nu',
    questionHint: question.hint,
    expectedOutput: question.expectedOutput || null,
    status: validationStatus[question.id] === 'correct' ? 'correct' : 'wrong',
    attempts: attempts[question.id] || 0,
    showHint: showHints[question.id] || false
  }));

  const gameSummary = {
    teamName,
    totalQuestions: questions.length,
    score: stats.correctAnswers,
    totalAttempts: stats.totalAttempts,
    successRate: stats.successRate,
    efficiency: stats.efficiency,
    questions: finalResult
  };

  // console.log("Final Game Result JSON:", JSON.stringify(gameSummary, null, 2));
  // Send JSON to Flask API
fetch("https://nse-stock-api.onrender.com/sqlresult", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(gameSummary)
})
  .then(response => response.json())
  .then(data => {
    console.log("Server response:", data);
  })
  .catch(error => {
    console.error("Error:", error);
  });
  return gameSummary;
};

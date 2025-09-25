// // Reset game HERE
// const resetGame = () => {
//     // Load a new random set
//     initializeRandomSet();
    
//     // Reset all game state
//     setQueries({});
//     setResults({});
//     setValidationStatus({});
//     setValidationMessages({});
//     setErrors({});
//     setLoading({});
//     setAttempts({});
//     setShowHints({});
//     setIsGameFinished(false);

//     // Clear persisted state for this team (but keep team name)
//     try {
//       if (teamName) localStorage.removeItem(getTeamStorageKey(teamName));
//     } catch {}
//   };

//   // Finish game manually
//   const finishGame = () => {
//     setIsGameFinished(true);
//   };

//   // Logout / Switch Team HERE
//   const logoutTeam = () => {
//     try {
//       if (teamName) localStorage.removeItem(getTeamStorageKey(teamName));
//       localStorage.removeItem(TEAM_NAME_KEY);
//     } catch {}

//     // Clear in-memory state
//     setTeamName('');
//     setTeamInput('');
//     setIsTeamModalOpen(true);

//     setCurrentQuestions([]);
//     setCurrentSetInfo(null);
//     setSelectedQuestionId(null);
//     setQueries({});
//     setResults({});
//     setValidationStatus({});
//     setValidationMessages({});
//     setErrors({});
//     setLoading({});
//     setAttempts({});
//     setShowHints({});
//     setIsGameFinished(false);
//   };

// //   LOG OUT BUTTON
//           {/* <button
//             onClick={logoutTeam}
//             className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm font-medium transition-colors"
//           >
//             Logout / Switch Team
//           </button> */}

// // NEW GAME BUTTON
// {/* <button
//                     onClick={resetGame}
//                     className="w-full px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded font-medium transition-colors"
//                   >
//                     🔄 New Investigation
//                   </button> */}
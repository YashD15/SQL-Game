import React from "react";

async function getResults() {
  const res = await fetch("https://nse-stock-api.onrender.com/getresults", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch results");
  }
  return res.json();
}

export default async function ResultsPage() {
  const data = await getResults();

  if (!data.results || data.results.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-xl font-bold text-red-500 animate-pulse">No souls found...</p>
      </div>
    );
  }

  const sortedResults = [...data.results].sort(
    (a, b) => parseFloat(b.successRate) - parseFloat(a.successRate)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 text-transparent bg-gradient-to-r from-red-500 via-blue-400 to-red-600 bg-clip-text">
          ⚡ RESULTS LEADERBOARD ⚡
        </h1>
        
        <div className="space-y-4">
          {sortedResults.map((team, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border border-red-800/30 rounded-lg p-4 hover:border-red-500/50 transition-all duration-300 shadow-lg hover:shadow-red-500/20"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-blue-300 flex items-center gap-2">
                  {idx === 0 && "👑"} {team.teamName}
                </h2>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-400">{team.successRate}%</div>
                  <div className="text-xs text-gray-400">success rate</div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mb-4 text-sm">
                <div className="text-gray-300">
                  <span className="text-blue-400 font-semibold">{team.score}</span>
                  <span className="text-gray-500">/{team.totalQuestions}</span>
                  <span className="ml-1 text-xs text-gray-400">solved</span>
                </div>
                <div className="text-gray-300">
                  <span className="text-red-400 font-semibold">{team.totalAttempts}</span>
                  <span className="ml-1 text-xs text-gray-400">attempts</span>
                </div>
              </div>

              {/* Questions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {team.questions.map((q) => (
                  <div
                    key={q.id}
                    className={`p-3 rounded border-l-4 text-xs transition-all hover:scale-105 ${
                      q.status === "correct"
                        ? "bg-green-900/20 border-l-green-400 hover:bg-green-900/30"
                        : "bg-red-900/20 border-l-red-400 hover:bg-red-900/30"
                    }`}
                  >
                    <div className="font-medium text-gray-200 mb-1 truncate" title={q.questionText}>
                      {q.questionText}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">
                        {q.attempts} tries
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          q.status === "correct"
                            ? "bg-green-600/20 text-green-300"
                            : "bg-red-600/20 text-red-300"
                        }`}
                      >
                        {q.status === "correct" ? "✓" : "✗"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
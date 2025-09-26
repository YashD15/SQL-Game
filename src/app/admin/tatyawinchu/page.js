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

  const sortedResults = [...data.results].sort(
    (a, b) => parseFloat(b.successRate) - parseFloat(a.successRate)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Team Results</h1>
      <div className="grid gap-6">
        {sortedResults.map((team, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-200"
          >
            <h2 className="text-2xl font-semibold text-blue-700">
              {team.teamName}
            </h2>
            <p className="mt-2 text-gray-700">
              Success Rate:{" "}
              <span className="font-bold">{team.successRate}%</span>
            </p>
            <p className="text-gray-700">
              Score: <span className="font-bold">{team.score}</span> /{" "}
              {team.totalQuestions}
            </p>
            <p className="text-gray-700">
              Attempts: <span className="font-bold">{team.totalAttempts}</span>
            </p>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Questions</h3>
              <ul className="space-y-3">
                {team.questions.map((q) => (
                  <li
                    key={q.id}
                    className={`p-4 rounded-lg border ${
                      q.status === "correct"
                        ? "bg-green-100 border-green-400"
                        : "bg-red-100 border-red-400"
                    }`}
                  >
                    <p className="font-medium">{q.questionText}</p>
                    <p className="text-sm text-gray-600">
                      Attempts: {q.attempts}
                    </p>
                    <p className="text-sm">
                      Expected:{" "}
                      {q.expectedOutput.map((o) => o.item_name).join(", ")}
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        q.status === "correct"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      Status: {q.status}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

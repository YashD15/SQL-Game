export const gameQuestions = [
  {
    id: 1,
    question: "Find all employees in the Engineering department",
    expectedOutput: [
      { id: 1, name: 'John Doe', department: 'Engineering', salary: 75000, hire_date: '2020-01-15' },
      { id: 3, name: 'Bob Johnson', department: 'Engineering', salary: 80000, hire_date: '2021-06-10' }
    ],
    hint: "Use WHERE clause to filter by department",
    tables: ['employees']
  },
  {
    id: 2,
    question: "Count the number of employees in each department",
    expectedOutput: [
      { department: 'Engineering', count: 2 },
      { department: 'HR', count: 1 },
      { department: 'Marketing', count: 2 }
    ],
    hint: "Use GROUP BY and COUNT functions",
    tables: ['employees']
  },
  {
    id: 3,
    question: "Find employees with salary greater than 70000, ordered by salary descending",
    expectedOutput: [
      { id: 3, name: 'Bob Johnson', department: 'Engineering', salary: 80000, hire_date: '2021-06-10' },
      { id: 1, name: 'John Doe', department: 'Engineering', salary: 75000, hire_date: '2020-01-15' }
    ],
    hint: "Use WHERE, ORDER BY with DESC",
    tables: ['employees']
  }
];

export function checkAnswer(questionId, userResult) {
  const question = gameQuestions.find(q => q.id === questionId);
  if (!question) return false;
  
  const expected = question.expectedOutput;
  const actual = userResult.data;
  
  // Deep comparison of results
  return JSON.stringify(expected.sort()) === JSON.stringify(actual.sort());
}
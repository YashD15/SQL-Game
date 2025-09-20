// data/gameQuestions.js
export const gameQuestions = [
  {
    id: 1,
    question: "Ritual shuru hone se pehle sabse zyada chadhaya gaya phal kaun tha?",
    expectedOutput: [{ item_name: "Coconut" }],
    hint: "Use WHERE clause to filter by item_type 'fruit' and offered_in_ritual TRUE, then ORDER BY used_count DESC LIMIT 1",
    tables: ["exorcism_items"],
    maxAttempts: 5
  },
  {
    id: 2,
    question: "Sabse frequently use hone wali mala kaunsi thi?",
    expectedOutput: [{ item_name: "Rosary" }],
    hint: "Filter by item_type 'rosary' and ORDER BY used_count DESC LIMIT 1",
    tables: ["exorcism_items"],
    maxAttempts: 5
  },
  {
    id: 3,
    question: "Kaunsa patta har ritual mein sabse pehle jalta tha?",
    expectedOutput: [{ item_name: "Neem Leaf" }],
    hint: "Filter by item_type 'leaf' and ORDER BY burn_count DESC LIMIT 1",
    tables: ["exorcism_items"],
    maxAttempts: 5
  },
  {
    id: 4,
    question: "Ritual ke dauran kisi ne chadhaya hua paani kis jagah use kiya?",
    expectedOutput: [{ item_name: "Holy Water" }],
    hint: "Filter by item_type 'holy_water' and location_used = 'altar'",
    tables: ["exorcism_items"],
    maxAttempts: 5
  },
  {
    id: 5,
    question: "Ek non-ritual item jo distractor tha, par teams confuse ho sakti thi?",
    expectedOutput: [{ item_name: "Silver Thread" }],
    hint: "Search for the item_name 'Silver Thread'",
    tables: ["exorcism_items"],
    maxAttempts: 5
  }
];
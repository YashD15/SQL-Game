// data/gameQuestions.js

// Define all 7 question sets
export const questionSets = {
  set1: {
    id: 'set1',
    name: 'Exorcism Rituals - Basic',
    description: 'Basic questions about ritual items and practices',
    difficulty: 'Easy',
    questions: [
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
    ]
  },
  set2: {
  id: "set2",
  name: "Exorcism Rituals - Intermediate",
  description: "Questions focusing on ritual oils, sacramental items, and distractors",
  difficulty: "Medium",
  questions: [
    {
      id: 1,
      question: "Sirf defeat ke baad diya gaya phal kaun tha?",
      expectedOutput: [{ item_name: "Lemon" }],
      hint: "Filter by item_type 'fruit' and ritual_use TRUE, then ORDER BY item_name DESC LIMIT 1",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 2,
      question: "Protective circle ke andar sirf kaunsa tel use hua?",
      expectedOutput: [{ item_name: "Mustard Oil" }],
      hint: "Filter by item_type 'oil' and location_used = 'circle'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 3,
      question: "Sacred item jo mantra ke saath use hua?",
      expectedOutput: [{ item_name: "Blessed Salt" }],
      hint: "Filter by item_type 'sacramental', blessed TRUE, and used_with_mantra TRUE",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 4,
      question: "Ek animal product jo distractor tha?",
      expectedOutput: [{ item_name: "Cow Horn" }],
      hint: "Search for item_name 'Cow Horn'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 5,
      question: "Ek distractor dust item, jisse confusion ho sakti thi",
      expectedOutput: [{ item_name: "Charcoal Dust" }],
      hint: "Search for item_name 'Charcoal Dust'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    }
  ]
},


  set3: {
  id: "set3",
  name: "Exorcism Rituals - Advanced I",
  description: "Challenging questions involving animal products, mantras, crucifixes, and distractor items",
  difficulty: "Hard",
  questions: [
    {
      id: 1,
      question: "Animal product jo altar pe rakha gaya, par naam lene se log darte the?",
      expectedOutput: [{ item_name: "Crow Bone" }],
      hint: "Filter by item_type 'animal_product' and location_used = 'altar'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 2,
      question: "Mantra jo sirf 3 baar chant hua aur 2 baar successful tha?",
      expectedOutput: [{ item_name: "Rudra Ashtak" }],
      hint: "Filter by item_type 'mantra' with chant_count = 3 and success_count = 2",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 3,
      question: "Crucifix jo hamesha haath me pakda gaya?",
      expectedOutput: [{ item_name: "Traveler’s Crucifix" }],
      hint: "Filter by item_type 'crucifix' and always_held = TRUE",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 4,
      question: "Distractor item jo teams confuse kar sakti thi?",
      expectedOutput: [{ item_name: "Clay Figurine" }],
      hint: "Search for item_name 'Clay Figurine'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 5,
      question: "Distractor item jo table me exist karta tha, par correct nahi?",
      expectedOutput: [{ item_name: "Fake Bell" }],
      hint: "Search for item_name 'Fake Bell'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    }
  ]
},

  set4: {
  id: "set4",
  name: "Exorcism Rituals - Advanced II",
  description: "Focus on ritual fruits, oils, tools, and distractor items",
  difficulty: "Hard",
  questions: [
    {
      id: 1,
      question: "Ritual ke dauran defeat ke baad diya gaya phal?",
      expectedOutput: [{ item_name: "Lemon" }],
      hint: "Filter by item_type 'fruit' and ritual_use TRUE, then ORDER BY item_name DESC LIMIT 1",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 2,
      question: "Oil jo hamesha mantra ke saath use hota tha?",
      expectedOutput: [{ item_name: "Sandalwood Oil" }],
      hint: "Filter by item_type 'oil' and used_with_mantra = TRUE",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 3,
      question: "Rusty tool jo last ritual me bhi use hua?",
      expectedOutput: [{ item_name: "Rusty Axe" }],
      hint: "Filter by item_type 'tool' and condition = 'rusty'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 4,
      question: "Distractor tool item jo confuse kare?",
      expectedOutput: [{ item_name: "Silver Knife" }],
      hint: "Search for item_name 'Silver Knife'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 5,
      question: "Distractor leaf item jo table me tha?",
      expectedOutput: [{ item_name: "Mango Leaf" }],
      hint: "Search for item_name 'Mango Leaf'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    }
  ]
},

  set5: {
  id: "set5",
  name: "Exorcism Rituals - Sacred Items & Distractors",
  description: "Mix of animal products, crucifixes, ritual oils, and misleading distractors",
  difficulty: "Medium",
  questions: [
    {
      id: 1,
      question: "Animal product jo chadhaya gaya par kabhi aag me nahi dala?",
      expectedOutput: [{ item_name: "Goat Horn" }],
      hint: "Filter by item_type 'animal_product', offered_in_ritual TRUE, and burn_count = 0",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 2,
      question: "Crucifix jo hamesha haath me rakha gaya aur haath chhuta nahi?",
      expectedOutput: [{ item_name: "Pocket Crucifix" }],
      hint: "Filter by item_type 'crucifix' and always_held = TRUE",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 3,
      question: "Oil jo hamesha protective circle ke andar use hota tha?",
      expectedOutput: [{ item_name: "Mustard Oil" }],
      hint: "Filter by item_type 'oil' and location_used = 'circle'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 4,
      question: "Distractor item jo table me exist karta tha?",
      expectedOutput: [{ item_name: "Charcoal Dust" }],
      hint: "Search for item_name 'Charcoal Dust'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 5,
      question: "Distractor cloth item jo table me tha?",
      expectedOutput: [{ item_name: "Red Cloth" }],
      hint: "Search for item_name 'Red Cloth'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    }
  ]
},

  set6: {
  id: "set6",
  name: "Exorcism Rituals - Sacred Chants & Oddities",
  description: "Mantras, rosaries, sacramental items, and tricky distractors",
  difficulty: "Medium",
  questions: [
    {
      id: 1,
      question: "Mantra jo sirf ek baar chant hua aur 100% success hua?",
      expectedOutput: [{ item_name: "Narasimha Kavach" }],
      hint: "Filter by item_type 'mantra' with chant_count = 1 and success_count = 1",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 2,
      question: "Rosary jiska count system kharab tha, par use hoti thi?",
      expectedOutput: [{ item_name: "Broken Rosary" }],
      hint: "Filter by item_type 'rosary' where used_count IS NULL",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 3,
      question: "Sacred item jo mantra ke saath use hua?",
      expectedOutput: [{ item_name: "Blessed Salt" }],
      hint: "Filter by item_type 'sacramental', blessed TRUE, and used_with_mantra TRUE",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 4,
      question: "Distractor item jisse confusion ho sakti thi",
      expectedOutput: [{ item_name: "Clay Idol" }],
      hint: "Search for item_name 'Clay Idol'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 5,
      question: "Distractor item jisse confusion ho sakti thi",
      expectedOutput: [{ item_name: "Garlic Paste" }],
      hint: "Search for item_name 'Garlic Paste'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    }
  ]
},

  set7: {
  id: "set7",
  name: "Exorcism Rituals - Final Trials",
  description: "Leaves, vestments, fruits, and misleading distractors",
  difficulty: "Hard",
  questions: [
    {
      id: 1,
      question: "Leaf jo hamesha haath se uthaya jaata tha, zameen par nahi?",
      expectedOutput: [{ item_name: "Tulsi Leaf" }],
      hint: "Filter by item_type 'leaf' and scattered_location IS NULL",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 2,
      question: "Priest ka vastra jo sirf poornima ko pehna jaata tha?",
      expectedOutput: [{ item_name: "Full Moon Robe" }],
      hint: "Filter by item_type 'vestment' and ritual_day_used = 15",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 3,
      question: "Fruit jo kabhi ritual me offer nahi hua?",
      expectedOutput: [{ item_name: "Pomegranate" }],
      hint: "Filter by item_type 'fruit' and offered_in_ritual = FALSE, then ORDER BY item_name LIMIT 1",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 4,
      question: "Distractor wooden item",
      expectedOutput: [{ item_name: "Wooden Beads" }],
      hint: "Search for item_name 'Wooden Beads'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    },
    {
      id: 5,
      question: "Distractor cow-related item",
      expectedOutput: [{ item_name: "Cow Horn" }],
      hint: "Search for item_name 'Cow Horn'",
      tables: ["exorcism_items"],
      maxAttempts: 5
    }
  ]
}
};

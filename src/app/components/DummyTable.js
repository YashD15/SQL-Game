import React from "react";

export default function RitualTable() {
  const headers = [
    "id",
    "item_name",
    "item_type",
    "ritual_day_used",
    "used_count",
    "offered_in_ritual",
    "burn_count",
    "location_used",
    "ritual_use",
    "blessed",
    "used_with_mantra",
    "chant_count",
    "success_count",
    "always_held",
    "condition",
    "scattered_location",
  ];

  const items = [
    // --- Set 1 ---
    [1, 'Coconut', 'fruit', 1, 15, 1, 0, null, 1, 0, 0, 0, 0, 0, null, null],
    [2, 'Banana', 'fruit', 1, 10, 1, 0, null, 1, 0, 0, 0, 0, 0, null, null],
    [3, 'Mango', 'fruit', 2, 5, 1, 0, null, 1, 0, 0, 0, 0, 0, null, null],
    [4, 'Rosary', 'rosary', 1, 20, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [5, 'Tulsi Mala', 'rosary', 1, 10, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [6, 'Neem Leaf', 'leaf', 1, 0, 1, 30, null, 0, 0, 0, 0, 0, 0, null, null],
    [7, 'Peepal Leaf', 'leaf', 2, 0, 1, 15, null, 0, 0, 0, 0, 0, 0, null, null],
    [8, 'Holy Water', 'holy_water', 1, 0, 1, 0, 'altar', 0, 0, 0, 0, 0, 0, null, null],
    [9, 'Silver Thread', 'ornament', 3, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],

    // --- Set 2 ---
    [10, 'Lemon', 'fruit', 1, 0, 0, 0, null, 1, 0, 0, 0, 0, 0, null, null],
    [11, 'Orange', 'fruit', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [12, 'Mustard Oil', 'oil', 1, 0, 0, 0, 'circle', 0, 0, 0, 0, 0, 0, null, null],
    [13, 'Olive Oil', 'oil', 1, 0, 0, 0, 'altar', 0, 0, 0, 0, 0, 0, null, null],
    [14, 'Blessed Salt', 'sacramental', 1, 0, 0, 0, null, 0, 1, 1, 0, 0, 0, null, null],
    [15, 'Normal Salt', 'sacramental', 1, 0, 0, 0, null, 0, 0, 1, 0, 0, 0, null, null],
    [16, 'Cow Horn', 'animal', 2, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [17, 'Charcoal Dust', 'dust', 2, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],

    // --- Set 3 ---
    [18, 'Crow Bone', 'animal_product', 1, 0, 0, 0, 'altar', 0, 0, 0, 0, 0, 0, null, null],
    [19, 'Rudra Ashtak', 'mantra', 1, 0, 0, 0, null, 0, 0, 0, 3, 2, 0, null, null],
    [20, 'Traveler’s Crucifix', 'crucifix', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 1, null, null],
    [21, 'Clay Figurine', 'artifact', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [22, 'Fake Bell', 'ornament', 2, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],

    // --- Set 4 ---
    [23, 'Lemon', 'fruit', 1, 0, 0, 0, null, 1, 0, 0, 0, 0, 0, null, null],
    [24, 'Sandalwood Oil', 'oil', 1, 0, 0, 0, null, 0, 0, 1, 0, 0, 0, null, null],
    [25, 'Rusty Axe', 'tool', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, 'rusty', null],
    [26, 'Silver Knife', 'tool', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, 'sharp', null],
    [27, 'Mango Leaf', 'leaf', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],

    // --- Set 5 ---
    [28, 'Goat Horn', 'animal_product', 1, 0, 1, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [29, 'Pocket Crucifix', 'crucifix', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 1, null, null],
    [30, 'Mustard Oil', 'oil', 1, 0, 0, 0, 'circle', 0, 0, 0, 0, 0, 0, null, null],
    [31, 'Charcoal Dust', 'dust', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [32, 'Red Cloth', 'cloth', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],

    // --- Set 6 ---
    [33, 'Narasimha Kavach', 'mantra', 1, 0, 0, 0, null, 0, 0, 0, 1, 1, 0, null, null],
    [34, 'Broken Rosary', 'rosary', 1, null, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [35, 'Blessed Salt', 'sacramental', 1, 0, 0, 0, null, 0, 1, 1, 0, 0, 0, null, null],
    [36, 'Clay Idol', 'artifact', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [37, 'Garlic Paste', 'ingredient', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],

    // --- Set 7 ---
    [38, 'Tulsi Leaf', 'leaf', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null], // scattered_location IS NULL
    [39, 'Full Moon Robe', 'vestment', 15, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [40, 'Pomegranate', 'fruit', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null], // offered_in_ritual = 0
    [41, 'Wooden Beads', 'wooden', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null],
    [42, 'Cow Horn', 'animal', 1, 0, 0, 0, null, 0, 0, 0, 0, 0, 0, null, null]
  ];

  return (
    <div className="overflow-x-auto">
      <table className="border border-gray-500 border-collapse w-full text-xs">
        <thead>
          <tr>
            {headers.map((head, i) => (
              <th
                key={i}
                className="border border-gray-500 px-2 py-1 bg-gray-600"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border border-gray-500 px-2 py-1">
                  {cell !== null ? cell : "NULL"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
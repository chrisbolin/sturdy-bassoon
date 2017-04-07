const levels = [
  { // just walk across
    player: [0, 2],
    goal: [9, 2],
    enemies: [],
  },
  { // first enemy
    player: [0, 4],
    goal: [9, 6],
    enemies: [[0, 9]],
  },
  { // two enemies
    player: [6, 1],
    goal: [9, 6],
    enemies: [
      [0, 9],
      [3, 9]
    ],
  },
  { // first close call with an enemy
    player: [4, 9],
    goal: [7, 0],
    enemies: [[9, 9]],
  },
  { // enemies can destroy each other
    player: [4, 4],
    goal: [0, 1],
    enemies: [
      [4, 5],
      [5, 4],
    ],
  },
  { // enemies ahead, must make them collide
    player: [9, 9],
    goal: [0, 0],
    enemies: [
      [2, 3],
      [1, 4],
    ],
  },
  { // again, must make them collide
    player: [0, 2],
    goal: [9, 7],
    enemies: [
      [1, 10],
      [2, 9],
      [2, 8],
      [3, 8],
    ],
  },
];

// get the new level if it exists; otherwise restart at the same
export default (level) => (level < levels.length ? {
  ...levels[level],
  deadEnemies: [],
  living: true,
  level,
} : {});

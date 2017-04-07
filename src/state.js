import { withState } from 'freactal';
import { flow, isEqual, countBy, forOwn, intersectionWith } from 'lodash';

import { DIM } from './constants';
import Levels from './levels';

const fromXY = ([x, y]) => x + y * DIM;

const vectorAdd = (v, w) => ([v[0] + w[0], v[1] + w[1]]);
const vectorSubtract = (v, w) => ([v[0] - w[0], v[1] - w[1]]);
// includes function handles array of arrays
const includes = (array, value) => !!intersectionWith(array, [value], isEqual).length;

const inBounds = value => (value >= 0 && value < DIM);
const validPosition = (player, state) => {
  if (!inBounds(player[0]) || !inBounds(player[1])) {
    return false;
  }
  return true;
};
const validDirection = direction =>
  (Math.abs(direction[0]) === 0 && Math.abs(direction[1]) === 1)
  || (Math.abs(direction[0]) === 1 && Math.abs(direction[1]) === 0);


const throwIf = (condition, message) => {
  if (condition) {
    throw new Error(message);
  }
}

const getNextPlayer = (state, direction, userFeedback) => {
  if (!state.living) {
    return throwIf(userFeedback, 'Cannot move when player is dead. Call Game.reset()');
  }
  if (!validDirection(direction)) {
    return throwIf(userFeedback, 'Invalid direction. Choose one of the following: move(1, 0), move(-1, 0), move(0, 1), or move(0, -1).');
  }
  const nextPlayer = vectorAdd(state.player, direction);
  if (!validPosition(nextPlayer)) {
    return throwIf(userFeedback, 'Cannot move off of the board.');
  }
  return nextPlayer;
}

const tickEnemies = (state) => ({
  ...state,
  enemies: state.enemies.map(enemy => {
    const [x, y] = vectorSubtract(state.player, enemy);
    if (Math.abs(x) === Math.abs(y)) {
      return enemy; // if the enemy could go either way, just have him wait
    } else if (Math.abs(x) > Math.abs(y)) {
      return vectorAdd(enemy, [Math.sign(x), 0]);
    } else {
      return vectorAdd(enemy, [0, Math.sign(y)]);
    }
  })
});

const tickLiving = (state) => ({
  ...state,
  living: state.enemies.concat(state.deadEnemies)
    .reduce((living, enemy) => living && !isEqual(enemy, state.player), true)
});

const tickDeadEnemies = (state) => {
  // if an enemy runs into another enemy (alive or dead) it dies
  // concat alive and dead enemies, count them by position, and then iterate
  const enemies = [];
  const deadEnemies = [];
  forOwn(countBy(state.enemies.concat(state.deadEnemies)), (count, stringPosition) => {
    const position = stringPosition.split(',').map(str => parseInt(str, 10));
    if (count === 1 && !includes(state.deadEnemies, position)) {
      enemies.push(position);
    } else {
      deadEnemies.push(position);
    }
  });
  return { ...state, enemies, deadEnemies };
};

const tickLevel = (state) => {
  if (isEqual(state.player, state.goal)) {
    const nextLevel = state.level + 1;
    return {
      ...state,
      ...Levels(nextLevel),
      maxLevel: nextLevel
    };
  } else {
    return state;
  }
};

const tick = flow([tickEnemies, tickLiving, tickDeadEnemies, tickLevel]);

const getInitialState = () => ({
  maxLevel: 0,
  ...Levels(0),
});

export default withState({
  initialState: getInitialState,
  computed: {
    playerIndex: ({ player }) => fromXY(player),
    goalIndex: ({ goal }) => fromXY(goal),
    enemyIndexes: ({ enemies }) => enemies.map(enemy => fromXY(enemy)),
    deadEnemyIndexes: ({ deadEnemies }) => deadEnemies.map(enemy => fromXY(enemy)),
    playerIcon: ({ living }) => living ? 'PLAYER': 'DEAD_PLAYER',
    canLevelUp: ({ level, maxLevel}) => level < maxLevel,
    canLevelDown: ({ level }) => level > 0,
  },
  effects: {
    move: (effects, direction, userFeedback) => state => {
      const nextPlayer = getNextPlayer(state, direction, userFeedback);
      if (!nextPlayer) return state;
      return tick({ ...state, player: nextPlayer });
    },
    changeLevel: (effects, level) => state => ({
      ...state,
      living: true,
      ...Levels(level), // just reset the level-specific details
    }),
    reset: effects => state => (effects.changeLevel(state.level), state),
    changeLevelUp: effects => state => (effects.changeLevel(state.level + 1), state),
    changeLevelDown: effects => state => (effects.changeLevel(state.level - 1), state),
  },
});

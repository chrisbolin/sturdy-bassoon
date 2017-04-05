import { withState } from 'freactal';

import { DIM } from './constants';

const fromXY = ([x, y]) => x + y * DIM;

const vectorAdd = (v, w) => ([v[0] + w[0], v[1] + w[1]]);
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

export default withState({
  initialState: () => ({
    player: [0, 2],
    goal: [15, 7],
  }),
  computed: {
    playerIndex: ({ player }) => fromXY(player),
    goalIndex: ({ goal }) => fromXY(goal),
  },
  effects: {
    move: (effects, direction, userFeedback) => state => {
      const newPlayer = vectorAdd(state.player, direction);
      if (!validDirection(direction)) {
        if (!userFeedback) return state;
        throw new Error('Invalid direction. Choose one of the following: move(1, 0), move(-1, 0), move(0, 1), or move(0, -1).');
      }
      if (!validPosition(newPlayer)) {
        if (!userFeedback) return state;
        throw new Error('Cannot move off of the board.');
      }

      return { ...state, player: vectorAdd(state.player, direction) };
    }
  },
});

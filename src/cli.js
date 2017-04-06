export default (context) => {
  window.Game = {
    move(x, y) {
      // must move 1 and only 1 space: right, left, up, or down
      // move(1, 0), move(-1, 0), move(0, 1), move(0, -1)
      context.effects.move([x, y], true);
    },
    reset() {
      // reset the game
      context.effects.reset();
    },
  };
};

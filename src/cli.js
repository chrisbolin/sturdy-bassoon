export default (context) => {
  window.Game = {
    move: function move(x, y) {
      context.effects.move([x, y], true);
    },
  };
};

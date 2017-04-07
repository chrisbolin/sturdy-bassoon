import React from 'react';
import { contextTypes } from 'freactal';

import { GRID, ENTITY_MAP, UP, DOWN, LEFT, RIGHT } from './constants';
import addState from './state';
import initializeCLI from './cli';
import './App.css';

const getGestureDirection = (firstEvent, lastEvent) => {
  // how "straight" is the touch line? 0 === perfectly up/down/left/right; 1 === 45 degrees
  const THRESHOLD = 0.1;
  const [start] = firstEvent.changedTouches;
  const [end] = lastEvent.changedTouches;
  const dx = end.screenX - start.screenX;
  const dy = end.screenY - start.screenY;
  const vertical = Math.abs(dy) > Math.abs(dx);

  if (Math.abs( vertical ? dx/dy : dy/dx) < THRESHOLD) {
    if (vertical) return (dy < 0) ? UP : DOWN;
    return (dx < 0) ? LEFT : RIGHT;
  } else {
    return false;
  }
}

const Tile = ({entity}, {state, effects}) => (
  <div className="Tile">
    {entity && ENTITY_MAP[entity]}
  </div>
);

const Grid = ({entity}, { state, effects }) => (
  <div className="Grid">
    {GRID.map((i) => {
      let entity = null;
      if (state.playerIndex === i) {
        entity = state.playerIcon;
      } else if (state.goalIndex === i) {
        entity = 'GOAL';
      } else if (state.enemyIndexes.includes(i)) {
        entity = 'ENEMY';
      } else if (state.deadEnemyIndexes.includes(i)) {
        entity = 'DEAD_ENEMY';
      }
      return <Tile key={i} entity={entity}/>;
    })}
  </div>
);

Grid.contextTypes = contextTypes;

const Info = ({entity}, { state, effects }) => (
  <div className="Info">
    Level {state.level}
    {state.canLevelUp && <a onClick={effects.changeLevelUp}>⬆️</a>}
    {state.canLevelDown && <a onClick={effects.changeLevelDown}>⬇️</a>}
  </div>
);

Info.contextTypes = contextTypes;

class App extends React.Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('touchstart', this.handleTouchStart.bind(this));
    window.addEventListener('touchend', this.handleTouchEnd.bind(this));
    initializeCLI(this.context);
  }
  handleKeyDown(event) {
    const keyMap = {
      // arrows
      38: UP,
      40: DOWN,
      39: RIGHT,
      37: LEFT,
      // wsad
      87: UP,
      83: DOWN,
      68: RIGHT,
      65: LEFT,
    };
    const direction = keyMap[event.keyCode];
    if (direction) {
      this.context.effects.move(direction);
    } else if (event.keyCode === 82) {
      this.context.effects.reset();
    }
  }
  handleTouchStart(event) {
    this.touchStartEvent = event;
  }
  handleTouchEnd(event) {
    const direction = getGestureDirection(this.touchStartEvent, event);
    if (direction) {
      this.context.effects.move(direction);
    }
    this.touchStartEvent = null;
  }
  handleTouchCancel(event) {
    this.touchStartEvent = null;
    console.log('canceled');
  }
  render() {
    return (
      <div className="App">
        <Grid/>
        <Info/>
      </div>
    );
  }
}

App.contextTypes = contextTypes;

export default addState(App);

import React from 'react';
import { contextTypes } from 'freactal';

import { GRID, ENTITY_MAP, UP, DOWN, LEFT, RIGHT } from './constants';
import addState from './state';
import initializeCLI from './cli';
import './App.css';

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
        entity = 'P';
      } else if (state.goalIndex === i) {
        entity = 'G';
      }
      return <Tile key={i} entity={entity}/>;
    })}
  </div>
);

Grid.contextTypes = contextTypes;

class App extends React.Component {
  componentDidMount() {
    this._handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this._handleKeyDown);
    initializeCLI(this.context);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this._handleKeyDown);
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
    }
  }
  render() {
    return (
      <div className="App">
        <Grid/>
      </div>
    );
  }
}

App.contextTypes = contextTypes;

export default addState(App);

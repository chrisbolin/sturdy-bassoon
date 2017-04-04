import React, { Component } from 'react';
import { range, fill } from 'lodash';
import './App.css';

const DIM = 16;

const entityMap = {
  P: '🐭',
  G: '🧀',
  B: '💣',
};

const xy = (x, y) => x + y * DIM;

const grid = fill(range(DIM * DIM), null);
grid[xy(0, 4)] = 'P';
grid[xy(15, 5)] = 'G';

const Tile = ({entity}) => (
  <div className="Tile">
    {entity && entityMap[entity]}
  </div>
)

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="Grid">
          {grid.map((entity, i) =>
            <Tile key={i} entity={entity}/>)
          }
        </div>
      </div>
    );
  }
}

export default App;

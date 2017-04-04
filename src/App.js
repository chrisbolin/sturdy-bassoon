import React, { Component } from 'react';
import { range } from 'lodash';
import './App.css';

const Cell = () => (
  <div className="Cell"/>
)


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="Grid">
          {range(16 * 16).map(i => <Cell key={i} />)}
        </div>
      </div>
    );
  }
}

export default App;

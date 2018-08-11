import React, { Component } from 'react';
import './App.css';

import Musicbox from "./components/Musicbox/Musicbox";

class App extends Component {
  render() {
    return (
      <div className="appContainer">
        <Musicbox />
      </div>
    );
  }
}

export default App;

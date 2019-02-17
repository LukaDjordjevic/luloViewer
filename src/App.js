import React, { Component } from 'react';
import './styles.css';
import LuloViewer from './LuloViewer';

class App extends Component {
  render() {
    const images = [
      'http://lorempixel.com/1920/1920/sports/Dummy-Text/',
      'http://lorempixel.com/1920/1920/city/Dummy-Text/',
      'http://lorempixel.com/1920/1920/people/Dummy-Text/',
      'http://lorempixel.com/1000/600/abstract/4/',
      'http://lorempixel.com/1000/600/technics/5/',
      'http://lorempixel.com/1000/600/transport/6/'
    ];
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <LuloViewer imageUrls={images} />
      </div>
    );
  }
}

export default App;

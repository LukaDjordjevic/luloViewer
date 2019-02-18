import React, { Component } from 'react';
import './styles.css';
import LuloViewer from './LuloViewer';

class App extends Component {
  render() {
    const images = [
      'http://lorempixel.com/1920/1920/sports/Dummy-Text/',
      'http://lorempixel.com/1920/1920/city/Dummy-Text/',
      'http://lorempixel.com/1920/1920/people/Dummy-Text/',
      'http://lorempixel.com/1000/600/abstract/Dummy-Text/',
      'http://lorempixel.com/1000/600/technics/Dummy-Text/',
      'http://lorempixel.com/1000/600/transport/Dummy-Text/',
      'http://lorempixel.com/1000/600/cats/Dummy-Text/',
      'http://lorempixel.com/1000/600/animals/Dummy-Text/',
      'http://lorempixel.com/1000/600/nightlife/Dummy-Text/',
      'http://lorempixel.com/1000/600/fashion/Dummy-Text/',
      'http://lorempixel.com/1000/600/nature/Dummy-Text/'
    ];
    return (
      <div
        // style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}
        style={{
          width: '500px',
          height: '500px',
          backgroundColor: 'black',
          top: '100px',
          left: '200px',
          position: 'relative'
        }}
      >
        <LuloViewer imageUrls={images} />
      </div>
    );
  }
}

export default App;

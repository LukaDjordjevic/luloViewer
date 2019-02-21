import React, { Component } from 'react';
import './styles.css';
import LuloViewer from './LuloViewer';

class App extends Component {
  render() {
    const images = [
      // 'http://dm.damcdn.net/pics/wp-content/uploads/2011/10/02-young-beautiful-model.jpg',
      // 'http://dm.damcdn.net/pics/wp-content/uploads/2011/10/02-young-beautiful-model.jpg',
      'http://galleries.gossipkings.com/hollywoodscanner/pictures/041-eva-herzigova-eva-mendes/images/eva-herzigova-eva-mendes-1.jpg',
      'http://galleries.gossipkings.com/hollywoodscanner/pictures/041-eva-herzigova-eva-mendes/images/eva-herzigova-eva-mendes-2.jpg',
      'http://galleries.gossipkings.com/hollywoodscanner/pictures/041-eva-herzigova-eva-mendes/images/eva-herzigova-eva-mendes-3.jpg',
      'http://galleries.gossipkings.com/hollywoodscanner/pictures/041-eva-herzigova-eva-mendes/images/eva-herzigova-eva-mendes-4.jpg',
      'http://galleries.gossipkings.com/hollywoodscanner/pictures/041-eva-herzigova-eva-mendes/images/eva-herzigova-eva-mendes-5.jpg',
      'http://galleries.gossipkings.com/hollywoodscanner/pictures/041-eva-herzigova-eva-mendes/images/eva-herzigova-eva-mendes-6.jpg',
      'http://galleries.gossipkings.com/hollywoodscanner/pictures/041-eva-herzigova-eva-mendes/images/eva-herzigova-eva-mendes-7.jpg'
      // 'http://lorempixel.com/1920/1920/sports/Dummy-Text/',
      // 'http://lorempixel.com/1920/1920/city/Dummy-Text/',
      // 'http://lorempixel.com/1920/1920/people/Dummy-Text/',
      // 'http://lorempixel.com/1000/600/abstract/Dummy-Text/',
      // 'http://lorempixel.com/1000/600/technics/Dummy-Text/',
      // 'http://lorempixel.com/1000/600/transport/Dummy-Text/',
      // 'http://lorempixel.com/1000/600/cats/Dummy-Text/',
      // 'http://lorempixel.com/1000/600/animals/Dummy-Text/',
      // 'http://lorempixel.com/1000/600/nightlife/Dummy-Text/',
      // 'http://lorempixel.com/1000/600/fashion/Dummy-Text/',
      // 'http://lorempixel.com/1000/600/nature/Dummy-Text/'
    ];
    return (
      <div
        style={{
          width: '550px',
          height: '450px',
          backgroundColor: '#000',
          top: '100px',
          left: '10%',
          position: 'relative'
          // display: 'flex'
        }}
      >
        <LuloViewer imageUrls={images} />
      </div>
    );
  }
}

export default App;

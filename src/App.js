import React, { Component } from 'react';
import './styles.css';
import LuloViewer from './LuloViewer';

class App extends Component {
  constructor() {
    super();
    this.state = { bb: true };
  }
  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({ bb: false });
    // }, 2000);
  }
  render() {
    const images = [
      'http://cdn.collider.com/wp-content/uploads/2018/08/bohemian-rhapsody-image-2.jpg',
      'http://cdn.collider.com/wp-content/uploads/2018/08/bohemian-rhapsody-image-3.jpg',
      'http://cdn.collider.com/wp-content/uploads/2018/08/bohemian-rhapsody-image-4.jpg',
      'http://cdn.collider.com/wp-content/uploads/2018/08/bohemian-rhapsody-image-1.jpg',
      'http://dm.damcdn.net/pics/wp-content/uploads/2011/10/bad_url.jpg',
      'https://solarsystem.nasa.gov/internal_resources/3326',
      'https://qph.fs.quoracdn.net/main-qimg-53b60475fe8386e610447a63d6d97baa',
      'http://dm.damcdn.net/pics/wp-content/uploads/2011/10/bad_url.jpg',      
      'https://blog.nationalgeographic.org/wp-content/uploads/2014/05/gpw-201306-NASA-ISS035-E-34688-Earth-from-space-clouds-shadows-20130505-large-1024x681.jpg',
      // // 'http://lorempixel.com/1920/1920/sports/Dummy-Text/'
      // // 'http://lorempixel.com/1920/1920/city/Dummy-Text/',
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
          left: '30%',
          position: 'relative'
          // display: 'flex'
        }}
      >
        {this.state.bb ? <LuloViewer imageUrls={images} /> : null}
      </div>
    );
  }
}

export default App;

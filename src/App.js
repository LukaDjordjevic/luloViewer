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
  sliderCallback(index) {
    console.log('Slide', index, 'clicked');
  }
  render() {
    const images = [
      'http://cdn.collider.com/wp-content/uploads/2018/08/bohemian-rhapsody-image-2.jpg',
      'http://cdn.collider.com/wp-content/uploads/2018/08/bohemian-rhapsody-image-3.jpg',
      'http://cdn.collider.com/wp-content/uploads/2018/08/bohemian-rhapsody-image-4.jpg',
      'http://cdn.collider.com/wp-content/uploads/2018/08/bohemian-rhapsody-image-1.jpg',
      // 'http://dm.damcdn.net/pics/wp-content/uploads/2011/10/bad_url.jpg',
      // 'http://dm.damcdn.net/pics/wp-content/uploads/2011/10/bad_url.jpg',
      'https://solarsystem.nasa.gov/internal_resources/3326',
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
      'http://lorempixel.com/1000/600/nature/Dummy-Text/',
      'https://qph.fs.quoracdn.net/main-qimg-53b60475fe8386e610447a63d6d97baa',
      'https://blog.nationalgeographic.org/wp-content/uploads/2014/05/gpw-201306-NASA-ISS035-E-34688-Earth-from-space-clouds-shadows-20130505-large-1024x681.jpg',
      'https://www.popsci.com/sites/popsci.com/files/styles/655_1x_/public/images/2018/10/comet_in_may_2015.jpg?itok=l7KMRGJf&fc=50,50'
    ];
    return (
      <div
        style={{
          width: '500px',
          height: '400px',
          // width: '70%',
          // height: '80%',
          // width: '90%',
          // height: '90%',
          // width: '180px',
          // height: '180px',
          // width: '100vw',
          // height: '100vh',
          backgroundColor: '#000',
          top: '100px',
          left: '100px',
          position: 'relative',
          margin: 0
          // display: 'flex'
        }}
      >
        <LuloViewer
          imageUrls={images}
          // slideBgdColor="teal"
          // randomSlideColors={false}
          // allowCyclic={false}
          // showViewer={false}
          // allowMenu={false}
          // showSlider={false}
          // showArrows={false}
          // showZoomController={false}
          // slideTransitionDuration={0}
          // arrowDefaultColor="#8888AA"
          // arrowHighlightColor="#AAAAFF"
          sliderCallback={this.sliderCallback}
        />
      </div>
    );
  }
}

export default App;

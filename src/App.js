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
      // 'http://cdn.collider.com/wp-content/uploads/2018/08/bohemian-rhapsody-image-2.jpg',
      // 'http://cdn.collider.com/wp-content/uploads/2018/08/bohemian-rhapsody-image-3.jpg',
      // 'http://cdn.collider.com/wp-content/uploads/2018/08/bohemian-rhapsody-image-4.jpg',
      // 'http://cdn.collider.com/wp-content/uploads/2018/08/bohemian-rhapsody-image-1.jpg',
      // 'http://dm.damcdn.net/pics/wp-content/uploads/2011/10/bad_url.jpg',
      // 'http://dm.damcdn.net/pics/wp-content/uploads/2011/10/bad_url.jpg',
      // 'https://solarsystem.nasa.gov/internal_resources/3326',
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
      // 'http://lorempixel.com/1000/600/nature/Dummy-Text/',
      // 'https://qph.fs.quoracdn.net/main-qimg-53b60475fe8386e610447a63d6d97baa',
      // 'https://blog.nationalgeographic.org/wp-content/uploads/2014/05/gpw-201306-NASA-ISS035-E-34688-Earth-from-space-clouds-shadows-20130505-large-1024x681.jpg',
      // 'https://www.popsci.com/sites/popsci.com/files/styles/655_1x_/public/images/2018/10/comet_in_may_2015.jpg?itok=l7KMRGJf&fc=50,50',

      // 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Curiosity_Self-Portrait_at_%27Big_Sky%27_Drilling_Site.jpg',
      // 'https://upload.wikimedia.org/wikipedia/commons/4/4d/USA_10654_Bryce_Canyon_Luca_Galuzzi_2007.jpg',
      // 'https://upload.wikimedia.org/wikipedia/commons/a/a5/ComputerHotline_-_Snow_crystals_%28by%29.jpg',
      // 'https://upload.wikimedia.org/wikipedia/commons/0/00/Crab_Nebula.jpg',
      // 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Hubble_ultra_deep_field_high_rez_edit1.jpg',
      // 'https://upload.wikimedia.org/wikipedia/commons/8/87/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg',
      // 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Kittyply_edit1.jpg',
      // 'https://upload.wikimedia.org/wikipedia/commons/4/44/EpicEarth-Globespin%282016May29%29.gif',
      // 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Felix_from_ISS_03_sept_2007_1138Z.jpg',
      // 'https://upload.wikimedia.org/wikipedia/commons/8/89/Grasses_in_the_Valles_Caldera_2014-06-26.JPG'
      'https://upload.wikimedia.org/wikipedia/commons/5/5d/Restless_flycatcher04.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/a/a2/SN1994D.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b6/Felis_catus-cat_on_snow.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/c/ca/Larix_decidua_Aletschwald.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/7/7f/Waschbaer_auf_dem_Dach.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/f/f4/Leaf_1_web.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/0/03/Tavares.Forum.Romanum.redux.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b3/Dolphind.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/c/c2/Martian-Sunset-O-de-Goursac-Curiosity-2013.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/8c/Great_Horned_Owl_in_a_Rain_Storm_in_the_Mojave.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/9/9f/Raccoon_climbing_in_tree_-_Cropped_and_color_corrected.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/9/95/Tracy_Caldwell_Dyson_in_Cupola_ISS.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/c/cb/Hellyer_Gorge%2C_Tasmania.jpg'
    ];
    return (
      <div style={{ backgroundColor: '#222', padding: '30px' }}>
        <h2 style={{ color: '#CCC' }}>Lulo Viewer</h2>
        <div
          style={{
            width: '500px',
            height: '380px',
            // width: '70%',
            // height: '80%',
            // width: '90%',
            // height: '90%',
            // width: '180px',
            // height: '180px',
            // width: '45vw',
            // height: '70vh',
            backgroundColor: '#000',
            // top: '50px',
            // left: '50px',
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
            // sliderCallback={this.sliderCallback}
          />
        </div>
        <p style={{ color: '#CCC' }}>
          Press F for fullscreen. Keyboard arrows for prev/next slide, wheel to
          zoom. Right click for menu.
        </p>
        <p style={{ color: '#CCC' }}>
          Repository and docs{' '}
          <a href="https://www.github.com/lukaDjordjevic/luloViewer">here</a>
        </p>
        {/* <div
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
            // top: '100px',
            // left: '100px',
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
            // sliderCallback={this.sliderCallback}
          />
        </div> */}
      </div>
    );
  }
}

export default App;

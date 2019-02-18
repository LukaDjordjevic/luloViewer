import React, { Component } from 'react';
import SingleImage from './SingleImage';

class LuloViewer extends Component {
  constructor(props) {
    super(props);
    this.constants = {
      STARTING_SLIDE: 2,
      MAX_PRELOADED_IMAGES: this.props.imageUrls.length,
      ZOOM_LEVELS: 20
    };

    this.imagesInfo = new Array(this.props.imageUrls.length);
    this.imagesInfo.fill(null);
    console.log(this.imagesInfo);
    this.state = {
      allLoaded: false,
      currentSlideIndex: this.constants.STARTING_SLIDE,
      currentSlideLodaed: false
    };

    this.imageLoading = false;
    this.images = [];
    this.preloadedImagesIndeces = [];

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    this.checkPreload();
    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('keydown', this.onKeyDown, false);
    console.log('&&&&&', this.mainDiv.getBoundingClientRect());
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize() {
    this.forceUpdate();
  }

  onKeyDown(e) {
    // e.preventDefault()
    switch (e.key) {
      case 'ArrowLeft':
        console.log('ArrowLeft');
        break;
      case 'ArrowRight':
        console.log('ArrowRight');
        break;
      case 'f':
        console.log('f');
        this.mainDiv.requestFullscreen();

        break;

      default:
        console.log('something else');
    }
  }

  checkPreload() {
    const requiredImages = [];
    for (let i = 0; i < this.constants.MAX_PRELOADED_IMAGES + 1; i++) {
      const nextSlide =
        (this.state.currentSlideIndex + i) % this.props.imageUrls.length;
      if (!requiredImages.includes(nextSlide)) requiredImages.push(nextSlide);
    }
    console.log('required slides:', requiredImages);

    let allLoaded = true;
    const self = this;
    requiredImages.forEach((imageIdx, idx) => {
      if (!self.preloadedImagesIndeces.includes(imageIdx)) {
        allLoaded = false;
        if (!this.imageLoading) self.startImagePreload(imageIdx);
      }
    });
    if (allLoaded) {
      console.log('ALL REQUIRED SLIDES LOADED ============');
      console.log(this.imagesInfo);
    }
  }

  startImagePreload(idx) {
    this.imageLoading = true;
    const image = new Image();
    console.log('starting preload of image', idx);
    image.src = this.props.imageUrls[idx];
    image.onload = () => {
      console.log(image.naturalWidth, image.naturalHeight);
      if (!this.preloadedImagesIndeces.includes(idx)) {
        this.imagesInfo[idx] = {
          url: this.props.imageUrls[idx],
          imageAspectRatio: image.naturalWidth / image.naturalHeight,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight
        };
        console.log('downloaded image', idx);
        this.preloadedImagesIndeces.push(idx);
        if (idx === this.state.currentSlideIndex)
          this.setState({ currentSlideLodaed: true });
      }
      this.imageLoading = false;
      this.checkPreload();
    };
  }

  onMouseUp() {
    console.log('up');
    this.setState({
      currentSlideIndex:
        (this.state.currentSlideIndex + 1) % this.props.imageUrls.length
    });
  }

  render() {
    console.log('*** render ***');
    return (
      <div className="main-div" ref={el => (this.mainDiv = el)}>
        {this.state.currentSlideLodaed ? (
          <SingleImage
            imageInfo={this.imagesInfo[this.state.currentSlideIndex]}
            parentBoundingRect={this.mainDiv.getBoundingClientRect()}
            imageIndex={this.state.currentSlideIndex}
            onMouseUp={this.onMouseUp}
            ZOOM_LEVELS={this.constants.ZOOM_LEVELS}
          />
        ) : (
          <div>louding</div>
        )}
      </div>
    );
  }
}

export default LuloViewer;

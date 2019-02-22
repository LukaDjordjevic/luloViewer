import React, { Component } from 'react';
import SingleImage from './SingleImage';

class LuloViewer extends Component {
  constructor(props) {
    super(props);
    this.constants = {
      STARTING_SLIDE: 0,
      // MAX_PRELOADED_IMAGES: this.props.imageUrls.length,
      MAX_PRELOADED_IMAGES: 1,
      ZOOM_LEVELS: 20
    };
    this.imagesInfo = new Array(this.props.imageUrls.length);
    this.imagesInfo.fill(null);
    this.state = {
      allLoaded: false,
      currentSlideIndex: this.constants.STARTING_SLIDE
    };

    this.imageLoading = false;
    this.images = [];
    this.isFullScreen = false;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.changeSlide = this.changeSlide.bind(this);
    this.isFirefox = typeof InstallTrigger !== 'undefined';
  }

  componentDidMount() {
    this.checkPreload();
    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('keydown', this.onKeyDown, false);
    this.setState({ mainDivRect: this.mainDiv.getBoundingClientRect() }, () => {
      // this.forceUpdate();
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  onWindowResize() {
    this.setState({ mainDivRect: this.mainDiv.getBoundingClientRect() });
  }

  onKeyDown(e) {
    // e.preventDefault()
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.changeSlide(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.changeSlide(1);
        break;
      case 'f':
        if (!this.isFullScreen) {
          this.isFullScreen = true;
          this.mainDiv.requestFullscreen();
        } else {
          this.isFullScreen = false;
          document.exitFullscreen();
        }
        break;
      default:
        console.log('something else');
    }
  }

  changeSlide(direction) {
    let currentSlideIndex =
      (this.state.currentSlideIndex + direction) % this.props.imageUrls.length;
    if (currentSlideIndex === -1)
      currentSlideIndex = this.props.imageUrls.length - 1;
    this.setState({ currentSlideIndex }, () => {
      this.checkPreload();
    });
  }

  checkPreload() {
    const requiredImages = [];
    for (let i = 0; i < this.constants.MAX_PRELOADED_IMAGES + 1; i++) {
      const nextSlide =
        (this.state.currentSlideIndex + i) % this.props.imageUrls.length;
      if (!requiredImages.includes(nextSlide)) requiredImages.push(nextSlide);
    }
    // console.log('required slides:', requiredImages);

    let allLoaded = true;
    const self = this;
    requiredImages.forEach((imageIdx, idx) => {
      if (self.imagesInfo[imageIdx] === null) {
        allLoaded = false;
        if (!this.imageLoading) self.startImagePreload(imageIdx);
        return;
      }
    });
    if (allLoaded) {
      // console.log('ALL REQUIRED SLIDES LOADED ============');
    }
  }

  startImagePreload(idx) {
    this.imageLoading = true;
    const image = new Image();
    // console.log('starting preload of image', idx);
    image.src = this.props.imageUrls[idx];
    image.onload = () => {
      if (this.imagesInfo[idx] === null) {
        this.imagesInfo[idx] = {
          url: this.props.imageUrls[idx],
          imageAspectRatio: image.naturalWidth / image.naturalHeight,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight
        };
        // console.log('downloaded image', idx);
        if (idx === this.state.currentSlideIndex) {
          this.setState({ mainDivRect: this.mainDiv.getBoundingClientRect() });
        }
        this.imageLoading = false;
        this.checkPreload();
      }
    };
  }

  // onWheel(e) {
  //   e.preventDefault();
  // }

  render() {
    console.log('*** render ***');

    return (
      <div
        className="main-div"
        ref={el => (this.mainDiv = el)}
        // onWheel={this.onWheel}
      >
        {this.imagesInfo[this.state.currentSlideIndex] !== null ? (
          <SingleImage
            // ref={el=> this.image1 = el}
            imageInfo={this.imagesInfo[this.state.currentSlideIndex]}
            parentBoundingRect={this.state.mainDivRect}
            ZOOM_LEVELS={this.constants.ZOOM_LEVELS}
            isFirefox={this.isFirefox}
            changeSlide={this.changeSlide}
          />
        ) : (
          <div style={{ color: 'white' }}>louding</div>
        )}
      </div>
    );
  }
}

export default LuloViewer;

import React, { Component } from 'react';
import SingleImage from './SingleImage';

class LuloViewer extends Component {
  constructor(props) {
    super(props);
    this.constants = {
      STARTING_SLIDE: 0,
      // MAX_PRELOADED_IMAGES: this.props.imageUrls.length,
      MAX_PRELOADED_IMAGES: 5,
      ZOOM_LEVELS: 100,
      SWIPE_THRESHOLD: 20,
      SLIDE_TRANSITION_DURATION: 0.5,
      SLIDE_TRANSITION_TIMEOUT: 600
    };

    const imagesInfo = new Array(this.props.imageUrls.length);
    imagesInfo.fill(null);
    this.state = {
      allLoaded: false,
      activeSlide: 'A',
      currentSlideIndex: this.constants.STARTING_SLIDE,
      imagesInfo,
      slideAImageIndex: this.constants.STARTING_SLIDE,
      slideBImageIndex: this.getNextSlideIndex(
        this.constants.STARTING_SLIDE,
        1
      ),
      slideCImageIndex: this.getNextSlideIndex(
        this.constants.STARTING_SLIDE,
        -1
      ),
      slideAAnimationName: null,
      slideBAnimationName: null,
      slideCAnimationName: null,
      slideTransitionDuration: this.constants.SLIDE_TRANSITION_DURATION
    };

    this.imageLoadFailedArr = [];

    this.imageLoading = false;
    this.images = [];
    this.isFullScreen = false;
    this.changingSlide = false;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onWheel = this.onWheel.bind(this);
    // this.changeSlide = this.changeSlide.bind(this);
    // this.onAnimationEnd = this.onAnimationEnd.bind(this);
    this.isFirefox = typeof InstallTrigger !== 'undefined';
  }

  componentDidMount() {
    this.setState(
      { mainDivRect: this.mainDiv.parentNode.getBoundingClientRect() },
      () => {
        // Create style object for slide animations
        this.slideAnimationsStylesheet = document.createElement('style');
        this.slideAnimationsStylesheet.type = 'text/css';
        document.head.appendChild(this.slideAnimationsStylesheet);
        this.createSlideAnimationKeyframes(this.slideAnimationsStylesheet);
        console.log(this.slideAnimationsStylesheet);
      }
    );
    this.checkPreload();

    // this.slideDivA.addEventListener('animationend', this.onAnimationEnd, false);
    // this.slideDivB.addEventListener('animationend', this.onAnimationEnd, false);
    document.addEventListener('wheel', this.onWheel);
    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    console.log('#######  unmounting  ######');
    // Delete animation styleSheet
    this.slideAnimationsStylesheet.parentNode.removeChild(
      this.slideAnimationsStylesheet
    );
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  onWindowResize() {
    this.setState({ mainDivRect: this.mainDiv.getBoundingClientRect() }, () => {
      this.createSlideAnimationKeyframes(this.slideAnimationsStylesheet);
    });
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

  // onAnimationEnd(e) {
  //   console.log('animend', e);
  //   // this.changingSlide = false;
  // }

  onWheel(e) {
    console.log('on wheel', e.deltaX, e.deltaY, e.ctrlKey);

    e.preventDefault();
    e.stopPropagation();

    let threshold = this.constants.SWIPE_THRESHOLD;
    let timeout = this.constants.SLIDE_TRANSITION_TIMEOUT;
    if (this.isFirefox) {
      threshold = threshold * 1.5;
      // timeout = 180;
    }

    if (!this.changingSlide) {
      if (Math.abs(e.deltaX) > threshold) {
        console.log('THRESHOLD');
        if (this.zoomTimeout) clearTimeout(this.zoomTimeout);
        this.zoomTimeout = setTimeout(() => {
          this.changingSlide = false;
        }, timeout);
        this.changingSlide = true;
        if (e.deltaX > 0) {
          this.changeSlide(1);
        } else {
          this.changeSlide(-1);
        }
        return;
      }
      if (this.state.activeSlide === 'A' && this.slideA) {
        this.slideA.onWheel(e);
      } else if (this.slideB) {
        this.slideB.onWheel(e);
      } else {
      }
    }
  }

  createSlideAnimationKeyframes(styleSheet) {
    const width = this.state.mainDivRect.width;
    if (styleSheet.sheet.cssRules[0]) styleSheet.sheet.deleteRule(0);
    console.log('***********', styleSheet.sheet.cssRules);
    styleSheet.sheet.insertRule(
      `
    @keyframes center-left {
      from { left: 0px; } 
      to { left: ${-1 * width}px; }
    }`,
      0
    );
    if (styleSheet.sheet.cssRules[1]) styleSheet.sheet.deleteRule(1);
    styleSheet.sheet.insertRule(
      `
    @keyframes center-right {
      from { left: 0px; } 
      to { left: ${width}px; }
    }`,
      1
    );
    if (styleSheet.sheet.cssRules[2]) styleSheet.sheet.deleteRule(2);
    styleSheet.sheet.insertRule(
      `
    @keyframes left-center {
      from { left: ${-1 * width}px; } 
      to { left: 0px; }
    }`,
      2
    );
    if (styleSheet.sheet.cssRules[3]) styleSheet.sheet.deleteRule(3);
    styleSheet.sheet.insertRule(
      `
    @keyframes right-center {
      from { left: ${width}px; } 
      to { left: 0px; }
    }`,
      3
    );
    if (styleSheet.sheet.cssRules[4]) styleSheet.sheet.deleteRule(4);
    styleSheet.sheet.insertRule(
      `
    @keyframes center-left-alt {
      from { left: 0px; } 
      to { left: ${-1 * width}px; }
    }`,
      4
    );
    if (styleSheet.sheet.cssRules[5]) styleSheet.sheet.deleteRule(5);
    styleSheet.sheet.insertRule(
      `
    @keyframes center-right-alt {
      from { left: 0px; } 
      to { left: ${width}px; }
    }`,
      5
    );
    if (styleSheet.sheet.cssRules[6]) styleSheet.sheet.deleteRule(6);
    styleSheet.sheet.insertRule(
      `
    @keyframes left-center-alt {
      from { left: ${-1 * width}px; } 
      to { left: 0px; }
    }`,
      6
    );
    if (styleSheet.sheet.cssRules[7]) styleSheet.sheet.deleteRule(7);
    styleSheet.sheet.insertRule(
      `
    @keyframes right-center-alt {
      from { left: ${width}px; } 
      to { left: 0px; }
    }`,
      7
    );
    console.log('new animations:', styleSheet.sheet);
  }

  getNextSlideIndex(currentIndex, amount) {
    let nextSlideIndex =
      (currentIndex + amount + this.props.imageUrls.length) %
      this.props.imageUrls.length;
    return nextSlideIndex;
  }

  changeSlide(amount) {
    const nextSlideIndex = this.getNextSlideIndex(
      this.state.currentSlideIndex,
      amount
    );

    const { imagesInfo } = this.state;
    const imageInfo = JSON.parse(
      JSON.stringify(imagesInfo[this.state.currentSlideIndex])
    );
    if (this.state.activeSlide === 'A') {
      if (this.state.imagesInfo[this.state.slideAImageIndex] && this.slideA) {
        imageInfo.zoomLevel = this.slideA.state.zoomLevel;
        imageInfo.zoomTarget = this.slideA.state.zoomTarget;
        imagesInfo[this.state.currentSlideIndex] = imageInfo;
      }
    } else {
      if (this.state.imagesInfo[this.state.slideBImageIndex] && this.slideB) {
        imageInfo.zoomLevel = this.slideB.state.zoomLevel;
        imageInfo.zoomTarget = this.slideB.state.zoomTarget;
        imagesInfo[this.state.currentSlideIndex] = imageInfo;
      }
    }

    if (amount > 0) {
      // Forwards
      if (this.state.activeSlide === 'A') {
        this.setState({
          currentSlideIndex: nextSlideIndex,
          imagesInfo,
          activeSlide: 'B',
          slideAAnimationName:
            this.state.slideAAnimationName === 'center-left'
              ? 'center-left-alt'
              : 'center-left',
          slideBAnimationName:
            this.state.slideBAnimationName === 'right-center'
              ? 'right-center-alt'
              : 'right-center',
          slideBImageIndex: nextSlideIndex
        });
      } else {
        this.setState({
          currentSlideIndex: nextSlideIndex,
          imagesInfo,
          activeSlide: 'A',
          slideBAnimationName:
            this.state.slideBAnimationName === 'center-left'
              ? 'center-left-alt'
              : 'center-left',
          slideAAnimationName:
            this.state.slideAAnimationName === 'right-center'
              ? 'right-center-alt'
              : 'right-center',
          slideAImageIndex: nextSlideIndex
        });
      }
    } else {
      // Backwards
      if (this.state.activeSlide === 'A') {
        this.setState({
          currentSlideIndex: nextSlideIndex,
          imagesInfo,
          activeSlide: 'B',
          slideAAnimationName:
            this.state.slideAAnimationName === 'center-right'
              ? 'center-right-alt'
              : 'center-right',
          slideBAnimationName:
            this.state.slideBAnimationName === 'left-center'
              ? 'left-center-alt'
              : 'left-center',
          slideBImageIndex: nextSlideIndex
        });
      } else {
        this.setState({
          currentSlideIndex: nextSlideIndex,
          imagesInfo,
          activeSlide: 'A',
          slideBAnimationName:
            this.state.slideBAnimationName === 'center-right'
              ? 'center-right-alt'
              : 'center-right',
          slideAAnimationName:
            this.state.slideAAnimationName === 'left-center'
              ? 'left-center-alt'
              : 'left-center',
          slideAImageIndex: nextSlideIndex
        });
      }
    }
    this.checkPreload();
  }

  checkPreload() {
    // if (
    //   !this.state.imagesInfo[this.state.slideAImageIndex] &&
    //   this.state.activeSlide === 'A'
    // ) {
    //   const mainDivRect = this.mainDiv.getBoundingClientRect();
    //   this.setState({
    //     slideAImageIndex: this.state.currentSlideIndex,
    //     mainDivRect: mainDivRect
    //   });
    // }
    // if (
    //   !this.state.imagesInfo[this.state.slideBImageIndex] &&
    //   this.state.activeSlide === 'B'
    // ) {
    //   this.setState({
    //     slideBImageIndex: this.state.currentSlideIndex
    //   });
    // }
    // if (!this.state.slideBImage && this.state.activeSlide === 'C') {
    //   this.setState({
    //     slideCImage: this.state.imagesInfo[this.state.currentSlideIndex]
    //   });
    // }

    //First figure out which images should be preloaded based on current image index & MAX_PRELOADED_IMAGES
    const requiredImages = [];
    for (let i = 0; i < this.constants.MAX_PRELOADED_IMAGES + 1; i++) {
      const nextSlide = this.getNextSlideIndex(this.state.currentSlideIndex, i);
      if (!requiredImages.includes(nextSlide)) requiredImages.push(nextSlide);
    }
    // Add previous slide also
    requiredImages.push(
      this.getNextSlideIndex(this.state.currentSlideIndex, -1)
    );
    console.log('required slides:', requiredImages);

    let allLoaded = true;
    const self = this;
    requiredImages.forEach((imageIdx, idx) => {
      if (self.state.imagesInfo[imageIdx] === null) {
        allLoaded = false;
        if (!this.imageLoading && !this.imageLoadFailedArr.includes(imageIdx))
          self.startImagePreload(imageIdx);
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
    console.log('starting preload of image', idx);
    image.src = this.props.imageUrls[idx];
    image.onload = () => {
      this.imageLoading = false;
      if (this.state.imagesInfo[idx] === null) {
        // const imagesInfo = [...this.state.imagesInfo];
        const imagesInfo = this.state.imagesInfo;

        const MAX_ZOOM = image.naturalWidth / this.state.mainDivRect.width + 8;

        const maxv = Math.log(MAX_ZOOM);
        const scale = maxv / this.constants.ZOOM_LEVELS;
        const zoomMultipliers = [];
        for (let i = 0; i < this.constants.ZOOM_LEVELS; i++) {
          zoomMultipliers.push(Math.exp(scale * i));
        }
        imagesInfo[idx] = {
          url: this.props.imageUrls[idx],
          imageAspectRatio: image.naturalWidth / image.naturalHeight,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          zoomLevel: 0,
          zoomTarget: { x: 0.5, y: 0.5 },
          zoomMultipliers
        };

        console.log('downloaded image', idx);
        this.setState({ imagesInfo });

        this.checkPreload();
      }
    };
    image.onerror = () => {
      this.imageLoading = false;
      // const { imageLoadFailedArr } = this.state;
      this.imageLoadFailedArr.push(idx);
      console.log('loud fejld');
    };
  }

  render() {
    console.log('*** viewer render ***');

    return (
      <div className="viewer" ref={el => (this.mainDiv = el)}>
        <div
          className="main-image-div"
          ref={el => {
            this.slideDivA = el;
          }}
          style={{
            animationName: this.state.slideAAnimationName,
            animationDuration: `${this.state.slideTransitionDuration}s`,
            animationFillMode: 'forwards',
            left: '0px'
          }}
        >
          {this.state.imagesInfo[this.state.slideAImageIndex] !== null ? (
            <SingleImage
              ref={el => {
                this.slideA = el;
              }}
              slide="A"
              activeSlide={this.state.activeSlide}
              imageInfo={this.state.imagesInfo[this.state.slideAImageIndex]}
              parentBoundingRect={this.state.mainDivRect}
              ZOOM_LEVELS={this.constants.ZOOM_LEVELS}
              SWIPE_THRESHOLD={this.constants.SWIPE_THRESHOLD}
              // changeSlide={this.changeSlide}
              isFirefox={this.isFirefox}
            />
          ) : this.imageLoadFailedArr.includes(this.state.currentSlideIndex) &&
            this.state.activeSlide === 'A' ? (
            <div style={{ color: 'white' }}>loud fejld</div>
          ) : (
            <div style={{ color: 'white' }}>louding</div>
          )}
        </div>
        <div
          className="main-image-div"
          ref={el => {
            this.slideDivB = el;
          }}
          style={{
            animationName: this.state.slideBAnimationName,
            animationDuration: `${this.state.slideTransitionDuration}s`,
            animationFillMode: 'forwards',
            left: this.state.mainDivRect ? this.state.mainDivRect.width : 0
          }}
        >
          {this.state.imagesInfo[this.state.slideBImageIndex] !== null ? (
            <SingleImage
              ref={el => {
                this.slideB = el;
              }}
              slide="B"
              activeSlide={this.state.activeSlide}
              imageInfo={this.state.imagesInfo[this.state.slideBImageIndex]}
              parentBoundingRect={this.state.mainDivRect}
              ZOOM_LEVELS={this.constants.ZOOM_LEVELS}
              SWIPE_THRESHOLD={this.constants.SWIPE_THRESHOLD}
              // changeSlide={this.changeSlide}
              isFirefox={this.isFirefox}
            />
          ) : this.imageLoadFailedArr.includes(this.state.currentSlideIndex) &&
            this.state.activeSlide === 'B' ? (
            <div style={{ color: 'white' }}>loud fejld</div>
          ) : (
            <div style={{ color: 'white' }}>louding</div>
          )}
        </div>
        {/* <div
          className="main-image-div"
          style={{
            animationName: this.state.slideCAnimationName,
            animationDuration: `${this.state.slideTransitionDuration}s`,
            animationFillMode: 'forwards',
            left: this.state.mainDivRect ? -1 * this.state.mainDivRect.width : 0
          }}
        >
          {this.state.imagesInfo[this.state.slideCImageIndex] !== null ? (
            <SingleImage
              slide="C"
              activeSlide={this.state.activeSlide}
              imageInfo={this.state.imagesInfo[this.state.slideCImageIndex]}
              parentBoundingRect={this.state.mainDivRect}
              ZOOM_LEVELS={this.constants.ZOOM_LEVELS}
              SWIPE_THRESHOLD={this.constants.SWIPE_THRESHOLD}
              isFirefox={this.isFirefox}
            />
          ) : this.state.imageLoadFailedArr.includes(
              this.state.currentSlideIndex
            ) && this.state.activeSlide === 'C' ? (
            <div style={{ color: 'white' }}>loud fejld</div>
          ) : (
            <div style={{ color: 'white' }}>louding</div>
          )}
        </div> */}
      </div>
    );
  }
}

export default LuloViewer;

import React, { Component } from 'react';
import SingleImage from './SingleImage';

class LuloViewer extends Component {
  constructor(props) {
    super(props);
    this.constants = {
      STARTING_SLIDE: 0,
      // MAX_PRELOADED_IMAGES: this.props.imageUrls.length,
      MAX_PRELOADED_IMAGES: 1,
      ZOOM_LEVELS: 100,
      SWIPE_THRESHOLD: 40,
      SLIDE_TRANSITION_DURATION: 0.5
    };

    const imagesInfo = new Array(this.props.imageUrls.length);
    imagesInfo.fill(null);
    this.state = {
      allLoaded: false,
      imageLoadFailedArr: [],
      activeSlide: 'A',
      currentSlideIndex: this.constants.STARTING_SLIDE,
      imagesInfo,
      slideAImage: null,
      slideBImage: null,
      // slideATransition: `left ${this.constants.SLIDE_TRANSITION_DURATION}s`,
      // slideBTransition: `left ${this.constants.SLIDE_TRANSITION_DURATION}s`,
      // slideALeft: '0px',
      // slideBLeft: '0px',
      changingSlide: false,
      slideAAnimationName: null,
      slideBAnimationName: null,
      slideTransitionDuration: this.constants.SLIDE_TRANSITION_DURATION
    };

    this.imageLoading = false;
    this.images = [];
    this.isFullScreen = false;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    // this.changeSlide = this.changeSlide.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.slideDidMount = this.slideDidMount.bind(this);
    this.isFirefox = typeof InstallTrigger !== 'undefined';

  }
  
  createSlideKeyframes() {
    console.log(this.slideAnimationsStylesheet)
  }

  createSlideAnimationKeyframes(styleSheet) {
    const width = this.state.mainDivRect.width
    if (styleSheet.sheet.cssRules[0]) styleSheet.sheet.deleteRule(0)
    console.log('***********', styleSheet.sheet.cssRules)
    styleSheet.sheet.insertRule(`
    @keyframes center-left {
      from { left: 0px; } 
      to { left: ${ -1 * width}px; }
    }`, 0)
    if (styleSheet.sheet.cssRules[1]) styleSheet.sheet.deleteRule(1)
    styleSheet.sheet.insertRule(`
    @keyframes center-right {
      from { left: 0px; } 
      to { left: ${width}px; }
    }`, 1)
    if (styleSheet.sheet.cssRules[2]) styleSheet.sheet.deleteRule(2)
    styleSheet.sheet.insertRule(`
    @keyframes left-center {
      from { left: ${ -1 * width}px; } 
      to { left: 0px; }
    }`, 2)
    if (styleSheet.sheet.cssRules[3]) styleSheet.sheet.deleteRule(3)
    styleSheet.sheet.insertRule(`
    @keyframes right-center {
      from { left: ${ width}px; } 
      to { left: 0px; }
    }`, 3)
    if (styleSheet.sheet.cssRules[4]) styleSheet.sheet.deleteRule(4)
    styleSheet.sheet.insertRule(`
    @keyframes center-left-alt {
      from { left: 0px; } 
      to { left: ${ -1 * width}px; }
    }`, 4)
    if (styleSheet.sheet.cssRules[5]) styleSheet.sheet.deleteRule(5)
    styleSheet.sheet.insertRule(`
    @keyframes center-right-alt {
      from { left: 0px; } 
      to { left: ${width}px; }
    }`, 5)
    if (styleSheet.sheet.cssRules[6]) styleSheet.sheet.deleteRule(6)
    styleSheet.sheet.insertRule(`
    @keyframes left-center-alt {
      from { left: ${ -1 * width}px; } 
      to { left: 0px; }
    }`, 6)
    if (styleSheet.sheet.cssRules[7]) styleSheet.sheet.deleteRule(7)
    styleSheet.sheet.insertRule(`
    @keyframes right-center-alt {
      from { left: ${ width}px; } 
      to { left: 0px; }
    }`, 7)
    console.log('new animations:', styleSheet.sheet)
  }
  
  componentDidMount() {
    this.setState({ mainDivRect: this.mainDiv.getBoundingClientRect() }, () => {
      // Create style object for slide animations
      this.slideAnimationsStylesheet = document.createElement('style')
      this.slideAnimationsStylesheet.type = 'text/css';
      document.head.appendChild(this.slideAnimationsStylesheet)
      this.createSlideAnimationKeyframes(this.slideAnimationsStylesheet)
      console.log(this.slideAnimationsStylesheet)
    });
    // setTimeout(() => {
    //   this.setState({animationName: 'center-right', animationDuration: '0.5s'})
    // }, 2000);
    this.checkPreload();
    
    document.addEventListener('wheel', this.onWheel);
    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('keydown', this.onKeyDown, false);
    // Delete animation styleSheet
    this.slideAnimationsStylesheet.parentNode.removeChild(this.slideAnimationsStylesheet)

  }

  onWindowResize() {
    this.setState({ mainDivRect: this.mainDiv.getBoundingClientRect() }, () => {
      this.createSlideAnimationKeyframes(this.slideAnimationsStylesheet)
    });
    // if (this.state.activeSlide === 'A') {
    //   console.log('TRIGGERED, moving...', this.props.slide);
    //   this.setState({
    //     slideBLeft: this.state.mainDivRect.width,
    //     slideBTransition: 'left 0s'
    //   });
    // } else {
    //   this.setState({
    //     slideALeft: this.state.mainDivRect.width,
    //     slideATransition: 'left 0s'
    //   });
    // }
  }

  onKeyDown(e) {
    // e.preventDefault()
    console.log('changing:', this.changingSlide);
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        // if (!this.changingSlide) 
        this.changeSlide(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        // if (!this.changingSlide) 
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

  getNextSlideIndex(currentIndex, amount) {
    let nextSlideIndex =
      (currentIndex + amount + this.props.imageUrls.length) %
      this.props.imageUrls.length;
    return nextSlideIndex;
  }

  slideDidMount(slide) {
    // setTimeout(() => {
    //   if (slide === 'A') {
    //     this.slideADiv.addEventListener(
    //       'transitionend',
    //       this.onTransitionEnd,
    //       true
    //     );
    //   }
    //   if (slide === 'B') {
    //     this.slideBDiv.addEventListener(
    //       'transitionend',
    //       this.onTransitionEnd,
    //       true
    //     );
    //   }
    // }, 0);
  }

  // onTransitionEnd() {
  //   this.changingSlide = false;
  //   console.log('**********************transition end', this.changingSlide);
  // }

  changeSlide(amount) {
    console.log('change slide', amount);
    this.changingSlide = true;
    // setTimeout(() => {
    //   this.changingSlide = false;
    // }, this.constants.SLIDE_TRANSITION_DURATION * 1200);
    const nextSlideIndex = this.getNextSlideIndex(
      this.state.currentSlideIndex,
      amount
    );

    const imageInfo = this.state.imagesInfo[this.state.currentSlideIndex];
    const { imagesInfo } = this.state;
    if (this.state.activeSlide === 'A') {
      if (this.slideA) {
        imageInfo.zoomLevel = this.slideA.state.zoomLevel;
        imageInfo.zoomTarget = this.slideA.state.zoomTarget;
        imagesInfo[this.state.currentSlideIndex] = imageInfo;
      }
    } else {
      if (this.slideB) {
        imageInfo.zoomLevel = this.slideB.state.zoomLevel;
        imageInfo.zoomTarget = this.slideB.state.zoomTarget;
        imagesInfo[this.state.currentSlideIndex] = imageInfo;
      }
    }

    // const width = this.state.mainDivRect.width
    if (amount > 0) {
      console.log('helllo????')
      // Forwards
      if (this.state.activeSlide === 'A') {
        console.log(
          'CHANGING SLIDE',
          this.state.currentSlideIndex,
          nextSlideIndex,
          this.state.mainDivRect.width
        );
        // this.slideA.classList.remove(this.state.slideAAnimationName)
        console.log(this.state.slideAAnimationName, this.state.slideAAnimationName === 'center-left' ? 'center-left-alt' : 'center-left')
        this.setState({
          currentSlideIndex: nextSlideIndex,
          imagesInfo,
          activeSlide: 'B',
          slideAAnimationName: this.state.slideAAnimationName === 'center-left' ? 'center-left-alt' : 'center-left',
          slideBAnimationName: this.state.slideBAnimationName === 'right-center' ? 'right-center-alt' : 'right-center',
          slideBImage: this.state.imagesInfo[nextSlideIndex]
        });
        // setTimeout(() => {
        //   this.setState({
        //     slideBTransition: `left ${
        //       this.constants.SLIDE_TRANSITION_DURATION
        //     }s`,
        //     slideBLeft: 0
        //   });
        // }, 0);
      } else {
        console.log(this.state.slideBAnimationName, this.state.slideBAnimationName === 'center-left' ? 'center-left-alt' : 'center-left')

        this.setState({
          currentSlideIndex: nextSlideIndex,
          imagesInfo,
          activeSlide: 'A',
          slideBAnimationName: this.state.slideBAnimationName === 'center-left' ? 'center-left-alt' : 'center-left',
          slideAAnimationName: this.state.slideAAnimationName === 'right-center' ? 'right-center-alt' : 'right-center',
          slideAImage: this.state.imagesInfo[nextSlideIndex]
        });
        // setTimeout(() => {
        //   this.setState({
        //     slideATransition: `left ${
        //       this.constants.SLIDE_TRANSITION_DURATION
        //     }s`,
        //     slideALeft: 0
        //   });
        // }, 0);
      }
    } else {
      // Backwards
      if (this.state.activeSlide === 'A') {
        console.log('doing dat');

        console.log(
          this.state.currentSlideIndex,
          nextSlideIndex,
          this.state.mainDivRect.width
        );
        this.setState({
          currentSlideIndex: nextSlideIndex,
          imagesInfo,
          activeSlide: 'B',
          slideAAnimationName: this.state.slideAAnimationName === 'center-right' ? 'center-right-alt' : 'center-right',
          slideBAnimationName: this.state.slideBAnimationName === 'left-center' ? 'left-center-alt' : 'left-center',
          slideBImage: this.state.imagesInfo[nextSlideIndex]
        });
      } else {
        this.setState({
          currentSlideIndex: nextSlideIndex,
          imagesInfo,
          activeSlide: 'A',
          slideBAnimationName: this.state.slideBAnimationName === 'center-right' ? 'center-right-alt' : 'center-right',
          slideAAnimationName: this.state.slideAAnimationName === 'left-center' ? 'left-center-alt' : 'left-center',
          slideAImage: this.state.imagesInfo[nextSlideIndex]
        });

      }
    }
    this.checkPreload();
  }

  checkPreload() {
    const requiredImages = [];
    if (!this.state.slideAImage && this.state.activeSlide === 'A') {
      const mainDivRect = this.mainDiv.getBoundingClientRect();
      this.setState({
        slideAImage: this.state.imagesInfo[this.state.currentSlideIndex],
        mainDivRect: mainDivRect,
        // slideBLeft: mainDivRect.width,
        // slideBTransition: 'left 0s'
      });
    }
    if (!this.state.slideBImage && this.state.activeSlide === 'B') {
      this.setState({
        slideBImage: this.state.imagesInfo[this.state.currentSlideIndex]
      });
    }
    for (let i = 0; i < this.constants.MAX_PRELOADED_IMAGES + 1; i++) {
      const nextSlide =
        (this.state.currentSlideIndex + i) % this.props.imageUrls.length;
      if (!requiredImages.includes(nextSlide)) requiredImages.push(nextSlide);
    }
    console.log('required slides:', requiredImages);

    let allLoaded = true;
    const self = this;
    requiredImages.forEach((imageIdx, idx) => {
      if (self.state.imagesInfo[imageIdx] === null) {
        allLoaded = false;
        if (
          !this.imageLoading &&
          !this.state.imageLoadFailedArr.includes(imageIdx)
        )
          self.startImagePreload(imageIdx);
        return;
      }
    });
    if (allLoaded) {
      console.log('ALL REQUIRED SLIDES LOADED ============');
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
        const zoomMultipliers = {};
        for (let i = 0; i < this.constants.ZOOM_LEVELS; i++) {
          zoomMultipliers[i] = Math.exp(scale * i);
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

        this.setState({ imagesInfo });
        console.log('downloaded image', idx);

        this.checkPreload();
      }
    };
    image.onerror = () => {
      this.imageLoading = false;
      const { imageLoadFailedArr } = this.state;
      imageLoadFailedArr.push(idx);
      console.log('loud fejld');
    };
  }

  onWheel(e) {
    e.preventDefault();
    if (this.state.activeSlide === 'A') {
      this.slideA.onWheel(e);
    } else {
      this.slideB.onWheel(e);
    }
  }

  render() {
    console.log('*** viewer render ***');

    return (
      <div className="viewer" ref={el => (this.mainDiv = el)}>
        <div
          className="main-image-div"
          ref={el => {
            this.slideADiv = el;
          }}
          style={{
            // left: this.state.slideALeft,
            // transition: this.state.slideATransition,
            animationName: this.state.slideAAnimationName,
            animationDuration: `${this.state.slideTransitionDuration}s`,
            animationFillMode: 'forwards'
          }}
        >
          {this.state.slideAImage !== null ? (
            <SingleImage
              ref={el => {
                this.slideA = el;
              }}
              slide="A"
              slideDidMount={this.slideDidMount}
              activeSlide={this.state.activeSlide}
              imageInfo={this.state.slideAImage}
              parentBoundingRect={this.state.mainDivRect}
              ZOOM_LEVELS={this.constants.ZOOM_LEVELS}
              SWIPE_THRESHOLD={this.constants.SWIPE_THRESHOLD}
              isFirefox={this.isFirefox}
              // changeSlide={this.changeSlide}
            />
          ) : this.state.imageLoadFailedArr.includes(
              this.state.currentSlideIndex
            ) && this.state.activeSlide === 'A' ? (
            <div style={{ color: 'white' }}>loud fejld</div>
          ) : (
            <div style={{ color: 'white' }}>louding</div>
          )}
        </div>
        <div
          className="main-image-div"
          ref={el => {
            this.slideBDiv = el;
          }}
          style={{
            // left: this.state.slideBLeft,
            animationName: this.state.slideBAnimationName,
            animationDuration: `${this.state.slideTransitionDuration}s`,
            animationFillMode: 'forwards'
          }}
        >
          {this.state.slideBImage !== null ? (
            <SingleImage
              ref={el => {
                this.slideB = el;
              }}
              slide="B"
              slideDidMount={this.slideDidMount}
              activeSlide={this.state.activeSlide}
              imageInfo={this.state.slideBImage}
              parentBoundingRect={this.state.mainDivRect}
              ZOOM_LEVELS={this.constants.ZOOM_LEVELS}
              SWIPE_THRESHOLD={this.constants.SWIPE_THRESHOLD}
              isFirefox={this.isFirefox}
              // changeSlide={this.changeSlide}
            />
          ) : this.state.imageLoadFailedArr.includes(
              this.state.currentSlideIndex
            ) && this.state.activeSlide === 'B' ? (
            <div style={{ color: 'white' }}>loud fejld</div>
          ) : (
            <div style={{ color: 'white' }}>louding</div>
          )}
        </div>
      </div>
    );
  }
}

export default LuloViewer;

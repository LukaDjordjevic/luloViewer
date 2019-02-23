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
      activeSlide: 'A',
      currentSlideIndex: this.constants.STARTING_SLIDE,
      // nextSlideIndex: this.getNextSlideIndex(this.constants.STARTING_SLIDE, 1),
      imagesInfo,
      slideAImage: null,
      slideBImage: null,
      slideATransition: `left ${this.constants.SLIDE_TRANSITION_DURATION}s`,
      slideBTransition: `left ${this.constants.SLIDE_TRANSITION_DURATION}s`,
      slideALeft: '0px',
      slideBLeft: '0px',
      changingSlide: false
    };

    this.imageLoading = false;
    this.images = [];
    this.isFullScreen = false;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.changeSlide = this.changeSlide.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.isFirefox = typeof InstallTrigger !== 'undefined';
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ mainDivRect: this.mainDiv.getBoundingClientRect() });
    }, 0);
    this.checkPreload();
    document.addEventListener('wheel', this.onWheel);

    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('keydown', this.onKeyDown, false);
    this.setState({ mainDivRect: this.mainDiv.getBoundingClientRect() }, () => {
      // this.forceUpdate();
    });
    // setTimeout(() => {
    //   this.setState({ slideALeft: '-700px' });
    //   // this.forceUpdate();
    // }, 1000);
    // setTimeout(() => {
    //   this.setState({ slideALeft: '0px' });
    //   // this.forceUpdate();
    // }, 2000);
    // setTimeout(() => {
    //   this.setState({ slideALeft: '700px' });
    //   // this.forceUpdate();
    // }, 3000);
    // setTimeout(() => {
    //   this.setState({ slideALeft: '0px' });
    //   // this.forceUpdate();
    // }, 4000);
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
        if (!this.changingSlide) this.changeSlide(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (!this.changingSlide) this.changeSlide(1);
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

  changeSlide(amount) {
    console.log('change slide', amount);
    this.changingSlide = true;
    setTimeout(() => {
      this.changingSlide = false;
    }, this.constants.SLIDE_TRANSITION_DURATION * 1100);
    const nextSlideIndex = this.getNextSlideIndex(
      this.state.currentSlideIndex,
      amount
    );
    if (amount > 0) {
      // Forwards
      if (this.state.activeSlide === 'A') {
        console.log(
          'CHANGING SLIDE',
          this.state.currentSlideIndex,
          nextSlideIndex,
          this.state.mainDivRect.width
        );

        this.setState({
          currentSlideIndex: nextSlideIndex,
          activeSlide: 'B',
          slideALeft: -1 * this.state.mainDivRect.width,
          slideBTransition: `left 0s`,
          slideBLeft: this.state.mainDivRect.width,
          slideAImage: this.state.imagesInfo[this.state.currentSlideIndex],
          slideBImage: this.state.imagesInfo[nextSlideIndex]
        });
        setTimeout(() => {
          this.setState({
            slideBTransition: `left ${
              this.constants.SLIDE_TRANSITION_DURATION
            }s`,
            slideBLeft: 0
          });
        }, 0);
      } else {
        this.setState({
          currentSlideIndex: nextSlideIndex,
          activeSlide: 'A',
          slideBLeft: -1 * this.state.mainDivRect.width,
          slideATransition: 'left 0s',
          slideALeft: this.state.mainDivRect.width,
          slideBImage: this.state.imagesInfo[this.state.currentSlideIndex],
          slideAImage: this.state.imagesInfo[nextSlideIndex]
        });
        setTimeout(() => {
          this.setState({
            slideATransition: `left ${
              this.constants.SLIDE_TRANSITION_DURATION
            }s`,
            slideALeft: 0
          });
        }, 0);
      }
    } else {
      // Backwards
      if (this.state.activeSlide === 'A') {
        console.log(
          'CHANGING SLIDE',
          this.state.currentSlideIndex,
          nextSlideIndex,
          this.state.mainDivRect.width
        );

        this.setState({
          currentSlideIndex: nextSlideIndex,
          activeSlide: 'B',
          slideALeft: this.state.mainDivRect.width,
          slideBTransition: `left 0s`,
          slideBLeft: -1 * this.state.mainDivRect.width,
          slideAImage: this.state.imagesInfo[this.state.currentSlideIndex],
          slideBImage: this.state.imagesInfo[nextSlideIndex]
        });
        setTimeout(() => {
          this.setState({
            slideBTransition: `left ${
              this.constants.SLIDE_TRANSITION_DURATION
            }s`,
            slideBLeft: 0
          });
        }, 0);
      } else {
        this.setState({
          currentSlideIndex: nextSlideIndex,
          activeSlide: 'A',
          slideBLeft: this.state.mainDivRect.width,
          slideATransition: 'left 0s',
          slideALeft: -1 * this.state.mainDivRect.width,
          slideBImage: this.state.imagesInfo[this.state.currentSlideIndex],
          slideAImage: this.state.imagesInfo[nextSlideIndex]
        });
        setTimeout(() => {
          this.setState({
            slideATransition: `left ${
              this.constants.SLIDE_TRANSITION_DURATION
            }s`,
            slideALeft: 0
          });
        }, 0);
      }
    }
    this.checkPreload();
  }

  checkPreload() {
    const requiredImages = [];
    if (!this.state.slideAImage && this.state.activeSlide === 'A') {
      this.setState({
        slideAImage: this.state.imagesInfo[this.state.currentSlideIndex]
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
        console.log('isNull');
        allLoaded = false;
        if (!this.imageLoading) self.startImagePreload(imageIdx);
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
        console.log('spread images info:', imagesInfo, this.state.imagesInfo);
        imagesInfo[idx] = {
          url: this.props.imageUrls[idx],
          imageAspectRatio: image.naturalWidth / image.naturalHeight,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight
        };
        console.log('*************imageinfo', imagesInfo);

        this.setState({ imagesInfo });
        console.log('downloaded image', idx);

        // if (idx === this.state.currentSlideIndex) {
        //   this.setState({
        //     mainDivRect: this.mainDiv.getBoundingClientRect(),
        //     slideAImage: this.state.imagesInfo[this.state.currentSlideIndex]
        //   });
        // }
        // if (idx === this.state.nextSlideIndex) {
        //   this.setState({
        //     slideBImage: this.state.imagesInfo[
        //       this.getNextSlideIndex(this.state.currentSlideIndex, 1)
        //     ]
        //   });
        // }

        this.checkPreload();
      }
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
    console.log('*** render ***');

    return (
      <div className="viewer" ref={el => (this.mainDiv = el)}>
        <div
          className="main-image-div"
          style={{
            left: this.state.slideALeft,
            transition: this.state.slideATransition
          }}
          // onWheel={this.onWheel}
        >
          {this.state.slideAImage !== null ? (
            <SingleImage
              ref={el => {
                this.slideA = el;
              }}
              imageInfo={this.state.slideAImage}
              parentBoundingRect={this.state.mainDivRect}
              ZOOM_LEVELS={this.constants.ZOOM_LEVELS}
              SWIPE_THRESHOLD={this.constants.SWIPE_THRESHOLD}
              isFirefox={this.isFirefox}
              changeSlide={this.changeSlide}
            />
          ) : (
            <div style={{ color: 'white' }}>louding</div>
          )}
        </div>
        <div
          className="main-image-div"
          style={{
            left: this.state.slideBLeft,
            transition: this.state.slideBTransition
          }}
          // ref={el => (this.mainDiv = el)}
          // onWheel={this.onWheel}
        >
          {this.state.slideBImage !== null ? (
            <SingleImage
              ref={el => {
                this.slideB = el;
              }}
              imageInfo={this.state.slideBImage}
              parentBoundingRect={this.state.mainDivRect}
              ZOOM_LEVELS={this.constants.ZOOM_LEVELS}
              SWIPE_THRESHOLD={this.constants.SWIPE_THRESHOLD}
              isFirefox={this.isFirefox}
              changeSlide={this.changeSlide}
            />
          ) : (
            <div style={{ color: 'white' }}>louding</div>
          )}
        </div>
      </div>
    );
  }
}

export default LuloViewer;

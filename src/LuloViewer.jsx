import React, { Component } from 'react';
import SingleImage from './SingleImage';
import ZoomController from './ZoomController';
import Slider from './Slider';
import Arrows from './Arrows';
import Menu from './Menu';
import {
  calculateSlidesDivFromMainDiv,
  updateZoomTarget,
  constrainTranslate,
  getViewRectangleTransform,
  createSlideAnimationKeyframes
} from './util';

class LuloViewer extends Component {
  constructor(props) {
    super(props);
    this.constants = {
      STARTING_SLIDE: 0,
      MAX_PRELOADED_IMAGES: 5,
      ZOOM_LEVELS: 100,
      SWIPE_THRESHOLD: 20,
      SLIDE_TRANSITION_DURATION: 0.3,
      SLIDE_TRANSITION_TIMEOUT: 600,
      BACKGROUND_COLOR: 'black',
      // BACKGROUND_COLOR: 'darkslategray',
      SHOW_ARROWS: true,
      ALLOW_MENU: true,
      ARROWS_SIZE: 0.05, // width of arrow as fraction of viewer width
      ALLOW_CYCLIC: true,
      ARROW_DEFAULT_COLOR: '#AAAAAA',
      ARROW_HIGHLIGHT_COLOR: '#FFFFFF',
      ARROW_DISABLED_COLOR: '#333333',
      SHOW_SLIDER: true,
      SHOW_SLIDER_ARROWS: true,
      SLIDER_POSITION: 'bottom',
      SLIDER_SIZE: 0.1, //slider thickness as fraction of viewer dimension
      SLIDER_ARROW_SIZE: 3, // in percent of slider div
      ARROWS_PADDING: 5,
      SHOW_ZOOM_CONTROLLER: true,
      ZOOM_CONTROLLER_SIZE: 0.18, // width of zoomController as fraction of viewer width
      ZOOM_CONTROLLER_PADDING: 5, // zoomController padding as viewer width percent
      ZOOM_CONTROLLER_POSITION_X: 0.8,
      ZOOM_CONTROLLER_POSITION_Y: 0.025,
      MENU_SIZE: 30, // %
      MENU_TEXT_COLOR: 'lightgrey',
      MENU_ICON_COLOR: 'lightgrey',
      MENU_BGD_COLOR: 'rgba(0, 0, 0, 0.7)'
    };

    const imagesInfo = new Array(this.props.imageUrls.length);
    imagesInfo.fill(null);
    this.state = {
      showArrows: this.constants.SHOW_ARROWS,
      showZoomController: this.constants.SHOW_ZOOM_CONTROLLER,
      showSlider: this.constants.SHOW_SLIDER,
      sliderPosition: this.constants.SLIDER_POSITION,
      slideTransitionDuration: this.constants.SLIDE_TRANSITION_DURATION,
      showMenu: false,
      allLoaded: false,
      activeSlide: 'A',
      currentSlideIndex: this.constants.STARTING_SLIDE,
      imagesInfo,
      slideALeft: 0,
      slideBLeft: 0,
      slideCLeft: 0,
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
      leftArrowColor: '#CCCCCC',
      rightArrowColor: '#CCCCCC',
      mainDivRect: { left: 0, top: 0, width: 0, height: 0 },
      slidesRect: { left: 0, top: 0, width: 0, height: 0 }
    };
    this.zoomControllerTransform = {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    };
    this.imageLoadFailedArr = [];
    // this.lastSliderPos = { left: 0, top: 0 };
    this.imageLoading = false;
    this.images = [];
    this.changingSlide = false;
    this.numberOfSlides = this.props.imageUrls.length;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.updateImageFromZoomController = this.updateImageFromZoomController.bind(
      this
    );
    this.onLeftArrowClick = this.onLeftArrowClick.bind(this);
    this.onRightArrowClick = this.onRightArrowClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.setViewerToSlide = this.setViewerToSlide.bind(this);
    // this.updateSliderPos = this.updateSliderPos.bind(this);
    this.updateZoomController = this.updateZoomController.bind(this);
    this.saveSlidePosition = this.saveSlidePosition.bind(this);
    // this.onTouchStart = this.onTouchStart.bind(this);
    // this.onTouchMove = this.onTouchMove.bind(this);
    // this.onTouchEnd = this.onTouchEnd.bind(this);
    this.isFirefox = typeof InstallTrigger !== 'undefined';
  }

  // onTouchStart(e) {
  //   e.preventDefault();
  // }

  // onTouchMove(e) {
  //   e.preventDefault();
  // }

  componentDidMount() {
    window.oncontextmenu = e => {
      console.log('kontekst meni');

      if (this.constants.ALLOW_MENU) e.preventDefault();
    };

    const mainDivRect = this.mainDiv.parentNode.getBoundingClientRect();
    const slidesRect = calculateSlidesDivFromMainDiv(
      mainDivRect,
      this.state.sliderPosition,
      this.state.showSlider,
      this.constants.SLIDER_SIZE
    );
    this.updateZoomControllerTransform(mainDivRect, slidesRect);

    setTimeout(() => {
      // const mainDivRect = this.mainDiv.getBoundingClientRect();
      // const slidesRect = this.slides.getBoundingClientRect();
      // this.setState({ slidesRect, mainDivRect }, () => {
      //   this.updateZoomControllerTransform();
      // });
      this.onWindowResize();
    }, 1000);

    console.log('dobijo', slidesRect, mainDivRect);

    this.setState(
      {
        slidesRect,
        mainDivRect,
        slideALeft: 0,
        slideBLeft: slidesRect.width,
        slideCLeft: -1 * slidesRect.width
      },
      () => {
        // Create style object for slide animations
        this.slideAnimationsStylesheet = document.createElement('style');
        this.slideAnimationsStylesheet.type = 'text/css';
        document.head.appendChild(this.slideAnimationsStylesheet);
        createSlideAnimationKeyframes(
          this.slideAnimationsStylesheet,
          this.state.slidesRect
        );
        this.updateZoomController();
        console.log(this.slideAnimationsStylesheet);
      }
    );
    // document.addEventListener('wheel', this.onWheel);
    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('keydown', this.onKeyDown, false);

    this.checkPreload();
  }

  // updateSliderPos(newPosition) {
  //   // console.log(('saving position to', newPosition));

  //   this.lastSliderPos = newPosition;
  // }

  getActiveSlide() {
    const slides = {
      A: this.slideA,
      B: this.slideB,
      C: this.slideC
    };
    return slides[this.state.activeSlide];
  }

  updateImageFromZoomController(moveDelta) {
    const activeSlide = this.getActiveSlide();
    const imageLeft = activeSlide ? activeSlide.state.left : 0;
    const imageTop = activeSlide ? activeSlide.state.top : 0;
    const imageWidth = activeSlide ? activeSlide.state.width : 0;
    const imageHeight = activeSlide ? activeSlide.state.height : 0;
    const zoomFactor = activeSlide ? activeSlide.state.zoomFactor : 0;

    const factor =
      this.state.slidesRect.width / this.state.slidesRect.height >
      this.state.imagesInfo[this.state.currentSlideIndex].imageAspectRatio
        ? imageHeight / this.zoomControllerTransform.height
        : imageWidth / this.zoomControllerTransform.width;
    const newLeft = imageLeft - moveDelta.x * factor;
    const newTop = imageTop - moveDelta.y * factor;

    const zoomTarget = updateZoomTarget(
      newLeft,
      newTop,
      imageWidth,
      imageHeight,
      this.state.slidesRect.width,
      this.state.slidesRect.height
    );

    const { constrainedLeft, constrainedTop } = constrainTranslate(
      newLeft,
      newTop,
      zoomFactor,
      this.state.slidesRect,
      this.state.imagesInfo[this.state.currentSlideIndex].imageAspectRatio
    );

    // const zoomTarget = updateZoomTarget(
    //   constrainedLeft,
    //   constrainedTop,
    //   imageWidth,
    //   imageHeight,
    //   this.state.slidesRect.width,
    //   this.state.slidesRect.width
    // );

    const newState = {
      left: constrainedLeft,
      top: constrainedTop,
      // left: newLeft,
      // top: newTop,
      zoomTarget
    };
    activeSlide.setState(newState, () => {
      this.updateZoomController();
    });
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

  updateZoomControllerTransform(mainDivRect, slidesRect) {
    const left =
      slidesRect.width * this.constants.ZOOM_CONTROLLER_POSITION_X +
      (slidesRect.left - mainDivRect.left);
    const top =
      slidesRect.height * this.constants.ZOOM_CONTROLLER_POSITION_Y +
      (slidesRect.top - mainDivRect.top);

    const width = slidesRect.width * this.constants.ZOOM_CONTROLLER_SIZE;
    const height = slidesRect.height * this.constants.ZOOM_CONTROLLER_SIZE;
    // let offsetX = 0;
    // let offsetY = 0;
    // const imageInfo = this.state.imagesInfo[this.state.currentSlideIndex];
    // if (imageInfo) {
    //   if (
    //     imageInfo.imageAspectRatio >
    //     this.state.slidesRect.width / this.state.slidesRect.height
    //   ) {
    //     console.log('veci je aspekt');
    //     offsetY = (height - width / imageInfo.imageAspectRatio) / 2;
    //   } else {
    //     console.log('manji je aspekt');
    //     offsetY = (width - height * imageInfo.imageAspectRatio) / 2;
    //   }
    // }
    this.zoomControllerTransform = {
      left,
      top,
      width,
      height
      // offsetX,
      // offsetY
    };
    console.log('333', this.zoomControllerTransform);
  }

  onWindowResize() {
    console.log('onwindowsresize');

    const mainDivRect = this.mainDiv.getBoundingClientRect();
    // const slidesRect = this.slides.getBoundingClientRect();
    const slidesRect = calculateSlidesDivFromMainDiv(
      mainDivRect,
      this.state.sliderPosition,
      this.state.showSlider,
      this.constants.SLIDER_SIZE
    );

    this.updateZoomControllerTransform(mainDivRect, slidesRect);
    if (this.slider) this.slider.setInitialPosition();

    let slideALeft = 0;
    let slideBLeft = 0;
    let slideCLeft = 0;
    if (this.state.slideALeft > 0) slideALeft = slidesRect.width;
    if (this.state.slideALeft < 0) slideALeft = -1 * slidesRect.width;
    if (this.state.slideBLeft > 0) slideBLeft = slidesRect.width;
    if (this.state.slideBLeft < 0) slideBLeft = -1 * slidesRect.width;
    if (this.state.slideCLeft > 0) slideCLeft = slidesRect.width;
    if (this.state.slideCLeft < 0) slideCLeft = -1 * slidesRect.width;
    this.setState(
      {
        slidesRect,
        mainDivRect,
        slideALeft,
        slideBLeft,
        slideCLeft
      },
      () => {
        createSlideAnimationKeyframes(
          this.slideAnimationsStylesheet,
          this.state.slidesRect
        );
        this.updateZoomController();
      }
    );
  }

  onKeyDown(e) {
    // e.preventDefault()
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (this.constants.ALLOW_CYCLIC || this.state.currentSlideIndex !== 0) {
          this.changeSlide(-1);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (
          this.constants.ALLOW_CYCLIC ||
          this.state.currentSlideIndex !== this.props.imageUrls.length - 1
        ) {
          this.changeSlide(1);
        }
        break;
      case 'f':
        if (!this.state.isFullscreen) {
          this.mainDiv.requestFullscreen();
          this.setState({ isFullscreen: true });
        } else {
          document.exitFullscreen();
          this.setState({ isFullscreen: false });
        }
        break;
      default:
        console.log('something else');
    }
  }

  onMouseDown(e) {
    console.log('layout-main onMouseDown', e.clientX, e.pageX, e.screenX);

    e.preventDefault();
    // e.stopPropagation();
    if (e.button === 0) {
      // Left click
      if (this.state.showMenu && this.constants.ALLOW_MENU) {
        this.setState({ showMenu: false });
        return;
      }
      // document.addEventListener('mousemove', this.onMouseMove);
      // document.addEventListener('mouseup', this.onMouseUp);
    } else {
      // Right click
      if (this.constants.ALLOW_MENU) {
        this.setState({
          showMenu: !this.state.showMenu,
          menuPosition: {
            x: e.clientX - this.state.mainDivRect.left,
            y: e.clientY - this.state.mainDivRect.top
          }
        });
      }
    }
  }

  onMouseUp(e) {
    // e.preventDefault();
    // e.stopPropagation();
    // document.removeEventListener('mousemove', this.onMouseMove);
    // document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove(e) {
    // e.preventDefault();
    // e.stopPropagation();
    // this.updateZoomController(e, 'mouseMove');
  }

  onWheel(e) {
    console.log('main onwheel', e.deltaX, e.deltaY, e.ctrlKey, e.button);

    e.preventDefault();
    e.stopPropagation();

    if (!this.changingSlide) {
      let threshold = this.constants.SWIPE_THRESHOLD;
      let timeout = this.constants.SLIDE_TRANSITION_TIMEOUT;
      if (this.isFirefox) threshold = threshold * 1.5;
      const activeSlide = this.getActiveSlide();
      if (Math.abs(e.deltaX) > threshold) {
        console.log('THRESHOLD');
        this.changingSlide = true;
        if (this.slideChangeTimeout) clearTimeout(this.slideChangeTimeout);
        this.slideChangeTimeout = setTimeout(() => {
          this.changingSlide = false;
        }, timeout);
        if (activeSlide) {
          if (e.deltaX > 0) {
            if (
              this.constants.ALLOW_CYCLIC ||
              this.state.currentSlideIndex !== this.props.imageUrls.length - 1
            ) {
              if (!activeSlide.zoomTargetSelected) this.changeSlide(1);
            }
          } else {
            if (
              this.constants.ALLOW_CYCLIC ||
              this.state.currentSlideIndex !== 0
            ) {
              if (!activeSlide.zoomTargetSelected) this.changeSlide(-1);
            }
          }
        } else {
          if (e.deltaX > 0) {
            this.changeSlide(1);
          } else {
            this.changeSlide(-1);
          }
        }
      } else {
        if (activeSlide) activeSlide.handleWheel(e);
        this.updateZoomController(e, 'wheel');
      }
    }
  }

  onLeftArrowClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.changeSlide(-1);
  }

  onRightArrowClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.changeSlide(1);
  }

  getNextSlideIndex(currentIndex, amount) {
    let nextSlideIndex =
      (currentIndex + amount + this.props.imageUrls.length) %
      this.props.imageUrls.length;
    return nextSlideIndex;
  }

  updateZoomController(e, eventType) {
    const activeSlide = this.getActiveSlide();
    if (activeSlide) {
      const imageLeft = activeSlide.state.left;
      const imageTop = activeSlide.state.top;
      const imageWidth = activeSlide.state.width;
      const imageHeight = activeSlide.state.height;

      if (this.zoomController) {
        const viewRectangleTransform = getViewRectangleTransform(
          imageLeft,
          imageTop,
          imageWidth,
          imageHeight,
          this.state.slidesRect.width * this.constants.ZOOM_CONTROLLER_SIZE,
          this.state.slidesRect.height * this.constants.ZOOM_CONTROLLER_SIZE,
          this.state.slidesRect
        );
        this.zoomController.updateViewRectangle(viewRectangleTransform);
      }
    }
  }

  handleMenuClick(item) {
    console.log(item);

    switch (item) {
      case 'fullscreen':
        if (this.state.isFullscreen) {
          this.setState({ isFullscreen: false });
          document.exitFullscreen();
        } else {
          this.setState({ isFullscreen: true });
          this.mainDiv.requestFullscreen();
        }
        break;
      case 'arrows':
        this.setState({ showArrows: !this.state.showArrows });
        break;
      case 'slider':
        this.setState({ showSlider: !this.state.showSlider }, () => {
          this.onWindowResize();
        });
        break;
      case 'zoom':
        this.setState(
          { showZoomController: !this.state.showZoomController },
          () => {
            this.updateZoomController();
          }
        );
        break;
      case 'animate':
        this.setState({
          slideTransitionDuration:
            this.state.slideTransitionDuration === 0
              ? this.constants.SLIDE_TRANSITION_DURATION
              : 0
        });
        break;
      default:
        const slidesRect = calculateSlidesDivFromMainDiv(
          this.state.mainDivRect,
          item,
          this.state.showSlider,
          this.constants.SLIDER_SIZE
        );
        this.setState({ sliderPosition: item, slidesRect }, () => {
          this.updateZoomControllerTransform(
            this.state.mainDivRect,
            slidesRect
          );
          this.onWindowResize();
        });
    }
  }

  saveSlidePosition() {
    console.log('saving slide');

    const activeSlide = this.getActiveSlide();
    const imagesInfo = JSON.parse(JSON.stringify(this.state.imagesInfo));
    const imageInfo = JSON.parse(
      JSON.stringify(imagesInfo[this.state.currentSlideIndex])
    );

    if (activeSlide && imageInfo) {
      imageInfo.zoomLevel = activeSlide.state.zoomLevel;
      imageInfo.zoomTarget = activeSlide.state.zoomTarget;
      imagesInfo[this.state.currentSlideIndex] = imageInfo;
    }
    this.setState({ imagesInfo });
  }

  changeSlide(amount) {
    console.log('changing slide');
    this.saveSlidePosition();

    const width = this.state.slidesRect.width;
    let slideAAnimationName = this.state.slideAAnimationName;
    let slideBAnimationName = this.state.slideBAnimationName;
    let slideCAnimationName = this.state.slideCAnimationName;
    let slideALeft = this.state.slideALeft;
    let slideBLeft = this.state.slideBLeft;
    let slideCLeft = this.state.slideCLeft;
    let slideAImageIndex = this.state.slideAImageIndex;
    let slideBImageIndex = this.state.slideBImageIndex;
    let slideCImageIndex = this.state.slideCImageIndex;
    let currentSlideIndex;
    let activeSlide;
    if (amount > 0) {
      // Forwards
      currentSlideIndex = this.getNextSlideIndex(
        this.state.currentSlideIndex,
        1
      );
      if (this.state.slideALeft === -1 * this.state.slidesRect.width) {
        console.log(
          'AAAA IS LEFT',
          this.state.slideALeft,
          -1 * this.state.slidesRect.width
        );
        slideBAnimationName =
          this.state.slideBAnimationName === 'center-left'
            ? 'center-left-alt'
            : 'center-left';
        slideCAnimationName =
          this.state.slideCAnimationName === 'right-center'
            ? 'right-center-alt'
            : 'right-center';
        slideAAnimationName = null;
        slideALeft = width;
        slideCLeft = 0;
        slideBLeft = -1 * width;
        activeSlide = 'C';

        slideAImageIndex = this.getNextSlideIndex(
          this.state.currentSlideIndex,
          2
        );
      } else if (this.state.slideBLeft === -1 * this.state.slidesRect.width) {
        console.log('B is left');

        slideCAnimationName =
          this.state.slideCAnimationName === 'center-left'
            ? 'center-left-alt'
            : 'center-left';
        slideAAnimationName =
          this.state.slideAAnimationName === 'right-center'
            ? 'right-center-alt'
            : 'right-center';
        slideBAnimationName = null;

        slideCLeft = -1 * width;
        slideALeft = 0;
        slideBLeft = width;
        activeSlide = 'A';

        slideBImageIndex = this.getNextSlideIndex(
          this.state.currentSlideIndex,
          2
        );
        console.log('###', this.state.currentSlideIndex, slideBImageIndex);
      } else {
        console.log('C is left');

        slideAAnimationName =
          this.state.slideAAnimationName === 'center-left'
            ? 'center-left-alt'
            : 'center-left';
        slideBAnimationName =
          this.state.slideBAnimationName === 'right-center'
            ? 'right-center-alt'
            : 'right-center';
        slideCAnimationName = null;
        slideALeft = -1 * width;
        slideBLeft = 0;
        slideCLeft = width;
        activeSlide = 'B';

        slideCImageIndex = this.getNextSlideIndex(
          this.state.currentSlideIndex,
          2
        );
      }
    } else {
      // Backwards
      currentSlideIndex = this.getNextSlideIndex(
        this.state.currentSlideIndex,
        -1
      );
      if (this.state.slideALeft === -1 * this.state.slidesRect.width) {
        console.log(
          'AAAA IS LEFT',
          this.state.slideALeft,
          -1 * this.state.slidesRect.width
        );
        slideAAnimationName =
          this.state.slideAAnimationName === 'left-center'
            ? 'left-center-alt'
            : 'left-center';
        slideBAnimationName =
          this.state.slideCAnimationName === 'center-right'
            ? 'center-right-alt'
            : 'center-right';
        slideCAnimationName = null;
        slideALeft = 0;
        slideBLeft = width;
        slideCLeft = -1 * width;
        activeSlide = 'A';

        slideCImageIndex = this.getNextSlideIndex(
          this.state.currentSlideIndex,
          -2
        );
      } else if (this.state.slideBLeft === -1 * this.state.slidesRect.width) {
        console.log('B is left');

        slideBAnimationName =
          this.state.slideCAnimationName === 'left-center'
            ? 'left-center-alt'
            : 'left-center';
        slideCAnimationName =
          this.state.slideAAnimationName === 'center-right'
            ? 'center-right-alt'
            : 'center-right';
        slideAAnimationName = null;

        slideALeft = -1 * width;
        slideBLeft = 0;
        slideCLeft = width;
        activeSlide = 'B';

        slideAImageIndex = this.getNextSlideIndex(
          this.state.currentSlideIndex,
          -2
        );
      } else {
        console.log('C is left');

        slideCAnimationName =
          this.state.slideAAnimationName === 'left-center'
            ? 'left-center-alt'
            : 'left-center';
        slideAAnimationName =
          this.state.slideBAnimationName === 'center-right'
            ? 'center-right-alt'
            : 'center-right';
        slideBAnimationName = null;
        slideBLeft = -1 * width;
        slideCLeft = 0;
        slideALeft = width;
        activeSlide = 'C';

        slideBImageIndex = this.getNextSlideIndex(
          this.state.currentSlideIndex,
          -2
        );
      }
    }

    this.setState(
      {
        activeSlide,
        slideALeft,
        slideBLeft,
        slideCLeft,
        slideAImageIndex,
        slideBImageIndex,
        slideCImageIndex,
        currentSlideIndex,
        slideAAnimationName,
        slideBAnimationName,
        slideCAnimationName
      },
      () => {
        this.updateZoomController();
        this.checkPreload();
      }
    );
  }

  setViewerToSlide(index, e) {
    this.saveSlidePosition();
    switch (this.state.activeSlide) {
      case 'A':
        this.setState(
          {
            currentSlideIndex: index,
            slideAImageIndex: index,
            slideBImageIndex: this.getNextSlideIndex(index, 1),
            slideCImageIndex: this.getNextSlideIndex(index, -1)
          },
          () => {
            this.updateZoomController();
            this.checkPreload();
          }
        );
        break;
      case 'B':
        this.setState(
          {
            currentSlideIndex: index,
            slideAImageIndex: this.getNextSlideIndex(index, -1),
            slideBImageIndex: index,
            slideCImageIndex: this.getNextSlideIndex(index, 1)
          },
          () => {
            this.updateZoomController();
            this.checkPreload();
          }
        );
        break;
      case 'C':
        this.setState(
          {
            currentSlideIndex: index,
            slideAImageIndex: this.getNextSlideIndex(index, 1),
            slideBImageIndex: this.getNextSlideIndex(index, -1),
            slideCImageIndex: index
          },
          () => {
            this.updateZoomController();
            this.checkPreload();
          }
        );
        break;
      default:
    }
    console.log(index);
  }

  checkPreload() {
    //First figure out which images should be preloaded based on current image index & MAX_PRELOADED_IMAGES
    const requiredImages = [];
    // Add the slide on the left (previous slide)
    // requiredImages.push(
    //   this.getNextSlideIndex(this.state.currentSlideIndex, -1)
    // );
    for (let i = 0; i < this.constants.MAX_PRELOADED_IMAGES + 1; i++) {
      const nextSlide = this.getNextSlideIndex(this.state.currentSlideIndex, i);
      const previousSlide = this.getNextSlideIndex(
        this.state.currentSlideIndex,
        -1
      );
      console.log('previous slide is', previousSlide);

      if (i === 2) {
        console.log('pushing previous');

        requiredImages.push(previousSlide);
      }
      if (!requiredImages.includes(nextSlide)) {
        console.log('pushing next');

        requiredImages.push(nextSlide);
      }
    }
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

        const MAX_ZOOM = image.naturalWidth / this.state.slidesRect.width + 4;

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
      this.imageLoadFailedArr.push(idx);
      console.log('loud fejld');
      this.checkPreload();
    };
  }

  render() {
    console.log(
      '*** viewer render ***',
      this.state.slidesRect ? this.state.slidesRect.height / 2 : 0
    );

    // const activeSlide = this.getActiveSlide();
    // console.log('active slide', this.state.activeSlide, activeSlide);

    //*******************************************
    //****************** arrows *****************
    //*******************************************
    const arrows = this.state.showArrows ? (
      <Arrows
        arrowsSize={this.constants.ARROWS_SIZE}
        sliderSize={this.constants.SLIDER_SIZE}
        arrowsPadding={this.constants.ARROWS_PADDING}
        allowCyclic={this.constants.ALLOW_CYCLIC}
        highlightColor={this.constants.ARROW_HIGHLIGHT_COLOR}
        defaultColor={this.constants.ARROW_DEFAULT_COLOR}
        sliderPosition={this.state.sliderPosition}
        showSlider={this.state.showSlider}
        mainDivRect={this.state.mainDivRect}
        slidesRect={this.state.slidesRect}
        leftArrowColor={this.state.leftArrowColor}
        rightArrowColor={this.state.rightArrowColor}
        currentSlideIndex={this.state.currentSlideIndex}
        onLeftArrowClick={this.onLeftArrowClick}
        onRightArrowClick={this.onRightArrowClick}
        numberOfSlides={this.numberOfSlides}
      />
    ) : null;

    //*******************************************
    //************** zoom controller ************
    //*******************************************
    const zoomController =
      this.state.showZoomController &&
      this.state.slidesRect &&
      this.state.imagesInfo[this.state.currentSlideIndex] ? (
        <ZoomController
          ref={el => (this.zoomController = el)}
          style={{
            left: this.zoomControllerTransform.left,
            top: this.zoomControllerTransform.top,
            width: this.zoomControllerTransform.width,
            height: this.zoomControllerTransform.height,
            backgroundImage: `url('${
              this.props.imageUrls[this.state.currentSlideIndex]
            }')`
          }}
          updateImageFromZoomController={this.updateImageFromZoomController}
        />
      ) : null;

    //****************************************
    //************** Photo Slides ************
    //****************************************
    const photoSlides = (
      <div
        className="photo-slides"
        style={{
          width: this.state.slidesRect.width,
          height: this.state.slidesRect.height
        }}
      >
        <div
          className="main-image-div"
          style={{
            animationName: this.state.slideAAnimationName,
            animationDuration: `${this.state.slideTransitionDuration}s`,
            animationFillMode: 'forwards',
            left: `${this.state.slideALeft}px`
          }}
        >
          {this.state.imagesInfo[this.state.slideAImageIndex] !== null ? (
            <SingleImage
              ref={el => {
                this.slideA = el;
              }}
              slide="A"
              parentLeft={this.state.slideALeft}
              imageInfo={this.state.imagesInfo[this.state.slideAImageIndex]}
              parentBoundingRect={
                this.state.showSlider
                  ? this.state.slidesRect
                  : this.state.mainDivRect
              }
              ZOOM_LEVELS={this.constants.ZOOM_LEVELS}
              isFirefox={this.isFirefox}
              updateZoomController={this.updateZoomController}
            />
          ) : this.imageLoadFailedArr.includes(this.state.slideAImageIndex) ? (
            <div className="message">
              Image {this.props.imageUrls[this.state.currentSlideIndex]} failed
              to load.
            </div>
          ) : (
            <div className="message">Image Loading</div>
          )}
        </div>
        <div
          className="main-image-div"
          style={{
            animationName: this.state.slideBAnimationName,
            animationDuration: `${this.state.slideTransitionDuration}s`,
            animationFillMode: 'forwards',
            left: `${this.state.slideBLeft}px`
          }}
        >
          {this.state.imagesInfo[this.state.slideBImageIndex] !== null ? (
            <SingleImage
              ref={el => {
                this.slideB = el;
              }}
              slide="B"
              parentLeft={this.state.slideBLeft}
              imageInfo={this.state.imagesInfo[this.state.slideBImageIndex]}
              parentBoundingRect={this.state.slidesRect}
              ZOOM_LEVELS={this.constants.ZOOM_LEVELS}
              isFirefox={this.isFirefox}
              updateZoomController={this.updateZoomController}
            />
          ) : this.imageLoadFailedArr.includes(this.state.slideBImageIndex) ? (
            <div className="message">
              Image {this.props.imageUrls[this.state.currentSlideIndex]} failed
              to load.
            </div>
          ) : (
            <div className="message">Image Loading</div>
          )}
        </div>
        <div
          className="main-image-div"
          style={{
            animationName: this.state.slideCAnimationName,
            animationDuration: `${this.state.slideTransitionDuration}s`,
            animationFillMode: 'forwards',
            left: `${this.state.slideCLeft}px`
          }}
        >
          {this.state.imagesInfo[this.state.slideCImageIndex] !== null ? (
            <SingleImage
              ref={el => {
                this.slideC = el;
              }}
              slide="C"
              parentLeft={this.state.slideCLeft}
              imageInfo={this.state.imagesInfo[this.state.slideCImageIndex]}
              parentBoundingRect={this.state.slidesRect}
              ZOOM_LEVELS={this.constants.ZOOM_LEVELS}
              isFirefox={this.isFirefox}
              updateZoomController={this.updateZoomController}
            />
          ) : this.imageLoadFailedArr.includes(this.state.slideCImageIndex) ? (
            <div className="message">
              Image {this.props.imageUrls[this.state.currentSlideIndex]} failed
              to load.
            </div>
          ) : (
            <div className="message">Image Loading</div>
          )}
        </div>
      </div>
    );

    const flexDirection = ['top', 'bottom'].includes(this.state.sliderPosition)
      ? 'column'
      : 'row';

    const slidesWidth =
      ['left', 'right'].includes(this.state.sliderPosition) &&
      this.state.showSlider
        ? (1 - this.constants.SLIDER_SIZE) * 100
        : 100;
    const slidesHeight =
      ['top', 'bottom'].includes(this.state.sliderPosition) &&
      this.state.showSlider
        ? (1 - this.constants.SLIDER_SIZE) * 100
        : 100;

    const sliderWidth =
      ['left', 'right'].includes(this.state.sliderPosition) &&
      this.state.showSlider
        ? this.constants.SLIDER_SIZE * 100
        : 100;
    const sliderHeight =
      ['top', 'bottom'].includes(this.state.sliderPosition) &&
      this.state.showSlider
        ? this.constants.SLIDER_SIZE * 100
        : 100;

    //*******************************************
    //***************** Slider ******************
    //*******************************************
    const isHorizontal = ['top', 'bottom'].includes(this.state.sliderPosition);
    const slideSize = isHorizontal
      ? this.state.mainDivRect.height * this.constants.SLIDER_SIZE
      : this.state.mainDivRect.width * this.constants.SLIDER_SIZE;
    // const left = isHorizontal
    //   ? this.lastSliderPos.left || this.lastSliderPos.top
    //   : 0;
    // const top = isHorizontal
    //   ? 0
    //   : this.lastSliderPos.left || this.lastSliderPos.top;

    const slider = (
      <div
        className="layout-slider"
        style={{
          width: `${sliderWidth}%`,
          height: `${sliderHeight}%`
          // backgroundColor: this.constants.BACKGROUND_COLOR
        }}
      >
        <Slider
          ref={el => (this.slider = el)}
          images={this.state.imagesInfo.map(el => {
            if (el) {
              return el.url;
            }
            return 'no-url';
          })}
          isHorizontal={isHorizontal}
          backgroundColor={this.state.backgroundColor}
          arrowDefaultColor={this.constants.ARROW_DEFAULT_COLOR}
          arrowHighlightColor={this.constants.ARROW_HIGHLIGHT_COLOR}
          arrowDisabledColor={this.constants.ARROW_DISABLED_COLOR}
          sliderArrowSize={this.constants.SLIDER_ARROW_SIZE}
          activeSlideIdx={this.state.currentSlideIndex}
          slideSize={slideSize}
          slidesStripSize={slideSize * this.numberOfSlides}
          slideClick={this.setViewerToSlide}
          mainDivRect={this.state.mainDivRect}
          // left={left}
          // top={top}
          // updateSliderPos={this.updateSliderPos}
          showArrows={this.constants.SHOW_SLIDER_ARROWS}
          imagesInfo={this.state.imagesInfo}
        />
      </div>
    );

    const start =
      ['left', 'top'].includes(this.state.sliderPosition) &&
      this.state.showSlider
        ? slider
        : null;

    const middle = (
      <div
        className="slides-main"
        ref={el => (this.slides = el)}
        style={{
          width: `${slidesWidth}%`,
          height: `${slidesHeight}%`
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          {arrows}
          {zoomController}
          {photoSlides}
        </div>
      </div>
    );

    const end =
      ['right', 'bottom'].includes(this.state.sliderPosition) &&
      this.state.showSlider
        ? slider
        : null;

    const menu = this.state.showMenu ? (
      <Menu
        style={{
          // width: `${this.constants.MENU_SIZE}%`,
          // height: `${this.constants.MENU_SIZE}%`,
          // height:'auto',
          left: `${this.state.menuPosition.x}px`,
          top: `${this.state.menuPosition.y}px`,
          backgroundColor: this.constants.MENU_BGD_COLOR
        }}
        menuIconColor={this.constants.MENU_ICON_COLOR}
        menuTextColor={this.constants.MENU_TEXT_COLOR}
        handleMenuClick={this.handleMenuClick}
        showArrows={this.state.showArrows}
        showSlider={this.state.showSlider}
        showZoomController={this.state.showZoomController}
        slideTransitionDuration={this.state.slideTransitionDuration}
        isFullscreen={this.state.isFullscreen}
      />
    ) : null;

    return (
      <div className="viewer" ref={el => (this.mainDiv = el)}>
        <div
          className="layout-main"
          style={{
            width: `${this.state.mainDivRect.width}px`,
            height: `${this.state.mainDivRect.height}px`,
            flexDirection,
            backgroundColor: this.constants.BACKGROUND_COLOR
          }}
          onWheel={this.onWheel}
          onMouseDown={this.onMouseDown}
        >
          {start}
          {middle}
          {end}
        </div>
        {menu}
      </div>
    );
  }
}

export default LuloViewer;

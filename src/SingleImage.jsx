import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class SingleImage extends PureComponent {
  constructor(props) {
    super(props);

    this.startingX = this.props.parentBoundingRect.width / 2;
    this.startingY = this.props.parentBoundingRect.height / 2;
    this.startingLeft = this.startingX;
    this.startingTop = this.startingY;

    this.inThrottle = false;
    this.zooming = false;
    this.zoomTargetSelected = false;
    this.state = {
      zoomFactor:
        this.props.imageInfo.zoomMultipliers[this.props.imageInfo.zoomLevel] ||
        1,
      zoomLevel: this.props.imageInfo.zoomLevel || 0,
      cursor: 'initial',
      zoomTarget: this.props.imageInfo.zoomTarget || { x: 0.5, y: 0.5 }
    };

    this.containerAspectRatio =
      this.props.parentBoundingRect.width /
      this.props.parentBoundingRect.height;

    // const parentBoundingRect = { ...this.props.parentBoundingRect };
    const parentBoundingRect = {
      left: this.props.parentBoundingRect.left,
      top: this.props.parentBoundingRect.top,
      width: this.props.parentBoundingRect.width,
      height: this.props.parentBoundingRect.height
    };

    const imageAspectRatio = this.props.imageInfo.imageAspectRatio;
    const containerAspectRatio = this.containerAspectRatio;
    const { left, top, width, height } = this.getImageTransform(
      this.state.zoomFactor,
      this.state.zoomTarget,
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio
    );

    const { constrainedLeft, constrainedTop } = this.constrainTranslate(
      left,
      top,
      this.state.zoomFactor,
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio
    );

    this.state.left = constrainedLeft;
    this.state.top = constrainedTop;
    this.state.width = width;
    this.state.height = height;

    this.onWheel = this.onWheel.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    // this.onTouchStart = this.onTouchStart.bind(this);
    // this.onTouchMove = this.onTouchMove.bind(this);
    // this.onTouchEnd = this.onTouchEnd.bind(this);

    // document.onfullscreenchange = e => {
    // };
  }

  componentDidMount() {
    console.log('initialized');
  }

  componentWillReceiveProps(nextProps) {
    const parentBoundingRect = JSON.parse(
      JSON.stringify(nextProps.parentBoundingRect)
    );
    const imageAspectRatio = nextProps.imageInfo.imageAspectRatio;
    const containerAspectRatio =
      nextProps.parentBoundingRect.width / nextProps.parentBoundingRect.height;

    this.containerAspectRatio = containerAspectRatio;

    // Window resize or toggling fullscreen
    if (
      JSON.stringify(nextProps.parentBoundingRect) !==
      JSON.stringify(this.props.parentBoundingRect)
    ) {
      // console.log(nextProps.activeSlide, this.props.slide);
      const zoomFactor = this.state.zoomFactor;
      const zoomTarget = { ...this.state.zoomTarget };
      let { left, top, width, height } = this.getImageTransform(
        zoomFactor,
        zoomTarget,
        parentBoundingRect,
        imageAspectRatio,
        containerAspectRatio
      );

      const { constrainedLeft, constrainedTop } = this.constrainTranslate(
        left,
        top,
        zoomFactor,
        parentBoundingRect,
        imageAspectRatio,
        containerAspectRatio
      );

      left = constrainedLeft;
      top = constrainedTop;

      this.setState({ left, top, width, height }, () => {});
    }
    // Slide image has changed
    if (
      JSON.stringify(nextProps.imageInfo) !==
      JSON.stringify(this.props.imageInfo)
    ) {
      const { left, top, width, height } = this.getImageTransform(
        this.props.imageInfo.zoomMultipliers[nextProps.imageInfo.zoomLevel] ||
          1,
        nextProps.imageInfo.zoomTarget || { x: 0.5, y: 0.5 },
        parentBoundingRect,
        imageAspectRatio,
        containerAspectRatio
      );

      const { constrainedLeft, constrainedTop } = this.constrainTranslate(
        left,
        top,
        this.props.imageInfo.zoomMultipliers[nextProps.imageInfo.zoomLevel] ||
          1,
        parentBoundingRect,
        imageAspectRatio,
        containerAspectRatio
      );

      this.setState({
        zoomFactor: this.props.imageInfo.zoomMultipliers[
          nextProps.imageInfo.zoomLevel
        ],
        zoomLevel: nextProps.imageInfo.zoomLevel,
        zoomTarget: nextProps.imageInfo.zoomTarget,
        left: constrainedLeft,
        top: constrainedTop,
        width,
        height
      });
    } else {
    }
  }

  componentWillUnmount() {
    // document.removeEventListener('wheel', this.onWheel);
  }

  onMouseDown(e) {
    e.preventDefault();
    this.startingX = e.pageX;
    this.startingY = e.pageY;
    this.startingLeft = this.state.left;
    this.startingTop = this.state.top;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseUp() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove(e) {
    const offset = { x: e.pageX - this.startingX, y: e.pageY - this.startingY };

    let newLeft = this.startingLeft + offset.x;
    let newTop = this.startingTop + offset.y;

    const zoomFactor = this.state.zoomFactor;
    const imageAspectRatio = this.props.imageInfo.imageAspectRatio;
    const containerAspectRatio = this.containerAspectRatio;
    const parentBoundingRect = JSON.parse(
      JSON.stringify(this.props.parentBoundingRect)
    );
    console.log('stringifaj:', parentBoundingRect);

    const parentBoundingRect1 = { ...this.props.parentBoundingRect };
    const parentBoundingRect2 = Object.assign(
      {},
      this.props.parentBoundingRect
    );
    console.log('spread:', parentBoundingRect1);
    console.log('assign:', parentBoundingRect2);

    //Update zoomTarget
    const zoomTarget = {};
    zoomTarget.x =
      (-1 * newLeft + this.props.parentBoundingRect.width / 2) /
      this.state.width;
    zoomTarget.y =
      (-1 * newTop + this.props.parentBoundingRect.height / 2) /
      this.state.height;

    const { constrainedLeft, constrainedTop } = this.constrainTranslate(
      newLeft,
      newTop,
      zoomFactor,
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio
    );
    this.setState({
      left: constrainedLeft,
      top: constrainedTop,
      zoomTarget
    });
  }

  onWheel(e) {
    // console.log('on wheel', e.deltaX, e.deltaY, e.ctrlKey);
    // let threshold = this.props.SWIPE_THRESHOLD;
    // let timeout = 250;
    // if (this.props.isFirefox) {
    //   threshold = this.props.SWIPE_THRESHOLD * 1.5;
    //   timeout = 180;
    // }
    // if (Math.abs(e.deltaX) > threshold) {
    //   if (this.zoomTimeout) clearTimeout(this.zoomTimeout);
    //   this.zoomTimeout = setTimeout(() => {
    //     this.zooming = false;
    //   }, timeout);
    //   if (!this.zooming) {
    //     this.zooming = true;
    //     if (e.deltaX > 0) {
    //       this.props.changeSlide(1);
    //     } else {
    //       this.props.changeSlide(-1);
    //     }
    //     return;
    //   }
    // }

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    let zoomLevel = Math.round(this.state.zoomLevel - e.deltaY / 5);
    if (zoomLevel < 0) {
      // console.log('to little');
      return;
    }
    if (zoomLevel > this.props.ZOOM_LEVELS - 1) {
      // console.log('too much');
      return;
    }

    const newZoomFactor = this.props.imageInfo.zoomMultipliers[
      zoomLevel.toString()
    ];

    const parentBoundingRect = JSON.parse(
      JSON.stringify(this.props.parentBoundingRect)
    );
    const imageAspectRatio = this.props.imageInfo.imageAspectRatio;
    const containerAspectRatio = this.containerAspectRatio;
    const eventPosition = { x: e.clientX, y: e.clientY };

    const imgLeft = this.state.left;
    const imgTop = this.state.top;
    const oldZoomFactor = this.state.zoomFactor;
    const { left, top, width, height } = this.getNewZoomTransform(
      imgLeft,
      imgTop,
      newZoomFactor,
      oldZoomFactor,
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio,
      eventPosition
    );

    // Calculate new zoomTarget
    let zoomTarget = {};
    console.log(!this.zooming, e.deltaY);

    if (!this.zoomTargetSelected && e.deltaY < 0) {
      if (this.zoomTargetTimeout) clearTimeout(this.zoomTargetTimeout);
      this.zoomTargetTimeout = setTimeout(() => {
        this.zoomTargetSelected = false;
      }, 200);

      //Update zoomTarget
      zoomTarget.x =
        (-1 * this.state.left + parentBoundingRect.width / 2) /
        this.state.width;
      zoomTarget.y =
        (-1 * this.state.top + parentBoundingRect.height / 2) /
        this.state.height;
    } else {
      zoomTarget = this.state.zoomTarget;
    }

    // Constrain image position
    const { constrainedLeft, constrainedTop } = this.constrainTranslate(
      left,
      top,
      newZoomFactor,
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio
    );

    this.setState(
      {
        left: constrainedLeft,
        top: constrainedTop,
        width,
        height,
        zoomFactor: newZoomFactor,
        zoomLevel,
        zoomTarget
      },
      () => {}
    );
  }

  // Returns new image pos & dimensions while zooming such that the point on image below mouse pointer doesn't move
  getNewZoomTransform(
    imgLeft,
    imgTop,
    newZoomFactor,
    oldZoomFactor,
    parentBoundingRect,
    imageAspectRatio,
    containerAspectRatio,
    eventPosition
  ) {
    let width;
    let height;
    let oldWidth;
    let oldHeight;
    let left;
    let top;

    if (imageAspectRatio > containerAspectRatio) {
      oldWidth = parentBoundingRect.width * oldZoomFactor;
      oldHeight = oldWidth / imageAspectRatio;
      width = parentBoundingRect.width * newZoomFactor;
      height = width / imageAspectRatio;
    } else {
      oldHeight = parentBoundingRect.height * oldZoomFactor;
      oldWidth = oldHeight * imageAspectRatio;
      height = parentBoundingRect.height * newZoomFactor;
      width = height * imageAspectRatio;
    }

    const divCoords = {
      x: eventPosition.x - parentBoundingRect.left,
      y: eventPosition.y - parentBoundingRect.top
    };

    const oldPointX = -1 * imgLeft + divCoords.x;
    const oldPointY = -1 * imgTop + divCoords.y;
    const newPointX = (oldPointX / oldWidth) * width;
    const newPointY = (oldPointY / oldHeight) * height;

    left = -1 * newPointX + divCoords.x;
    top = -1 * newPointY + divCoords.y;

    return { left, top, width, height };
  }

  // Returns image position and dimensions based on zoomTarget, zoomFactor and div rectangle
  getImageTransform(
    zoomFactor,
    zoomTarget,
    parentBoundingRect,
    imageAspectRatio,
    containerAspectRatio
  ) {
    const { width, height } = this.getImageDimensions(
      zoomFactor,
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio
    );

    const left = -1 * width * zoomTarget.x + parentBoundingRect.width / 2;
    const top = -1 * height * zoomTarget.y + parentBoundingRect.height / 2;

    return { left, top, width, height };
  }

  getImageDimensions(
    zoomFactor,
    parentBoundingRect,
    imageAspectRatio,
    containerAspectRatio
  ) {
    let width;
    let height;

    if (imageAspectRatio > containerAspectRatio) {
      width = parentBoundingRect.width * zoomFactor;
      height = width / imageAspectRatio;
    } else {
      height = parentBoundingRect.height * zoomFactor;
      width = height * imageAspectRatio;
    }

    return { width, height };
  }

  constrainTranslate(
    left,
    top,
    zoomFactor,
    parentBoundingRect,
    imageAspectRatio,
    containerAspectRatio
  ) {
    let constrainedLeft = left;
    let constrainedTop = top;
    let leftOffset = 0;
    let topOffset = 0;
    let leftBoundary;
    let topBoundary;
    if (imageAspectRatio > containerAspectRatio) {
      topOffset =
        ((parentBoundingRect.height -
          parentBoundingRect.width / imageAspectRatio) /
          2) *
        zoomFactor;
      leftBoundary =
        -1 * parentBoundingRect.width * zoomFactor + parentBoundingRect.width;
      topBoundary =
        -1 * zoomFactor * (parentBoundingRect.width / imageAspectRatio) +
        parentBoundingRect.height -
        topOffset;
    } else {
      leftOffset =
        ((parentBoundingRect.width -
          parentBoundingRect.height * imageAspectRatio) /
          2) *
        zoomFactor;
      leftBoundary =
        -1 * zoomFactor * (parentBoundingRect.height * imageAspectRatio) +
        parentBoundingRect.width -
        leftOffset;
      topBoundary =
        -1 * parentBoundingRect.height * zoomFactor + parentBoundingRect.height;
    }

    if (left > leftOffset) constrainedLeft = leftOffset;
    if (left < leftBoundary) constrainedLeft = leftBoundary;
    if (top > topOffset) constrainedTop = topOffset;
    if (top < topBoundary) constrainedTop = topBoundary;

    return { constrainedLeft, constrainedTop };
  }

  refresh() {
    this.forceUpdate();
  }

  render() {
    console.log('*** single image render ***');

    return (
      <div
        className="image-div"
        style={{ cursor: this.state.cursor }}
        ref={el => (this.imageDiv = el)}
      >
        <img
          src={this.props.imageInfo.url}
          ref={el => (this.image = el)}
          alt=""
          style={{
            left: this.state.left,
            top: this.state.top,
            width: this.state.width,
            height: this.state.height
          }}
          onMouseDown={this.onMouseDown}
        />
      </div>
    );
  }
}

SingleImage.propTypes = {
  // imageInfo: PropTypes.shape({
  //   url: PropTypes.string.isRequired,
  //   imageAspectRatio: PropTypes.number.isRequired
  // }).isRequired
};

export default SingleImage;

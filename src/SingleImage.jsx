import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SingleImage extends Component {
  constructor(props) {
    super(props);
    this.MAX_ZOOM =
      this.props.imageInfo.naturalWidth / this.props.parentBoundingRect.width +
      8;

    this.startingX = this.props.parentBoundingRect.width / 2;
    this.startingY = this.props.parentBoundingRect.height / 2;
    this.startingLeft = this.startingX;
    this.startingTop = this.startingY;

    this.inThrottle = false;

    this.state = {
      zoomFactor: 1,
      zoomLevel: 0,
      zooming: false,
      cursor: 'initial',
      zoomTarget: { x: 0.5, y: 0.5 }
    };

    this.containerAspectRatio =
      this.props.parentBoundingRect.width /
      this.props.parentBoundingRect.height;
    console.log(this.props.parentBoundingRect.x);
    const bla = { x: 0, y: 0, left: 1, top: 21 };
    const bla1 = { ...bla };
    console.log(bla1);

    // const parentBoundingRect = { ...this.props.parentBoundingRect };
    const parentBoundingRect = {
      left: this.props.parentBoundingRect.left,
      top: this.props.parentBoundingRect.top,
      width: this.props.parentBoundingRect.width,
      height: this.props.parentBoundingRect.height
    };
    console.log(parentBoundingRect);

    const imageAspectRatio = this.props.imageInfo.imageAspectRatio;
    const containerAspectRatio = this.containerAspectRatio;
    const { left, top, width, height } = this.getImageTransform(
      1,
      { x: 0.5, y: 0.5 },
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio
    );

    this.state.left = left;
    this.state.top = top;
    this.state.width = width;
    this.state.height = height;

    this.onWheel = this.onWheel.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.throttledOnWheel = this.throttledOnWheel.bind(this);

    document.addEventListener('wheel', this.onWheel);

    // document.onfullscreenchange = e => {
    //   console.log(e, this.state, this.props);
    //   console.log('setting state');

    //   this.setState(
    //     this.getImageTransform(
    //       this.state.zoomFactor,
    //       this.state.zoomTarget,
    //       this.props.parentBoundingRect,
    //       this.props.imageInfo.imageAspectRatio,
    //       this.containerAspectRatio
    //     )
    //   );
    // };
  }

  componentWillReceiveProps(nextProps) {
    console.log('received new rect,', nextProps.parentBoundingRect);

    // const parentBoundingRect = { ...nextProps.parentBoundingRect };
    const parentBoundingRect = JSON.parse(
      JSON.stringify(nextProps.parentBoundingRect)
    );
    const imageAspectRatio = nextProps.imageInfo.imageAspectRatio;
    const containerAspectRatio =
      nextProps.parentBoundingRect.width / nextProps.parentBoundingRect.height;

    this.containerAspectRatio = containerAspectRatio;
    console.log(JSON.stringify(nextProps.parentBoundingRect));
    if (
      JSON.stringify(nextProps.parentBoundingRect) !==
      JSON.stringify(this.props.parentBoundingRect)
    ) {
      console.log('1');

      const zoomFactor = this.state.zoomFactor;
      const zoomTarget = JSON.parse(JSON.stringify(this.state.zoomTarget));
      console.log('zoomtarget', zoomTarget);
      // const zoomTarget = { ...this.state.zoomTarget };
      const imageTransform = this.getImageTransform(
        zoomFactor,
        zoomTarget,
        parentBoundingRect,
        imageAspectRatio,
        containerAspectRatio
      );

      console.log('constraining');
      const { constrainedLeft, constrainedTop } = this.constrainTranslate(
        imageTransform.left,
        imageTransform.top,
        zoomFactor,
        parentBoundingRect,
        imageAspectRatio,
        containerAspectRatio
      );

      imageTransform.left = constrainedLeft;
      imageTransform.top = constrainedTop;

      console.log('setting state');
      this.setState(imageTransform, () => {
        console.log('state set');
      });
    }
    if (
      JSON.stringify(nextProps.imageInfo) !==
      JSON.stringify(this.props.imageInfo)
    ) {
      const { left, top, width, height } = this.getImageTransform(
        1,
        { x: 0.5, y: 0.5 },
        parentBoundingRect,
        imageAspectRatio,
        containerAspectRatio
      );

      console.log('setting state');

      this.setState({
        zoomFactor: 1,
        zoomLevel: 0,
        left,
        top,
        width,
        height
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('wheel', this.onWheel);
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
    console.log('offsset', offset);

    let newLeft = this.startingLeft + offset.x;
    let newTop = this.startingTop + offset.y;

    // const left = this.state.left;
    // const top = this.state.top;
    const zoomFactor = this.state.zoomFactor;
    const imageAspectRatio = this.props.imageInfo.imageAspectRatio;
    const containerAspectRatio = this.containerAspectRatio;
    const parentBoundingRect = JSON.parse(
      JSON.stringify(this.props.parentBoundingRect)
    );
    console.log('@@@', newLeft, newTop);

    //Update zoomTarget
    const zoomTarget = {};
    zoomTarget.x =
      (-1 * newLeft + this.props.parentBoundingRect.width / 2) /
      this.state.width;
    zoomTarget.y =
      (-1 * newTop + this.props.parentBoundingRect.height / 2) /
      this.state.height;
    console.log('zoom target:', offset, zoomTarget);

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

  throttledOnWheel = (func, limit) => {
    // let inThrottle;
    const self = this;
    return function() {
      const args = arguments;
      const context = this;
      if (!self.inThrottle) {
        func.apply(context, args);
        self.inThrottle = true;
        setTimeout(() => (self.inThrottle = false), limit);
      }
    };
  };

  onWheel(e) {
    console.log('on wheel', e.deltaX, e.deltaY, e.ctrlKey);
    // document.removeEventListener('wheel', this.onWheel);
    e.preventDefault();
    e.stopPropagation();

    // if (e.deltaX > 10) {
    //   console.log('TRIG');
    //   this.props.changeSlide(1);
    //   return;
    // }
    // if (e.deltaX < -10) {
    //   console.log('TRIG');
    //   this.props.changeSlide(-1);
    //   return;
    // }

    // let zoomDamping = 8;
    // if (this.props.isFirefox) zoomDamping = 50;
    // let zoomLevel = this.state.zoomLevel - e.deltaY / zoomDamping;
    // const zoomLevel =
    //   e.deltaY > 0 ? this.state.zoomLevel + 1 : this.state.zoomLevel - 1;
    let zoomLevel;
    if (e.deltaY < 0) {
      zoomLevel = this.state.zoomLevel + 1;
    } else {
      zoomLevel = this.state.zoomLevel - 1;
    }
    if (zoomLevel < 0) {
      console.log('to little');

      return;
    }
    if (zoomLevel > this.props.ZOOM_LEVELS) {
      console.log('too much');
      return;
    }

    const maxv = Math.log(this.MAX_ZOOM);
    // Calculate adjustment factor
    const scale = maxv / this.props.ZOOM_LEVELS;
    const newZoomFactor = Math.exp(scale * zoomLevel);

    const parentBoundingRect = JSON.parse(
      JSON.stringify(this.props.parentBoundingRect)
    );
    const imageAspectRatio = this.props.imageInfo.imageAspectRatio;
    const containerAspectRatio = this.containerAspectRatio;
    const eventPosition = { x: e.clientX, y: e.clientY };
    // let zoomTarget = {};

    // const parentBoundingRect = { ...this.props.parentBoundingRect };

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

    // console.log(left, top, width, height);

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
        // cursor: 'none',
        left: constrainedLeft,
        top: constrainedTop,
        width,
        height,
        zoomFactor: newZoomFactor,
        zoomLevel
        // zoomTarget
      },
      () => {
        // document.addEventListener('wheel', this.onWheel);
      }
    );
  }

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
    console.log(
      'IN:',
      imgLeft,
      imgTop,
      newZoomFactor,
      oldZoomFactor,
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio,
      eventPosition
    );
    let width;
    let height;
    let oldWidth;
    let oldHeight;
    let left = imgLeft;
    let top = imgTop;
    if (imageAspectRatio > containerAspectRatio) {
      width = parentBoundingRect.width * newZoomFactor;
      height = width / imageAspectRatio;
      oldWidth = parentBoundingRect.width * oldZoomFactor;
      oldHeight = oldWidth / imageAspectRatio;
    } else {
      height = parentBoundingRect.height * newZoomFactor;
      width = height * imageAspectRatio;
      oldHeight = parentBoundingRect.height * oldZoomFactor;
      oldWidth = oldHeight * imageAspectRatio;
    }
    const divCoords = {
      x: eventPosition.x - parentBoundingRect.left,
      y: eventPosition.y - parentBoundingRect.top
    };
    console.log('div coords', divCoords);

    const oldPointX = -1 * imgLeft + divCoords.x;
    const newPointX = (oldPointX / oldWidth) * width;
    const oldPointY = -1 * imgTop + divCoords.y;
    const newPointY = (oldPointY / oldHeight) * height;
    console.log('POINTS', oldPointX, newPointX);

    left = -1 * newPointX + divCoords.x;
    top = -1 * newPointY + divCoords.y;
    console.log('OUT:', imgLeft, left);
    return { left, top, width, height };
  }

  // Get image position and dimensions based on zoomTarget, zoomFactor and div rectangle
  getImageTransform( // Pure
    zoomFactor,
    zoomTarget,
    parentBoundingRect,
    imageAspectRatio,
    containerAspectRatio
  ) {
    console.log('RECEIVING', parentBoundingRect);

    const { width, height } = this.getImageDimensions(
      zoomFactor,
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio
    );

    const left = -1 * width * zoomTarget.x + parentBoundingRect.width / 2;
    const top = -1 * height * zoomTarget.y + parentBoundingRect.height / 2;
    console.log('RETURNING', { left, top, width, height });

    return { left, top, width, height };
  }

  getImageDimensions(
    zoomFactor,
    parentBoundingRect,
    imageAspectRatio,
    containerAspectRatio
  ) {
    const dimensions = {};
    if (imageAspectRatio > containerAspectRatio) {
      dimensions.width = parentBoundingRect.width * zoomFactor;
      dimensions.height = dimensions.width / imageAspectRatio;
    } else {
      dimensions.height = parentBoundingRect.height * zoomFactor;
      dimensions.width = dimensions.height * imageAspectRatio;
    }
    return dimensions;
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

    console.log('CONSTRAIN RETURNED:', constrainedLeft, constrainedTop);

    return { constrainedLeft, constrainedTop };
  }

  refresh() {
    this.forceUpdate();
  }

  render() {
    console.log('*** single image render ***');
    // document.addEventListener('wheel', this.onWheel);

    return (
      <div
        className="image-div"
        // onWheel={this.onWheel}
        style={{ cursor: this.state.cursor }}
      >
        <img
          src={this.props.imageInfo.url}
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

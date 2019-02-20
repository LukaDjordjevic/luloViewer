import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SingleImage extends Component {
  constructor(props) {
    super(props);
    this.MAX_ZOOM =
      this.props.imageInfo.naturalWidth / this.props.parentBoundingRect.width +
      8;

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
  }

  componentWillReceiveProps(nextProps) {
    const zoomFactor = this.state.zoomFactor;
    // const zoomTarget = { ...this.state.zoomTarget };
    // const parentBoundingRect = { ...nextProps.parentBoundingRect };
    const zoomTarget = JSON.parse(JSON.stringify(this.state.zoomTarget));
    const parentBoundingRect = JSON.parse(
      JSON.stringify(this.props.parentBoundingRect)
    );
    console.log('zoomtarget', zoomTarget);
    const imageAspectRatio = nextProps.imageInfo.imageAspectRatio;
    const containerAspectRatio = this.containerAspectRatio;
    if (
      JSON.stringify(nextProps.parentBoundingRect) !==
      JSON.stringify(this.props.parentBoundingRect)
    ) {
      this.setState(
        this.getImageTransform(
          zoomFactor,
          zoomTarget,
          parentBoundingRect,
          imageAspectRatio,
          containerAspectRatio
        )
      );
    }
    if (
      JSON.stringify(nextProps.imageInfo) !==
      JSON.stringify(this.props.imageInfo)
    ) {
      this.setState(
        this.getImageTransform(
          1,
          { x: 0.5, y: 0.5 },
          parentBoundingRect,
          imageAspectRatio,
          containerAspectRatio
        )
      );
    }
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

    // const left = this.state.left;
    // const top = this.state.top;
    const zoomFactor = this.state.zoomFactor;
    const imageAspectRatio = this.props.imageInfo.imageAspectRatio;
    const containerAspectRatio = this.containerAspectRatio;
    const parentBoundingRect = JSON.parse(
      JSON.stringify(this.props.parentBoundingRect)
    );
    const constrainedPosition = this.constrainTranslate(
      newLeft,
      newTop,
      zoomFactor,
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio
    );
    this.setState({
      left: constrainedPosition.left,
      top: constrainedPosition.top
    });
  }

  onWheel(e) {
    e.preventDefault();
    let zoomLevel = this.state.zoomLevel - e.deltaY / 4;
    if (zoomLevel < 0) zoomLevel = 0;
    if (zoomLevel > this.props.ZOOM_LEVELS) zoomLevel = this.props.ZOOM_LEVELS;
    const maxv = Math.log(this.MAX_ZOOM);
    // Calculate adjustment factor
    const scale = maxv / this.props.ZOOM_LEVELS;
    const zoomFactor = Math.exp(scale * zoomLevel);

    if (this.wheelTimeout) clearTimeout(this.wheelTimeout);
    this.wheelTimeout = setTimeout(() => {
      const cursor = this.state.zoomFactor === 1 ? 'initial' : 'grab';
      this.setState({ cursor });
      this.zooming = false;
    }, 150);
    let zoomTarget = {};
    if (!this.zooming && e.deltaY < 0) {
      const zoomFactor = this.state.zoomFactor;
      const parentBoundingRect = JSON.parse(
        JSON.stringify(this.props.parentBoundingRect)
      );
      const imageAspectRatio = this.props.imageInfo.imageAspectRatio;
      const containerAspectRatio = this.containerAspectRatio;

      const { width, height } = this.getImageDimensions(
        zoomFactor,
        parentBoundingRect,
        imageAspectRatio,
        containerAspectRatio
      );
      zoomTarget.x =
        (-1 * this.state.left + e.pageX - this.props.parentBoundingRect.left) /
        width;
      zoomTarget.y =
        (-1 * this.state.top + e.pageY - this.props.parentBoundingRect.top) /
        height;
      this.zooming = true;
    } else {
      zoomTarget = this.state.zoomTarget;
    }
    const parentBoundingRect = JSON.parse(
      JSON.stringify(this.props.parentBoundingRect)
    );
    // const parentBoundingRect = { ...this.props.parentBoundingRect };
    const imageAspectRatio = this.props.imageInfo.imageAspectRatio;
    const containerAspectRatio = this.containerAspectRatio;
    const { left, top, width, height } = this.getImageTransform(
      zoomFactor,
      zoomTarget,
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio
    );

    const constrainedPosition = this.constrainTranslate(
      left,
      top,
      zoomFactor,
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio
    );
    this.setState({
      left: constrainedPosition.left,
      top: constrainedPosition.top,
      width,
      height,
      zoomFactor,
      zoomLevel,
      zoomTarget
    });
  }

  getImageTransform( // Pure
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

  getImageDimensions( // Pure
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
    console.log(
      '===',
      left,
      top,
      zoomFactor,
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio
    );
    // let leftBoundary;
    // let topBoundary;
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
    if (left > leftOffset) {
      console.log('too much to the left');
      constrainedLeft = leftOffset;
    }
    if (left < leftBoundary) constrainedLeft = leftBoundary;
    if (top > topOffset) {
      console.log('too much up');
      constrainedTop = topOffset;
    }
    if (top < topBoundary) {
      console.log('too much down');
      constrainedTop = topBoundary;
    }

    return { left: constrainedLeft, top: constrainedTop };
  }

  refresh() {
    this.forceUpdate();
  }

  render() {
    // console.log('*** single image render ***');

    return (
      <div className="image-div" onWheel={this.onWheel}>
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

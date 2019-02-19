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
    const { left, top, width, height } = this.getImageTransform(
      null,
      1,
      this.state.zoomTarget
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
    this.setState({
      left: this.startingLeft + offset.x,
      top: this.startingTop + offset.y
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.parentBoundingRect) !==
        JSON.stringify(this.props.parentBoundingRect) ||
      JSON.stringify(nextProps.imageInfo) !==
        JSON.stringify(this.props.imageInfo)
    )
      this.setState(
        this.getImageTransform(
          nextProps,
          this.state.zoomFactor,
          this.state.zoomTarget
        )
      );
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
      const { width, height } = this.getImageDimensions(this.state.zoomFactor);
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
    const { left, top, width, height } = this.getImageTransform(
      null,
      zoomFactor,
      zoomTarget
    );
    this.setState({
      left,
      top,
      width,
      height,
      zoomFactor,
      zoomLevel,
      zoomTarget
    });
  }

  getImageTransform(nextProps, zoomFactor, zoomTarget) {
    const props = nextProps || this.props;
    this.containerAspectRatio =
      props.parentBoundingRect.width / props.parentBoundingRect.height;
    const { width, height } = this.getImageDimensions(zoomFactor, nextProps);

    const left = -1 * width * zoomTarget.x + props.parentBoundingRect.width / 2;
    const top =
      -1 * height * zoomTarget.y + props.parentBoundingRect.height / 2;

    return { left, top, width, height };
  }

  getImageDimensions(zoomFactor, nextProps) {
    const props = nextProps || this.props;
    const dimensions = {};
    if (props.imageInfo.imageAspectRatio > this.containerAspectRatio) {
      dimensions.width = props.parentBoundingRect.width * zoomFactor;
      dimensions.height = dimensions.width / props.imageInfo.imageAspectRatio;
    } else {
      dimensions.height = props.parentBoundingRect.height * zoomFactor;
      dimensions.width = dimensions.height * props.imageInfo.imageAspectRatio;
    }
    return dimensions;
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

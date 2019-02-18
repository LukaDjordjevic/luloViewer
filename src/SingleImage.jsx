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
  }

  componentWillReceiveProps(nextProps) {
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
    let zoomLevel = this.state.zoomLevel - e.deltaY / 10;
    if (zoomLevel < 0) zoomLevel = 0;
    if (zoomLevel > this.props.ZOOM_LEVELS) zoomLevel = this.props.ZOOM_LEVELS;
    const maxv = Math.log(this.MAX_ZOOM);
    // Calculate adjustment factor
    const scale = maxv / this.props.ZOOM_LEVELS;
    const zoomFactor = Math.exp(scale * zoomLevel);
    console.log('===', zoomFactor, zoomLevel);

    if (this.wheelTimeout) clearTimeout(this.wheelTimeout);
    this.wheelTimeout = setTimeout(() => {
      const cursor = this.state.zoomFactor === 1 ? 'initial' : 'grab';
      this.setState({ cursor });
      this.zooming = false;
    }, 100);
    let zoomTarget = {};
    if (!this.zooming && e.deltaY < 0) {
      const { width, height } = this.getImageDimensions(this.state.zoomFactor);
      zoomTarget.x =
        (-1 * this.state.left + e.pageX - this.props.parentBoundingRect.left) /
        width;
      zoomTarget.y =
        (-1 * this.state.top + e.pageY - this.props.parentBoundingRect.top) /
        height;
      console.log('zoomtrgt', zoomTarget);
      this.zooming = true;
    } else {
      zoomTarget = this.state.zoomTarget;
    }
    this.setState({ zoomFactor, zoomTarget, zoomLevel }, () => {});
    this.setState(
      this.getImageTransform(null, this.state.zoomFactor, zoomTarget)
    );
  }

  getImageTransform(nextProps, zoomFactor, zoomTarget) {
    const props = nextProps || this.props;
    this.containerAspectRatio =
      props.parentBoundingRect.width / props.parentBoundingRect.height;
    const { width, height } = this.getImageDimensions(zoomFactor, nextProps);

    const left = -1 * width * zoomTarget.x + props.parentBoundingRect.width / 2;
    const top =
      -1 * height * zoomTarget.y + props.parentBoundingRect.height / 2;

    console.log('****', left, top, width, height);
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
    // console.log('got image dimensions', dimensions);

    return dimensions;
  }

  render() {
    console.log('*** single image render ***');
    console.log(this.props.parentBoundingRect);

    return (
      // <div className="image-div" onWheel={this.onWheel}>
      <img
        src={this.props.imageInfo.url}
        alt=""
        style={{
          left: this.state.left,
          top: this.state.top,
          width: this.state.width,
          height: this.state.height
        }}
        onMouseUp={this.props.onMouseUp}
        onWheel={this.onWheel}
      />
      // </div>
    );
  }
}

SingleImage.propTypes = {
  imageInfo: PropTypes.shape({
    url: PropTypes.string.isRequired,
    imageAspectRatio: PropTypes.number.isRequired
  }).isRequired
};

export default SingleImage;

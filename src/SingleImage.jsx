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
      zoomTarget: { x: 0.5, y: 0.5 }
    };
    const { left, top, width, height } = this.getImageTransform();

    this.state.left = left;
    this.state.top = top;
    this.state.width = width;
    this.state.height = height;
  }

  componentWillReceiveProps(nextProps) {
    // const { left, top, width, height } = this.getImageTransform(nextProps);
    this.setState(this.getImageTransform(nextProps));
  }

  getImageTransform(nextProps) {
    const props = nextProps || this.props;
    this.containerAspectRatio =
      props.parentBoundingRect.width / props.parentBoundingRect.height;
    const { width, height } = this.getImageDimensions(
      this.state.zoomFactor,
      nextProps
    );

    const left =
      -1 * width * this.state.zoomTarget.x + props.parentBoundingRect.width / 2;
    const top =
      -1 * height * this.state.zoomTarget.y +
      props.parentBoundingRect.height / 2;

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
    console.log('got image dimensions', dimensions);

    return dimensions;
  }

  render() {
    console.log(this.props);
    console.log('*** single image render ***');

    return (
      <div className="image-div">
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
        />
      </div>
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

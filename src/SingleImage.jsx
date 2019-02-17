import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SingleImage extends Component {
  constructor(props) {
    super(props);

    this.containerAspectRatio =
      this.props.parentBoundingRect.width /
      this.props.parentBoundingRect.height;
    const imageTransform = this.getInitialImageTransform();
    console.log(imageTransform);

    this.state = {
      zoomFactor: 1,
      left: imageTransform.left,
      top: imageTransform.top,
      width: imageTransform.width,
      height: imageTransform.height,
      zoomTarget: { x: 0.5, y: 0.5 }
    };
  }

  componentDidMount() {}

  getInitialImageTransform() {
    console.log(this.props.imageInfo.imageAspectRatio);
    const imageTransform = {};
    if (this.props.imageInfo.imageAspectRatio > this.containerAspectRatio) {
      console.log('>');

      imageTransform.width = this.props.parentBoundingRect.width;
      imageTransform.height =
        imageTransform.width / this.props.imageInfo.imageAspectRatio;
      imageTransform.left = 0;
      imageTransform.top =
        (this.props.parentBoundingRect.height -
          this.props.parentBoundingRect.width /
            this.props.imageInfo.imageAspectRatio) /
        2;
    } else {
      console.log('<');

      imageTransform.height = this.props.parentBoundingRect.height;
      imageTransform.width =
        imageTransform.height * this.props.imageInfo.imageAspectRatio;
      imageTransform.left =
        (this.props.parentBoundingRect.width -
          this.props.parentBoundingRect.height /
            this.props.imageInfo.imageAspectRatio) /
        2;
      imageTransform.top = 0;
    }
    return imageTransform;
  }

  render() {
    console.log(this.props);
    console.log('*** single image render ***');

    return (
      <div className="image-div">
        <img
          alt=""
          src={this.props.imageInfo.url}
          style={{
            left: this.state.left,
            top: this.state.top,
            width: this.state.width,
            height: this.state.height
          }}
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

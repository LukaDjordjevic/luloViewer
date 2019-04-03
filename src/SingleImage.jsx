import React, { PureComponent } from 'react';
import {
  updateZoomTarget,
  getNewZoomTransform,
  getImageTransform,
  constrainTranslate
} from './util';
import PropTypes from 'prop-types';

class SingleImage extends PureComponent {
  constructor(props) {
    super(props);

    this.startingX = this.props.parentBoundingRect.width / 2;
    this.startingY = this.props.parentBoundingRect.height / 2;
    this.startingLeft = this.startingX;
    this.startingTop = this.startingY;

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
    const { left, top, width, height } = getImageTransform(
      this.state.zoomFactor,
      this.state.zoomTarget,
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio
    );

    const { constrainedLeft, constrainedTop } = constrainTranslate(
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

    this.handleWheel = this.handleWheel.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    // this.onTouchStart = this.onTouchStart.bind(this);
    // this.onTouchMove = this.onTouchMove.bind(this);
    // this.onTouchEnd = this.onTouchEnd.bind(this);
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
      let { left, top, width, height } = getImageTransform(
        zoomFactor,
        zoomTarget,
        parentBoundingRect,
        imageAspectRatio,
        containerAspectRatio
      );

      const { constrainedLeft, constrainedTop } = constrainTranslate(
        left,
        top,
        zoomFactor,
        parentBoundingRect,
        imageAspectRatio,
        containerAspectRatio
      );

      left = constrainedLeft;
      top = constrainedTop;

      this.setState({ left, top, width, height });
    }
    // Slide image has changed
    if (
      JSON.stringify(nextProps.imageInfo) !==
      JSON.stringify(this.props.imageInfo)
    ) {
      const { left, top, width, height } = getImageTransform(
        nextProps.imageInfo.zoomMultipliers[nextProps.imageInfo.zoomLevel] || 1,
        nextProps.imageInfo.zoomTarget || { x: 0.5, y: 0.5 },
        parentBoundingRect,
        imageAspectRatio,
        containerAspectRatio
      );

      const { constrainedLeft, constrainedTop } = constrainTranslate(
        left,
        top,
        nextProps.imageInfo.zoomMultipliers[nextProps.imageInfo.zoomLevel] || 1,
        parentBoundingRect,
        imageAspectRatio,
        containerAspectRatio
      );

      this.setState({
        zoomFactor:
          nextProps.imageInfo.zoomMultipliers[nextProps.imageInfo.zoomLevel],
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

  handleMouseDown(e) {
    console.log('single image mouse down');

    this.startingX = e.pageX;
    this.startingY = e.pageY;
    this.startingLeft = this.state.left;
    this.startingTop = this.state.top;
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove(e) {
    console.log('single image mouse move');

    e.preventDefault();
    e.stopPropagation();
    const offset = {
      x: e.pageX - this.startingX,
      y: e.pageY - this.startingY
    };

    let newLeft = this.startingLeft + offset.x;
    let newTop = this.startingTop + offset.y;

    const zoomFactor = this.state.zoomFactor;
    const imageAspectRatio = this.props.imageInfo.imageAspectRatio;
    const containerAspectRatio = this.containerAspectRatio;
    const parentBoundingRect = JSON.parse(
      JSON.stringify(this.props.parentBoundingRect)
    );

    const imageWidth = this.state.width;
    const imageHeight = this.state.height;
    const divWidth = this.props.parentBoundingRect.width;
    const divHeight = this.props.parentBoundingRect.height;
    //Update zoomTarget
    const zoomTarget = updateZoomTarget(
      newLeft,
      newTop,
      imageWidth,
      imageHeight,
      divWidth,
      divHeight
    );

    const { constrainedLeft, constrainedTop } = constrainTranslate(
      newLeft,
      newTop,
      zoomFactor,
      parentBoundingRect,
      imageAspectRatio,
      containerAspectRatio
    );

    this.setState(
      {
        left: constrainedLeft,
        top: constrainedTop,
        zoomTarget
      },
      () => {
        this.props.updateZoomController(e, 'mouseMove');
      }
    );
  }

  handleWheel(e) {
    return new Promise(resolve => {
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
        zoomLevel //.toString()
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
      const { left, top, width, height } = getNewZoomTransform(
        imgLeft,
        imgTop,
        newZoomFactor,
        oldZoomFactor,
        parentBoundingRect,
        imageAspectRatio,
        containerAspectRatio,
        eventPosition
      );

      let zoomTarget;
      if (!this.zoomTargetSelected && e.deltaY < 0) {
        if (this.zoomTargetTimeout) clearTimeout(this.zoomTargetTimeout);
        this.zoomTargetTimeout = setTimeout(() => {
          this.zoomTargetSelected = false;
        }, 200);

        // Calculate new zoomTarget
        const imageLeft = this.state.left;
        const imageTop = this.state.top;
        const imageWidth = this.state.width;
        const imageHeight = this.state.height;
        const divWidth = this.props.parentBoundingRect.width;
        const divHeight = this.props.parentBoundingRect.height;

        zoomTarget = updateZoomTarget(
          imageLeft,
          imageTop,
          imageWidth,
          imageHeight,
          divWidth,
          divHeight
        );
      } else {
        zoomTarget = this.state.zoomTarget;
      }

      // Constrain image position
      const { constrainedLeft, constrainedTop } = constrainTranslate(
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
        () => {
          resolve();
        }
      );
    });
  }

  render() {
    console.log('*** single image render ***');

    return (
      <div
        className="image-div"
        style={{ cursor: this.state.cursor }}
        ref={el => (this.imageDiv = el)}
        onMouseDown={this.handleMouseDown}
        // onMouseUp={this.handleMouseUp}
        // onMouseMove={this.handleMouseMove}
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

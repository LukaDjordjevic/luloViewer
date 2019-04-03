import React, { PureComponent } from 'react';

class ZoomController extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      viewRectangleLeft: 0,
      viewRectangleTop: 0,
      viewRectangleWidth: this.props.style.width,
      viewRectangleHeight: this.props.style.height
    };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();
    console.log('view rect onMouseDown', e.clientX, e.pageX, e.screenX);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    this.startingClick = { x: e.clientX, y: e.clientY };
    this.startingSliderPosition = {
      x: this.state.viewRectangleLeft,
      y: this.state.viewRectangleTop
    };
    // this.dragging = false;
    // console.log(this.startingClick);
  }

  onMouseUp(e) {
    console.log('slides strip mouse up');
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);

    // e.stopPropagation();
  }

  onMouseMove(e) {
    e.preventDefault();
    console.log(
      'ratio',
      this.props.zoomControllerRatio,
      'image factor',
      this.props.imageZoomFactor
    );

    // console.log('slider mouse move');
    // this.dragging = true;
    console.log(
      e.clientX - this.startingClick.x + this.startingSliderPosition.x
    );
    const newPosition = {
      left:
        (e.clientX - this.startingClick.x + this.startingSliderPosition.x) *
        -1 *
        this.props.zoomControllerRatio, // *
      // this.props.imageZoomFactor,
      top:
        (e.clientY - this.startingClick.y + this.startingSliderPosition.y) *
        -1 *
        this.props.zoomControllerRatio // *
      // this.props.imageZoomFactor
    };

    this.props.updateImageFromZoomController({
      left: newPosition.left,
      top: newPosition.top
    });

    console.log(newPosition);
  }

  updateViewRectangle(newState) {
    this.setState({
      viewRectangleLeft: newState.left,
      viewRectangleTop: newState.top,
      viewRectangleWidth: newState.width,
      viewRectangleHeight: newState.height
    });
  }

  render() {
    let viewRectangleLeft = this.state.viewRectangleLeft;
    let viewRectangleTop = this.state.viewRectangleTop;
    let viewRectangleWidth = this.state.viewRectangleWidth;
    let viewRectangleHeight = this.state.viewRectangleHeight;

    if (viewRectangleLeft < 0) viewRectangleLeft = 0;
    if (viewRectangleTop < 0) viewRectangleTop = 0;
    if (viewRectangleWidth > this.props.style.width)
      viewRectangleWidth = Math.floor(this.props.style.width);
    if (viewRectangleHeight > this.props.style.height)
      viewRectangleHeight = Math.floor(this.props.style.height);
    return (
      <div className="zoom-controller" style={this.props.style}>
        <div className="zoom-controller-bgd" />
        <div
          className="view-rectangle"
          style={{
            left: `${viewRectangleLeft}${'px'}`,
            top: `${viewRectangleTop}${'px'}`,
            width: `${viewRectangleWidth}${'px'}`,
            height: `${viewRectangleHeight}${'px'}`,
            boxShadow: `${'0 0 0 '}${
              this.props.style.width > this.props.style.height
                ? this.props.style.width
                : this.props.style.height
            }${'px rgba(0, 0, 0, 0.5)'}`
          }}
          onMouseDown={this.onMouseDown}
        />
      </div>
    );
  }
}

export default ZoomController;

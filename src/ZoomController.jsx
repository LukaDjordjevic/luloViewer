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
    this.startingZoomControllerPos = {
      x: this.state.viewRectangleLeft,
      y: this.state.viewRectangleTop
    };
  }

  onMouseUp(e) {
    console.log('view rect mouse up');
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    // this.props.saveSlidePosition();
  }

  onMouseMove(e) {
    // console.log(e.screenY, e.clientY, e.pageY, this.props.style.top);

    e.preventDefault();
    // const newPosition = {
    //   left: e.clientX - this.startingZoomControllerPos.x,
    //   top: e.clientY - this.startingZoomControllerPos.y
    // };
    const newPosition = {
      left: e.clientX,
      top: e.clientY
    };
    this.props.updateImageFromZoomController(
      e,
      this.startingZoomControllerPos,
      this.startingClick
    );

    // console.log(newPosition);
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

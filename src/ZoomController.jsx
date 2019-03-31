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
        />
      </div>
    );
  }
}

export default ZoomController;

import React, { PureComponent } from 'react';

class ZoomController extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      viewRectangleLeft: this.props.viewRectangleLeft,
      viewRectangleTop: this.props.viewRectangleTop,
      viewRectangleWidth: this.props.viewRectangleWidth,
      viewRectangleHeight: this.props.viewRectangleHeight
    };

    // this.onWindowResize = this.onWindowResize.bind(this);
  }

  // componentWillReceiveProps(nexProps) {
  //   if (this.props.style.background !== nexProps.style.background) {
  //     this.forceUpdate();
  //     console.log(
  //       '####123',
  //       this.props.style.background,
  //       nexProps.style.background
  //     );
  //   }
  // }

  updateViewRectangle(newState) {
    console.log('%%%%%%%%%%', newState);
    this.setState({
      viewRectangleLeft: newState.left,
      viewRectangleTop: newState.top,
      viewRectangleWidth: newState.width,
      viewRectangleHeight: newState.height
    });
  }

  render() {
    return (
      <div className="zoom-controller" style={this.props.style}>
        <div className="zoom-controller-bgd" />
        <div
          className="view-rectangle no-select"
          style={{
            left: `${this.state.viewRectangleLeft}${'px'}`,
            top: `${this.state.viewRectangleTop}${'px'}`,
            width: `${this.state.viewRectangleWidth}${'px'}`,
            height: `${this.state.viewRectangleHeight}${'px'}`,
            boxShadow: `${'0 0 0 '}${
              this.props.style.width > this.props.style.height
                ? this.props.style.width
                : this.props.style.height
            }${'px rgba(0, 0, 0, 0.0)'}`
          }}
        />
      </div>
    );
  }
}

export default ZoomController;

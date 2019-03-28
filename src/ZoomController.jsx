import React, { PureComponent } from 'react';

class ZoomController extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    // this.onWindowResize = this.onWindowResize.bind(this);
  }

  componentWillReceiveProps(nexProps) {
    if (this.props.style.background !== nexProps.style.background) {
      this.forceUpdate();
      console.log(
        '####123',
        this.props.style.background,
        nexProps.style.background
      );
    }
  }

  render() {
    return (
      <div className="zoom-controller" style={this.props.style}>
        <div className="zoom-controller-bgd" />
      </div>
    );
  }
}

export default ZoomController;

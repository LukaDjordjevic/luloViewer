import React, { PureComponent } from 'react';
import Icon from './Icon';

class Slider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startArrowColor: this.props.ARROW_DEFAULT_COLOR,
      endArrowColor: this.props.ARROW_DEFAULT_COLOR
    };
  }

  render() {
    const startIconName = this.props.isHorizontal ? 'arrow-left' : 'arrow-up';
    const endIconName = this.props.isHorizontal ? 'arrow-right' : 'arrow-down';
    const arrowWidth = this.props.isHorizontal
      ? this.props.SLIDER_ARROW_SIZE
      : 100;
    const arrowHeight = this.props.isHorizontal
      ? 100
      : this.props.SLIDER_ARROW_SIZE;
    const contentWidth = this.props.isHorizontal
      ? 100 - this.props.SLIDER_ARROW_SIZE * 2
      : 100;
    const contentHeight = this.props.isHorizontal
      ? 100
      : 100 - this.props.SLIDER_ARROW_SIZE * 2;
    const start = (
      <div
        className="slider-arrow"
        style={{
          width: `${arrowWidth}%`,
          height: `${arrowHeight}%`
        }}
      >
        <Icon
          className={this.props.isHorizontal ? `slider-icon` : ''}
          name={startIconName}
          color={this.state.startArrowColor}
          size={this.arrowSize}
        />
      </div>
    );
    const middle = (
      <div
        className="slider-content"
        style={{
          width: `${contentWidth}%`,
          height: `${contentHeight}%`
        }}
      />
    );
    const end = (
      <div
        className="slider-arrow"
        style={{
          width: `${arrowWidth}%`,
          height: `${arrowHeight}%`
        }}
      >
        <Icon
          className={this.props.isHorizontal ? `slider-icon` : ''}
          name={endIconName}
          color={this.state.endArrowColor}
          size={this.arrowSize}
        />
      </div>
    );
    return (
      <div
        className="slider-main"
        style={{
          flexDirection: this.props.isHorizontal ? 'row' : 'column'
        }}
      >
        {start}
        {middle}
        {end}
      </div>
    );
  }
}

export default Slider;

import React, { PureComponent } from 'react';
import Icon from './Icon';

class Arrows extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      leftArrowColor: this.props.defaultColor,
      rightArrowColor: this.props.defaultColor
    };

    this.onLeftArrowEnter = this.onLeftArrowEnter.bind(this);
    this.onLeftArrowLeave = this.onLeftArrowLeave.bind(this);
    this.onRightArrowEnter = this.onRightArrowEnter.bind(this);
    this.onRightArrowLeave = this.onRightArrowLeave.bind(this);
  }

  onLeftArrowEnter() {
    this.setState({ leftArrowColor: this.props.highlightColor });
  }

  onLeftArrowLeave() {
    this.setState({ leftArrowColor: this.props.defaultColor });
  }

  onRightArrowEnter() {
    this.setState({ rightArrowColor: this.props.highlightColor });
  }

  onRightArrowLeave() {
    this.setState({ rightArrowColor: this.props.defaultColor });
  }
  render() {
    const arrowSize = this.props.slidesRect
      ? this.props.slidesRect.height * this.props.arrowsSize
      : 0;

    const arrowsTop =
      this.props.slidesRect.height / 2 -
      (this.props.slidesRect.height * this.props.arrowsSize) / 2 +
      (this.props.slidesRect.top - this.props.mainDivRect.top);
    return (
      <div
        className="arrows"
        style={{
          top: `${arrowsTop}px`,

          width:
            ['left', 'right'].includes(this.props.SLIDER_POSITION) &&
            this.props.SHOW_SLIDER
              ? this.props.slidesRect.width * (1 - this.props.sliderSize)
              : this.props.slidesRect.width
        }}
      >
        <div
          className="arrow"
          onMouseEnter={this.onLeftArrowEnter}
          onMouseLeave={this.onLeftArrowLeave}
          onMouseUp={this.props.onLeftArrowClick}
          style={{
            width: arrowSize,
            height:
              this.props.allowCyclic || this.props.currentSlideIndex !== 0
                ? arrowSize
                : '0',
            paddingLeft: `${this.props.arrowsPadding}%`
          }}
        >
          <div className="arrows-icon">
            <Icon
              name="arrow-left"
              color={this.state.leftArrowColor}
              size={'100%'}
            />
          </div>
        </div>
        <div
          className="arrow"
          onMouseEnter={this.onRightArrowEnter}
          onMouseLeave={this.onRightArrowLeave}
          onMouseUp={this.props.onRightArrowClick}
          style={{
            width: arrowSize,
            height:
              this.props.allowCyclic ||
              this.props.currentSlideIndex !== this.props.imageUrlsLength - 1
                ? arrowSize
                : '0',
            paddingRight: `${this.props.arrowsPadding}%`
          }}
        >
          <div className="arrows-icon">
            <Icon
              name="arrow-right"
              color={this.state.rightArrowColor}
              size={'100%'}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Arrows;

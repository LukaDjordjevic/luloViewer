import React, { PureComponent } from 'react';
import Icon from './Icon';

class Arrows extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      leftArrowColor: this.props.defaultColor,
      rightArrowColor: this.props.defaultColor
    };

    this.onArrowEnter = this.onArrowEnter.bind(this);
    this.onArrowLeave = this.onArrowLeave.bind(this);
  }

  onArrowEnter(arrow) {
    if (arrow === 'left') {
      this.setState({ leftArrowColor: this.props.highlightColor });
    } else {
      this.setState({ rightArrowColor: this.props.highlightColor });
    }
  }

  onArrowLeave(arrow) {
    if (arrow === 'left') {
      this.setState({ leftArrowColor: this.props.defaultColor });
    } else {
      this.setState({ rightArrowColor: this.props.defaultColor });
    }
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
      (this.props.slidesRect.top - this.props.mainDivRect.top) -
      arrowSize / 2;
    const sliderSize = this.props.SHOW_VIEWER ? this.props.sliderSize : 1;
    return (
      <div
        className="lv-arrows"
        style={{
          top: `${arrowsTop}px`,

          width:
            ['left', 'right'].includes(this.props.SLIDER_POSITION) &&
            this.props.SHOW_SLIDER
              ? this.props.slidesRect.width * (1 - sliderSize)
              : this.props.slidesRect.width
        }}
      >
        <div
          className="lv-arrow"
          onMouseEnter={e => this.onArrowEnter('left', e)}
          onMouseLeave={e => this.onArrowLeave('left', e)}
          onMouseUp={e => this.props.onArrowClick('left', e)}
          style={{
            width: arrowSize,
            height:
              this.props.allowCyclic || this.props.currentSlideIndex !== 0
                ? arrowSize
                : '0',
            paddingLeft: `${this.props.arrowsPadding}%`
          }}
        >
          <div className="lv-arrows-icon">
            <Icon
              name="arrow-left"
              color={this.state.leftArrowColor}
              size={'100%'}
            />
          </div>
        </div>
        <div
          className="lv-arrow"
          onMouseEnter={e => this.onArrowEnter('right', e)}
          onMouseLeave={e => this.onArrowLeave('right', e)}
          onMouseUp={e => this.props.onArrowClick('right', e)}
          style={{
            width: arrowSize,
            height:
              this.props.allowCyclic ||
              this.props.currentSlideIndex !== this.props.numberOfSlides - 1
                ? arrowSize
                : '0',
            paddingRight: `${this.props.arrowsPadding}%`
          }}
        >
          <div className="lv-arrows-icon">
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

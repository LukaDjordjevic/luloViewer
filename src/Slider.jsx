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
        />
      </div>
    );

    const slides = this.props.images.map((imgUrl, idx) => (
      <SingleSlide
        key={`${imgUrl || '.'}${idx}`}
        slideActive={idx === this.props.activeSlideIdx}
        backgroundImage={imgUrl}
        index={idx}
        slideSize={this.props.slideSize}
        left={idx * this.props.slideSize}
        top={0}
        // onClick={this.onClick}
      />
    ));

    const middle = (
      <div
        className="slider-content"
        style={{
          width: `${100 - 2 * this.props.SLIDER_ARROW_SIZE}%`,
          height: `${contentHeight}%`
        }}
      >
        <div
          className="slides-strip"
          style={{
            width: this.props.slidesStripSize,
            height: this.props.slideSize
          }}
        />
        {slides}
      </div>
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

const SingleSlide = props => {
  return (
    <div
      className="single-slide"
      style={{
        backgroundImage: `${"url('"}${props.backgroundImage}${"'"}`,
        width: `${props.slideSize}px`,
        height: `${props.slideSize}px`,
        left: `${props.left}px`,
        top: `${props.top}px`
      }}
    >
      {props.slideActive ? null : <div className="photo-darken" />}
    </div>
  );
};

export default Slider;
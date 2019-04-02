import React, { PureComponent } from 'react';
import Icon from './Icon';

class Slider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startArrowColor: this.props.arrowDefaultColor,
      endArrowColor: this.props.arrowDefaultColor,
      top: 0,
      left: 0
    };

    this.slideClick = this.slideClick.bind(this);
  }

  onWheel(e) {
    console.log('wheel');

    e.preventDefault();
    e.stopPropagation();
  }

  onMouseEnter(arrow, e) {
    if (arrow === 'start') {
      this.setState({ startArrowColor: this.props.arrowHighlightColor });
    } else {
      this.setState({ endArrowColor: this.props.arrowHighlightColor });
    }
  }

  onMouseLeave(arrow, e) {
    if (arrow === 'start') {
      this.setState({ startArrowColor: this.props.arrowDefaultColor });
    } else {
      this.setState({ endArrowColor: this.props.arrowDefaultColor });
    }
  }

  slideClick(index) {
    this.props.slideClick(index);
  }

  render() {
    const startIconName = this.props.isHorizontal ? 'arrow-left' : 'arrow-up';
    const endIconName = this.props.isHorizontal ? 'arrow-right' : 'arrow-down';
    const arrowWidth = this.props.isHorizontal
      ? this.props.sliderArrowSize
      : 100;
    const arrowHeight = this.props.isHorizontal
      ? 100
      : this.props.sliderArrowSize;
    const contentWidth = this.props.isHorizontal
      ? 100 - this.props.sliderArrowSize * 2
      : 100;
    const contentHeight = this.props.isHorizontal
      ? 100
      : 100 - this.props.sliderArrowSize * 2;
    const start = (
      <div
        className="slider-arrow"
        style={{
          width: `${arrowWidth}%`,
          height: `${arrowHeight}%`
        }}
        onMouseEnter={e => this.onMouseEnter('start', e)}
        onMouseLeave={e => this.onMouseLeave('start', e)}
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
        isHorizontal={this.props.isHorizontal}
        slideClick={this.slideClick}
      />
    ));

    const middle = (
      <div
        className="slider-content"
        style={{
          width: this.props.isHorizontal
            ? `${100 - 2 * this.props.sliderArrowSize}%`
            : `${contentWidth}%`,
          height: this.props.isHorizontal
            ? `${contentHeight}%`
            : `${100 - 2 * this.props.sliderArrowSize}%`
        }}
      >
        <div
          className="slides-strip"
          style={{
            width: this.props.isHorizontal
              ? this.props.slidesStripSize
              : this.props.slideSize,
            height: this.props.isHorizontal
              ? this.props.slideSize
              : this.props.slidesStripSize,
            display: this.props.isHorizontal ? 'inline-flex' : 'block',
            left: `${this.state.left}px`,
            top: `${this.state.top}px`
          }}
        >
          {slides}
        </div>
      </div>
    );

    const end = (
      <div
        className="slider-arrow"
        style={{
          width: `${arrowWidth}%`,
          height: `${arrowHeight}%`
        }}
        onMouseEnter={e => this.onMouseEnter('end', e)}
        onMouseLeave={e => this.onMouseLeave('end', e)}
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
        onWheel={this.onWheel}
      >
        {start}
        {middle}
        {end}
      </div>
    );
  }
}

const SingleSlide = props => {
  const style = {
    backgroundImage: `${"url('"}${props.backgroundImage}${"'"}`

    // width: `${props.slideSize}px`,
    // height: `${props.slideSize}px`,
    // left: `${props.left}px`,
    // top: `${props.top}px`
  };
  if (props.isHorizontal) {
    style.width = `${props.slideSize}px`;
    style.margin = `${0.45}%`;
  } else {
    style.height = `${props.slideSize}px`;
    style.margin = `${5}%`;
  }

  return (
    <div
      className="single-slide"
      style={style}
      onMouseUp={e => props.slideClick(props.index, e)}
    >
      {props.slideActive ? null : <div className="photo-darken" />}
    </div>
  );
};

export default Slider;

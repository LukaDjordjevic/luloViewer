import React, { PureComponent } from 'react';
import { getSliderCenterPos } from './util';
import Icon from './Icon';

class Slider extends PureComponent {
  constructor(props) {
    super(props);
    this.calculateLayoutDimensions();
    this.state = {
      startArrowColor: this.props.arrowDefaultColor,
      endArrowColor: this.props.arrowDefaultColor,
      top: 0,
      left: 0
    };
    this.dragging = false;
    this.slideMouseUp = this.slideMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  componentDidMount() {
    console.log('did mount');

    // getSliderCenterPos(
    //   this.props.mainDivRect.width,
    //   this.props.mainDivRect.height,
    //   this.contentHeight,
    //   this.contentWidth,
    //   this.props.slidesStripSize,
    //   this.props.isHorizontal
    // );
    // this.setState({ left: sliderPosition.left, top: sliderPosition.top });
  }

  componentWillReceiveProps() {
    // getSliderCenterPos(
    //   this.props.mainDivRect.width,
    //   this.props.mainDivRect.height,
    //   this.contentHeight,
    //   this.contentWidth,
    //   this.props.slidesStripSize,
    //   this.props.isHorizontal
    // );
  }

  onWheel(e) {
    console.log('wheel');

    e.preventDefault();
    e.stopPropagation();
  }

  onMouseDown(e) {
    // e.stopPropagation();
    e.preventDefault();
    console.log('slider-strip onMouseDown', e.clientX, e.pageX, e.screenX);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    this.startingClick = { x: e.clientX, y: e.clientY };
    this.startingSliderPosition = { x: this.state.left, y: this.state.top };
    this.dragging = false;
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

    console.log('slider mouse move');
    this.dragging = true;
    const newPosition = {
      x: e.clientX - this.startingClick.x + this.startingSliderPosition.x,
      y: e.clientY - this.startingClick.y + this.startingSliderPosition.y
    };
    if (this.props.isHorizontal) {
      this.setState({ left: newPosition.x });
    } else {
      this.setState({ top: newPosition.y });
    }

    console.log(newPosition);
  }

  onMouseEnter(arrow, e) {
    e.stopPropagation();
    if (arrow === 'start') {
      this.setState({ startArrowColor: this.props.arrowHighlightColor });
    } else {
      this.setState({ endArrowColor: this.props.arrowHighlightColor });
    }
  }

  onMouseLeave(arrow, e) {
    e.stopPropagation();

    if (arrow === 'start') {
      this.setState({ startArrowColor: this.props.arrowDefaultColor });
    } else {
      this.setState({ endArrowColor: this.props.arrowDefaultColor });
    }
  }

  slideMouseUp(index, e) {
    console.log('slide mouseUp');

    // e.stopPropagation();
    if (!this.dragging) this.props.slideClick(index, e);
  }

  calculateLayoutDimensions() {
    this.arrowWidth = this.props.isHorizontal
      ? this.props.sliderArrowSize
      : 100;
    this.arrowHeight = this.props.isHorizontal
      ? 100
      : this.props.sliderArrowSize;
    this.contentWidth = this.props.isHorizontal
      ? 100 - this.props.sliderArrowSize * 2
      : 100;
    this.contentHeight = this.props.isHorizontal
      ? 100
      : 100 - this.props.sliderArrowSize * 2;
  }

  render() {
    const startIconName = this.props.isHorizontal ? 'arrow-left' : 'arrow-up';
    const endIconName = this.props.isHorizontal ? 'arrow-right' : 'arrow-down';
    this.calculateLayoutDimensions();
    const start = (
      <div
        className="slider-arrow"
        style={{
          width: `${this.arrowWidth}%`,
          height: `${this.arrowHeight}%`
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
        slideClick={this.slideMouseUp}
      />
    ));

    const middle = (
      <div
        className="slider-content"
        style={{
          width: this.props.isHorizontal
            ? `${100 - 2 * this.props.sliderArrowSize}%`
            : `${this.contentWidth}%`,
          height: this.props.isHorizontal
            ? `${this.contentHeight}%`
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
          onMouseDown={this.onMouseDown}
          // onMouseUp={this.onMouseUp}
          // onMouseMove={this.onMouseMove}
        >
          {slides}
        </div>
      </div>
    );

    const end = (
      <div
        className="slider-arrow"
        style={{
          width: `${this.arrowWidth}%`,
          height: `${this.arrowHeight}%`
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
          backgroundColor: this.props.backgroundColor,
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

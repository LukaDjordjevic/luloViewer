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
      left: 0,
      top: 0
    };
    this.dragging = false;
    this.slideMouseUp = this.slideMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onWheel = this.onWheel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isHorizontal !== nextProps.isHorizontal) {
      this.setState({
        left: this.props.top,
        top: this.props.left
      });
    }
  }

  onWheel(e) {
    console.log('slider wheel');

    e.preventDefault();
    e.stopPropagation();
    const factor = 1;
    console.log(this.state.left, e.deltaX, factor);

    const left = this.state.left - e.deltaX / factor;
    const top = this.state.top - e.deltaY / factor;
    console.log('got', left, top);

    const constrainedPos = this.constrainMovement({ left, top });
    if (this.props.isHorizontal) {
      this.setState({ left: constrainedPos.left });
    } else {
      this.setState({ top: constrainedPos.top });
    }
    this.props.updateSliderPos({
      left: constrainedPos.left,
      top: constrainedPos.top
    });
    console.log(left, top, constrainedPos);
  }

  constrainMovement(pos) {
    let left = pos.left;
    let top = pos.top;

    if (this.props.isHorizontal) {
      const contentSize =
        this.props.mainDivRect.width * ((100 - 2 * this.arrowWidth) / 100);
      if (this.props.slidesStripSize > contentSize) {
        if (left > 0) left = 0;
        if (left < contentSize - this.props.slidesStripSize)
          left = contentSize - this.props.slidesStripSize;
      } else {
        if (left > contentSize - this.props.slidesStripSize)
          left = contentSize - this.props.slidesStripSize;
        if (left < 0) left = 0;
      }
      console.log('contentSize', contentSize);
    } else {
      const contentSize =
        this.props.mainDivRect.height * ((100 - 2 * this.arrowHeight) / 100);

      if (this.props.slidesStripSize > contentSize) {
        if (top > 0) top = 0;
        if (top < contentSize - this.props.slidesStripSize)
          top = contentSize - this.props.slidesStripSize;
      } else {
        if (top > contentSize - this.props.slidesStripSize)
          top = contentSize - this.props.slidesStripSize;
        if (top < 0) top = 0;
      }
    }
    // if (pos.left > 0) po

    return { left, top };
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

    // console.log('slider mouse move');
    this.dragging = true;
    const newPosition = {
      left: e.clientX - this.startingClick.x + this.startingSliderPosition.x,
      top: e.clientY - this.startingClick.y + this.startingSliderPosition.y
    };
    // console.log('saving pos', newPosition);
    const constrainedPos = this.constrainMovement({
      left: newPosition.left,
      top: newPosition.top
    });
    if (this.props.isHorizontal) {
      newPosition.top = 0;
      this.setState({ left: constrainedPos.left });
    } else {
      newPosition.left = 0;
      this.setState({ top: constrainedPos.top });
    }
    this.props.updateSliderPos(constrainedPos);

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
    const arrowSize = this.props.showArrows ? this.props.sliderArrowSize : 0;

    this.arrowWidth = this.props.isHorizontal ? arrowSize : 100;
    this.arrowHeight = this.props.isHorizontal ? 100 : arrowSize;
    this.contentWidth = this.props.isHorizontal ? 100 - arrowSize * 2 : 100;
    this.contentHeight = this.props.isHorizontal ? 100 : 100 - arrowSize * 2;
  }

  render() {
    const startIconName = this.props.isHorizontal ? 'arrow-left' : 'arrow-up';
    const endIconName = this.props.isHorizontal ? 'arrow-right' : 'arrow-down';
    this.calculateLayoutDimensions();
    const start = this.props.showArrows ? (
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
    ) : null;

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
          width: `${this.contentWidth}%`,
          height: `${this.contentHeight}%`
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

    const end = this.props.showArrows ? (
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
    ) : null;

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

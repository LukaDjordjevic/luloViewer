import React, { PureComponent } from 'react';
import Icon from './Icon';
import { constrainSliderMovement } from './util';

class Slider extends PureComponent {
  constructor(props) {
    super(props);
    this.calculateLayoutDimensions();
    this.state = {
      startArrowColor: this.props.arrowDefaultColor,
      endArrowColor: this.props.arrowDefaultColor,
      left: 0,
      top: 0,
      bounced: false,
      currentEnergy: 1,
      animationName: null
    };
    this.startArrowAllowed = true;
    this.endArrowAllowed = true;
    this.energyAfterBounce = 0.1;
    this.dragging = false;
    this.slideMouseUp = this.slideMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.onAnimationEnd = this.onAnimationEnd.bind(this);
    // this.onTouchStart = this.onTouchStart.bind(this);
    // this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.setInitialPosition = this.setInitialPosition.bind(this);
  }

  componentDidMount() {
    // setTimeout(() => {
    //   console.log('setting');

    //   this.setState({ left: 300 });
    // }, 5000);
    // this.calculateLayoutDimensions();

    this.slidesStrip.onanimationend = this.onAnimationEnd;
    this.content.addEventListener('wheel', this.onWheel, { passive: false });
  }

  onAnimationEnd() {
    console.log('animation end', this.animEndPos);

    this.setState(this.animEndPos);
  }

  componentWillReceiveProps(nextProps) {
    this.calculateLayoutDimensions(nextProps);

    if (this.props.isHorizontal !== nextProps.isHorizontal) {
      this.calculateLayoutDimensions(nextProps);
      this.setInitialPosition(nextProps);
      // const newPosition = {
      //   left: this.props.top,
      //   top: this.props.left
      // };
      // this.setState(newPosition);
    }
    if (
      JSON.stringify(this.props.mainDivRect) !==
      JSON.stringify(nextProps.mainDivRect)
    ) {
      // parent div bounding rect has changed
      this.calculateLayoutDimensions(nextProps);
      this.setInitialPosition(nextProps);
    }
    if (this.props.activeSlideIdx !== nextProps.activeSlideIdx) {
      // Current slide has changed

      this.setInitialPosition(nextProps);
    }
  }

  onTouchEnd() {
    console.log('touch end');
  }

  setInitialPosition(nextProps) {
    const props = nextProps || this.props;

    // Flip left & top when isHorizontal has changed

    if (this.allSlidesFit) {
      // console.log('all slides fit');
      const newPos = {
        left: (this.contentSize - props.slidesStripSize) / 2,
        top: (this.contentSize - props.slidesStripSize) / 2
      };
      if (props.isHorizontal) {
        newPos.top = 0;
      } else {
        newPos.left = 0;
      }
      this.setState(newPos); // Chrome animate end event bug
      this.animateSlider(newPos);
    } else {
      // console.log('slides no fit');
      const newPos = this.getSlideCenterPos(props.activeSlideIdx);
      if (props.isHorizontal) {
        newPos.top = 0;
      } else {
        newPos.left = 0;
      }
      // this.setState(newPos); // Chrome animate end event bug
      // this.animateSlider(newPos);
      this.constrainAndApply(newPos, nextProps);
    }
    const newPos = this.getSlideCenterPos(props.activeSlideIdx);

    if (this.props.isHorizontal) {
      this.updateArrowColors(newPos.left);
    } else {
      this.updateArrowColors(newPos.top);
    }
  }

  getSlideCenterPos(index) {
    const props = this.props;

    if (props.isHorizontal) {
      const left =
        -1 * index * props.slideSize +
        this.contentSize / 2 -
        props.slideSize / 2;

      return { left, top: 0 };
    } else {
      const top =
        -1 * index * props.slideSize +
        this.contentSize / 2 -
        props.slideSize / 2;
      return { left: 0, top };
    }
  }

  onWheel(e) {
    e.preventDefault();
    e.stopPropagation();
    const factor = 1;
    let deltaX = e.deltaX * this.state.currentEnergy;
    let deltaY = e.deltaY * this.state.currentEnergy;
    if (this.state.bounced) {
      deltaX = deltaX * -1;
      deltaY = deltaY * -1;
    }
    if (Math.abs(e.deltaX) < 2 && Math.abs(e.deltaY) < 2) {
      this.setState({ bounced: false, currentEnergy: 1 });
    }
    const left = this.state.left - deltaX / factor;
    const top = this.state.top - deltaY / factor;

    this.constrainAndApply({ left, top });
    if (this.props.isHorizontal) {
      this.updateArrowColors(left);
    } else {
      this.updateArrowColors(top);
    }
  }

  onMouseDown(e) {
    // e.stopPropagation();
    e.preventDefault();
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    this.startingClick = { x: e.clientX, y: e.clientY };
    this.startingSliderPosition = { x: this.state.left, y: this.state.top };
    this.dragging = false;
    // console.log(this.startingClick);
  }

  onMouseUp(e) {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    this.setState({ bounced: false, currentEnergy: 1 });
    // e.stopPropagation();
  }

  onMouseMove(e) {
    e.preventDefault();

    this.dragging = true;
    const newPosition = {
      left: e.clientX - this.startingClick.x + this.startingSliderPosition.x,
      top: e.clientY - this.startingClick.y + this.startingSliderPosition.y
    };

    this.constrainAndApply(newPosition);
    if (this.props.isHorizontal) {
      this.updateArrowColors(newPosition.left);
    } else {
      this.updateArrowColors(newPosition.top);
    }
  }

  onMouseEnter(arrow, e) {
    e.stopPropagation();
    if (arrow === 'start') {
      if (!this.allSlidesFit && this.startArrowAllowed) {
        this.setState({ startArrowColor: this.props.arrowHighlightColor });
      }
    } else {
      if (!this.allSlidesFit && this.endArrowAllowed) {
        this.setState({ endArrowColor: this.props.arrowHighlightColor });
      }
    }
  }

  onMouseLeave(arrow, e) {
    e.stopPropagation();

    if (arrow === 'start') {
      this.setState({
        startArrowColor:
          this.allSlidesFit || !this.startArrowAllowed
            ? this.props.arrowDisabledColor
            : this.props.arrowDefaultColor
      });
    } else {
      this.setState({
        endArrowColor:
          this.allSlidesFit || !this.endArrowAllowed
            ? this.props.arrowDisabledColor
            : this.props.arrowDefaultColor
      });
    }
  }
  onArrowClick(arrow, e) {
    e.stopPropagation();
    let left = this.state.left;
    let top = this.state.top;
    if (this.props.isHorizontal) {
      if (arrow === 'start') {
        left += this.contentSize;
      } else {
        left -= this.contentSize;
      }
    } else {
      if (arrow === 'start') {
        top += this.contentSize;
      } else {
        top -= this.contentSize;
      }
    }
    this.constrainAndApply({ left, top });
    if (this.props.isHorizontal) {
      this.updateArrowColors(left);
    } else {
      this.updateArrowColors(top);
    }
  }

  slideMouseUp(index, e) {
    const newPos = this.getSlideCenterPos(index);
    if (!this.allSlidesFit && !this.dragging) this.animateSlider(newPos);

    // e.stopPropagation();
    if (!this.dragging) this.props.slideClick(index, e);
  }

  animateSlider(newPos) {
    const key = this.props.isHorizontal ? 'left' : 'top';
    if (this.props.slideAnimationsStylesheet) {
      this.createKeyframes(
        this.props.slideAnimationsStylesheet,
        newPos[key],
        key
      );
    }

    this.setState({
      animationName:
        this.state.animationName === 'slider-move'
          ? 'slider-move-alt'
          : 'slider-move'
    });
  }

  createKeyframes(styleSheet, end, key) {
    const newPos = { left: this.state.left, top: this.state.top };
    newPos[key] = end;
    if (styleSheet && styleSheet.sheet.cssRules[8])
      styleSheet.sheet.deleteRule(8);
    styleSheet.sheet.insertRule(
      `
    @keyframes slider-move {
      from { ${key}: ${this.state[key]}px; } 
      to { ${key}: ${newPos[key]}px; }
    }`,
      8
    );
    if (styleSheet && styleSheet.sheet.cssRules[9])
      styleSheet.sheet.deleteRule(9);
    styleSheet.sheet.insertRule(
      `
    @keyframes slider-move-alt {
      from { ${key}: ${this.state[key]}px; } 
      to { ${key}: ${newPos[key]}px; }
    }`,
      9
    );

    this.animEndPos = newPos; // Save new position because we need to set state to that value once animation ends
  }

  updateArrowColors(value) {
    let startArrowColor = this.props.arrowDefaultColor;
    let endArrowColor = this.props.arrowDefaultColor;
    this.startArrowAllowed = true;
    this.endArrowAllowed = true;

    if (this.allSlidesFit) {
      startArrowColor = this.props.arrowDisabledColor;
      endArrowColor = this.props.arrowDisabledColor;
      this.startArrowAllowed = false;
      this.endArrowAllowed = false;
    } else {
      if (value >= 0) {
        this.startArrowAllowed = false;
        startArrowColor = this.props.arrowDisabledColor;
      }
      if (value <= this.contentSize - this.props.slidesStripSize) {
        this.endArrowAllowed = false;
        endArrowColor = this.props.arrowDisabledColor;
      }
    }
    this.setState({ startArrowColor, endArrowColor });
  }

  constrainAndApply(pos, nextProps) {
    const props = nextProps || this.props;

    const constrainedPos = constrainSliderMovement(
      pos,
      props.slidesStripSize,
      this.contentSize,
      props.isHorizontal,
      this
    );

    this.setState(constrainedPos); // Chrome animate end event bug
    this.animateSlider(constrainedPos);

    // this.setState({
    //   left: constrainedPos.left,
    //   top: constrainedPos.top
    //   // startArrowColor,
    //   // endArrowColor
    // });
  }

  calculateLayoutDimensions(nextProps) {
    const props = nextProps || this.props;
    const arrowSize = props.showArrows ? props.sliderArrowSize : 0;

    this.arrowWidth = props.isHorizontal ? arrowSize : 100;
    this.arrowHeight = props.isHorizontal ? 100 : arrowSize;
    this.contentWidth = props.isHorizontal ? 100 - arrowSize * 2 : 100;
    this.contentHeight = props.isHorizontal ? 100 : 100 - arrowSize * 2;

    this.contentSize = props.isHorizontal
      ? props.mainDivRect.width * ((100 - 2 * this.arrowWidth) / 100)
      : props.mainDivRect.height * ((100 - 2 * this.arrowHeight) / 100);
    this.allSlidesFit =
      this.contentSize - props.slidesStripSize >= 0 ? true : false;
  }

  render() {
    console.log('Slider render');

    const startIconName = this.props.isHorizontal ? 'arrow-left' : 'arrow-up';
    const endIconName = this.props.isHorizontal ? 'arrow-right' : 'arrow-down';
    // this.calculateLayoutDimensions();
    const start = this.props.showArrows ? (
      <div
        className="lv-slider-arrow"
        style={{
          width: `${this.arrowWidth}%`,
          height: `${this.arrowHeight}%`
        }}
        onMouseEnter={e => this.onMouseEnter('start', e)}
        onMouseLeave={e => this.onMouseLeave('start', e)}
        onMouseUp={e => this.onArrowClick('start', e)}
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
        imageLoaded={this.props.imagesInfo[idx] ? true : false}
        sliderCallback={this.props.sliderCallback}
        color={
          this.props.randomSlidesColor
            ? this.props.slideColors[idx]
            : this.props.slideBgdColor
        }
      />
    ));

    const middle = (
      <div
        className="lv-slider-content"
        ref={el => (this.content = el)}
        style={{
          width: `${this.contentWidth}%`,
          height: `${this.contentHeight}%`
        }}
      >
        <div
          ref={el => (this.slidesStrip = el)}
          className="lv-slides-strip"
          style={{
            left: `${this.state.left}px`,
            top: `${this.state.top}px`,
            animationName: this.state.animationName,
            animationDuration: `${this.props.slideTransitionDuration}s`,
            animationFillMode: 'none',
            width: this.props.isHorizontal
              ? this.props.slidesStripSize
              : this.props.slideSize,
            height: this.props.isHorizontal
              ? this.props.slideSize
              : this.props.slidesStripSize,
            display: this.props.isHorizontal ? 'flex' : 'block'
          }}
          onMouseDown={this.onMouseDown}
          onTouchEnd={this.onTouchEnd}
          // onMouseUp={this.onMouseUp}
          // onMouseMove={this.onMouseMove}
        >
          {slides}
        </div>
      </div>
    );

    const end = this.props.showArrows ? (
      <div
        className="lv-slider-arrow"
        style={{
          width: `${this.arrowWidth}%`,
          height: `${this.arrowHeight}%`
        }}
        onMouseEnter={e => this.onMouseEnter('end', e)}
        onMouseLeave={e => this.onMouseLeave('end', e)}
        onMouseUp={e => this.onArrowClick('end', e)}
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
        className="lv-slider-main"
        style={{
          backgroundColor: this.props.backgroundColor,
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
  const style = {
    width: `${props.slideSize}px`,
    height: `${props.slideSize}px`
  };

  const slideMargin = 5;

  return (
    <div
      className="lv-single-slide"
      style={style}
      onMouseUp={e => {
        if (props.sliderCallback) props.sliderCallback(props.index);
        props.slideClick(props.index, e);
      }}
    >
      {/* {image} */}
      <div
        className="lv-slide-image"
        style={{
          backgroundImage: `${"url('"}${props.backgroundImage}${"'"}`,
          width: `${100 - slideMargin * 2}%`,
          height: `${100 - slideMargin * 2}%`,
          backgroundColor: props.color
        }}
      />
      {props.slideActive ? null : <div className="lv-photo-darken" />}
    </div>
  );
};

export default Slider;

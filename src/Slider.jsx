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
      top: 0,
      bounced: false,
      currentEnergy: 1
      // allowSlider: true
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
    // this.onTouchStart = this.onTouchStart.bind(this);
    // this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.setInitialPosition = this.setInitialPosition.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isHorizontal !== nextProps.isHorizontal) {
      console.log('isHorizontal changed');

      // isHorizontal has changed
      this.calculateLayoutDimensions(nextProps);
      this.setInitialPosition(nextProps);
      // Flip left & top
      const newPosition = {
        left: this.props.top,
        top: this.props.left
      };
      // this.props.updateSliderPos(newPosition);
      this.setState(newPosition);
    }
    if (
      JSON.stringify(this.props.mainDivRect) !==
      JSON.stringify(nextProps.mainDivRect)
    ) {
      console.log(
        'slider says maindiv changed',
        JSON.stringify(this.props.mainDivRect),
        JSON.stringify(nextProps.mainDivRect)
      );
      console.log('next props slide', nextProps.activeSlideIdx);
      // parent div bounding rect has changed

      this.calculateLayoutDimensions(nextProps);
      this.setInitialPosition(nextProps);
    }
    if (this.props.activeSlideIdx !== nextProps.activeSlideIdx) {
      // Current slide has changed
      console.log('will receive props got', nextProps);
      this.setInitialPosition(nextProps);
    }
  }

  onTouchEnd() {
    console.log('touch end');
  }

  setInitialPosition(nextProps) {
    console.log('set initial pos');
    const props = nextProps || this.props;

    let left = this.state.left;
    let top = this.state.top;
    // this.forceUpdate();
    console.log('initial pos thinks active slide is', props.activeSlideIdx);

    if (this.allSlidesFit) {
      console.log('all slides fit');
      const newPos = this.getSlideCenterPos(nextProps);
      if (props.isHorizontal) {
        // left = (this.contentSize - props.slidesStripSize) / 2;
        this.setState({
          left: newPos.left,
          top: 0,
          startArrowColor: props.arrowDisabledColor,
          endArrowColor: props.arrowDisabledColor
        });
      } else {
        // const top = (this.contentSize - props.slidesStripSize) / 2;
        this.setState({
          left: 0,
          top: newPos.top,
          startArrowColor: props.arrowDisabledColor,
          endArrowColor: props.arrowDisabledColor
        });
      }
    } else {
      console.log('slides no fit');
      const constrainedPos = this.constrainMovement({ left, top }, nextProps);

      this.setState({
        left: constrainedPos.left,
        top: constrainedPos.top,
        startArrowColor: props.arrowDisabledColor,
        endArrowColor: props.arrowDefaultColor
      });
    }
  }
  getSlideCenterPos(nextProps) {
    const props = nextProps || this.props;

    if (props.isHorizontal) {
      const left =
        -1 * props.activeSlideIdx * props.slideSize +
        this.contentSize / 2 -
        props.slideSize / 2;
      console.log('getSlideCenterPos got', left);

      return { left, top: 0 };
    } else {
      const top =
        -1 * props.activeSlideIdx * props.slideSize +
        this.contentSize / 2 -
        props.slideSize / 2;
      console.log('getSlideCenterPos got', top);
      return { left: 0, top };
    }
  }

  onWheel(e) {
    e.preventDefault();
    e.stopPropagation();
    const factor = 1;
    console.log('.!.', e.deltaX, e.deltaY);
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
    console.log('123', left, top, this.state.top);

    const constrainedPos = this.constrainMovement({ left, top });
    if (this.props.isHorizontal) {
      this.setState({ left: constrainedPos.left });
    } else {
      this.setState({ top: constrainedPos.top });
    }
    // this.props.updateSliderPos({
    //   left: constrainedPos.left,
    //   top: constrainedPos.top
    // });
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
    this.setState({ bounced: false, currentEnergy: 1 });
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
    // this.props.updateSliderPos(constrainedPos); // Save slider position to container component

    console.log(newPosition);
  }

  onMouseEnter(arrow, e) {
    console.log('on enter', arrow, this.startArrowAllowed, this.allSlidesFit);

    e.stopPropagation();
    if (arrow === 'start') {
      if (!this.allSlidesFit && this.startArrowAllowed) {
        console.log('highlighting start');

        this.setState({ startArrowColor: this.props.arrowHighlightColor });
      }
    } else {
      if (!this.allSlidesFit && this.endArrowAllowed) {
        console.log('highlighting end');
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
    const constrainedPos = this.constrainMovement({ left, top });
    this.setState(constrainedPos);
  }

  slideMouseUp(index, e) {
    console.log('slide mouseUp');

    // e.stopPropagation();
    if (!this.dragging) this.props.slideClick(index, e);
  }

  constrainMovement(pos, nextProps) {
    console.log('constraint input', pos);

    const props = nextProps || this.props;

    let left = pos.left;
    let top = pos.top;

    this.startArrowAllowed = true;
    this.endArrowAllowed = true;

    let startArrowColor = this.props.arrowDefaultColor;
    let endArrowColor = this.props.arrowDefaultColor;

    if (props.isHorizontal) {
      if (props.slidesStripSize >= this.contentSize) {
        // Slides strip can't fit in slides container
        if (left > 0) {
          this.startArrowAllowed = false;
          startArrowColor = this.props.arrowDisabledColor;
          left = 0;
        }
        if (left < this.contentSize - props.slidesStripSize) {
          this.endArrowAllowed = false;
          endArrowColor = this.props.arrowDisabledColor;
          left = this.contentSize - props.slidesStripSize;
        }
      } else {
        // Slides strip is smaller than slides container
        if (left >= this.contentSize - props.slidesStripSize) {
          left = this.contentSize - props.slidesStripSize;
          this.setState({
            bounced: !this.state.bounced,
            currentEnergy: this.state.currentEnergy * this.energyAfterBounce
          });
        }
        if (left <= 0) {
          this.setState({
            bounced: !this.state.bounced,
            currentEnergy: this.state.currentEnergy * this.energyAfterBounce
          });
          left = 0;
        }
      }
    } else {
      if (props.slidesStripSize >= this.contentSize) {
        // Slides strip can't fit in slides container
        console.log(
          'slides can not fit',
          this.props.slidesStripSize,
          this.contentSize
        );

        if (top > 0) {
          this.startArrowAllowed = false;
          startArrowColor = this.props.arrowDisabledColor;
          top = 0;
        }
        if (top < this.contentSize - props.slidesStripSize) {
          this.endArrowAllowed = false;
          endArrowColor = this.props.arrowDisabledColor;
          top = this.contentSize - props.slidesStripSize;
        }
      } else {
        console.log('is smaller');
        // Slides strip is smaller than slides container
        if (top >= this.contentSize - props.slidesStripSize) {
          top = this.contentSize - props.slidesStripSize;
          this.setState({
            bounced: !this.state.bounced,
            currentEnergy: this.state.currentEnergy * this.energyAfterBounce
          });
        }
        if (top <= 0) {
          this.setState({
            bounced: !this.state.bounced,
            currentEnergy: this.state.currentEnergy * this.energyAfterBounce
          });
          top = 0;
        }
      }
    }
    this.setState({ startArrowColor, endArrowColor });
    console.log('constrain got', { left, top });

    return { left, top };
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
    console.log('slider render', this.props.mainDivRect);

    const startIconName = this.props.isHorizontal ? 'arrow-left' : 'arrow-up';
    const endIconName = this.props.isHorizontal ? 'arrow-right' : 'arrow-down';
    // this.calculateLayoutDimensions();
    const start = this.props.showArrows ? (
      <div
        className="slider-arrow"
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
        className="slider-arrow"
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
    width: `${props.slideSize}px`,
    height: `${props.slideSize}px`
  };

  if (props.isHorizontal) {
    // style.margin = `${0.45}%`;
  } else {
    // style.margin = `${5}%`;
  }

  const slideMargin = 5;

  // const image = props.imageLoaded ? (
  //   <img
  //     alt=""
  //     width={`${100 - slideMargin * 2}%`}
  //     height={`${100 - slideMargin * 2}%`}
  //     src={props.backgroundImage}
  //     position={'absolute'}
  //   />
  // ) : (
  //   <div
  //     style={{
  //       width: `${100 - slideMargin * 2}%`,
  //       height: `${100 - slideMargin * 2}%`
  //     }}
  //   />
  // );
  return (
    <div
      className="single-slide"
      style={style}
      onMouseUp={e => {
        props.sliderCallback(props.index);
        props.slideClick(props.index, e);
      }}
    >
      {/* {image} */}
      <div
        className="slide-image"
        style={{
          backgroundImage: `${"url('"}${props.backgroundImage}${"'"}`,
          width: `${100 - slideMargin * 2}%`,
          height: `${100 - slideMargin * 2}%`
        }}
      />
      {props.slideActive ? null : <div className="photo-darken" />}
    </div>
  );
};

export default Slider;

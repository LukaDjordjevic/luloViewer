import React from 'react';
import Icon from './Icon';

const Arrows = props => {
  const arrowSize = props.slidesRect
    ? props.slidesRect.height * props.ARROWS_SIZE
    : 0;

  const arrowsTop =
    props.slidesRect.height / 2 -
    (props.slidesRect.height * props.ARROWS_SIZE) / 2 +
    (props.slidesRect.top - props.mainDivRect.top);
  return (
    <div
      className="arrows"
      style={{
        top: `${arrowsTop}px`,

        width:
          ['left', 'right'].includes(props.SLIDER_POSITION) && props.SHOW_SLIDER
            ? props.mainDivRect.width * (1 - props.SLIDER_SIZE)
            : props.mainDivRect.width
      }}
    >
      <div
        className="arrow"
        onMouseEnter={props.onLeftArrowEnter}
        onMouseLeave={props.onLeftArrowLeave}
        onMouseUp={props.onLeftArrowClick}
        style={{
          width: arrowSize,
          height:
            props.ALLOW_CYCLIC || props.currentSlideIndex !== 0
              ? arrowSize
              : '0',
          paddingLeft: `${props.ARROWS_PADDING}%`
        }}
      >
        <div className="arrows-icon">
          <Icon name="arrow-left" color={props.leftArrowColor} size={'100%'} />
        </div>
      </div>
      <div
        className="arrow"
        onMouseEnter={props.onRightArrowEnter}
        onMouseLeave={props.onRightArrowLeave}
        onMouseUp={props.onRightArrowClick}
        style={{
          width: arrowSize,
          height:
            props.ALLOW_CYCLIC ||
            props.currentSlideIndex !== props.imageUrlsLength - 1
              ? arrowSize
              : '0',
          paddingRight: `${props.ARROWS_PADDING}%`
        }}
      >
        <div className="arrows-icon">
          <Icon
            name="arrow-right"
            color={props.rightArrowColor}
            size={'100%'}
          />
        </div>
      </div>
    </div>
  );
};

export default Arrows;

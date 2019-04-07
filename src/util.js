// Calculate point in center of screen based on image transform and div bounding rectangle.
// Returns dimensionless coords (represented as multipliers of image width and height)
const updateZoomTarget = (
  imageLeft,
  imageTop,
  imageWidth,
  imageHeight,
  boundingRectWidth,
  boundingRectHeight
) => {
  const zoomTargetX = (-1 * imageLeft + boundingRectWidth / 2) / imageWidth;
  const zoomTargetY = (-1 * imageTop + boundingRectHeight / 2) / imageHeight;

  return { x: zoomTargetX, y: zoomTargetY };
};

// Returns new image pos & dimensions while zooming such that the point on image below mouse pointer doesn't move
const getNewZoomTransform = (
  imgLeft,
  imgTop,
  newZoomFactor,
  oldZoomFactor,
  parentBoundingRect,
  imageAspectRatio,
  eventPosition
) => {
  const containerAspectRatio =
    parentBoundingRect.width / parentBoundingRect.height;
  let width;
  let height;
  let oldWidth;
  let oldHeight;
  let left;
  let top;

  if (imageAspectRatio > containerAspectRatio) {
    oldWidth = parentBoundingRect.width * oldZoomFactor;
    oldHeight = oldWidth / imageAspectRatio;
    width = parentBoundingRect.width * newZoomFactor;
    height = width / imageAspectRatio;
  } else {
    oldHeight = parentBoundingRect.height * oldZoomFactor;
    oldWidth = oldHeight * imageAspectRatio;
    height = parentBoundingRect.height * newZoomFactor;
    width = height * imageAspectRatio;
  }

  const divCoords = {
    x: eventPosition.x - parentBoundingRect.left,
    y: eventPosition.y - parentBoundingRect.top
  };

  const oldPointX = -1 * imgLeft + divCoords.x;
  const oldPointY = -1 * imgTop + divCoords.y;
  const newPointX = (oldPointX / oldWidth) * width;
  const newPointY = (oldPointY / oldHeight) * height;

  left = -1 * newPointX + divCoords.x;
  top = -1 * newPointY + divCoords.y;

  return { left, top, width, height };
};

// Returns image position and dimensions based on zoomTarget, zoomFactor and div rectangle
const getImageTransform = (
  zoomFactor,
  zoomTarget,
  parentBoundingRect,
  imageAspectRatio
) => {
  const containerAspectRatio =
    parentBoundingRect.width / parentBoundingRect.height;
  const { width, height } = getImageDimensions(
    zoomFactor,
    parentBoundingRect,
    imageAspectRatio,
    containerAspectRatio
  );

  const left = -1 * width * zoomTarget.x + parentBoundingRect.width / 2;
  const top = -1 * height * zoomTarget.y + parentBoundingRect.height / 2;

  return { left, top, width, height };
};

const getImageDimensions = (
  zoomFactor,
  parentBoundingRect,
  imageAspectRatio,
  containerAspectRatio
) => {
  let width;
  let height;

  if (imageAspectRatio > containerAspectRatio) {
    width = parentBoundingRect.width * zoomFactor;
    height = width / imageAspectRatio;
  } else {
    height = parentBoundingRect.height * zoomFactor;
    width = height * imageAspectRatio;
  }

  return { width, height };
};

// Used by SingleImage component
const constrainTranslate = (
  left,
  top,
  zoomFactor,
  parentBoundingRect,
  imageAspectRatio
) => {
  const containerAspectRatio =
    parentBoundingRect.width / parentBoundingRect.height;
  let constrainedLeft = left;
  let constrainedTop = top;
  let leftOffset = 0;
  let topOffset = 0;
  let leftBoundary;
  let topBoundary;
  if (imageAspectRatio > containerAspectRatio) {
    topOffset =
      ((parentBoundingRect.height -
        parentBoundingRect.width / imageAspectRatio) /
        2) *
      zoomFactor;
    leftBoundary =
      -1 * parentBoundingRect.width * zoomFactor + parentBoundingRect.width;
    topBoundary =
      -1 * zoomFactor * (parentBoundingRect.width / imageAspectRatio) +
      parentBoundingRect.height -
      topOffset;
  } else {
    leftOffset =
      ((parentBoundingRect.width -
        parentBoundingRect.height * imageAspectRatio) /
        2) *
      zoomFactor;
    leftBoundary =
      -1 * zoomFactor * (parentBoundingRect.height * imageAspectRatio) +
      parentBoundingRect.width -
      leftOffset;
    topBoundary =
      -1 * parentBoundingRect.height * zoomFactor + parentBoundingRect.height;
  }

  if (left > leftOffset) constrainedLeft = leftOffset;
  if (left < leftBoundary) constrainedLeft = leftBoundary;
  if (top > topOffset) constrainedTop = topOffset;
  if (top < topBoundary) constrainedTop = topBoundary;

  return { constrainedLeft, constrainedTop };
};

// Calculate view rectangle transform based on image transform and bounding rectangle
const getViewRectangleTransform = (
  imageLeft,
  imageTop,
  imageWidth,
  imageHeight,
  zoomControllerWidth,
  zoomControllerHeight,
  boundingRect
) => {
  let leftOffsetImage;
  let topOffsetImage;
  let left;
  let top;
  let width;
  let height;
  if (imageWidth / imageHeight > boundingRect.width / boundingRect.height) {
    topOffsetImage =
      (imageWidth / (boundingRect.width / boundingRect.height) - imageHeight) /
      2;
    left = ((-1 * imageLeft) / imageWidth) * zoomControllerWidth;
    top =
      ((-1 * imageTop + topOffsetImage) /
        (imageWidth / (boundingRect.width / boundingRect.height))) *
      zoomControllerHeight;
    width = (boundingRect.width / imageWidth) * zoomControllerWidth;
    height = width / (boundingRect.width / boundingRect.height);
  } else {
    leftOffsetImage =
      (imageHeight / (boundingRect.height / boundingRect.width) - imageWidth) /
      2;
    left =
      ((-1 * imageLeft + leftOffsetImage) /
        (imageHeight / (boundingRect.height / boundingRect.width))) *
      zoomControllerWidth;
    top = ((-1 * imageTop) / imageHeight) * zoomControllerHeight;

    height = (boundingRect.height / imageHeight) * zoomControllerHeight;
    width = height * (boundingRect.width / boundingRect.height);
  }

  return { left, top, width, height };
};

// Creates keyframes for main image scrolling
const createSlideAnimationKeyframes = (styleSheet, slidesRect) => {
  const width = slidesRect.width;
  if (styleSheet.sheet.cssRules[0]) styleSheet.sheet.deleteRule(0);
  styleSheet.sheet.insertRule(
    `
  @keyframes center-left {
    from { left: 0px; } 
    to { left: ${-1 * width}px; }
  }`,
    0
  );
  if (styleSheet.sheet.cssRules[1]) styleSheet.sheet.deleteRule(1);
  styleSheet.sheet.insertRule(
    `
  @keyframes center-right {
    from { left: 0px; } 
    to { left: ${width}px; }
  }`,
    1
  );
  if (styleSheet.sheet.cssRules[2]) styleSheet.sheet.deleteRule(2);
  styleSheet.sheet.insertRule(
    `
  @keyframes left-center {
    from { left: ${-1 * width}px; } 
    to { left: 0px; }
  }`,
    2
  );
  if (styleSheet.sheet.cssRules[3]) styleSheet.sheet.deleteRule(3);
  styleSheet.sheet.insertRule(
    `
  @keyframes right-center {
    from { left: ${width}px; } 
    to { left: 0px; }
  }`,
    3
  );
  if (styleSheet.sheet.cssRules[4]) styleSheet.sheet.deleteRule(4);
  styleSheet.sheet.insertRule(
    `
  @keyframes center-left-alt {
    from { left: 0px; } 
    to { left: ${-1 * width}px; }
  }`,
    4
  );
  if (styleSheet.sheet.cssRules[5]) styleSheet.sheet.deleteRule(5);
  styleSheet.sheet.insertRule(
    `
  @keyframes center-right-alt {
    from { left: 0px; } 
    to { left: ${width}px; }
  }`,
    5
  );
  if (styleSheet.sheet.cssRules[6]) styleSheet.sheet.deleteRule(6);
  styleSheet.sheet.insertRule(
    `
  @keyframes left-center-alt {
    from { left: ${-1 * width}px; } 
    to { left: 0px; }
  }`,
    6
  );
  if (styleSheet.sheet.cssRules[7]) styleSheet.sheet.deleteRule(7);
  styleSheet.sheet.insertRule(
    `
  @keyframes right-center-alt {
    from { left: ${width}px; } 
    to { left: 0px; }
  }`,
    7
  );
};

// Calculates main image rectangle from main div
const calculateSlidesDivFromMainDiv = (
  mainDivRect,
  sliderPosition,
  showSlider,
  sliderSize
) => {
  const slidesRect = Object.assign({}, mainDivRect);

  const slidesWidth =
    ['left', 'right'].includes(sliderPosition) && showSlider
      ? mainDivRect.width * (1 - sliderSize)
      : mainDivRect.width;

  const slidesHeight =
    ['top', 'bottom'].includes(sliderPosition) && showSlider
      ? mainDivRect.height * (1 - sliderSize)
      : mainDivRect.height;

  let offsetLeft = 0;
  let offsetTop = 0;
  if (sliderPosition === 'left' && showSlider)
    offsetLeft = mainDivRect.width * sliderSize;
  if (sliderPosition === 'top' && showSlider)
    offsetTop = mainDivRect.height * sliderSize;

  slidesRect.width = slidesWidth;
  slidesRect.height = slidesHeight;
  slidesRect.left = mainDivRect.left + offsetLeft;
  slidesRect.top = mainDivRect.top + offsetTop;
  slidesRect.x = mainDivRect.x + offsetLeft;
  slidesRect.y = mainDivRect.y + offsetTop;
  slidesRect.right = slidesRect.width + slidesRect.left;
  slidesRect.bottom = slidesRect.height + slidesRect.top;

  return slidesRect;
};

const constrainSliderMovement = (
  pos,
  slidesStripSize,
  contentSize,
  isHorizontal,
  parent
) => {
  console.log('****** new called', pos);

  let left = pos.left;
  let top = pos.top;

  if (isHorizontal) {
    if (slidesStripSize >= contentSize) {
      // Slides strip can't fit in slides container
      if (left > 0) {
        left = 0;
      }
      if (left < contentSize - slidesStripSize) {
        left = contentSize - slidesStripSize;
      }
    } else {
      // Slides strip is smaller than slides container

      if (left > contentSize - slidesStripSize) {
        left = contentSize - slidesStripSize;
        parent.setState({
          bounced: !parent.state.bounced,
          currentEnergy: parent.state.currentEnergy * this.energyAfterBounce
        });
      }
      if (left < 0) {
        parent.setState({
          bounced: !parent.state.bounced,
          currentEnergy: parent.state.currentEnergy * this.energyAfterBounce
        });
        left = 0;
      }
    }
    top = 0;
  } else {
    if (slidesStripSize >= contentSize) {
      // Slides strip can't fit in slides container
      if (top > 0) {
        top = 0;
      }
      if (top < contentSize - slidesStripSize) {
        top = contentSize - slidesStripSize;
      }
    } else {
      // Slides strip is smaller than slides container
      if (top >= contentSize - slidesStripSize) {
        top = contentSize - slidesStripSize;
        parent.setState({
          bounced: !parent.state.bounced,
          currentEnergy: parent.state.currentEnergy * 0.1
        });
      }
      if (top <= 0) {
        parent.setState({
          bounced: !parent.state.bounced,
          currentEnergy: parent.state.currentEnergy * 0.1
        });
        top = 0;
      }
    }
    left = 0;
  }
  console.log('new returning', left, top);

  return { left, top };
};

const generateColorArray = numberOfSlides => {
  const colors = [];
  for (let i = 0; i < numberOfSlides; i++) {
    colors.push(getRandomColor());
  }
  return colors;
};

const getRandomColor = () => {
  const letters = '0123456789AB';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    if ([4, 5].includes(i)) {
      color += letters[Math.floor(Math.random() * 6)];
      // Blue
    } else {
      color += letters[Math.floor(Math.random() * 12)];
    }
    console.log('color', color);
  }
  return color;
};

// Returns constants obj that is used throughout the app
const updateWithPropsInfo = (defaults, props) => {
  console.log('got', defaults);
  const constants = Object.assign({}, defaults);

  // TODO: write this with loop to lower source size
  if (typeof props.showViewer === 'boolean')
    constants.SHOW_VIEWER = props.showViewer;
  if (typeof props.showArrows === 'boolean')
    constants.SHOW_ARROWS = props.showArrows;
  if (typeof props.showSlider === 'boolean')
    constants.SHOW_SLIDER = props.showSlider;
  if (typeof props.showSliderArrows === 'boolean')
    constants.SHOW_SLIDER_ARROWS = props.showSliderArrows;
  if (typeof props.showZoomController === 'boolean')
    constants.SHOW_ZOOM_CONTROLLER = props.showZoomControlle;
  if (typeof props.allowMenu === 'boolean')
    constants.ALLOW_MENU = props.allowMenu;
  if (['left', 'right', 'top', 'bottom'].includes(props.sliderPosition))
    constants.SLIDER_POSITION = props.sliderPosition;

  if (typeof props.arrowsSize === 'number')
    constants.ARROWS_SIZE = props.arrowsSize;
  if (typeof props.arrowsPadding === 'number')
    constants.ARROWS_PADDING = props.arrowsPadding;
  if (typeof props.sliderSize === 'number')
    constants.SLIDER_SIZE = props.sliderSize;
  if (typeof props.sliderArrowSize === 'number')
    constants.SLIDER_ARROW_SIZE = props.sliderArrowSize;
  if (typeof props.zoomControllerSize === 'number')
    constants.ZOOM_CONTROLLER_SIZE = props.zoomControllerSize;
  if (typeof props.zoomControllerPadding === 'number')
    constants.ZOOM_CONTROLLER_PADDING = props.zoomControllerPadding;
  if (typeof props.zoomControllerPositionX === 'number')
    constants.ZOOM_CONTROLLER_POSITION_X = props.zoomControllerPositionX;
  if (typeof props.zoomControllerPositionY === 'number')
    constants.ZOOM_CONTROLLER_POSITION_Y = props.zoomControllerPositionY;
  if (typeof props.menuSize === 'number') constants.MENU_SIZE = props.menuSize;

  if (typeof props.allowCyclic === 'boolean')
    constants.ALLOW_CYCLIC = props.allowCyclic;
  if (typeof props.startingSlide === 'number')
    constants.STARTING_SLIDE = props.startingSlide;
  if (typeof props.maxPreloadedImages === 'number')
    constants.MAX_PRELOADED_IMAGES = props.maxPreloadedImages;
  if (typeof props.zoomLevels === 'number')
    constants.ZOOM_LEVELS = props.zoomLevels;
  if (typeof props.swipeThreshold === 'number')
    constants.SWIPE_THRESHOLD = props.swipeThreshold;
  if (typeof props.slideTransitionDuration === 'number')
    constants.SLIDE_TRANSITION_DURATION = props.slideTransitionDuration;
  if (typeof props.slideTransitionTimeout === 'number')
    constants.SLIDE_TRANSITION_TIMEOUT = props.slideTransitionTimeout;

  if (typeof props.backgroundColor === 'string')
    constants.BACKGROUND_COLOR = props.backgroundColor;
  if (typeof props.arrowDefaultColor === 'string')
    constants.ARROW_DEFAULT_COLOR = props.arrowDefaultColor;
  if (typeof props.arrowHighlightColor === 'string')
    constants.ARROW_HIGHLIGHT_COLOR = props.arrowHighlightColor;
  if (typeof props.arrowDisabledColor === 'string')
    constants.ARROW_DISABLED_COLOR = props.arrowDisabledColor;
  if (typeof props.menuTextColor === 'string')
    constants.MENU_TEXT_COLOR = props.menuTextColor;
  if (typeof props.menuIconColor === 'string')
    constants.MENU_ICON_COLOR = props.menuIconColor;
  if (typeof props.menuBgdColor === 'string')
    constants.MENU_BGD_COLOR = props.menuBgdColor;

  console.log('returning', constants);
  return constants;
};

// const getSliderCenterPos = (
//   viewerWidth,
//   viewerHeight,
//   widthPercentage,
//   heightPercentage,
//   slidesStripSize,
//   isHorizontal
// ) => {
//   console.log(
//     viewerWidth,
//     viewerHeight,
//     heightPercentage,
//     widthPercentage,
//     slidesStripSize,
//     isHorizontal
//   );
//   let left;
//   let top;
//   const contentWidth = widthPercentage * viewerWidth;
//   const contentHeight = heightPercentage * viewerHeight;
//   if (isHorizontal) {
//     left = (contentWidth - slidesStripSize) / 2;
//   } else {
//     top = (contentHeight - slidesStripSize) / 2;
//   }
//   console.log('88888888', { left, top });
//   return { left, top };
// };

module.exports = {
  updateZoomTarget,
  getNewZoomTransform,
  getImageTransform,
  getImageDimensions,
  constrainTranslate,
  getViewRectangleTransform,
  createSlideAnimationKeyframes,
  calculateSlidesDivFromMainDiv,
  constrainSliderMovement,
  getRandomColor,
  generateColorArray,
  updateWithPropsInfo
  // getSliderCenterPos
};

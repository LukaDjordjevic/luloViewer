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
  containerAspectRatio,
  eventPosition
) => {
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
  imageAspectRatio,
  containerAspectRatio
) => {
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

const constrainTranslate = (
  left,
  top,
  zoomFactor,
  parentBoundingRect,
  imageAspectRatio,
  containerAspectRatio
) => {
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

const createSlideAnimationKeyframes = (styleSheet, slidesRect) => {
  const width = slidesRect.width;
  if (styleSheet.sheet.cssRules[0]) styleSheet.sheet.deleteRule(0);
  console.log('***********', styleSheet.sheet.cssRules);
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
  console.log('new animations:', styleSheet.sheet);
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
  createSlideAnimationKeyframes
  // getSliderCenterPos
};

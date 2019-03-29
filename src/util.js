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
  // let leftOffsetController;
  // let topOffsetController;
  let leftOffsetImage;
  let topOffsetImage;
  let left;
  let top;
  let width;
  let height;
  if (imageWidth / imageHeight > boundingRect.width / boundingRect.height) {
    // Image aspect ratio > bounding rect aspect
    // leftOffsetController = 0;
    // topOffsetController =
    //   (zoomControllerHeight -
    //     zoomControllerWidth / (imageWidth / imageHeight)) /
    //   2;
    topOffsetImage =
      (imageWidth / (boundingRect.width / boundingRect.height) - imageHeight) /
      2;
    left = ((-1 * imageLeft) / imageWidth) * zoomControllerWidth;
    top =
      ((-1 * imageTop + topOffsetImage) /
        (imageWidth / (boundingRect.width / boundingRect.height))) *
      zoomControllerHeight;
    width =
      Math.round((boundingRect.width / imageWidth) * zoomControllerWidth) - 0;
    height = Math.round(width / (boundingRect.width / boundingRect.height)) - 0;
  } else {
    // topOffsetController = 0;
    leftOffsetImage =
      (imageHeight / (boundingRect.height / boundingRect.width) - imageWidth) /
      2;
    left =
      ((-1 * imageLeft + leftOffsetImage) /
        (imageHeight / (boundingRect.height / boundingRect.width))) *
      zoomControllerWidth;
    top = ((-1 * imageTop) / imageHeight) * zoomControllerHeight;

    height =
      Math.floor((boundingRect.height / imageHeight) * zoomControllerHeight) -
      0;
    width = Math.floor(height * (boundingRect.width / boundingRect.height)) - 0;
  }
  console.log('topoffset', topOffsetImage);
  return { left, top, width, height };
};

module.exports = {
  updateZoomTarget,
  getNewZoomTransform,
  getImageTransform,
  getImageDimensions,
  constrainTranslate,
  getViewRectangleTransform
};

const defaults = {
  // Layout
  SHOW_VIEWER: true,
  SHOW_ARROWS: true,
  SHOW_SLIDER: true,
  SHOW_SLIDER_ARROWS: true,
  SHOW_ZOOM_CONTROLLER: true,
  SLIDER_POSITION: 'bottom',
  ALLOW_MENU: true,

  // Transforms
  ARROWS_SIZE: 0.05, // width of arrow as fraction of viewer width
  ARROWS_PADDING: 5,
  SLIDER_SIZE: 0.12, //slider thickness as fraction of viewer dimension
  SLIDER_ARROW_SIZE: 3, // in percent of slider div
  ZOOM_CONTROLLER_SIZE: 0.18, // width of zoomController as fraction of viewer width
  ZOOM_CONTROLLER_PADDING: 5, // zoomController padding as viewer width percent
  ZOOM_CONTROLLER_POSITION_X: 0.8,
  ZOOM_CONTROLLER_POSITION_Y: 0.025,
  MENU_SIZE: 30, // %

  // Misc
  ALLOW_CYCLIC: true,
  STARTING_SLIDE: 0,
  MAX_PRELOADED_IMAGES: 5,
  ZOOM_LEVELS: 50,
  SWIPE_THRESHOLD: 20,
  SLIDE_TRANSITION_DURATION: 0.3,
  SLIDE_TRANSITION_TIMEOUT: 600,

  // Colors
  BACKGROUND_COLOR: 'black',
  ARROW_DEFAULT_COLOR: '#AAAAAA',
  ARROW_HIGHLIGHT_COLOR: '#FFFFFF',
  ARROW_DISABLED_COLOR: '#333333',
  MENU_TEXT_COLOR: 'lightgrey',
  MENU_ICON_COLOR: 'lightgrey',
  MENU_BGD_COLOR: 'rgba(0, 0, 0, 0.7)'
};

export default defaults;

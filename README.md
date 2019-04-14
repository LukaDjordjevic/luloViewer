# LuloViewer

Customizable React based image viewer

[![INSERT YOUR GRAPHIC HERE](https://gdurl.com/2mMv)]()

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- [Features](#features)
- [Installation](#installation)
- [Options](#options)
- [License](#license)

---

## Features

Fully customizable React image viewer. It features image preloader, fullscreen mode, slide animations, zoom and pan and it has a slider that can be used optionally, and even separately.

---

## Installation

From root dir of your project:

```shell
$ yarn add lulo-viewer --save
```

---

## Usage

```javascript
import LuloViewer from 'lulo-viewer'

...

const images = [
  'http://www.example.com/image1.png',
  'http://www.example.com/image2.png',
  'http://www.example.com/image3.png',
]

<LuloViewer
  imageUrls={images}
  showViewer={true}
  showSlider={true}
  showArrows={true}
  showZoomController={true}
  allowMenu={true}
  allowCyclic={true}
  slideBgdColor="teal"
  randomSlideColors={true}
  slideTransitionDuration={500} />
...

```

Only imageUrls prop is required.

## Options

| Prop                    |  Type   | Description                                                                                            |
| :---------------------- | :-----: | :----------------------------------------------------------------------------------------------------- |
| imageUrls               |  array  | Array of image URLs.                                                                                   |
| showViewer              | boolean | Show main image screen.                                                                                |
| showArrows              | boolean | Show arrows on main image screen.                                                                      |
| showSlider              | boolean | Show slider.                                                                                           |
| showSliderArrows        | boolean | Show slider arrows.                                                                                    |
| showZoomController      | boolean | Show zoom controller.                                                                                  |
| allowMenu               | boolean | Allow right-click menu.                                                                                |
| sliderPosition          | string  | Slider position. It can be 'bottom', 'top', 'left' or 'right'.                                         |
| arrowsSize              | number  | Size of main screen arrows. Should be between `0` and `1`. Defaults to `0.05`.                         |
| arrowsPadding           | number  | Padding for main arrows in percent of picture div width. Defaults to `5`.                              |
| sliderSize              | number  | Slider size as fraction of div dimensions. Should be between `0` and `1`. Defaults to `0.12`           |
| sliderArrowSize         | number  | Size of slider arrows as percent of slider size. Defaults to `3`.                                      |
| zoomControllerSize      | number  | Zoom controller size as fraction of div dimensions. Should be between `0` and `1`. Defaults to `0.18`. |
| zoomControllerPositionX | number  | Zoom controller position as fraction of width. Should be between `0` and `1`. Defaults to `0.8`.       |
| zoomControllerPositionX | number  | Zoom controller position as fraction of width. Should be between `0` and `1`. Defaults to `0.025`.     |
| menuSize                | number  | Menu size in viewer width percent. Defaults to `30`.                                                   |
| allowCyclic             |  bool   | Allows jumping from last to first image and also from first to last.                                   |
| startingSlide           | number  | Defaults to `0`.                                                                                       |
| maxPreloadedImages      | number  | Maximum number of preloaded images.                                                                    |
| slideTransitionDuration | number  | Duration of animations in `s`. Defaults to `0.3`.                                                      |
| randomSlideColors       | boolean | Randomize slide background colors.                                                                     |
| backgroundColor         | string  | Background color.                                                                                      |
| arrowDefaultColor       | string  | Arrows default color.                                                                                  |
| arrowHighlightColor     | string  | Arrows highlight color.                                                                                |
| arrowDisabledColor      | string  | Arrows disabled color.                                                                                 |
| slideBgdColor           | string  | Default color of unloaded slides. Should be used with randomSlideColors={false}.                       |

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**

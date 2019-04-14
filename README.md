# LuloViewer

Customizable React based image viewer. View the <a href="https://lulo-viewer.herokuapp.com/" rel="noopener noreferrer" target="_blank">DEMO</a> here.

[![INSERT YOUR GRAPHIC HERE](https://gdurl.com/2mMv)](https://lulo-viewer.herokuapp.com/)

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
      'https://upload.wikimedia.org/wikipedia/commons/f/f3/Curiosity_Self-Portrait_at_%27Big_Sky%27_Drilling_Site.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/9/95/Tracy_Caldwell_Dyson_in_Cupola_ISS.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/e/e7/Felix_from_ISS_03_sept_2007_1138Z.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/4/4d/USA_10654_Bryce_Canyon_Luca_Galuzzi_2007.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/9/9f/Raccoon_climbing_in_tree_-_Cropped_and_color_corrected.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/bb/Kittyply_edit1.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b6/Felis_catus-cat_on_snow.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/c/ca/Larix_decidua_Aletschwald.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/a/a5/ComputerHotline_-_Snow_crystals_%28by%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b3/Dolphind.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/7/7f/Waschbaer_auf_dem_Dach.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/4/44/EpicEarth-Globespin%282016May29%29.gif',
      'https://upload.wikimedia.org/wikipedia/commons/a/a2/SN1994D.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/0/00/Crab_Nebula.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/0/0d/Hubble_ultra_deep_field_high_rez_edit1.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/87/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/c/c2/Martian-Sunset-O-de-Goursac-Curiosity-2013.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/0/03/Tavares.Forum.Romanum.redux.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/89/Grasses_in_the_Valles_Caldera_2014-06-26.JPG'
    ];
    
...

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

Only imageUrls prop is required. LuloViewer will inherit dimensions from it's parent `<div>`.

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

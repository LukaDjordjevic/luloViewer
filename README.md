# LuloViewer

Customizable React based image viewer

[![INSERT YOUR GRAPHIC HERE](https://gdurl.com/2mMv)]()


[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org) 


- [Features](#features)
- [Installation](#installation)
- [License](#license)

---

## Features

Fully customizable React image viewer. It features image preloader, fullscreen mode, slide animations, zoom and pan and it has a slider that can be used optionally, and even separately.

---

## Installation
```shell
$ yarn add lulo-viewer@0.1.0-beta.1
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

Only imageUrls prop is required. More documentation to come.

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**

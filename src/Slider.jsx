import React, { PureComponent } from 'react';
import Icon from './Icon';

class Slider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {/* <div className="icon-arrow-down"> */}
        <Icon name="arrow-up" color={'#FFFFFF'} size={'20%'} />
        <Icon name="arrow-down" color={'#FFFFFF'} size={'20%'} />
        <Icon name="arrow-left" color={'#FFFFFF'} size={'20%'} />
        <Icon name="arrow-right" color={'#FFFFFF'} size={'20%'} />
        {/* </div> */}
        slajder
      </div>
    );
  }
}

export default Slider;

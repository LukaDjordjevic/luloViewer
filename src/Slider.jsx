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
        <Icon name="arrow-up" color={'#FFFFFF'} size={'10%'} />
        {/* </div> */}
        slajder
      </div>
    );
  }
}

export default Slider;

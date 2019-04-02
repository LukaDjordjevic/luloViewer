import React, { PureComponent } from 'react';
import Icon from './Icon';

class Menu extends PureComponent {
  constructor(props) {
    super(props);
    // this.state = {
    //   showArrows: this.props.showArrows,
    //   showSlider: this.props.showSlider,
    //   showZoom: this.props.showZoomController
    // };
    // this.onArrows = this.onArrows.bind(this);
    console.log('menu props', this.props);
  }

  onMouseUp(item, e) {
    console.log('clicked', item);
    e.preventDefault();
    e.stopPropagation();
    this.props.handleMenuClick(item);
  }

  // onArrows() {
  //   console.log('onArrows');

  // }

  render() {
    return (
      <div className="menu-main" style={this.props.style}>
        <Item
          text="Show arrows"
          menuIconColor={this.props.menuIconColor}
          menuTextColor={this.props.menuTextColor}
          iconName={this.props.showArrows ? 'check' : 'uncheck'}
          onClick={e => this.onMouseUp('arrows', e)}
        />
        <Item
          text="Show slider"
          menuIconColor={this.props.menuIconColor}
          menuTextColor={this.props.menuTextColor}
          iconName={this.props.showSlider ? 'check' : 'uncheck'}
          onClick={e => this.onMouseUp('slider', e)}
        />
        <Item
          text="Show zoom thingy"
          menuIconColor={this.props.menuIconColor}
          menuTextColor={this.props.menuTextColor}
          iconName={this.props.showZoomController ? 'check' : 'uncheck'}
          onClick={e => this.onMouseUp('zoom', e)}
        />
      </div>
    );
  }
}

const Item = props => {
  return (
    <div className="menu-item" onMouseUp={props.onClick}>
      <div
        className="menu-text no-select"
        style={{ color: props.menuTextColor }}
      >
        <p>{props.text}</p>
      </div>
      <div style={{ width: '10%' }}>
        <Icon name={props.iconName} color={props.menuIconColor} size="100%" />
      </div>
    </div>
  );
};

export default Menu;

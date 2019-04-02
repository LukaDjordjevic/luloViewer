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
    const sliderPosition = this.props.showSlider ? (
      <div className="menu-buttons">
        <Button
          text="Top"
          onClick={e => this.onMouseUp('top', e)}
          style={{ marginLeft: 0 }}
        />
        <Button text="Bottom" onClick={e => this.onMouseUp('bottom', e)} />
        <Button text="Left" onClick={e => this.onMouseUp('left', e)} />
        <Button text="Right" onClick={e => this.onMouseUp('right', e)} />
      </div>
    ) : null;
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
          text="Show zoom thingy"
          menuIconColor={this.props.menuIconColor}
          menuTextColor={this.props.menuTextColor}
          iconName={this.props.showZoomController ? 'check' : 'uncheck'}
          onClick={e => this.onMouseUp('zoom', e)}
        />
        <Item
          text="Show slider"
          menuIconColor={this.props.menuIconColor}
          menuTextColor={this.props.menuTextColor}
          iconName={this.props.showSlider ? 'check' : 'uncheck'}
          onClick={e => this.onMouseUp('slider', e)}
        />
        {sliderPosition}
        <Item
          text="Animate slides"
          menuIconColor={this.props.menuIconColor}
          menuTextColor={this.props.menuTextColor}
          iconName={
            this.props.slideTransitionDuration !== 0 ? 'check' : 'uncheck'
          }
          onClick={e => this.onMouseUp('animate', e)}
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

const Button = props => {
  return (
    <div
      className="menu-button no-select"
      onMouseUp={props.onClick}
      style={props.style}
    >
      {props.text}
    </div>
  );
};

export default Menu;

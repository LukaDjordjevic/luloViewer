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
    const buttonNames = ['bottom', 'right', 'top', 'left'];
    const buttons = buttonNames.map(name => {
      return (
        <Button
          key={name}
          text={name}
          onClick={e => this.onMouseUp(name, e)}
          style={{ marginLeft: 0, fontSize: this.props.menuWidth * 0.07 }}
        />
      );
    });
    const sliderPosition = this.props.showSlider ? (
      <div className="menu-buttons">
        {/* <Button
          text="Top"
          onClick={e => this.onMouseUp('top', e)}
          style={{ marginLeft: 0, fontSize: this.props.menuWidth * 0.05 }}
        />
        <Button text="Bottom" onClick={e => this.onMouseUp('bottom', e)} />
        <Button text="Left" onClick={e => this.onMouseUp('left', e)} />
        <Button text="Right" onClick={e => this.onMouseUp('right', e)} /> */}
        {buttons}
      </div>
    ) : null;
    return (
      <div className="menu-main" style={this.props.style}>
        <Item
          text="Fullscreen"
          menuWidth={this.props.menuWidth}
          menuIconColor={this.props.menuIconColor}
          menuTextColor={this.props.menuTextColor}
          iconName={this.props.isFullscreen ? 'check' : 'uncheck'}
          onClick={e => this.onMouseUp('fullscreen', e)}
        />
        <Item
          text="Show arrows"
          menuWidth={this.props.menuWidth}
          menuIconColor={this.props.menuIconColor}
          menuTextColor={this.props.menuTextColor}
          iconName={this.props.showArrows ? 'check' : 'uncheck'}
          onClick={e => this.onMouseUp('arrows', e)}
        />
        <Item
          text="Show zoom thingy"
          menuWidth={this.props.menuWidth}
          menuIconColor={this.props.menuIconColor}
          menuTextColor={this.props.menuTextColor}
          iconName={this.props.showZoomController ? 'check' : 'uncheck'}
          onClick={e => this.onMouseUp('zoom', e)}
        />
        <Item
          text="Show slider"
          menuWidth={this.props.menuWidth}
          menuIconColor={this.props.menuIconColor}
          menuTextColor={this.props.menuTextColor}
          iconName={this.props.showSlider ? 'check' : 'uncheck'}
          onClick={e => this.onMouseUp('slider', e)}
        />
        {sliderPosition}
        <Item
          text="Animate slides"
          menuWidth={this.props.menuWidth}
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
    <div
      className="menu-item"
      onMouseUp={props.onClick}
      style={{ height: `${props.menuWidth * 0.1}px` }}
    >
      <div
        className="menu-text no-select"
        style={{
          color: props.menuTextColor,
          fontSize: `${props.menuWidth * 0.08}px`
        }}
      >
        <p>{props.text}</p>
      </div>
      <div style={{ width: '10%' }}>
        {/* <img src={'./check.svg'} /> */}
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

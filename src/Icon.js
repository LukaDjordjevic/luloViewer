import React from 'react';
import Icons from './icons.svg';
import PropTypes from 'prop-types';

const Icon = ({ name, color, size, className = '' }) => (
  <svg
    className={`${className} icon-${name}`.trim()}
    fill={color}
    width={size}
    height={size}
  >
    <use xlinkHref={`${Icons}#icon-${name}`} />
  </svg>
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.string
};

export default Icon;

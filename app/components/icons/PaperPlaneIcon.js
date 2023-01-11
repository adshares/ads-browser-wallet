import React from 'react';
import Icon from './Icon';

export default class PaperPlaneIcon extends Icon {
  render() {
    const { fill } = this.props;
    return (
      <Icon fill={fill} >
        <path d="M2.51 3.53L10.02 6.75L2.5 5.75L2.51 3.53ZM10.01 12.25L2.5 15.47V13.25L10.01 12.25ZM0.51 0.5L0.5 7.5L15.5 9.5L0.5 11.5L0.51 18.5L21.5 9.5L0.51 0.5Z" />
      </Icon>
    );
  }
}

import React from 'react';
import Icon from './Icon';

export class BinIcon extends Icon {
  render() {
    const { fill, width, height = 18, viewBox = '0 0 14 18' } = this.props;
    return (
      <Icon fill={fill} width={width} height={height} viewBox={viewBox} >
        <path d="M11 6V16H3V6H11ZM9.5 0H4.5L3.5 1H0V3H14V1H10.5L9.5 0ZM13 4H1V16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4Z" />
      </Icon>
    );
  }
}

export class BroadcastIcon extends Icon {
  render() {
    const { fill, width, height, viewBox } = this.props;
    return (
      <Icon fill={fill} width={width} height={height} viewBox={viewBox} >
        <path d="M11 6V16H3V6H11ZM9.5 0H4.5L3.5 1H0V3H14V1H10.5L9.5 0ZM13 4H1V16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4Z" />
      </Icon>
    );
  }
}

export class CopyIcon extends Icon {
  render() {
    const { fill, width, height = 22, viewBox = '0 0 19 22' } = this.props;
    return (
      <Icon fill={fill} width={width} height={height} viewBox={viewBox} >
        <path d="M14 0H2C0.9 0 0 0.9 0 2V16H2V2H14V0ZM17 4H6C4.9 4 4 4.9 4 6V20C4 21.1 4.9 22 6 22H17C18.1 22 19 21.1 19 20V6C19 4.9 18.1 4 17 4ZM17 20H6V6H17V20Z" fill="white" />
      </Icon>
    );
  }
}

export class ExpandIcon extends Icon {
  render() {
    const { fill, width, height, viewBox } = this.props;
    return (
      <Icon fill={fill} width={width} height={height} viewBox={viewBox} >
        <path d="M2 9H0V14H5V12H2V9ZM0 5H2V2H5V0H0V5ZM12 12H9V14H14V9H12V12ZM9 0V2H12V5H14V0H9Z" />
      </Icon>
    );
  }
}

export class FindIcon extends Icon {
  render() {
    const { fill, width, height, viewBox } = this.props;
    return (
      <Icon fill={fill} width={width} height={height} viewBox={viewBox} >
        <path d="M12.5 11.5H11.71L11.43 11.23C12.41 10.09 13 8.61 13 7C13 3.41 10.09 0.5 6.5 0.5C2.91 0.5 0 3.41 0 7C0 10.59 2.91 13.5 6.5 13.5C8.11 13.5 9.59 12.91 10.73 11.93L11 12.21V13L16 17.99L17.49 16.5L12.5 11.5ZM6.5 11.5C4.01 11.5 2 9.49 2 7C2 4.51 4.01 2.5 6.5 2.5C8.99 2.5 11 4.51 11 7C11 9.49 8.99 11.5 6.5 11.5Z" />
      </Icon>
    );
  }
}

export class InfoCircleIcon extends Icon {
  render() {
    const { fill, width, height, viewBox } = this.props;
    return (
      <Icon fill={fill} width={width} height={height} viewBox={viewBox} >
        <path d="M9 5H11V7H9V5ZM9 9H11V15H9V9ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" />
      </Icon>
    );
  }
}

export class InfoShieldIcon extends Icon {
  render() {
    const { fill, width, height = 22, viewBox = '0 0 18 22' } = this.props;
    return (
      <Icon fill={fill} width={width} height={height} viewBox={viewBox} >
        <path d="M9 2.69L16 5.8V10.5C16 15.02 13.02 19.19 9 20.43C4.98 19.19 2 15.02 2 10.5V5.8L9 2.69ZM9 0.5L0 4.5V10.5C0 16.05 3.84 21.24 9 22.5C14.16 21.24 18 16.05 18 10.5V4.5L9 0.5ZM8 6.5H10V8.5H8V6.5ZM8 10.5H10V16.5H8V10.5Z" />
      </Icon>
    );
  }
}

export class KeyIcon extends Icon {
  render() {
    const { fill, width = 20, height, viewBox = '0 0 24 14' } = this.props;
    return (
      <Icon fill={fill} width={width} height={height} viewBox={viewBox} >
        <path d="M22 14H16V10H13.32C12.18 12.42 9.72 14 7 14C3.14 14 0 10.86 0 7C0 3.14 3.14 0 7 0C9.72 0 12.17 1.58 13.32 4H24V10H22V14ZM18 12H20V8H22V6H11.94L11.71 5.33C11.01 3.34 9.11 2 7 2C4.24 2 2 4.24 2 7C2 9.76 4.24 12 7 12C9.11 12 11.01 10.66 11.71 8.67L11.94 8H18V12ZM7 10C5.35 10 4 8.65 4 7C4 5.35 5.35 4 7 4C8.65 4 10 5.35 10 7C10 8.65 8.65 10 7 10ZM7 6C6.45 6 6 6.45 6 7C6 7.55 6.45 8 7 8C7.55 8 8 7.55 8 7C8 6.45 7.55 6 7 6Z" />
      </Icon>
    );
  }
}

export class LinkIcon extends Icon {
  render() {
    const { fill, width, height, viewBox } = this.props;
    return (
      <Icon fill={fill} width={width} height={height} viewBox={viewBox} >
        <path d="M15 0H11V2H15C16.65 2 18 3.35 18 5C18 6.65 16.65 8 15 8H11V10H15C17.76 10 20 7.76 20 5C20 2.24 17.76 0 15 0ZM9 8H5C3.35 8 2 6.65 2 5C2 3.35 3.35 2 5 2H9V0H5C2.24 0 0 2.24 0 5C0 7.76 2.24 10 5 10H9V8ZM6 4H14V6H6V4Z" />
      </Icon>
    );
  }
}

export class LogOutIcon extends Icon {
  render() {
    const { fill, width, height, viewBox } = this.props;
    return (
      <Icon fill={fill} width={width} height={height} viewBox={viewBox} >
        <path d="M9 4L7.6 5.4L10.2 8H0V10H10.2L7.6 12.6L9 14L14 9L9 4ZM18 16H10V18H18C19.1 18 20 17.1 20 16V2C20 0.9 19.1 0 18 0H10V2H18V16Z" />
      </Icon>
    );
  }
}

export class PaperPlaneIcon extends Icon {
  render() {
    const { fill, width, height, viewBox } = this.props;
    return (
      <Icon fill={fill} >
        <path d="M2.51 3.53L10.02 6.75L2.5 5.75L2.51 3.53ZM10.01 12.25L2.5 15.47V13.25L10.01 12.25ZM0.51 0.5L0.5 7.5L15.5 9.5L0.5 11.5L0.51 18.5L21.5 9.5L0.51 0.5Z" />      </Icon>
    );
  }
}

export class PencilIcon extends Icon {
  render() {
    const { fill, width, height, viewBox } = this.props;
    return (
      <Icon fill={fill} >
        <path d="M11.06 6.02L11.98 6.94L2.92 16H2V15.08L11.06 6.02ZM14.66 0C14.41 0 14.15 0.1 13.96 0.29L12.13 2.12L15.88 5.87L17.71 4.04C18.1 3.65 18.1 3.02 17.71 2.63L15.37 0.29C15.17 0.09 14.92 0 14.66 0ZM11.06 3.19L0 14.25V18H3.75L14.81 6.94L11.06 3.19Z" />
      </Icon>
    );
  }
}

export class PlusIcon extends Icon {
  render() {
    const { fill, width, height, viewBox } = this.props;
    return (
      <Icon fill={fill} >
        <path d="M14.5 8.5H8.5V14.5H6.5V8.5H0.5V6.5H6.5V0.5H8.5V6.5H14.5V8.5Z" />
      </Icon>
    );
  }
}

export class RecycleIcon extends Icon {
  render() {
    const { fill, width, height, viewBox } = this.props;
    return (
      <Icon fill={fill} width={width} height={height} viewBox={viewBox} >
        <path d="M18 4L14 8H17C17 11.31 14.31 14 11 14C9.99 14 9.03 13.75 8.2 13.3L6.74 14.76C7.97 15.54 9.43 16 11 16C15.42 16 19 12.42 19 8H22L18 4ZM5 8C5 4.69 7.69 2 11 2C12.01 2 12.97 2.25 13.8 2.7L15.26 1.24C14.03 0.46 12.57 0 11 0C6.58 0 3 3.58 3 8H0L4 12L8 8H5Z" />
      </Icon>
    );
  }
}


export class SettingsIcon extends Icon {
  render() {
    const { fill, width, height, viewBox } = this.props;
    return (
      <Icon fill={fill} width={width} height={height} viewBox={viewBox} >
        <path d="M17.4298 10.98C17.4698 10.66 17.4998 10.34 17.4998 10C17.4998 9.66 17.4698 9.34 17.4298 9.02L19.5398 7.37C19.7298 7.22 19.7798 6.95 19.6598 6.73L17.6598 3.27C17.5698 3.11 17.3998 3.02 17.2198 3.02C17.1598 3.02 17.0998 3.03 17.0498 3.05L14.5598 4.05C14.0398 3.65 13.4798 3.32 12.8698 3.07L12.4898 0.42C12.4598 0.18 12.2498 0 11.9998 0H7.99984C7.74984 0 7.53984 0.18 7.50984 0.42L7.12984 3.07C6.51984 3.32 5.95984 3.66 5.43984 4.05L2.94984 3.05C2.88984 3.03 2.82984 3.02 2.76984 3.02C2.59984 3.02 2.42984 3.11 2.33984 3.27L0.339839 6.73C0.209839 6.95 0.26984 7.22 0.45984 7.37L2.56984 9.02C2.52984 9.34 2.49984 9.67 2.49984 10C2.49984 10.33 2.52984 10.66 2.56984 10.98L0.45984 12.63C0.26984 12.78 0.219839 13.05 0.339839 13.27L2.33984 16.73C2.42984 16.89 2.59984 16.98 2.77984 16.98C2.83984 16.98 2.89984 16.97 2.94984 16.95L5.43984 15.95C5.95984 16.35 6.51984 16.68 7.12984 16.93L7.50984 19.58C7.53984 19.82 7.74984 20 7.99984 20H11.9998C12.2498 20 12.4598 19.82 12.4898 19.58L12.8698 16.93C13.4798 16.68 14.0398 16.34 14.5598 15.95L17.0498 16.95C17.1098 16.97 17.1698 16.98 17.2298 16.98C17.3998 16.98 17.5698 16.89 17.6598 16.73L19.6598 13.27C19.7798 13.05 19.7298 12.78 19.5398 12.63L17.4298 10.98ZM15.4498 9.27C15.4898 9.58 15.4998 9.79 15.4998 10C15.4998 10.21 15.4798 10.43 15.4498 10.73L15.3098 11.86L16.1998 12.56L17.2798 13.4L16.5798 14.61L15.3098 14.1L14.2698 13.68L13.3698 14.36C12.9398 14.68 12.5298 14.92 12.1198 15.09L11.0598 15.52L10.8998 16.65L10.6998 18H9.29984L9.10984 16.65L8.94984 15.52L7.88984 15.09C7.45984 14.91 7.05984 14.68 6.65984 14.38L5.74984 13.68L4.68984 14.11L3.41984 14.62L2.71984 13.41L3.79984 12.57L4.68984 11.87L4.54984 10.74C4.51984 10.43 4.49984 10.2 4.49984 10C4.49984 9.8 4.51984 9.57 4.54984 9.27L4.68984 8.14L3.79984 7.44L2.71984 6.6L3.41984 5.39L4.68984 5.9L5.72984 6.32L6.62984 5.64C7.05984 5.32 7.46984 5.08 7.87984 4.91L8.93984 4.48L9.09984 3.35L9.29984 2H10.6898L10.8798 3.35L11.0398 4.48L12.0998 4.91C12.5298 5.09 12.9298 5.32 13.3298 5.62L14.2398 6.32L15.2998 5.89L16.5698 5.38L17.2698 6.59L16.1998 7.44L15.3098 8.14L15.4498 9.27ZM9.99984 6C7.78984 6 5.99984 7.79 5.99984 10C5.99984 12.21 7.78984 14 9.99984 14C12.2098 14 13.9998 12.21 13.9998 10C13.9998 7.79 12.2098 6 9.99984 6ZM9.99984 12C8.89984 12 7.99984 11.1 7.99984 10C7.99984 8.9 8.89984 8 9.99984 8C11.0998 8 11.9998 8.9 11.9998 10C11.9998 11.1 11.0998 12 9.99984 12Z" />
      </Icon>
    );
  }
}


export class SwitchIcon extends Icon {
  render() {
    const { fill, width, height, viewBox } = this.props;
    return (
      <Icon fill={fill} width={width} height={height} viewBox={viewBox} >
        <path d="M16 0H6C2.69 0 0 2.69 0 6C0 9.31 2.69 12 6 12H16C19.31 12 22 9.31 22 6C22 2.69 19.31 0 16 0ZM16 10H6C3.79 10 2 8.21 2 6C2 3.79 3.79 2 6 2H16C18.21 2 20 3.79 20 6C20 8.21 18.21 10 16 10ZM16 3C14.34 3 13 4.34 13 6C13 7.66 14.34 9 16 9C17.66 9 19 7.66 19 6C19 4.34 17.66 3 16 3Z" />
      </Icon>
    );
  }
}


export class TransactionsIcon extends Icon {
  render() {
    const { fill, width, height, viewBox } = this.props;
    return (
      <Icon fill={fill} width={width} height={height} viewBox={viewBox} >
        <path d="M7.01 9H0V11H7.01V14L11 10L7.01 6V9ZM12.99 8V5H20V3H12.99V0L9 4L12.99 8Z" />
      </Icon>
    );
  }
}

export class WrapIcon extends Icon {
  render() {
    const { fill, rotate } = this.props;
    return (
      <Icon fill={fill} rotate={rotate} >
        <path d="M6.59 5.67L1.41 0.5L0 1.91L5.17 7.08L6.59 5.67ZM10.5 0.5L12.54 2.54L0 15.09L1.41 16.5L13.96 3.96L16 6V0.5H10.5ZM10.83 9.91L9.42 11.32L12.55 14.45L10.5 16.5H16V11L13.96 13.04L10.83 9.91Z" fill="black" />      </Icon>
    );
  }
}


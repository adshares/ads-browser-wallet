/* eslint-disable no-plusplus */
import React from 'react';
import PropTypes from 'prop-types';
import { WrapIcon } from '../icons/Icons';
import config from '../../config/config';
import style from './Timer.css';

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.getBlockTime()
    };
  }

  componentDidMount() {
    this.intervalId = setInterval(
      () => this.tick(),
      500
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  getBlockTime = () => {
    const now = Math.floor(Date.now() / 1000);
    const block = Math.floor(now / config.blockLength) * config.blockLength;
    const nextBlock = block + config.blockLength;

    return {
      block,
      nextBlock,
      time: (nextBlock - now) + 1,
      dividend: block % (config.blockLength * config.dividendLength) === 0,
    };
  };

  tick() {
    this.setState({
      ...this.getBlockTime()
    });
  }

  renderBlockTimer() {
    const blockTime = config.blockLength - this.state.time;
    const bits = [];

    for (let i = 0; i < 9; ++i) {
      /*eslint no-bitwise: ["error", { "allow": ["&"] }] */
      const className = blockTime & Math.pow(2, 8 - i) ? style.activeBit : '';
      bits.push(<div key={i} className={className} />);
    }

    const classNames = [];
    classNames.push(style.blockTimer);
    if (this.state.dividend) {
      classNames.push(style.dividend);
    }
    const className = classNames.join(' ');

    return (
      <div className={className} title={this.state.dividend ? 'Dividend block' : 'Current block id'}>
        {bits} #{this.state.block.toString(16).toUpperCase()}
        {this.state.dividend ? <WrapIcon /> : ''}
      </div>
    );
  }

  renderNextBlockTimer() {
    const minutes = Math.floor(this.state.time / 60);
    const seconds = this.state.time - (minutes * 60);

    return (
      <div className={style.nextBlockTimer}>
        Next block in {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
    );
  }

  render() {
    const {
      className,
      ...rest
    } = this.props;

    const classNames = [];
    classNames.push(style.timer);
    if (className) {
      classNames.push(className);
    }
    const styleClassName = classNames.join(' ');

    return (
      <div className={styleClassName} {...rest}>
        {this.renderBlockTimer()}
        {this.renderNextBlockTimer()}
      </div>
    );
  }
}

Timer.propTypes = {
  className: PropTypes.string,
};

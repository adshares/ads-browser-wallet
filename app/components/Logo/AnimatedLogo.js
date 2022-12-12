import React from 'react';
import anime from 'animejs';
import style from './Logo.css';

export default class AnimatedLogo extends React.Component {
  componentDidMount() {
    anime({
      targets: `.${style.cls1}`,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1500,
      delay: 100,
      loop: false
    });
  }

  render() {
    return (
      <video autoPlay muted>
        <source src="animated-logo.mp4" type="video/mp4" />
              Your browser does not support the video tag. </video>
    );
  }
}


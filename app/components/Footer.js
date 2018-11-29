import React from 'react';
import { Link } from 'react-router-dom';
import style from './Footer.css';

export default class Footer extends React.Component {
  render() {
    return (
      <footer className={style.footer}>
        <Link to={'/'}>Home</Link>
      </footer>
    );
  }
}

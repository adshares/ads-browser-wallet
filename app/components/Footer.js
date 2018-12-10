import React from 'react';
import { Link } from 'react-router-dom';
import style from './Footer.css';

const Footer = () => (
  <footer className={style.footer}>
    <Link to={'/'}>Home</Link>
  </footer>
);

export default Footer;

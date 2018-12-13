import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ButtonLink from '../atoms/ButtonLink';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import style from './Page.css';

export default class Page extends React.PureComponent {
  render() {
    const {
      title,
      cancelLink,
      scroll,
      children,
      ...rest
    } = { ...this.props };

    let classes = [];
    classes.push(style.header);
    if (cancelLink) {
      classes.push(style.withCancelLink);
    }
    const headerClass = classes.join(' ');

    classes = [];
    classes.push(style.contentWrapper);
    if (!title && !cancelLink) {
      classes.push(style.withoutHeader);
    }
    if (scroll) {
      classes.push(style.withScroll);
    }
    const wrapperClass = classes.join(' ');

    return (
      <div {...rest}>
        <Header />
        {title || cancelLink ? (
          <div className={headerClass}>
            <h2>{title}</h2>
            {cancelLink ? <ButtonLink to={cancelLink} size="small" inverse>
              <FontAwesomeIcon icon={faTimes} />
            </ButtonLink> : ''}
          </div>
        ) : '' }
        <div className={wrapperClass}>
          {children}
        </div>
        <Footer />
      </div>
    );
  }
}

Page.propTypes = {
  title: PropTypes.string,
  cancelLink: PropTypes.any,
  scroll: PropTypes.bool,
};

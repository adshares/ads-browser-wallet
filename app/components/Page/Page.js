import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ButtonLink from '../atoms/ButtonLink';
import Footer from '../Footer/Footer';
import style from './Page.css';
import Header from '../Header/Header';

export default class Page extends React.PureComponent {
  render() {
    const {
      title,
      cancelLink,
      scroll,
      logoutAction,
      ereaseAction,
      accounts,
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
      <section>
        <Header logoutAction={logoutAction} ereaseAction={ereaseAction} accounts={accounts} />
        <div {...rest} className={style.page}>
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
      </section>
    );
  }
}

Page.propTypes = {
  accounts: PropTypes.array.isRequired,
  logoutAction: PropTypes.func.isRequired,
  ereaseAction: PropTypes.func.isRequired,
  title: PropTypes.string,
  cancelLink: PropTypes.any,
  scroll: PropTypes.bool,
};

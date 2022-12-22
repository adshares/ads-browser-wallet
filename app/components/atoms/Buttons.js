import React from 'react';
import PropTypes from 'prop-types';
import style from './Buttons.css';
import ButtonLink from './ButtonLink';

export default class Buttons extends React.Component {
  render() {
    const {
      // children
      btnSecondaryTo,
      btnSecondaryDisabled,
      btnSecondaryText,
      btnPrimaryTo,
      btnPrimaryDisabled,
      btnPrimaryText,
    } = this.props;

    return (
      <div className={style.buttons}>
        {/*{children}*/}
        <ButtonLink
          to={btnSecondaryTo}
          layout="secondary"
          disabled={btnSecondaryDisabled}
        >{btnSecondaryText}
        </ButtonLink>
        <ButtonLink
          to={btnPrimaryTo}
          layout="Primary"
          disabled={btnPrimaryDisabled}
        >{btnPrimaryText}
        </ButtonLink>
        {/*<Button*/}
        {/*  type="submit"*/}
        {/*  layout="primary"*/}
        {/*  disabled={this.state.isSubmitted}*/}
        {/*>Save*/}
        {/*</Button>*/}
      </div>
    );
  }
}

Buttons.propTypes = {
  // children: PropTypes.any,
  btnSecondaryTo: PropTypes.any,
  btnSecondaryDisabled: PropTypes.bool,
  btnSecondaryText: PropTypes.string,
  btnPrimaryTo: PropTypes.any,
  btnPrimaryDisabled: PropTypes.bool,
  btnPrimaryText: PropTypes.string
};

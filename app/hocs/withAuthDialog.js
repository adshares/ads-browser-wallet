import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/actions';

export default Comp => class withAuthDialog extends Comp {
  handleClick = () => {
    this.props.authDialogActions.toggleAuthorisationDialog(true);
  };

  @connect(
    state => ({
      authDialog: state.authDialog
    }),
    dispatch => ({
      actions: {
        authDialogActions: bindActionCreators(Actions, dispatch),
      }
    })
  )

  render() {
    return (
      <Comp onClick={this.handleClick}/>
    );
  }
};

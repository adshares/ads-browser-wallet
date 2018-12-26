import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/actions';

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
export default Comp => class withAuthDialog extends Comp {
  handleClick = () => {
    this.props.authDialogActions.toggleAuthorisationDialog(true);
  };

  render() {
    return (
      <Comp onClick={this.handleClick}/>
    );
  }
};

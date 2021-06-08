import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import {
  cleanForm,
  inputChanged,
  validateInput,
  validateForm,
  transactionAccepted,
  transactionRejected,
} from '../../actions/transactionActions';
import { findFreeKey } from '../../actions/vaultActions';
import TransactionPage from './TransactionPage';
import InputControl from '../../components/atoms/InputControl';
import ADS from '../../utils/ads';
import style from './style.css';

class ChangeAccountKeyPage extends TransactionPage {
  static propTypes = {
    ...TransactionPage.propTypes,
    inputs: PropTypes.shape({
      publicKey: PropTypes.object.isRequired,
    })
  }

  constructor(props) {
    super(ADS.TX_TYPES.CHANGE_ACCOUNT_KEY, props);
    this.state = {
      newKey: {},
    };
  }

  refreshNewKey() {
    (new Promise((resolve) => {
      this.props.actions.findFreeKey(k => resolve(k));
    })).then((key) => {
      if (this.state.newKey.name !== key.name) {
        this.setState({ newKey: key });
        this.handleInputChange(key.publicKey, 'publicKey');
      }
    });
  }

  componentDidMount() {
    this.refreshNewKey();
  }

  componentDidUpdate() {
    this.refreshNewKey();
  }

  renderInputs() {
    const { newKey } = this.state;
    const {
      inputs: { publicKey }
    } = this.props;

    const { vault } = this.props;
    const account = vault.accounts.find(a => a.address === vault.selectedAccount);
    const currentKey = vault.keys.find(k => k.publicKey === account.publicKey) || {};

    return (
      <div className={style.message}>
        <InputControl
          name="currentPublicKey"
          label={`Current public key (${currentKey.name || 'unknown'})`}
          value={account.publicKey || '--- unknown ---'}
          rows={2}
          readOnly
        />
        <InputControl
          name="publicKey"
          label={`New public key (${newKey.name || '...'})`}
          value={publicKey.value}
          isValid={publicKey.isValid}
          errorMessage={publicKey.errorMsg}
          rows={2}
          readOnly
        />
      </div>
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    ...state.transactions[ADS.TX_TYPES.CHANGE_ACCOUNT_KEY]
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        cleanForm,
        inputChanged,
        validateInput,
        validateForm,
        transactionAccepted,
        transactionRejected,
        findFreeKey,
      },
      dispatch
    )
  })
)(ChangeAccountKeyPage));

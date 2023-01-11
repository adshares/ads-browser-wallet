/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PageComponent from '../../components/PageComponent';
import Page from '../../components/Page/Page';
import ButtonLink from '../../components/atoms/ButtonLink';
import Box from '../../components/atoms/Box';
import Broadcast from '../../components/icons/Broadcast';
import Key from '../../components/icons/Key';
import PaperPlaneIcon from '../../components/icons/PaperPlaneIcon';
import Wrap from '../../components/icons/Wrap';
import { typeLabels } from './labels';
import style from './style.css';

class AvailableTransactionsPage extends PageComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    vault: PropTypes.object.isRequired,
  };

  renderLinks() {
    return (
      <div className={style.availableLinks}>
        <ButtonLink
          icon="left" layout="primary"
          size="wide"
          to={{
            pathname: '/transactions/send_one',
            state: { referrer: this.props.history.location }
          }}
        >
          <PaperPlaneIcon fill="light" /> {typeLabels.send_one}
        </ButtonLink>
        <ButtonLink
          icon="left" size="wide" layout="secondary"
          to={{
            pathname: '/transactions/broadcast',
            state: { referrer: this.props.history.location }
          }}
        >
          <Broadcast /> {typeLabels.broadcast}
        </ButtonLink>
        <ButtonLink
          icon="left" size="wide" layout="secondary"
          to={{
            pathname: '/transactions/gateways',
            state: { referrer: this.props.history.location }
          }}
        >
          <Wrap /> Wrap ADS
        </ButtonLink>
        <ButtonLink
          icon="left" size="wide" layout="outline"
          to={{
            pathname: '/transactions/change_account_key',
            state: { referrer: this.props.history.location }
          }}
        >
          <Key className="style.primary" /> {typeLabels.change_account_key}
        </ButtonLink>
      </div>
    );
  }

  renderInfo() {
    return (
      <Box icon={'i'} inverse layout="warning">
        You can use this plugin to sign ADS Operator&apos;s transactions.<br />
        If You want to send transactions directly, You have to import an account first.
      </Box>
    );
  }

  render() {
    return (
      <Page
        title="Transactions"
        cancelLink={this.getReferrer()}
      >
        {this.props.vault.accounts.length > 0 ? this.renderLinks() : this.renderInfo() }
        <ButtonLink className={style.availableLinkCancel} to={this.getReferrer()} layout="secondary">
            Back
        </ButtonLink>
      </Page>
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
  })
)(AvailableTransactionsPage));

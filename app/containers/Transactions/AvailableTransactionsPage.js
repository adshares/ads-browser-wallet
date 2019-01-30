/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfo,
  faChevronLeft,
  faPaperPlane,
  faBullhorn,
  faKey,
  // faUserPlus,
  // faPlusSquare,
  // faRetweet,
} from '@fortawesome/free-solid-svg-icons';
import PageComponent from '../../components/PageComponent';
import Page from '../../components/Page/Page';
import ButtonLink from '../../components/atoms/ButtonLink';
import Box from '../../components/atoms/Box';
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
          icon="left" layout="info" inverse
          to={{
            pathname: '/transactions/send-one',
            state: { referrer: this.props.history.location }
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} /> {typeLabels.send_one}
        </ButtonLink>
        <ButtonLink
          icon="left" layout="info" inverse
          to={{
            pathname: '/transactions/broadcast',
            state: { referrer: this.props.history.location }
          }}
        >
          <FontAwesomeIcon icon={faBullhorn} /> {typeLabels.broadcast}
        </ButtonLink>
        {/*<ButtonLink
          icon="left" inverse
          to={{
            pathname: '/transactions/create-account',
            state: { referrer: this.props.history.location }
          }}
        >
          <FontAwesomeIcon icon={faUserPlus} /> {typeLabels.create_account}
        </ButtonLink>
        <ButtonLink
          icon="left" inverse
          to={{
            pathname: '/transactions/create-node',
            state: { referrer: this.props.history.location }
          }}
        >
          <FontAwesomeIcon icon={faPlusSquare} /> {typeLabels.create_node}
        </ButtonLink>*/}
        <ButtonLink
          icon="left" layout="warning" inverse
          to={{
            pathname: '/transactions/change-account-key',
            state: { referrer: this.props.history.location }
          }}
        >
          <FontAwesomeIcon icon={faKey} /> {typeLabels.change_account_key}
        </ButtonLink>
        {/*<ButtonLink
          icon="left" layout="danger" inverse
          to={{
            pathname: '/transactions/retrieve-funds',
            state: { referrer: this.props.history.location }
          }}
        >
          <FontAwesomeIcon icon={faRetweet} /> {typeLabels.retrieve_funds}
        </ButtonLink>*/}
      </div>
    );
  }

  renderInfo() {
    return (
      <Box icon={faInfo} inverse layout="warning">
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
        <ButtonLink to={this.getReferrer()} size="wide" icon="left" layout="info">
          <FontAwesomeIcon icon={faChevronLeft} /> Back
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

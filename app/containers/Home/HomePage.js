/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faCopy,
  // faGlobe,
  faExclamation,
  faRandom,
} from '@fortawesome/free-solid-svg-icons';
import { CREATE_FREE_ACCOUNT, SETTINGS, createFreeAccount } from '../../actions/settingsActions';
import { cleanForm } from '../../actions/formActions';
import Page from '../../components/Page/Page';
import ButtonLink from '../../components/atoms/ButtonLink';
import Button from '../../components/atoms/Button';
import Box from '../../components/atoms/Box';
import { formatAdsMoney, calculateToUsd } from '../../utils/ads';
import style from './HomePage.css';
import config from '../../config/config';
import * as types from '../../../app/constants/MessageTypes';
import { copyToClipboard } from '../../utils/utils';

class HomePage extends React.PureComponent {
  static propTypes = {
    adsOperatorApi: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    vault: PropTypes.object.isRequired,
    queue: PropTypes.array.isRequired,
    mainPage: PropTypes.object.isRequired,
    settingsPage: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      createFreeAccount: PropTypes.func.isRequired,
      cleanForm: PropTypes.func.isRequired,
    })
  };

  componentDidMount() {
    this.props.actions.cleanForm(CREATE_FREE_ACCOUNT);
  }

  componentWillUnmount() {
    this.props.actions.cleanForm(CREATE_FREE_ACCOUNT);
  }

  handleFreeAccountClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.createFreeAccount();
  }

  renderShortcuts(accountData, gateways) {
    const detailsLink = `${config.operatorUrl}blockexplorer/accounts/${accountData.address}`;
    const amount = accountData.balance ? formatAdsMoney(accountData.balance, 4) : null;
    // const amountInt = amount ? amount.substr(0, amount.indexOf('.')) : '---';
    const amountInt = amount ? amount.slice(0, amount.indexOf('.')) : '---';
    // const amountDec = amount ? amount.substr(amount.indexOf('.')) : '';
    const amountDec = amount ? amount.slice(amount.indexOf('.')) : '';
    const hasGateways = gateways && gateways.length > 0;
    const usdRate = this.props.adsOperatorApi.currencyCourses.usdRate;
    const amountInUsd = calculateToUsd(accountData.balance, usdRate);
    return (
      <div className={style.darkCard}>
        <h5 title="Account name">{accountData.name}&nbsp;</h5>
        <div className={style.balance} title="Account balance">
          {amountInt}
          <span>{amountDec}</span>
          &nbsp;
          <small>ADS</small>
        </div>
        <div className={style.currency}>
          <span>{(accountData.balance && usdRate) ? amountInUsd : '$---'}</span>
        </div>
        {config.testnet && <small>
          {/*{config.testnet && <small className={style.freeCoins}>*/}
          <a href={config.freeCoinsUrl} target="_blank" rel="noopener noreferrer">
            How to get test coins?
          </a>
        </small>}
        <hr />
        <div className={style.details}>
          <span title="Copy account address" onClick={() => copyToClipboard(accountData.address)}>
            {accountData.address}&nbsp;&nbsp;
            <FontAwesomeIcon icon={faCopy} />
          </span>
          <a href={detailsLink} target="_blank" rel="noopener noreferrer">
            <span>Details</span>
          </a>
        </div>
        <div className={style.buttons}>
          <ButtonLink to="/transactions/send_one" layout="secondary">
            <FontAwesomeIcon icon={faPaperPlane} /> Send ADS
          </ButtonLink>
          <ButtonLink to="/transactions/gateways" layout="secondary" disabled={!hasGateways}>
            <FontAwesomeIcon icon={faRandom} /> Wrap
          </ButtonLink>
        </div>
      </div>
    );
  }

  renderConfigure() {
    const {
      mainPage: {
        isSubmitted,
        errorMsg,
      }
    } = this.props;
    return (
      <div className={style.configure}>
        <Box icon={'!'} layout="warning" className={style.boxConfigure}>
          You can use this plugin to sign ADS Operator&apos;s transactions.<br />
          If you want to send transactions directly, you have to import an account first.
        </Box>
        {errorMsg && <Box title="Error" layout="warning" icon={faExclamation}>
          {errorMsg}
        </Box>}
        <Button
          onClick={this.handleFreeAccountClick}
          size="wide"
          layout="primary"
          disabled={isSubmitted}
          className={style.btnFreeAccoountconfigure}
        >
          Get free account
        </Button>
        <ButtonLink
          to={{
            pathname: '/settings/accounts/import',
            state: { referrer: this.props.history.location }
          }}
          size="wide"
          layout="secondary"
          disabled={isSubmitted}
        >
          Import account
        </ButtonLink>
      </div>
    );
  }

  render() {
    const { vault, queue, mainPage, settingsPage } = this.props;
    const filteredQueue = queue.filter(t =>
      !!config.testnet === !!t.testnet &&
      (t.type === types.MSG_SIGN || t.type === types.MSG_AUTHENTICATE)
    );
    const { selectedAccount, accounts, gateways } = vault;
    const accountData = accounts.find(account => account.address === selectedAccount);

    return (
      <Page
        className={style.page}
        homeLink={false}
        showLoader={mainPage.isSubmitted || settingsPage.isSubmitted}
      >
        {filteredQueue.length > 0 ?
          <ButtonLink to="/transactions/pending" layout="success" size="wide">
            Pending transactions ({filteredQueue.length})
          </ButtonLink> : ''}
        {accountData ? this.renderShortcuts(accountData, gateways) : this.renderConfigure()}
      </Page>
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    queue: state.queue,
    mainPage: state.pages[CREATE_FREE_ACCOUNT],
    settingsPage: state.pages[SETTINGS],
    adsOperatorApi: state.adsOperatorApi,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        createFreeAccount,
        cleanForm,
      },
      dispatch
    )
  })
)(HomePage));

/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfo,
  faPlus,
  faPaperPlane,
  faCopy,
  faGlobe,
  faSignature,
  faStar,
  faExclamation,
  faRandom,
} from '@fortawesome/free-solid-svg-icons';
import { CREATE_FREE_ACCOUNT, SETTINGS, createFreeAccount } from '../../actions/settingsActions';
import { cleanForm } from '../../actions/formActions';
import Page from '../../components/Page/Page';
import ButtonLink from '../../components/atoms/ButtonLink';
import Button from '../../components/atoms/Button';
import Box from '../../components/atoms/Box';
import Logo from '../../components/Logo/Logo';
import { formatAdsMoney, calculateToUsd } from '../../utils/ads';
import style from './HomePage.module.css';
import config from '../../config/config';
import * as types from '../../constants/MessageTypes';
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
    const amountInt = amount ? amount.substr(0, amount.indexOf('.')) : '---';
    const amountDec = amount ? amount.substr(amount.indexOf('.')) : '';
    const hasGateways = gateways && gateways.length > 0;
    const usdRate = this.props.adsOperatorApi.currencyCourses.usdRate;
    const amountInUsd = calculateToUsd(accountData.balance, usdRate);
    return (
      <div>
        <Box className={style.box} icon={faGlobe} layout="info">
          <small title="Account name">{accountData.name}&nbsp;</small>
          <div className={style.balance} title="Account balance">
            {amountInt}
            <small>{amountDec}</small>
            &nbsp;
            <small>ADS</small>
          </div>
          <div className={style.currency}>
            <small>{(accountData.balance && usdRate) ? amountInUsd : '$---'}</small>
          </div>
          {config.testnet && <small className={style.frreCoins}>
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
              Details
            </a>
          </div>
          <ButtonLink to="/transactions/send_one" layout="contrast" size="wide7" icon="left">
            <FontAwesomeIcon icon={faPaperPlane} /> Send ADS
          </ButtonLink>
          <ButtonLink to="/transactions/gateways" layout="contrast" size="wide3" icon="left" disabled={!hasGateways}>
            <FontAwesomeIcon icon={faRandom} /> Wrap
          </ButtonLink>

        </Box>
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
        <Logo withoutLogo />
        <Box icon={faInfo} inverse layout="warning">
          You can use this plugin to sign ADS Operator&apos;s transactions.<br />
          If You want to send transactions directly, You have to import an account first.
        </Box>
        {errorMsg && <Box title="Error" layout="danger" icon={faExclamation}>
          {errorMsg}
        </Box>}
        <Button
          onClick={this.handleFreeAccountClick}
          size="wide"
          icon="left"
          layout="success"
          disabled={isSubmitted}
        >
          <FontAwesomeIcon icon={faStar} /> Get free account
        </Button>
        <ButtonLink
          to={{
            pathname: '/settings/accounts/import',
            state: { referrer: this.props.history.location }
          }}
          size="wide"
          icon="left"
          layout="info"
          disabled={isSubmitted}
        >
          <FontAwesomeIcon icon={faPlus} /> Import account
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
          <ButtonLink to="/transactions/pending" layout="success" size="wide" icon="left">
            <FontAwesomeIcon icon={faSignature} /> Pending transactions ({filteredQueue.length})
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

import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfo,
  faPlus,
  faPaperPlane,
  faCopy,
  faGlobe,
  faSignature,
} from '@fortawesome/free-solid-svg-icons';
import Page from '../../components/Page/Page';
import ButtonLink from '../../components/atoms/ButtonLink';
import Box from '../../components/atoms/Box';
import Logo from '../../components/Logo/Logo';
import { formatAdsMoney } from '../../utils/ads';
import style from './HomePage.css';
import config from '../../config/config';

export default class HomePage extends React.PureComponent {
  renderShortcuts() {
    const account = this.props.vault.accounts[0];
    const detailsLink = `${config.operatorUrl}blockexplorer/accounts/${account.address}`;
    const amount = account.balance ? formatAdsMoney(account.balance, 4, '.', ' ') : null;
    const amountInt = amount ? amount.substr(0, amount.indexOf('.')) : '---';
    const amountDec = amount ? amount.substr(amount.indexOf('.')) : '';
    return (
      <div>
        <Box className={style.box} icon={faGlobe} layout="info">
          <small title="Account name">{account.name}</small>
          <div className={style.balance} title="Account balance">
            {amountInt}<small>{amountDec}</small>&nbsp;
            <small>ADS</small>
          </div>
          <hr />
          <div className={style.details}>
            <span title="Account address">
              {account.address}&nbsp;&nbsp;
              <FontAwesomeIcon icon={faCopy} />
            </span>
            <a href={detailsLink} target="_blank" rel="noopener noreferrer">
              Details
            </a>
          </div>
          <ButtonLink to="/transactions/sendOne" layout="contrast" size="wide" icon="left">
            <FontAwesomeIcon icon={faPaperPlane} /> Send transaction
          </ButtonLink>

        </Box>
      </div>
    );
  }

  renderConfigure() {
    return (
      <div className={style.configure}>
        <Logo withoutLogo />
        <Box icon={faInfo} inverse layout="warning">
          You can use this plugin to sign ADS Operator&apos;s transactions.<br />
          If You want to send transactions directly, You have to import an account first.
        </Box>
        <ButtonLink to="/accounts/import" size="wide" icon="left" layout="info">
          <FontAwesomeIcon icon={faPlus} /> Add account
        </ButtonLink>
        <div className={style.helpLinks}>
          <a href={config.getAccountLink} target="_blank" rel="noopener noreferrer">
            How to get an ADS account?
          </a>
        </div>
      </div>
    );
  }

  render() {
    const { vault } = this.props;
    const configured = vault.accounts.length > 0;
    const queue = this.props.queue.filter(t =>
      (!config.testnet || t.testnet) &&
      t.type === 'sign'
    );

    return (
      <Page>
        { queue.length > 0 ?
          <ButtonLink to="/transactions/awaiting" layout="success" size="wide" icon="left">
            <FontAwesomeIcon icon={faSignature} /> Awaiting transactions ({queue.length})
          </ButtonLink> : '' }
        {configured > 0 ? this.renderShortcuts() : this.renderConfigure()}
      </Page>
    );
  }
}

HomePage.propTypes = {
  vault: PropTypes.object.isRequired,
  queue: PropTypes.array.isRequired,
};

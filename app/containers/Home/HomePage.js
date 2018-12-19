import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfo,
  faPlus,
  faPaperPlane,
  faCopy,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import Page from '../../components/Page/Page';
import ButtonLink from '../../components/atoms/ButtonLink';
import Box from '../../components/atoms/Box';
import Logo from '../../components/Logo/Logo';
import { formatMoney } from '../../utils/utils';
import style from './HomePage.css';
import config from '../../config';

export default class HomePage extends React.PureComponent {
  renderShortcuts() {
    const account = this.props.vault.accounts[0];
    const detailsLink = `${config.operatorUrl}blockexplorer\\accounts\\${account.address}`;
    const amount = account.balance ? formatMoney(account.balance, 4, '.', ' ') : null;
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
    const configured = this.props.vault.accounts.length > 0;
    const title = configured ? null : 'Adshares';
    return (
      <Page>
        {configured > 0 ? this.renderShortcuts() : this.renderConfigure()}
      </Page>
    );
  }
}

HomePage.propTypes = {
  vault: PropTypes.object.isRequired,
};

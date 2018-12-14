import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faPlus, faArrowRight, faExpandArrowsAlt, faBullhorn, faList, faCopy } from '@fortawesome/free-solid-svg-icons';
import Page from '../../components/Page/Page';
import ButtonLink from '../../components/atoms/ButtonLink';
import Box from '../../components/atoms/Box';
import Logo from '../../components/Logo/Logo';
import style from './HomePage.css';
import config from '../../config';

export default class HomePage extends React.PureComponent {

  renderShortcuts() {
    const account = this.props.vault.accounts[0];
    const detailsLink = `${config.operatorUrl}blockexplorer\\accounts\\${account.address}`;

    return (
      <div>
        <Box inverse className={style.box}>
          <div className={style.balance}>
            9 999<small>.9999</small>&nbsp;
            <small>ADS</small>
          </div>
          <hr />
          <div className={style.details}>
            <span>
              {account.address}&nbsp;&nbsp;
              <FontAwesomeIcon icon={faCopy} />
            </span>
            <br />
            <a href={detailsLink} target="_blank" rel="noopener noreferrer">
              View details
            </a>
          </div>
        </Box>
        <div className={style.shortcuts}>
          <ButtonLink to="/transactions/sendOne" layout="success" size="wide" icon="left">
            <FontAwesomeIcon icon={faArrowRight} /> Send transaction
          </ButtonLink>
          <ButtonLink to="/transactions/sendMany" size="wide" icon="left">
            <FontAwesomeIcon icon={faExpandArrowsAlt} /> Send multi-transaction
          </ButtonLink>
          <ButtonLink to="/transactions/broadcast" layout="warning" size="wide" icon="left" inverse>
            <FontAwesomeIcon icon={faBullhorn} /> Send broadcast
          </ButtonLink>
          <ButtonLink to="/transactions" size="wide" icon="left" inverse>
            <FontAwesomeIcon icon={faList} /> More
          </ButtonLink>
        </div>
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
        <ButtonLink to="/accounts/import" size="wide" icon="left">
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

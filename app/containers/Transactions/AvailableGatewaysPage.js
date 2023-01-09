import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { faExclamation, faRandom } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './style.css';
import Page from '../../components/Page/Page';
import Box from '../../components/atoms/Box';
import ButtonLink from '../../components/atoms/ButtonLink';
import PageComponent from '../../components/PageComponent';
import config from '../../config/config';

class AvailableGatewaysPage extends PageComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    vault: PropTypes.object.isRequired,
  }

  renderGateways(gateways) {
    if (gateways.length === 0) {
      return (
        <Box title="Server error" layout="warning" icon={faExclamation}>
          No gateways found
        </Box>
      );
    }

    return (
      <div className={style.availableLinks}>
        {gateways.map(gateway =>
          <ButtonLink
            key={gateway.code}
            icon="left"
            layout="secondary"
            inverse
            size="wide"
            to={{
              pathname: `/transactions/gateways/${gateway.code}`,
              state: { referrer: this.props.history.location }
            }}
          >
            <FontAwesomeIcon icon={faRandom} /> {gateway.name}
          </ButtonLink>
        )}
        <ButtonLink
          className={style.unwrap}
          icon="left"
          layout="primary"
          external
          size="wide"
          target="_blank"
          rel="noopener noreferrer"
          href={config.unwrapUrl}
        >
          <FontAwesomeIcon icon={faRandom} /> Unwrap
        </ButtonLink>
      </div>
    );
  }

  render() {
    const { vault } = this.props;

    return (
      <Page
        className={style.page}
        title="Wrapped ADS gateways"
        cancelLink={this.getReferrer()}
        onCancelClick={this.handleCloseForm}
        hideSelectAccount
      >
        {this.renderGateways(vault.gateways || [])}
      </Page>
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault
  })
)(AvailableGatewaysPage));

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

class AvailableGatesPage extends PageComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    vault: PropTypes.object.isRequired,
  }

  renderGates(gates) {
    if (gates.length === 0) {
      return (
        <Box title="Server error" layout="warning" icon={faExclamation}>
          No gates found
        </Box>
      );
    }

    return (
      <div className={style.availableLinks}>
        {gates.map(gate =>
          <ButtonLink
            key={gate.code}
            icon="left" layout="info" inverse
            to={{
              pathname: `/transactions/gates/${gate.code}`,
              state: { referrer: this.props.history.location }
            }}
          >
            <FontAwesomeIcon icon={faRandom} /> {gate.name}
          </ButtonLink>
        )}
      </div>
    );
  }

  render() {
    const { vault } = this.props;

    return (
      <Page
        className={style.page}
        title="ADS gates"
        cancelLink={this.getReferrer()}
        onCancelClick={this.handleCloseForm}
      >
        {this.renderGates(vault.gates || [])}
      </Page>
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault
  })
)(AvailableGatesPage));

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faPaperPlane,
  faBullhorn,
  // faUserPlus,
  // faPlusSquare,
  // faKey,
  // faShieldAlt,
  // faRetweet,
} from '@fortawesome/free-solid-svg-icons';
import PageComponent from '../../components/PageComponent';
import Page from '../../components/Page/Page';
import ButtonLink from '../../components/atoms/ButtonLink';
import { typeLabels } from './labels';
import style from './style.css';


class AvailableTransactionsPage extends PageComponent {

  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Page
        title="Transactions"
        cancelLink={this.getReferrer()}
      >
        <div className={style.availableLinks}>
          <ButtonLink to="/transactions/send-one" icon="left" layout="info" inverse>
            <FontAwesomeIcon icon={faPaperPlane} /> {typeLabels.send_one}
          </ButtonLink>
          <ButtonLink to="/transactions/broadcast" icon="left" layout="info" inverse>
            <FontAwesomeIcon icon={faBullhorn} /> {typeLabels.broadcast}
          </ButtonLink>
          {/*<ButtonLink to="/transactions/create-account" icon="left" inverse>
            <FontAwesomeIcon icon={faUserPlus} /> {typeLabels.create_account}
          </ButtonLink>
          <ButtonLink to="/transactions/create-node" icon="left" inverse>
            <FontAwesomeIcon icon={faPlusSquare} /> {typeLabels.create_node}
          </ButtonLink>
          <ButtonLink to="/transactions/change-account-key" icon="left" layout="warning" inverse>
            <FontAwesomeIcon icon={faKey} /> {typeLabels.change_account_key}
          </ButtonLink>
          <ButtonLink to="/transactions/change-node-key" icon="left" layout="warning" inverse>
            <FontAwesomeIcon icon={faShieldAlt} /> {typeLabels.change_node_key}
          </ButtonLink>
          <ButtonLink to="/transactions/retrieve-funds" icon="left" layout="danger" inverse>
            <FontAwesomeIcon icon={faRetweet} /> {typeLabels.retrieve_funds}
          </ButtonLink>*/}
        </div>
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

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faCheck, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import PageComponent from '../../components/PageComponent';
import Page from '../../components/Page/Page';
import ErrorPage from '../ErrorPage';
import ButtonLink from '../../components/atoms/ButtonLink';
import Box from '../../components/atoms/Box';
import ADS from '../../utils/ads';
import { TransactionDataError } from '../../actions/errors';
import { formatDate } from '../../utils/utils';
import { typeLabels } from './labels';
import config from '../../config/config';
import * as types from '../../../app/constants/MessageTypes';
import style from './style.css';

class PendingTransactionsPage extends PageComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    queue: PropTypes.array.isRequired,
  };

  renderErrorPage(code, message, title) {
    return (
      <ErrorPage
        code={code}
        message={message}
        title={title}
        cancelLink={this.getReferrer()}
      />
    );
  }

  renderItem(item) {
    let type;

    if (item.type === types.MSG_SIGN) {
      if (!item.data || !item.data.data) {
        return this.renderErrorPage(400, 'Malformed transaction data');
      }
      try {
        const command = ADS.decodeCommand(item.data.data);
        type = command.type;
      } catch (err) {
        if (err instanceof TransactionDataError) {
          return this.renderErrorPage(400, 'Malformed transaction data');
        }
        throw err;
      }
    } else {
      type = item.type;
    }

    return (
      <div key={item.id}>
        <b>{typeLabels[type]}</b>
        <span title={formatDate(item.time, true, true)}>{formatDate(item.time)}</span>
        <i>#{item.id}</i>
        <ButtonLink
          layout="info"
          size="wide"
          icon="left"
          to={{
            pathname: `/transactions/${item.sourceId}/${item.id}/sign`,
            state: { referrer: this.props.history.location }
          }}
        ><FontAwesomeIcon icon={faList} /> Details</ButtonLink>
      </div>
    );
  }

  render() {
    const queue = this.props.queue.filter(t =>
      !!config.testnet === !!t.testnet &&
      (t.type === types.MSG_SIGN || t.type === types.MSG_AUTHENTICATE)
    );

    return (
      <Page
        className={style.pendingPage}
        title="Pending Transactions"
        scroll={queue.length > 3}
        cancelLink={this.getReferrer()}
      >
        {queue.length === 0 ?
          <React.Fragment>
            <Box
              layout="success"
              title="All right!"
              icon={faCheck}
            >
              There are no pending transactions
            </Box>
            <ButtonLink to={this.getReferrer()} size="wide" icon="left" layout="info">
              <FontAwesomeIcon icon={faChevronLeft} /> Back
            </ButtonLink>
          </React.Fragment> :
          <React.Fragment>
            {queue.map(item => this.renderItem(item))}
          </React.Fragment>
        }
      </Page>
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    queue: state.queue,
  })
)(PendingTransactionsPage));

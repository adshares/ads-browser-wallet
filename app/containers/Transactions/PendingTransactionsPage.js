import React from 'react';
import PropTypes from 'prop-types';
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
import style from './PendingTransactionsPage.css';

export default class PendingTransactionsPage extends PageComponent {

  renderErrorPage(code, message) {
    return (
      <ErrorPage
        code={code}
        message={message}
        cancelLink={this.getReferrer()}
      />
    );
  }

  renderItem(item) {
    let command;
    if (!item.data || !item.data.data) {
      return this.renderErrorPage(400, 'Malformed transaction data');
    }
    try {
      command = ADS.decodeCommand(item.data.data);
    } catch (err) {
      if (err instanceof TransactionDataError) {
        return this.renderErrorPage(400, 'Malformed transaction data');
      }
      throw err;
    }

    return (
      <div key={item.id}>
        <b>{typeLabels[command.type]}</b>
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
      t.type === 'sign'
    );

    return (
      <Page className={style.page} title="Pending Transactions" scroll={queue.length > 3} cancelLink={this.getReferrer()}>
        {queue.length === 0 ?
          <React.Fragment>
            <Box layout="success" title="All right!" icon={faCheck}>
              There are no pending transactions
            </Box>
            <ButtonLink to="/" size="wide" icon="left" layout="info">
              <FontAwesomeIcon icon={faChevronLeft} />Back
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

PendingTransactionsPage.propTypes = {
  history: PropTypes.object.isRequired,
  queue: PropTypes.array.isRequired,
};

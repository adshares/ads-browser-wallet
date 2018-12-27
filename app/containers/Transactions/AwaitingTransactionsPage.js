import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons/index'
import Page from '../../components/Page/Page';
import ErrorPage from '../ErrorPage';
import ButtonLink from '../../components/atoms/ButtonLink';
import ADS from '../../utils/ads';
import { TransactionDataError } from '../../actions/errors';
import { formatDate } from '../../utils/utils';
import { typeLabels } from './labels';
import config from '../../config/config';
import style from './AwaitingTransactionsPage.css';

export default class AwaitingTransactionsPage extends React.PureComponent {

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
            state: { referrer: this.props.location }
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
      <Page className={style.page} title="Awaiting Transactions" scroll cancelLink="/">
        Awaiting [<b>{queue.length}</b>]:
        {queue.map(item => this.renderItem(item))}
      </Page>
    );
  }
}

AwaitingTransactionsPage.propTypes = {
  location: PropTypes.object.isRequired,
  queue: PropTypes.array.isRequired,
};

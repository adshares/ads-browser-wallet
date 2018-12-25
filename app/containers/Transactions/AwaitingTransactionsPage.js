import React from 'react';
import PropTypes from 'prop-types';
import Page from '../../components/Page/Page';
import ButtonLink from '../../components/atoms/ButtonLink';
import config from '../../config/config';
import style from './AwaitingTransactionsPage.css';

export default class AwaitingTransactionsPage extends React.PureComponent {
  render() {
    const queue = this.props.queue.filter(t =>
      !!config.testnet === !!t.testnet &&
      t.type === 'sign'
    );

    return (
      <Page className={style.page} title="Awaiting Transactions" scroll cancelLink="/">
        Awaiting [<b>{queue.length}</b>]:
        {queue.map((item, index) =>
          <div key={index}>
            <hr />
            {item.time}<br />
            {item.sourceId}<br />
            {item.id}<br />
            <ButtonLink
              to={{
                pathname: `/transactions/${item.sourceId}/${item.id}/sign`,
                state: { referrer: this.props.location }
              }}
            >Sign</ButtonLink>
          </div>
        )}
      </Page>
    );
  }
}

AwaitingTransactionsPage.propTypes = {
  location: PropTypes.object.isRequired,
  queue: PropTypes.array.isRequired,
};

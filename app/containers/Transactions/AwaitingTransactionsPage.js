import React from 'react';
import PropTypes from 'prop-types';
import Page from '../../components/Page/Page';
import style from './AwaitingTransactionsPage.css';

export default class AwaitingTransactionsPage extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     queue: [],
  //   };
  //   getQueue((queue) => {
  //     this.setState({ queue });
  //   });
  //
  //   chrome.storage.onChanged.addListener((changes, namespace) => {
  //     for (const key in changes) {
  //       const storageChange = changes[key];
  //       console.log('Storage key "%s" in namespace "%s" changed. ' +
  //         'Old value was "%s", new value is "%s".',
  //         key,
  //         namespace,
  //         storageChange.oldValue,
  //         storageChange.newValue);
  //     }
  //   });
  // }

  render() {
    const { queue } = this.props;

    return (
      <Page className={style.page} title="Awaiting Transactions" scroll cancelLink="/">
        Awaiting [<b>{queue.length}</b>]
      </Page>
    );
  }
}

AwaitingTransactionsPage.propTypes = {
  queue: PropTypes.array.isRequired,
};

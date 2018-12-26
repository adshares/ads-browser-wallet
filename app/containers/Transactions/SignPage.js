import React from 'react';
import PropTypes from 'prop-types';
import PageComponent from '../../components/PageComponent';
import SignForm from './SignForm';
import BgClient from '../../utils/background';
import config from '../../config/config';

export default class SignPage extends PageComponent {
  constructor(props) {
    super(props);

    const { action, source, id } = this.props.match.params;
    console.debug(config, this.props.queue);
    const message = this.props.queue.find(t =>
      !!config.testnet === !!t.testnet &&
      t.type === 'sign' &&
      t.sourceId === source &&
      t.id === id
    );

    this.state = {
      source,
      id,
      message,
      popup: action === 'popup-sign',
      isSubmitted: false,
    };
  }

  sendResponse = (status, signature) => {
    BgClient.sendResponse(
      this.state.message.sourceId,
      this.state.message.id,
      { status, signature },
    );
    if (this.state.popup) {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.remove(tab.id);
      });
    } else {
      this.props.history.push(this.getReferrer());
    }
  }

  handleAccept = (signature) => {
    this.setState({
      isSubmitted: true
    }, () => {
      this.sendResponse('accepted', signature);
    });
  }

  handleReject = () => {
    this.setState({
      isSubmitted: true
    }, () => {
      this.sendResponse('rejected');
    });
  }

  render() {
    const { message, id } = this.state;
    if (!message) {
      return this.renderErrorPage(404, `Cannot find message ${id}`);
    }
    return (
      <SignForm
        transaction={message.data}
        acceptAction={this.handleAccept}
        rejectAction={this.handleReject}
        cancelLink={this.getReferrer()}
        noLinks={this.state.popup}
        loading={this.state.isSubmitted}
      />
    );
  }
}

SignPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  queue: PropTypes.array.isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PageComponent from '../../components/PageComponent';
import AuthenticateForm from './AuthenticateForm';
import SignForm from './SignForm';
import BgClient from '../../utils/background';
import * as types from '../../constants/MessageTypes';
import config from '../../config/config';

class SignTransactionPage extends PageComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    vault: PropTypes.object.isRequired,
    queue: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    const { action, source, id } = this.props.match.params;
    const message = this.props.queue.find(t =>
      !!config.testnet === !!t.testnet &&
      (t.type === types.MSG_AUTHENTICATE || t.type === types.MSG_SIGN) &&
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

  sendResponse = (status, data) => {
    BgClient.sendResponse(
      this.state.message.sourceId,
      this.state.message.id,
      { status, testnet: config.testnet, ...data },
    ).then(() => {
      this.props.history.push(this.getReferrer());
      if (this.state.popup) {
        chrome.tabs.getCurrent((tab) => {
          chrome.tabs.remove(tab.id);
        });
      }
    });
  }

  handleAccept = (data) => {
    this.setState({
      isSubmitted: true
    }, () => {
      this.sendResponse('accepted', data);
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
    const isAuth = message.type === types.MSG_AUTHENTICATE;
    const form = isAuth ? AuthenticateForm : SignForm;
    return React.createElement(form,
      {
        transaction: message.data,
        vault: this.props.vault,
        acceptAction: this.handleAccept,
        rejectAction: this.handleReject,
        cancelAction: this.handleReject,
        cancelLink: this.getReferrer(),
        noLinks: this.state.popup,
        showLoader: this.state.isSubmitted,
        history: this.props.history,
        showTitle: !isAuth,
        showDoc: !isAuth,
      }
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    queue: state.queue,
  })
)(SignTransactionPage));

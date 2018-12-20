import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Page from '../components/Page/Page';
import Box from '../components/atoms/Box';
import ButtonLink from '../components/atoms/ButtonLink';

export default class ErrorPage extends React.PureComponent {

  render() {
    const code = this.props.code || 100;
    const message = this.props.message || 'Unknown Error';
    const cancelLink = this.props.cancelLink || '/';

    return (
      <Page cancelLink={cancelLink} title={`Error ${code}`}>
        <Box title={`Error ${code}`} layout="warning" icon={faExclamation}>
          {message}
        </Box>
        {this.props.children}
        <ButtonLink to={cancelLink} size="wide" layout="info" icon="left">
          <FontAwesomeIcon icon={faChevronLeft} /> Back
        </ButtonLink>
      </Page>
    );
  }
}

ErrorPage.propTypes = {
  message: PropTypes.string,
  code: PropTypes.number,
  children: PropTypes.object,
  cancelLink: PropTypes.any,
};

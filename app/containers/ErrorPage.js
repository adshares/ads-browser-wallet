import React from 'react';
import PropTypes from 'prop-types';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import Box from '../components/atoms/Box';
import ButtonLink from '../components/atoms/ButtonLink';

export default class ErrorPage extends React.PureComponent {

  render() {
    const code = this.props.code || 100;
    const message = this.props.message || 'Unknown Error';

    return (
      <div style={{ margin: '40px 15px' }}>
        <Box title={`Error ${code}`} layout="warning" icon={faExclamation}>
            {message}
        </Box>
        {this.props.children}
        <ButtonLink to={'/'} size="wide" layout="info">Home page</ButtonLink>
      </div>
    );
  }
}

ErrorPage.propTypes = {
  message: PropTypes.string,
  code: PropTypes.number,
  children: PropTypes.object,
};

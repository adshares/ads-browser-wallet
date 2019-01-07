import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
  faPlus,
  faPencilAlt,
  faKey,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/atoms/Button';
import ButtonLink from '../../components/atoms/ButtonLink';
import style from './SettingsList.css';

export const SettingsList = ({
                               title,
                               keyTitle,
                               keys,
                               path,
                               showTitle,
                               removeAction,
                               createActionDesc,
                               createAction,
                               createActionPath
                             }) => {
  const editButton = (<ButtonLink
    to={{
      pathname: `${path}/edit`,
      state: { referrer: this.props.history.location }
    }}
    size="small"
    title={`Edit ${keyTitle}`}
    layout="info"
  ><FontAwesomeIcon icon={faPencilAlt} /></ButtonLink>);

  return (
    <div className={style.section}>
      <h3>{title}</h3>

      {keys.length > 0 &&
      <ul className={style.accounts}>
        {keys.map((key, index) =>
          <li key={index}>
            <span className={style.accountLabel}>
              <small>{key.name}</small>
              {key.address && (
                <span>{key.address}</span>
              )}
            </span>
            <span className={style.accountActions}>
              {editButton}
              <ButtonLink
                to={{
                  pathname: `${path}/keys`,
                  state: { referrer: this.props.history.location }
                }}
                size="small"
                layout="warning"
                title={showTitle}
              ><FontAwesomeIcon icon={faKey} /></ButtonLink>
              <Button
                onClick={removeAction}
                size="small"
                layout="danger"
                title={`Delete ${keyTitle}`}
              ><FontAwesomeIcon icon={faTrashAlt} /></Button>
            </span>
          </li>
        )}
      </ul>
      }

      {type === 'imported' ? (
        <ButtonLink
          to={{
            pathname: createActionPath,
            state: { referrer: this.props.history.location }
          }}
          icon="left"
          size="wide"
          layout="info"
        >
          <FontAwesomeIcon icon={faPlus} /> {createActionDesc}
        </ButtonLink>
      ) : <Button
        onClick={createAction}
        icon="left"
        size="wide"
        layout="info"
      >
        <FontAwesomeIcon icon={faPlus} /> {createActionDesc}
      </Button>

      }

    </div>
  );
};


SettingsList.propTypes = {
  title: PropTypes.string.isRequired,
  keyTitle: PropTypes.any,
  name: PropTypes.any,
  address: PropTypes.any,
  publicKey: PropTypes.any,
  keys: PropTypes.any,
  path: PropTypes.any,
  showTitle: PropTypes.any,
  removeAction: PropTypes.any,
  createAction: PropTypes.any,
  createActionPath: PropTypes.any,
  createActionDesc: PropTypes.string,
};

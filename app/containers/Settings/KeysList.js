import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
  faPlus,
  faKey,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/atoms/Button';
import ButtonLink from '../../components/atoms/ButtonLink';
import style from './SettingsPage.css';

export const KeysList = ({
                               keys,
                               removeAction,
                               createActionDesc,
                               createAction,
                               createActionPath,
                               location,
                               type
                             }) => {
  const filteredKeys = keys.filter(key => key.type === type)
  return (
    <div className={style.section}>
      <h3>{type} keys</h3>

      {filteredKeys.length > 0 &&
      <ul className={style.accounts}>
        {filteredKeys.map((key, index) =>
          <li key={index} className={style.list}>
            <span className={style.accountLabel}>
              <small>{key.name}</small>
              <span>{key.publicKey.slice(0, 16)}</span>
            </span>
            <span className={style.accountActions}>
              <ButtonLink
                to={{
                  pathname: `keys/${key.publicKey}`,
                  state: { referrer: location }
                }}
                size="small"
                layout="warning"
                title="Show keys"
              ><FontAwesomeIcon icon={faKey}/></ButtonLink>
              <Button
                onClick={removeAction}
                size="small"
                layout="danger"
                title="Delete key"
              ><FontAwesomeIcon icon={faTrashAlt}/></Button>
            </span>
          </li>
        )}
      </ul>
      }

      {type === 'imported' ? (
          <ButtonLink
            to={{
              pathname: createActionPath,
              state: { referrer: location }
            }}
            icon="left"
            size="wide"
            layout="info"
          >
            <FontAwesomeIcon icon={faPlus}/> Generate 5 new key pairs
          </ButtonLink>
        ) :
        <Button
          onClick={createAction}
          icon="left"
          size="wide"
          layout="info"
        >
          <FontAwesomeIcon icon={faPlus}/> Generate 5 new key pairs
        </Button>
      }

    </div>
  );
};


KeysList.propTypes = {
  type: PropTypes.string.isRequired,
  keys: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  removeAction: PropTypes.any,
  createAction: PropTypes.any,
  createActionPath: PropTypes.any,
  createActionDesc: PropTypes.string,
};

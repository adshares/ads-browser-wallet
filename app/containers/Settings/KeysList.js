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
import { getPublicKeyFromSecret } from './../../utils/keybox';

export const KeysList = ({
                           keys,
                           removeAction,
                           createAction,
                           location,
                           type
                         }) => {
  const filteredKeys = keys.filter(key => key.type === type)
    .map((k) => {
      if (!k.hasOwnProperty('publicKey')) {
        k.publicKey = getPublicKeyFromSecret(k.secretKey);
      }
      return k;
    });

  return (
    <div className={style.section}>
      <h3>{type === 'imported' ? 'Imported' : 'Generated'} keys</h3>

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
              {type === 'imported' && (
                <Button
                  onClick={() => removeAction(key.secretKey)}
                  size="small"
                  layout="danger"
                  title="Delete key"
                ><FontAwesomeIcon icon={faTrashAlt}/></Button>
              )}
            </span>
          </li>
        )}
      </ul>
      }

      {type === 'imported' ? (
          <ButtonLink
            to={{
              pathname: '/keys/import',
              state: { referrer: location }
            }}
            icon="left"
            size="wide"
            layout="info"
          >
            <FontAwesomeIcon icon={faPlus}/> Import key
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
};

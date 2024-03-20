import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { formatAdsMoney } from '../../utils/ads';
import style from './SelectAccount.module.css';

export default class SelectAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showOptions: false,
    };
  }

  setActiveOption(option) {
    this.props.selectAccount(option);
  }

  toggleShowOptions(state) {
    this.setState({
      showOptions: state
    });
  }

  render() {
    if (this.props.options.length === 0) {
      return <div />;
    }
    const { showOptions } = this.state;
    const { selectedAccount, options } = this.props;
    const activeOption = options.find(account => account.address === selectedAccount);
    const results = !!options.length && options.map((option, index) => {
      if (option.address !== selectedAccount) {
        return (
          <li
            tabIndex="0"
            key={index} className={style.option} data-value={option.address}
            onClick={() => this.setActiveOption(option.address)}
          >
            <span className={style.optionName}>{option.name ? option.name : option.address }</span>
            {option.name && (<span className={style.optionAccount}>{option.address}</span>)}
            <span className={style.optionBalance}>
              {formatAdsMoney(option.balance, 4, true)} ADS
            </span>
          </li>
        );
      }
      return null;
    }
    );

    return (
      <div
        className={`${style.select} ${showOptions && style.selectActive}`}
        onMouseLeave={() => this.toggleShowOptions(false)}
      >
        {activeOption && (<div
          tabIndex="0"
          role="button"
          className={`${style.option} ${style.optionActive}`}
          onClick={() => this.toggleShowOptions(!showOptions)}
          onKeyDown={() => this.toggleShowOptions(true)}
        >
          <span className={style.optionName}>
            {activeOption.name ? activeOption.name : activeOption.address}
          </span>
          <span className={style.optionAccount}>
            {activeOption.name ? activeOption.address : ''}
            <FontAwesomeIcon icon={showOptions ? faChevronUp : faChevronDown} />
          </span>
        </div>)}

        <ul className={`${style.optionList} ${showOptions && style.optionListActive}`}>
          <div className={style.scrollableList}>
            {showOptions && results}
          </div>
          {showOptions && (
            <li className={`${style.option} ${style.optionAdd}`}>
              <Link
                onBlur={() => this.toggleShowOptions(false)}
                className={style.optionLink}
                to="/settings/accounts/import"
              >
                Add account
                <FontAwesomeIcon icon={faPlus} className={style.optionIcon} />
              </Link>
            </li>)}
        </ul>
      </div>
    );
  }
}

SelectAccount.propTypes = {
  options: PropTypes.array.isRequired,
  selectAccount: PropTypes.func,
  selectedAccount: PropTypes.string,
};

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/es/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import style from './SelectAccount.css';

export default class SelectAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showOptions: false,
    };
  }

  componentDidMount() {
    this.setActiveOption(this.props.options[0]);
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
    const { activeOption, showOptions } = this.state;

    const options = this.props.options.map((option, index) => {
      if (option.address !== this.state.selectedAccount) {
        return (
          <li
            tabIndex="0"
            key={index} className={style.option} data-value={option.address}
            onClick={() => this.setActiveOption(option)}
          >
            <span className={style.optionName}> {option.name} </span>
            <span className={style.optionAccount}> {option.address} </span>
          </li>
        );
      }
    }
    );

    return (
      <div
        className={`${style.select} ${showOptions && style.selectActive}`}
        onMouseLeave={() => this.toggleShowOptions(false)}
      >
        <div
          tabIndex="0"
          role="button"
          className={`${style.option} ${style.optionActive}`}
          onClick={() => this.toggleShowOptions(!showOptions)}
          onKeyDown={() => this.toggleShowOptions(true)}
        >
          <span className={style.optionName}> {activeOption.name} </span>
          <span className={style.optionAccount}> {activeOption.address} </span>
        </div>

        <ul className={`${style.optionList} ${showOptions && style.optionListActive}`}>
          <div className={style.scrollableList}>
            {showOptions && options}
          </div>
          {showOptions && (
            <li className={`${style.option} ${style.optionAdd}`}>
              <Link
                onBlur={() => this.toggleShowOptions(false)}
                className={style.optionLink}
                to="/accounts/import"
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
  selectedAccount: PropTypes.object,
};

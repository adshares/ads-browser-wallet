import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import style from './Select.css';

export default class Select extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeOption: this.props.options[0],
      showOptions: false,
    };
  }

  setActiveOption(option) {
    this.setState({
      activeOption: option,
      showOptions: false,
    });
  }

  toggleShowOptions(state) {
    this.setState({
      showOptions: state
    });
  }

  render() {
    const { activeOption, showOptions } = this.state;

    const options = this.props.options.map((option, index) => {
      if (option !== this.state.activeOption) {
        return (
          <div
            key={index} className={style.option} data-value={option}
            onClick={() => this.setActiveOption(option)}
          >
            {option}
          </div>
        );
      }
    }
    );

    return (
      <div className={style.select}>
        <div
          role="button"
          className={style.option, style.optionActive}
          onClick={() => this.toggleShowOptions(!showOptions)}
        >
          {activeOption || this.props.options[0]}
          {showOptions ?
            <FontAwesomeIcon icon={faAngleUp} /> :
            <FontAwesomeIcon icon={faAngleDown} />}
        </div>
        {showOptions && options}
      </div>
    );
  }
}

Select.propTypes = {
  options: PropTypes.array.isRequired,
};

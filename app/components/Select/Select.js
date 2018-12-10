import React from 'react';
import PropTypes from 'prop-types';
import style from './Select.css';

export default class Select extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeOption: '',
      showOptions: false,
    };
  }

  render() {
    const { activeOption, showOptions } = this.state;
    const options = this.props.options.map((option, index) => (
      <div key={index} className={style.option} data-value={option}>
        {option}
      </div>
    ));

    return (
      <select className={style.select} >
        <div className={style.option}>
          { activeOption || this.props.options[0]}
        </div>
        { showOptions && options }
      </select>
    );
  }
}

Select.propTypes = {
  options: PropTypes.array.isRequired,
};

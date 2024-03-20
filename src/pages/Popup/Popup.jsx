import React from 'react';
// import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import BgClient from '../../utils/background'

const Popup = () => {
  return (
    <div className="App">
      <header className="App-header">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum, ipsa, quos. A assumenda blanditiis cumque, dolores eum ex fugiat ipsa ipsum iste laudantium maiores nam non numquam perferendis quam. Fugit.
        <p>
          Edit <code>src/pages/Popup/Popup.jsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
        <button onClick={() => BgClient.startSession('secret', (data) => {console.log(data)})}>test</button>
      </header>
    </div>
  );
};

export default Popup;

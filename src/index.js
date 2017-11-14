import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
const domAccessor = document.getElementById('app');

const render = props => {
  const { domAccessor } = props;
  ReactDOM.render(
    <App />,
    domAccessor
  );
}

render({domAccessor});

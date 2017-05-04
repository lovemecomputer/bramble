import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
// import './app.global.css';
import './app.global.scss';

const store = configureStore();

const listenToPresses = e => {
  console.log(e);
  store.dispatch({
    type: 'HOTKEY',
    key: e.key,
    withMeta: e.metaKey,
    withShift: e.shiftKey,
    withCtrl: e.ctrlKey
  });
  // e.stopPropagation();
  // TODO: PREVENT SOME KEYSTOKES WITH ELECTION API
};
document.addEventListener('keydown', listenToPresses);

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}

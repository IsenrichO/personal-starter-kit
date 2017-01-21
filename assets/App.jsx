'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import promiseMiddleware from 'redux-promise';

import '../assets/styles/master.scss';
import Results from './components/results_page';
import LandingPage from './components/landing_page';
import AboutPage from './components/about_page';
import reducers from './reducers/index';


const routerMid = routerMiddleware(browserHistory),
      createStoreWithMiddleware = applyMiddleware(promiseMiddleware, routerMid)(createStore),
      store = createStoreWithMiddleware(reducers),
      history = syncHistoryWithStore(browserHistory, store);

export default class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router history={ history }>
          <Route path='/'component={ LandingPage } />
          <Route path='results' component={ Results } />
          <Route path='about' component={ AboutPage } />
        </Router>
      </Provider>
    );
  }
};

ReactDOM.render(<App />, document.getElementById('root'));

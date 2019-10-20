import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import App from './App';
import mapReducer from './store/reducers/map';
import provincesReducer from './store/reducers/provinces';
import districtsReducer from './store/reducers/districts';
import provinceDataReducer from './store/reducers/provinceData';
import aqiWeatherReducer from './store/reducers/AqiWeather';
import authReducer from './store/reducers/auth';
import locationReducer from './store/reducers/location';
import logger from 'redux-logger';

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const rootReducer = combineReducers({
  map: mapReducer,
  provinces: provincesReducer,
  districts: districtsReducer,
  provinceData: provinceDataReducer,
  aqiWeather: aqiWeatherReducer,
  auth: authReducer,
  location: locationReducer
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, logger))
);

const app = (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

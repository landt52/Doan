import React, {Component} from 'react';
import './App.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Map from './containers/Map';

class App extends Component {


  render(){
    return <Map />;
  }
}; 

export default withRouter(App);

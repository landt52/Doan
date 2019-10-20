import React, { Component } from 'react';
import Auxiliary from '../Auxiliary/Auxiliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import classes from './Navigation.css';
import {connect} from 'react-redux';

class Layout extends Component {

  render() {
    return (
      <Auxiliary>
        <Toolbar
          isAuth={this.props.isAuthenticated}
          photo={this.props.photo}
          drawerToggleClicked={this.sideDrawerToggle}
          role={this.props.role}
        />
        <main className={classes.content}>{this.props.children}</main>
      </Auxiliary>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.jwt,
    photo: state.auth.photo,
    role: state.auth.role
  }
}

export default connect(mapStateToProps)(Layout);

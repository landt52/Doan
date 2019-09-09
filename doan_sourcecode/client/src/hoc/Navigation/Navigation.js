import React, { Component } from 'react';
import Auxiliary from '../Auxiliary/Auxiliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import classes from './Navigation.css';

class Layout extends Component {

  render() {
    return (
      <Auxiliary>
        <Toolbar
          isAuth={this.props.isAuthenticated}
          drawerToggleClicked={this.sideDrawerToggle}
        />
        <main className={classes.content}>{this.props.children}</main>
      </Auxiliary>
    );
  }
}

export default Layout;

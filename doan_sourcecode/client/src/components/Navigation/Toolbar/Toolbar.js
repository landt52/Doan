import React from 'react';
import classes from './Toolbar.css';
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar = props => (
  <header className={classes.Toolbar}>
  <h1>HELLO</h1>
    <nav>
      <NavigationItems />
    </nav>
  </header>
);

export default toolbar;

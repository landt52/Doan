import React from 'react';
import classes from './Toolbar.css';
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar = props => (
  <header className={classes.Toolbar}>
  <h1 style={{color: 'white'}}>VnGIS</h1>
    <nav>
      <NavigationItems isAuth={props.isAuth} photo={props.photo} role={props.role}/>
    </nav>
  </header>
);

export default toolbar;

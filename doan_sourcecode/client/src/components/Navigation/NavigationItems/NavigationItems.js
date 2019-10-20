import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = props => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link='/' exact>
      Provinces
    </NavigationItem>
    {props.role === 'Admin' ? <NavigationItem link='/districts' exact>
      Districts
    </NavigationItem> : null}
    <NavigationItem link='/map' exact>
      Map
    </NavigationItem>
    <NavigationItem link='/aqi' exact>
      Aqi-Weather
    </NavigationItem>
    <NavigationItem link='/location' exact>
      Location
    </NavigationItem>
    {props.isAuth ? (
      <React.Fragment>
        <NavigationItem link='/logout' exact>
          Logout
        </NavigationItem>
        <NavigationItem link='/user' exact>
          <img src={props.photo} alt="avatar" className={classes.avatar} />
        </NavigationItem>
      </React.Fragment>
    ) : (
      <NavigationItem link='/login' exact>
        Login
      </NavigationItem>
    )}
  </ul>
);

export default navigationItems;

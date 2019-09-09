import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = props => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link='/' exact>
      Vietnam GIS
    </NavigationItem>
    <NavigationItem link='/provinces' exact>
      Provinces
    </NavigationItem>
    <NavigationItem link='/districts' exact>
      Districts
    </NavigationItem>
  </ul>
);

export default navigationItems;

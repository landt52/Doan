import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = props => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link='/' exact>
      Tỉnh - Thành phố
    </NavigationItem>
    {props.role === 'Admin' ? <NavigationItem link='/districts' exact>
      Quận - Huyện
    </NavigationItem> : null}
    <NavigationItem link='/map' exact>
      Bản đồ Việt Nam
    </NavigationItem>
    <NavigationItem link='/aqi' exact>
      Aqi - Thời tiết
    </NavigationItem>
    <NavigationItem link='/location' exact>
      Du lịch
    </NavigationItem>
    {props.isAuth ? (
      <React.Fragment>
        <NavigationItem link='/logout' exact>
          Đăng xuất
        </NavigationItem>
        <NavigationItem link='/user' exact>
          <img src={props.photo} alt="avatar" className={classes.avatar} />
        </NavigationItem>
      </React.Fragment>
    ) : (
      <NavigationItem link='/login' exact>
        Đăng nhập
      </NavigationItem>
    )}
  </ul>
);

export default navigationItems;

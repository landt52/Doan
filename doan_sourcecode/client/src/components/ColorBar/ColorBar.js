import React from 'react';
import classes from './ColorBar.css';

function ColorBar() {
    return (
      <div className={classes.colorBar}>
        <div className={[classes.bar, classes.bar1].join(' ')}>0-50</div>
        <div className={[classes.bar, classes.bar2].join(' ')}>51-100</div>
        <div className={[classes.bar, classes.bar3].join(' ')}>101-150</div>
        <div className={[classes.bar, classes.bar4].join(' ')}>151-200</div>
        <div className={[classes.bar, classes.bar5].join(' ')}>201-300</div>
        <div className={[classes.bar, classes.bar6].join(' ')}>300+</div>
      </div>
    );
}

export default ColorBar

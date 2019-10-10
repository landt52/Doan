import React from 'react';
import classes from './ColorBar.css';

function ColorBar(props) {
    let bars;

    if(props.type === '') bars = null;
    if(props.type === 'aqi'){
      bars = (
        <div className={classes.colorBar}>
          <div className={[classes.bar, classes.bar1].join(' ')}>0-50</div>
          <div className={[classes.bar, classes.bar2].join(' ')}>51-100</div>
          <div className={[classes.bar, classes.bar3].join(' ')}>101-150</div>
          <div className={[classes.bar, classes.bar4].join(' ')}>151-200</div>
          <div className={[classes.bar, classes.bar5].join(' ')}>201-300</div>
          <div className={[classes.bar, classes.bar6].join(' ')}>300+</div>
        </div>
      )
    }
    if(props.type === 'weather'){
      bars = (
        <div className={classes.colorBar}>
          <div className={[classes.bar, classes.tempBar1].join(' ')}>-50</div>
          <div className={[classes.bar, classes.tempBar2].join(' ')}>-40</div>
          <div className={[classes.bar, classes.tempBar3].join(' ')}>-30</div>
          <div className={[classes.bar, classes.tempBar4].join(' ')}>-20</div>
          <div className={[classes.bar, classes.tempBar5].join(' ')}>-10</div>
          <div className={[classes.bar, classes.tempBar6].join(' ')}>0</div>
          <div className={[classes.bar, classes.tempBar7].join(' ')}>10</div>
          <div className={[classes.bar, classes.tempBar8].join(' ')}>20</div>
          <div className={[classes.bar, classes.tempBar9].join(' ')}>30</div>
          <div className={[classes.bar, classes.tempBar10].join(' ')}>40</div>
          <div className={[classes.bar, classes.tempBar11].join(' ')}>50</div>
        </div>
      );
    }

    return bars;
}

export default ColorBar

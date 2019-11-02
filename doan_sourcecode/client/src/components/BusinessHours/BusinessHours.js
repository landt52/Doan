/* eslint-disable eqeqeq */
import React from 'react';
import classes from './BusinessHours.css';

function BusinessHours(props) {
    const getTime = (time) => {
        if(typeof time === 'string') return time;
        else return `${time[0]} - ${time[1]}`
    }

    const getCurrentTime = (day, time) => {
      const date = new Date();
      const today = date.getDay();
      const hour = date.getHours();
      const min = date.getMinutes();

      if(typeof time === 'string'){
        switch (day) {
          case 'Mon':
            return today === 1 && time.split(' ')[0];
          case 'Tue':
            return today === 2 && time.split(' ')[0];
          case 'Wed':
            return today === 3 && time.split(' ')[0];
          case 'Thu':
            return today === 4 && time.split(' ')[0];
          case 'Fri':
            return today === 5 && time.split(' ')[0];
          case 'Sat':
            return today === 6 && time.split(' ')[0];
          case 'Sun':
            return today === 0 && time.split(' ')[0];
          default:
            return '';
        }
      }else{
        const openTime = time[0].split(':');
        const closeTime = time[1].split(':');

        switch (day) {
          case 'Mon':
            return (today === 1 && (openTime[0] < hour || (openTime[0] == hour && openTime[1] <= min ))) ? 'Open' : (today === 1 && (closeTime[0] > hour || (closeTime[0] == hour && closeTime[1] <= min))) ? 'Closed' : '';
          case 'Tue':
            return (today === 2 && (openTime[0] < hour || (openTime[0] == hour && openTime[1] <= min ))) ? 'Open' : (today === 2 && (closeTime[0] > hour || (closeTime[0] == hour && closeTime[1] <= min))) ? 'Closed' : '';
          case 'Wed':
            return (today === 3 && (openTime[0] < hour || (openTime[0] == hour && openTime[1] <= min ))) ? 'Open' : (today === 3 && (closeTime[0] > hour || (closeTime[0] == hour && closeTime[1] <= min))) ? 'Closed' : '';
          case 'Thu':
            return (today === 4 && (openTime[0] < hour || (openTime[0] == hour && openTime[1] <= min ))) ? 'Open' : (today === 4 && (closeTime[0] > hour || (closeTime[0] == hour && closeTime[1] <= min))) ? 'Closed' : '';
          case 'Fri':
            return (today === 5 && (openTime[0] < hour || (openTime[0] == hour && openTime[1] <= min ))) ? 'Open' : (today === 5 && (closeTime[0] > hour || (closeTime[0] == hour && closeTime[1] <= min))) ? 'Closed' : '';
          case 'Sat':
            return (today === 6 && (openTime[0] < hour || (openTime[0] == hour && openTime[1] <= min ))) ? 'Open' : (today === 6 && (closeTime[0] > hour || (closeTime[0] == hour && closeTime[1] <= min))) ? 'Closed' : '';
          case 'Sun':
            return (today === 0 && (openTime[0] < hour || (openTime[0] == hour && openTime[1] <= min ))) ? 'Open' : (today === 0 && (closeTime[0] > hour || (closeTime[0] == hour && closeTime[1] <= min))) ? 'Closed' : '';
          default:
            return '';
        }
      }
    }

    return (
      <div className={classes.biz}>
        <h2>Hours</h2>
        {Object.keys(props.hours).length !== 0 ? (
          <table className={classes.table}>
            <tbody>
              <tr>
                <th scope='row'>Mon</th>
                <td>{getTime(props.hours.Mon)}</td>
                <td
                  className={
                    getCurrentTime('Mon', props.hours.Mon) === ''
                      ? ''
                      : getCurrentTime('Mon', props.hours.Mon) === 'Closed'
                      ? classes.Closed
                      : classes.Open
                  }
                >
                  {getCurrentTime('Mon', props.hours.Mon)}
                </td>
              </tr>

              <tr>
                <th scope='row'>Tue</th>
                <td>{getTime(props.hours.Tue)}</td>
                <td
                  className={
                    getCurrentTime('Tue', props.hours.Tue) === ''
                      ? ''
                      : getCurrentTime('Tue', props.hours.Tue) === 'Closed'
                      ? classes.Closed
                      : classes.Open
                  }
                >{getCurrentTime('Tue', props.hours.Tue)}</td>
              </tr>

              <tr>
                <th scope='row'>Wed</th>
                <td>{getTime(props.hours.Wed)}</td>
                <td
                  className={
                    getCurrentTime('Wed', props.hours.Wed) === ''
                      ? ''
                      : getCurrentTime('Wed', props.hours.Wed) === 'Closed'
                      ? classes.Closed
                      : classes.Open
                  }
                >{getCurrentTime('Wed', props.hours.Wed)}</td>
              </tr>

              <tr>
                <th scope='row'>Thu</th>
                <td>{getTime(props.hours.Thu)}</td>
                <td
                  className={
                    getCurrentTime('Thu', props.hours.Thu) === ''
                      ? ''
                      : getCurrentTime('Thu', props.hours.Thu) === 'Closed'
                      ? classes.Closed
                      : classes.Open
                  }
                >{getCurrentTime('Thu', props.hours.Thu)}</td>
              </tr>

              <tr>
                <th scope='row'>Fri</th>
                <td>{getTime(props.hours.Fri)}</td>
                <td
                  className={
                    getCurrentTime('Fri', props.hours.Fri) === ''
                      ? ''
                      : getCurrentTime('Fri', props.hours.Fri) === 'Closed'
                      ? classes.Closed
                      : classes.Open
                  }
                >{getCurrentTime('Fri', props.hours.Fri)}</td>
              </tr>

              <tr>
                <th scope='row'>Sat</th>
                <td>{getTime(props.hours.Sat)}</td>
                <td
                  className={
                    getCurrentTime('Sat', props.hours.Sat) === ''
                      ? ''
                      : getCurrentTime('Sat', props.hours.Sat) === 'Closed'
                      ? classes.Closed
                      : classes.Open
                  }
                >{getCurrentTime('Sat', props.hours.Sat)}</td>
              </tr>

              <tr>
                <th scope='row'>Sun</th>
                <td>{getTime(props.hours.Sun)}</td>
                <td
                  className={
                    getCurrentTime('Sun', props.hours.Sun) === ''
                      ? ''
                      : getCurrentTime('Sun', props.hours.Sun) === 'Closed'
                      ? classes.Closed
                      : classes.Open
                  }
                >{getCurrentTime('Sun', props.hours.Sun)}</td>
              </tr>
            </tbody>
          </table>
        ) : null}
      </div>
    );
}

export default BusinessHours

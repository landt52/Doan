import React from 'react';
import classes from './WeatherCard.css';
import GetIcon from '../../containers/Aqi-Weather/GetIcon';

function WeatherCard(props) {
    const {name, summary, icon, data, temp} = props.data;

    const checkTempColor = temp => {
      return +temp >= 50
        ? '9E1010'
        : +temp >= 40
        ? 'D81313'
        : +temp >= 30
        ? 'EA681F'
        : +temp >= 20
        ? 'F6A123'
        : +temp >= 10
        ? 'DADC34'
        : +temp >= 0
        ? '61C9E1'
        : +temp >= -10
        ? '426BB2'
        : +temp >= -20
        ? '8A52A0'
        : +temp >= -30
        ? '99418F'
        : +temp >= -40
        ? '531F56'
        : '101233';
    };

    const cardData = data
      ? data.map(d => (
          <div className={classes.weatherBottom__card} key={d.unixTime}>
            <p>{d.time.split(' ')[0]}</p>
            <p>{d.time.split(' ')[1]}</p>
            <p>{d.temperature + String.fromCharCode(176) + 'C'}</p>
            <img
              src={encodeURI(
                'data:image/svg+xml,' +
                  GetIcon(d.icon, checkTempColor(d.temperature))
              ).replace('#', '%23')}
              alt={d.icon}
              style={{ height: '6rem' }}
            />
            <p>{d.summary}</p>
          </div>
        ))
      : null;

    return (
      <div className={classes.weatherCard}>
        <div className={classes.weatherHeader}>
          <p>{name}</p>
          <img
            src={encodeURI(
              'data:image/svg+xml,' + GetIcon(icon, checkTempColor(temp))
            ).replace('#', '%23')}
            alt={icon}
          />
          <p>{temp + String.fromCharCode(176) + 'C'}</p>
          <p>{summary}</p>
        </div>
        <div className={classes.weatherBottom}>{cardData}</div>
      </div>
    );
}

export default WeatherCard

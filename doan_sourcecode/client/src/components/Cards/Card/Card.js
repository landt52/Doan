import React from 'react';
import classes from './Card.css';
import {Link} from 'react-router-dom';

const Cards = props => {
  return (
    <div className={classes.card}>
      <Link
        to={{pathname: `/provinces/${props.data.name
          .replace(/\s|-|\./g, '')}`, search: `?lat=${props.data.lat}&lng=${props.data.lng}` }}
      >
        {props.data.name}
      </Link>
    </div>
  );
};

export default Cards;

import React from 'react';
import classes from './Card.css';
import {Link} from 'react-router-dom';

const Cards = props => {
  let card;

  if(props.type === 'districts'){
    card = (
      <Link
        to={{
          pathname: `/${props.type}/${props.data._id}`
        }}
      >
        {props.data.districtname}
      </Link>
    );
  }else{
    card = (
      <Link
        to={{
          pathname: `/${props.type}/${props.data.name.replace(/\s|-|\./g, '')}`,
          search: `?lat=${props.data.lat}&lng=${props.data.lng}`
        }}
      >
        {props.data.name}
      </Link>
    );
  }
  
  

  return (
    <div className={classes.card}>
      {card}
    </div>
  );
};

export default Cards;

import React from 'react';
import classes from './Card.css';
import {Link} from 'react-router-dom';

const Cards = props => {
  let card, editButton, infoPageButton;

  if(props.type === 'districts'){
    card = (
      <Link
        to={{
          pathname: `/${props.type}/edit/${props.data._id}`
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
        {props.data.realname}
      </Link>
    );
    editButton =
      props.role === 'Admin' ? (
        <Link to={{ pathname: `/${props.type}/edit/${props.data._id}` }}>
          <button className='btn btn-primary'>Edit</button>
        </Link>
      ) : null;
    infoPageButton = (
      <Link to={{ pathname: `/${props.type}/info/${props.data._id}` }}>
        <button className='btn btn-primary'>Info Page</button>
      </Link>
    );
  }

  return (
      <div className={classes.card}>{card}{editButton}{infoPageButton}</div>
  );
};

export default Cards;

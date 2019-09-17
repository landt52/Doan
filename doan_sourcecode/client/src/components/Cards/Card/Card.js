import React from 'react';
import classes from './Card.css';
import {Link} from 'react-router-dom';
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';

const Cards = props => {
  let card, editButton;

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
        {props.data.name}
      </Link>
    );
    editButton = (
      <Link to={{ pathname: `/${props.type}/edit/${props.data._id}` }}>
        <button className='btn btn-primary'>Edit</button>
      </Link>
    );
  }

  return (
    <Auxiliary>
      <div className={classes.card}>{card}{editButton}</div>
    </Auxiliary>
  );
};

export default Cards;

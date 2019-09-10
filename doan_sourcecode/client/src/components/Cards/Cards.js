import React from 'react'
import Card from './Card/Card';
import classes from './Cards.css';

const Cards = (props) => {
    let cards;

    if(props.type === 'districts'){
        cards = props.data.map(card => {
          return (
            <Card
              link={`/${props.type}/${card._id}`}
              exact
              data={card}
              type={props.type}
              key={card._id}
            />
          );
        });
    }else{
        cards = props.data.map(card => {
          return (
            <Card
              link={`/${props.type}/${card.name}`}
              exact
              data={card}
              key={card.id}
              type={props.type}
            />
          );
        });
    }

    return (
        <div className={classes.cards}>
            {cards}
        </div>
    )
}

export default Cards

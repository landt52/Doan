import React from 'react'
import Card from './Card/Card';
import classes from './Cards.css';

const Cards = (props) => {
    let cards = props.data.map(card => {
        return <Card link={`/provinces/${card.name}`} exact data={card} key={card.id}/>
    })

    return (
        <div className={classes.cards}>
            {cards}
        </div>
    )
}

export default Cards

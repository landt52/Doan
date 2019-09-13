import React from 'react'
import classes from './InfoCard.css';

function InfoCard(props) {
    return (
        <button className={classes.infoCard} onClick={props.clicked}>
            {props.data}
        </button>
    )
}

export default InfoCard

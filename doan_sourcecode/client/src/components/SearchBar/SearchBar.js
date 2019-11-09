import React from 'react';
import classes from './SearchBar.css';

export default function SearchBar(props) {
    return (
        <input className={classes.search__input} type="text" placeholder="Search" onChange={props.changed}/>
    );
}

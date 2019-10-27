import React from 'react'
import classes from './FuzzySearch.css';

export default function FuzzySearch(props) {
    return (
      <div className={classes.searchContainer}>
        <div className={classes.searchBar}>
          <input
            onBlur={props.toggleOff}
            type='text'
            name='search'
            placeholder='Search...'
            className={classes.searchInput}
            onKeyUp={e => props.search(e.target.value)}
          ></input>
        </div>
        <div className={classes.searchResults}>
          {props.searchResult
            ? props.searchResult.map(result => (
                <div
                  onClick={() => props.resultClick(result)}
                  key={result.name}
                >
                  {result.name}
                </div>
              ))
            : null}
        </div>
      </div>
    );
}

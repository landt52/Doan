import React from 'react'
import classes from './AddButton.css';
import {FaPlusCircle} from 'react-icons/fa';
import {Link} from 'react-router-dom';

function AddButton(props) {
    return (
        <Link to={props.link} exact='true' className={classes.addButton}>
          <FaPlusCircle className={classes.plus} />
          <button
            type='button'
            className={[classes.button, classes.fromLeft].join(' ')}
          >
            Add Location
          </button>
        </Link>
    );
}

export default AddButton

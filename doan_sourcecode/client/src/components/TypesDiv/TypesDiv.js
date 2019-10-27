import React from 'react';
import classes from './TypesDiv.css';

function TypesDiv(props) {
    return (
        <div className={classes.layerPanel}>
            <h3>Layers</h3>
            <div className={classes.layerButtons} onClick={props.clicked}>
                {props.types.map(type => (
                    <div key={type} data-type={type === 'Other' ? 'Default' : type} className={classes.toggleActive}>
                        {type}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TypesDiv

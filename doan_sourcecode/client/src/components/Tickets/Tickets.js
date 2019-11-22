import React from 'react';
import classes from './Tickets.css';
import buttonClasses from '../AddButton/AddButton.css';

export default function Tickets(props) {
    return (
      <div className={classes.ticket}>
        {props.ticket.ticketType === 'Reject' ? (
          <React.Fragment>
            <h3>Location: {props.ticket.locationName} - </h3>
            <h3 className={classes.reject}>
              {' '}
              Status: Deleted / {props.ticket.ticketType}
            </h3>
            <p>Reason: {props.ticket.reason}</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h3>Location: {props.ticket.locationName} - </h3>
            <h3 className={classes.approve}>
              {' '}
              Status: {props.ticket.ticketType}
            </h3>
          </React.Fragment>
        )}
        <button className={buttonClasses.buttonSmall} onClick={(e) => props.acceptTicket(e, props.ticket._id)}>Accept</button>
      </div>
    );
}

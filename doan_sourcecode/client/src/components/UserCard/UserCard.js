import React, {useState} from 'react';
import classes from './UserCard.css';
import buttonClasses from '../AddButton/AddButton.css';
import { Input } from 'reactstrap';

export default function UserCard(props) {
    const [editing, setEditing] = useState(false);
    const [userName, setUserName] = useState(props.data.userName);
    const [email, setEmail] = useState(props.data.email);

    return (
      <div className={classes.userCard}>
        <div className={classes.avatar}>
          <img src={props.data.photo} alt={props.data.userName} />
        </div>
        <div className={classes.info}>
          {!editing ? (
            <React.Fragment>
              <h3>{props.data.userName}</h3>
              <p>{props.data.email}</p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Input
                type='text'
                name='text'
                id='text'
                placeholder='User Name'
                style={{
                  fontSize: '1.6rem'
                }}
                value={userName}
                onChange={event => setUserName(event.target.value)}
              />
              <Input
                type='email'
                name='email'
                id='email'
                placeholder='Email'
                style={{
                  fontSize: '1.6rem'
                }}
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
            </React.Fragment>
          )}
        </div>
        <div className={classes.buttons}>
          {!editing ? (
            <button
              className={buttonClasses.buttonSmall}
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          ) : (
            <button
              className={buttonClasses.buttonSmall}
              onClick={() => {
                props.updateUser(userName, email, props.data.id);
                setEditing(false);
              }}
            >
              Update
            </button>
          )}
          {props.data.id !== props.currentID ? (
            <button
              className={buttonClasses.buttonSmallDelete}
              onClick={() => props.deactivateUser(props.data.id)}
            >
              Deactivate
            </button>
          ) : (
            <button
              className={buttonClasses.buttonSmallDelete}
              onClick={() => props.deactivateUser(props.data.id)}
              disabled
            >
              Deactivate
            </button>
          )}
        </div>
      </div>
    );
}

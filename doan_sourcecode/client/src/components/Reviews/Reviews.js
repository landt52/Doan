import React, {useState, useRef} from 'react';
import classes from './Reviews.css';
import moment from 'moment';
import ModalImage from '../ModalImage/ModalImage';
import buttonClasses from '../AddButton/AddButton.css';
import AddReview from '../../containers/AddReview/AddReview';

function Reviews(props) {
    const [editing, setEditing] = useState(false);
    const editRef = useRef(null)

    const getRating = () => {
        const starPercentage = (props.data.rating / 5) * 100;
        const roundedPercentage = `${(Math.round(starPercentage) / 10) * 10}%`;

        return {
            width: roundedPercentage
        };
    };

    return (
      <div className={classes.review}>
        <div style={{flexGrow: 1}}>
          {editing ? (
            <AddReview 
              mode={'edit'} 
              value={props.data.rating} 
              review={props.data.review}
              ref={editRef}/>
          ) : (
            <React.Fragment>
              <div className={classes.starsOuter}>
                <div className={classes.starsInner} style={getRating()}></div>
              </div>
              <span>
                {moment(props.data.createdAt).format('DD/MM/YYYY, h:mm A')}
              </span>
              <p>{props.data.review}</p>
            </React.Fragment>
          )}
          <div
            style={{
              display: 'flex',
              width: '50%'
            }}
          >
            {props.data.images.map(url => (
              <ModalImage
                key={url}
                image={url}
                alt=''
                ratio={`3:2`}
                length={props.data.images.length}
              />
            ))}
          </div>
        </div>
        <div>
          <div className={classes.avatar}>
            <p>{props.data.user.userName}</p>
            <img src={props.data.user.photo} alt='' />
          </div>
          {props.userId === props.data.user._id ? (
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
                    props.editReview(props.data.id, editRef.current.state.value, editRef.current.state.review)
                    setEditing(false);
                  }}
                >
                  Update
                </button>
              )}
              <button
                className={buttonClasses.buttonSmallDelete}
                onClick={() => props.deleteReview(props.data.id)}
              >
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
}

export default Reviews

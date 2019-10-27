import React, {useState, useEffect} from 'react';
import classes from './InfoPanel.css';
import { Link } from 'react-router-dom';

function InfoPanel(props) {
    const [address, setaddress] = useState('')

    const getRating = () => {
      const starPercentage = props.info.rating / 5 * 100;
      const roundedPercentage = `${Math.round(starPercentage) / 10 * 10}%`

      return {
        width: roundedPercentage
      }
    }

    const subStringAddress = (address, numOfChars = 50) => {
        return address.length >= numOfChars
          ? `${address.substr(0, numOfChars)}...`
          : address
    }

    useEffect(() => {
      if(props.info.address) setaddress(subStringAddress(props.info.address));
    }, [props.info.address])

    const showHidden = () => {
      setaddress(props.info.address)
    }

    const hide = () => {
      setaddress(subStringAddress(props.info.address));
    }

    return (
        <div
          className={classes.infoContainer}
          onClick={props.toggle}
          ref={props.infoRef}
        >
          <div className={classes.info}>
            <Link
              to={{
                pathname: `/location/${props.id}`
              }}
              className={classes.locationName}
            >
              {props.info.name}
            </Link>
            <div className={classes.starsOuter}>
              <div className={classes.starsInner} style={getRating()}></div>
            </div>
            <span>{props.info.reviewsCount + ' Reviews'}</span>
            {props.info.locationType ? (
              <p
                className={classes.locationType}
                onClick={() =>
                  props.filterLayer(props.info.locationType.locationType)
                }
              >
                {props.info.locationType.locationType}
              </p>
            ) : null}
            {props.info.phone ? <p>(+84) {props.info.phone}</p> : null}
            {props.info.website ? (
              <a href={props.info.website}>Go to their Website</a>
            ) : null}
            {props.info.address ? (
              <p onMouseEnter={showHidden} onMouseLeave={hide}>{address}</p>
            ) : null}
          </div>
          <Link className={classes.infoPictureContainer}
            to={{
              pathname: `/location/${props.id}`
            }}
          >
            <img
              src={props.info.cover}
              alt={props.info.name}
              className={classes.infoPicture}
            />
          </Link>
        </div>
    );
}

export default InfoPanel

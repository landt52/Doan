import React from 'react'
import classes from './InfoDiv.css';
import InfoCard from './InfoCard/InfoCard';

function InfoDiv(props) {
    let card = null;
    card =
      props.fetched &&
      props.data.some(district => district.properties.data.something)
        ? Object.keys(props.data[0].properties.data.something)
            .filter(card => {
              return card !== 'Tên huyện' && card !== "Tên tỉnh";
            })
            .map(card => {
              return (
                <InfoCard key={card} data={card} clicked={props.onclicked} />
              );
            })
        : null;

    return (
      <div className={classes.infoDiv}>
        {card}
      </div>
    );
}

export default InfoDiv

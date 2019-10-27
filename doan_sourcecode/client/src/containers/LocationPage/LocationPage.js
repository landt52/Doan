import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import draftToHtml from 'draftjs-to-html';
import classes from './LocationPage.css';
import LightBox from '../../components/LightBox/LightBox';
import MiniMap from './MiniMap';
import { FaMapPin, FaPhoneVolume, FaExternalLinkAlt } from 'react-icons/fa';

class LocationPage extends Component {
  state = {
    address: '',
    cover: '',
    hours: {},
    images: [],
    locationType: '',
    name: '',
    phone: '',
    rating: 0,
    summary: '',
    website: '',
    writer: '',
    reviews: [],
    reviewsCount: 0,
    coordinates: []
  };

  componentDidMount() {
    axios(`/api/location/${this.props.id}`).then(res => {
      const {
        address,
        images,
        hours,
        name,
        phone,
        rating,
        summary,
        website,
        cover,
        writer,
        coordinates
      } = res.data.data.location.location;
      const { locationType } = res.data.data.location.location.locationType;
      const { reviews } = res.data.data.location;
      const { reviewsCount } = res.data.data;

      this.setState({
          address,
          cover,
          hours: Object.assign({}, this.state.hours, hours),
          images: [...this.state.images, ...images],
          locationType,
          name,
          phone,
          rating,
          summary,
          website,
          writer,
          reviews: [...this.state.reviews, ...reviews],
          reviewsCount,
          coordinates
      }, () => {
          console.log(this.state)
      })
    });
  }

    getRating = () => {
      const starPercentage = this.state.rating / 5 * 100;
      const roundedPercentage = `${Math.round(starPercentage) / 10 * 10}%`

      return {
        width: roundedPercentage
      }
    }

  convertFromJSONToHTML = text => {
    return draftToHtml(JSON.parse(text));
  };

  createMarkup = () => {
    return {
      __html: this.convertFromJSONToHTML(
        this.props.provinceData.data.provinceData.info
      )
    };
  };

  render() {
    return (
      <div className={classes.locationPage}>
        <h1>{this.state.name}</h1>
        <div className={classes.starsOuter}>
          <div className={classes.starsInner} style={this.getRating()}></div>
        </div>
        <span>{this.state.reviewsCount + ' Reviews'}</span>
        <h2>{this.state.locationType}</h2>
        <hr></hr>
        <div className={classes.picsAndMap}>
          <LightBox input={this.state.images} ratio={`3:2`} />
          <div className={classes.map}>
            {this.state.coordinates[0] ? (
              <MiniMap
                zoom={18}
                lat={this.state.coordinates[1]}
                lng={this.state.coordinates[0]}
                locationType={this.state.locationType}
                name={this.state.name}
              />
            ) : null}
            <div className={classes.info}>
              <FaMapPin />
              <h2>{this.state.address}</h2>
            </div>
            <div className={classes.info}>
              <FaPhoneVolume />
              <h2>(+84) {this.state.phone}</h2>
            </div>
            <div className={classes.info}>
              <FaExternalLinkAlt />
              <h2>
                <a href={this.state.website}>Go to their website</a>
              </h2>
            </div>
          </div>
        </div>
        <hr></hr>
        <div className={classes.summaryAndBiz}>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
        id: state.location.id
    }
}

export default connect(mapStateToProps)(LocationPage);
import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import draftToHtml from 'draftjs-to-html';
import classes from './LocationPage.css';
import {toast} from 'react-toastify';
import buttonClasses from '../../components/AddButton/AddButton.css';
import LightBox from '../../components/LightBox/LightBox';
import MiniMap from './MiniMap';
import BusinessHours from '../../components/BusinessHours/BusinessHours';
import { Link } from 'react-router-dom';
import { FaMapPin, FaPhoneVolume, FaExternalLinkAlt } from 'react-icons/fa';
import Spinner from '../../components/Spinner/Spinner';
import Reviews from '../../components/Reviews/Reviews';

class LocationPage extends Component {
  state = {
    id: '',
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
      const { reviews, id } = res.data.data.location;
      const { reviewsCount } = res.data.data;

      this.setState({
          id,
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
        this.state.summary
      )
    };
  };

  deleteReview = async id => {
      try {
        await axios(`/api/review/${id}`, {
          method: 'DELETE'
        });
        toast.success('Xóa review thành công')
        this.props.history.goBack();
      } catch ({response}) {
        toast.error(response)
      }
  }

  updateReview = async (reviewId, rating, review) => {
    try {
      const updateReview = await axios(`/api/review/${reviewId}`, {
        method: 'PATCH',
        data: {
          rating,
          review
        }
      })

      const reviews = [...this.state.reviews];
      const reviewIndex = this.state.reviews.findIndex(
        review => review.id === updateReview.data.data.review.id
      )
      const updatedReview = {...reviews[reviewIndex], 
        rating: updateReview.data.data.review.rating,
        review: updateReview.data.data.review.review
      }
      reviews[reviewIndex] = updatedReview;

      this.setState({reviews})
    } catch ({response}) {
      toast.error(response);
    }
  }

  render() {
    let reviews = this.state.reviews.length === 0 ? null : (
      this.state.reviews.map(review => <Reviews 
        key={review.id} 
        userId={this.props.userId} 
        data={review}
        deleteReview={this.deleteReview}
        editReview={this.updateReview}
        />)
    )

    let content = !this.state.name ? (
      <Spinner />
    ) : (
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
          {this.state.summary ? (
            <div
              className={classes.summary}
              dangerouslySetInnerHTML={this.createMarkup()}
            ></div>
          ) : null}
          <BusinessHours hours={this.state.hours} />
        </div>
        <hr></hr>
        {!this.state.reviews.length ? (
          <div className={classes.zeroReview}>
            <h2>This location haven't got any review yet!</h2>
            <Link
              to={
                this.props.isAuthenticated
                  ? `/location/${this.state.id}/review`
                  : `/login`
              }
              exact='true'
              className={[
                buttonClasses.button,
                buttonClasses.buttonReview,
                buttonClasses.fromLeft
              ].join(' ')}
            >
              Add a review
            </Link>
          </div>
        ) : this.state.reviews
            .map(review => review.user._id)
            .includes(this.props.userId) ? null : (
          <Link
            to={
              this.props.isAuthenticated
                ? `/location/${this.state.id}/review`
                : `/login`
            }
            exact='true'
            style={{ textDecoration: 'none' }}
          >
            <button
              className={[
                buttonClasses.button,
                buttonClasses.buttonNormal,
                buttonClasses.fromLeft
              ].join(' ')}
            >
              Add Review
            </button>
          </Link>
        )}
        {reviews}
      </div>
    );

    return content;
  }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.jwt,
        id: state.location.id,
        userId: state.auth.id
    }
}

export default connect(mapStateToProps)(LocationPage);
import React, { Component } from 'react';
import Map from './AqiWeatherMap';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import ColorBar from '../../components/ColorBar/ColorBar';
import Modal from '../../components/Modal/Modal';
import WeatherCard from '../../components/WeatherCard/WeatherCard';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import classes from '../../components/AddButton/AddButton.css';

class AqiWeather extends Component {
    componentDidMount(){
        this.props.loadAqiData();
        this.props.loadWeatherData();
    }

    changeType = (e) => {
        this.props.changeType(e.target.value)
    }

    render() {
        return (
          <Auxiliary>
            <Modal
              show={this.props.openModal}
              modalClosed={this.props.closeModal}
            >
              <WeatherCard data={this.props.properties} />
            </Modal>
            <Map zoom={6} lat={16.830832} lng={107.067261} />
            <ColorBar type={this.props.type} />
            <button
              color='primary'
              className={[
                classes.button,
                classes.fromLeft,
                classes.buttonWeather
              ].join(' ')}
              value={'weather'}
              onClick={this.changeType}
            >
              Weather
            </button>
            <button
              color='primary'
              className={[
                classes.button,
                classes.fromLeft,
                classes.buttonAqi
              ].join(' ')}
              value={'aqi'}
              onClick={this.changeType}
            >
              Aqi
            </button>
          </Auxiliary>
        );
    }
}

const mapStateToProps = state => {
  return {
    type: state.aqiWeather.type,
    openModal: state.aqiWeather.openModal,
    properties: state.aqiWeather.properties
  }
}

const mapDispatchToProps = dispatch => {
    return {
        loadAqiData: () => dispatch(actions.loadAqiData()),
        loadWeatherData: () => dispatch(actions.loadWeatherData()),
        changeType: (type) => dispatch(actions.changeType(type)),
        closeModal: () => dispatch(actions.closeModal())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AqiWeather);
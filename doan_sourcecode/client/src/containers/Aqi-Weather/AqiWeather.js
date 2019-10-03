import React, { Component } from 'react';
import Map from './AqiWeatherMap';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import ColorBar from '../../components/ColorBar/ColorBar';

class AqiWeather extends Component {
    componentDidMount(){
        this.props.loadAqiData();
    }

    render() {
        return (
          <div>
            <Map zoom={6} lat={16.830832} lng={107.067261} />
            <ColorBar />
          </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadAqiData: () => dispatch(actions.loadAqiData())
    }
}

export default connect(null, mapDispatchToProps)(AqiWeather);
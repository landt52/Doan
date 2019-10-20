import React, { Component } from 'react';
import * as actions from '../../store/actions/index';
import Map from './LocationMap';
import {connect} from 'react-redux';

class Location extends Component {
    componentDidMount(){
        this.props.getAllLocations();
    }

    render() {
        return (
          <React.Fragment>
            <Map zoom={6} lat={16.830832} lng={107.067261} />
          </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllLocations: () => dispatch(actions.getAllLocations())
    }
}

export default connect(null, mapDispatchToProps)(Location);
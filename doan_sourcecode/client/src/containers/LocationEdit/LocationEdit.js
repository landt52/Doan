import React, { Component } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import LocationUploadMap from '../LocationUpload/LocationUploadMap';

class LocationEdit extends Component {
    state = {
        id: null,
        location: {},
        lat: 0,
        lng: 0,
        mode: 'edit'
    }

    componentDidMount(){    
        axios(`/api/location/${this.props.match.params.locationId}`)
            .then(res => {
                const {id, location} = res.data.data.location
                const lat = location.coordinates[1];
                const lng = location.coordinates[0];
                this.setState({id, location, lat, lng})
            })
            .catch(({response}) => toast.error(response));
    }

    render() {
        return <LocationUploadMap id={this.state.id} location={this.state.location} lat={this.state.lat} lng={this.state.lng} mode={this.state.mode}/>;
    }
}

export default LocationEdit;
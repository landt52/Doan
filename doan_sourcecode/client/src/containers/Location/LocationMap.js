import React, { Component } from 'react';
import L from 'leaflet';
import Spinner from '../../components/Spinner/Spinner';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

class LocationMap extends Component {
  componentDidMount() {
    this.map = L.map('map', {
      center: [this.props.lat, this.props.lng],
      zoom: this.props.zoom,
      maxZoom: 20,
      minZoom: 6,
      layers: [
        new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        })
      ]
    });

    this.map.zoomControl.setPosition('bottomright');
    this.layers = {};
  }

  componentDidUpdate(prevProps) {
    if(prevProps.locations !== this.props.locations.locations){
      this.addLocationGeoJson(this.props.types[0], this.props.locations)
    }
  }

  addLocationGeoJson = (layerTitle, geojson) => {
    this.layers[layerTitle] = L.geoJSON(geojson, {
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: `http://localhost:5000/${feature.properties.locationType.locationType}.svg`,
            iconSize: [40, 80]
          }),
          title: feature.properties.name
        });
      },
    }).addTo(this.map);
  };

  render() {
    let map = this.props.loading ? (
      <div style={{ height: '92vh' }}>
        <Spinner />
      </div>
    ) : (
      <div
        id='map'
        style={{ height: '92vh', width: '100vw', marginTop: '0px' }}
      ></div>
    );

    return map;
  }
}

const mapStateToProps = state => {
  return {
    loading: state.aqiWeather.loading,
    locations: state.location.locations,
    types: state.location.types
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeType: type => dispatch(actions.changeType(type)),
    openModal: data => dispatch(actions.openModal(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationMap);
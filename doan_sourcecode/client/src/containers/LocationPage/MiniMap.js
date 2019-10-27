import React, { Component } from 'react';
import L from 'leaflet';
import {connect} from 'react-redux';

class MiniMap extends Component {
  componentDidMount() {
    this.map = L.map('map', {
      zoomControl: false,
      center: [this.props.lat, this.props.lng],
      zoom: this.props.zoom,
      maxZoom: this.props.zoom,
      minZoom: this.props.zoom-5,
      layers: [
        new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      ]
    });

    this.addMarker();
  }

  addMarker = () => {
    L.marker(
      {
        lat: this.props.lat,
        lng: this.props.lng
      },
      {
        icon: L.icon({
          iconUrl: `http://localhost:5000/${this.props.locationType}.svg`,
          iconSize: [35, 70]
        }),
        title: this.props.name
      }
    )
      .addTo(this.map);
  };

  render() {
    return <div id='map' style={{ height: '200px', width: '100%' }}></div>;
  }
}

const mapStateToProps = state => {
  return {
    locationInfo: state.location.locationSelectedInfo
  };
};

export default connect(mapStateToProps)(MiniMap);
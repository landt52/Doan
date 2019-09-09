import React, {Component} from 'react';
import L from 'leaflet';
import axios from 'axios';

class Map extends Component {
  async componentDidMount() {
    this.map = L.map('map', {
      center: [21.028511, 105.804817],
      zoom: 10,
      maxZoom: 20,
      minZoom: 6,
      layers: [
        new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        })
      ]
    });

    const boundary = await axios('/api/vnBoundaries/tpcantho');

    L.geoJSON(boundary.data.boundaries, {
      style: {
        color: '#225',
        weight: 1,
        opacity: 0.65
      },
      onEachFeature: this.onEachDistrict
    }).addTo(this.map);
  }

  onEachDistrict = (feature, layer) => {
    layer.bindPopup(feature.properties.name, { closeButton: false });
  }

  render() {
    return <div id='map'></div>;
  }
}

export default Map;

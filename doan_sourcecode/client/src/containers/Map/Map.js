import React, {Component} from 'react';
import L from 'leaflet';
import axios from 'axios';

class Map extends Component {
  state = {
    lat: 16.830832,
    lng: 107.067261
  }
  async componentDidMount() {
    this.map = L.map('map', {
      center: [this.state.lat, this.state.lng],
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

    
    let boundary = await axios('/api/vnBoundaries');

    if(this.props.provinceName){
      boundary = await axios(`/api/vnBoundaries/${this.props.provinceName}`);
    }

    L.geoJSON(boundary.data.boundaries, {
      style: {
        color: '#225',
        weight: 1,
        opacity: 0.65
      },
      onEachFeature: this.onEachDistrict
    }).addTo(this.map);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lat !== this.props.lat
        || nextProps.lng !== this.props.lng) {
        this.map.setView({lat: nextProps.lat, lng: nextProps.lng});
    }
  }

  onEachDistrict = (feature, layer) => {
    let data = this.getInfoFrom(feature.properties.data).join(' <br>');
    layer.bindPopup(data, { closeButton: false });
  }

  getInfoFrom = (object) => {
    var popupFood = [];
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        var stringLine = "The " + key + " is " + object[key];
        popupFood.push(stringLine);
      }
    }
    return popupFood;
  }



  render() {
    return <div id='map' style={{height: "92vh",
  width: "100vw", marginTop: "0px"}}></div>;
  }
}

export default Map;

import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import LocationUpload from './LocationUpload';
import classes from '../../components/AddButton/AddButton.css';

class LocationUploadMap extends Component {
  state = {
    id: null,
    location: null,
    lat: 0,
    lng: 0
  }

  componentDidMount() {
    this.map = L.map('map', {
      center: [16.830832, 107.067261],
      zoom: 6,
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
    this.markerGroup = L.layerGroup().addTo(this.map);
    this.control = L.Routing.control({
      routeWhileDragging: true,
      geocoder: new L.Control.Geocoder.bing(
        'AoJWQBJqZ27XZZmJKpeSo8R4-wOhCSini66_TbZFOtd_zHeuhXc93_KQC3KndAGv'
      ),
      router: L.Routing.mapbox(
        'pk.eyJ1IjoibGFuZHQ1MiIsImEiOiJjam1yajJ1OHAwMWg4M3RvYmVoZDdmc21sIn0.M2RTMfWf_QFThhS7Q4ESnA'
      ),
      waypointNameFallback: function(latLng) {
        function zeroPad(n) {
          n = Math.round(n);
          return n < 10 ? '0' + n : n;
        }
        function sexagesimal(p, pos, neg) {
          const n = Math.abs(p),
            degs = Math.floor(n),
            mins = (n - degs) * 60,
            secs = (mins - Math.floor(mins)) * 60,
            frac = Math.round((secs - Math.floor(secs)) * 100);
          return (
            (n >= 0 ? pos : neg) +
            degs +
            '°' +
            zeroPad(mins) +
            "'" +
            zeroPad(secs) +
            '.' +
            zeroPad(frac) +
            '"'
          );
        }

        return (
          sexagesimal(latLng.lat, 'N', 'S') +
          ' ' +
          sexagesimal(latLng.lng, 'E', 'W')
        );
      }
    })
      .on('waypointschanged', (e) => {
        const lat = e.waypoints[0].latLng.lat;
        const lng = e.waypoints[0].latLng.lng
        this.setState({lat, lng})
      })
      .addTo(this.map);

    this.map.on('click', e => {
      const container = L.DomUtil.create('div'),
        startBtn = this.createButton('This location', container);

      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;

      L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(this.map);

      L.DomEvent.on(startBtn, 'click', () => {
        this.setState({lat, lng})
        this.markerGroup.clearLayers();
        new L.marker(e.latlng).addTo(this.markerGroup);
        this.map.closePopup();
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.id !== this.props.id){
      this.setState({lat: this.props.lat, lng: this.props.lng})
    }
  }
  
  
  createButton = (label, container) => {
    const btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.setAttribute('class', classes.buttonSmall);
    btn.innerHTML = label;
    return btn;
  };

  render() {
    return (
      <React.Fragment>
        <LocationUpload lat={this.state.lat} lng={this.state.lng} id={this.props.id} location={this.props.location}/>
        <div
          id='map'
          style={{ height: '92vh', width: '100vw', marginTop: '0px' }}
        ></div>
      </React.Fragment>
    );
  }
}

export default LocationUploadMap;
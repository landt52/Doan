import React, { Component } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import Spinner from '../../components/Spinner/Spinner';
import classes from './Map.css';

class Map extends Component {
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
  }

  componentWillReceiveProps(nextProps) {
    if (
      !nextProps.loading ||
      nextProps.lat !== this.props.lat ||
      nextProps.lng !== this.props.lng
    ) {
      this.map.setView({ lat: nextProps.lat, lng: nextProps.lng });
      this.geojson = L.geoJSON(nextProps.boundary.boundaries, {
        style: this.style,
        onEachFeature: this.onEachDistrict
      }).addTo(this.map);
    }
  }

  highlightFeature = e => {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  resetHighlight = (e) => {
    this.geojson.resetStyle(e.target);
  }

  zoomToFeature = (e) => {
    this.map.fitBounds(e.target.getBounds(3));
  }

  onEachDistrict = (feature, layer) => {
    layer.bindPopup(feature.properties.name, { closeButton: false });
    if (!feature.properties.data) return;
    if (feature.properties.data.something) {
      let popupContent = this.getInfoFrom(
        feature.properties.data.something,
        `${classes.table}`
      );
      layer.bindPopup(popupContent, { closeButton: false });
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
        click: this.zoomToFeature
      });
    }
  };

  getColor = d => {
    return d > 1000
      ? '#800026'
      : d > 500
      ? '#BD0026'
      : d > 200
      ? '#E31A1C'
      : d > 100
      ? '#FC4E2A'
      : d > 50
      ? '#FD8D3C'
      : d > 20
      ? '#FEB24C'
      : d > 10
      ? '#FED976'
      : '#FFEDA0';
  };

  style = feature => {
    return {
      fillColor: this.getColor(
        feature.geometry.properties.data.something['Diện tích mía (ha)']
      ),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  getInfoFrom = (object, className) => {
    let cols = Object.entries(object);

    let bodyRows = '';

    className = className || '';
    cols.map(row => {
      return (bodyRows +=
        '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td></tr>');
    });

    return (
      '<table class="' + className + '"><tbody>' + bodyRows + '</tbody></table>'
    );
  };

  render() {
    let map;
    map = this.props.loading ? (
      <div>
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
    lat: state.map.lat,
    lng: state.map.lng,
    boundary: state.map.boundary,
    err: state.map.err,
    loading: state.map.loading
  };
};

export default connect(mapStateToProps)(Map);

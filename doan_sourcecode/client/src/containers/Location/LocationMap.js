import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import Spinner from '../../components/Spinner/Spinner';
import { connect } from 'react-redux';
import classes from '../../components/AddButton/AddButton.css';
import * as actions from '../../store/actions/index';

class LocationMap extends Component {
  componentDidMount() {
    const { mapRef } = this.props;
    mapRef(this);

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
    }).addTo(this.map);

    this.map.on('click', (e) => {
        const container = L.DomUtil.create('div'),
          startBtn = this.createButton('Start here', container),
          destBtn = this.createButton('Go to', container);
        L.popup()
          .setContent(container)
          .setLatLng(e.latlng)
          .openOn(this.map);

        L.DomEvent.on(startBtn, 'click', () => {
          this.control.spliceWaypoints(0, 1, e.latlng);
          this.map.closePopup();
        });

        L.DomEvent.on(destBtn, 'click', () => {
          this.control.spliceWaypoints(
            this.control.getWaypoints().length - 1,
            1,
            e.latlng
          );
          this.map.closePopup();
        });
    });
  }

  componentWillUnmount() {
    const { mapRef } = this.props;
    mapRef(undefined);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentType !== this.props.currentType) {
      this.addLocationGeoJson(this.props.currentType, this.props.locations);
      this.toggleLayer(this.props.currentType);
    }

    if (prevProps.locationSelected !== this.props.locationSelected) {
      if (
        !this.map.hasLayer(this.layers[this.props.locationSelected.layerName])
      ) {
        this.props.clicked(null, this.props.locationSelected.layerName);
      }

      this.selectLocation(
        this.props.locationSelected.id,
        this.props.locationSelected.layerName
      );
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
      onEachFeature: this.onEachLocation
    });
  };

  onEachLocation = (feature, layer) => {
    layer.bindPopup(feature.properties.name);
    layer.on({
      click: () => {
        this.props.toggle();
        this.props.getInfo(feature.id, feature.properties);
      }
    });
  };

  toggleLayer = layerName => {
    const layer = this.layers[layerName];
    if (this.map.hasLayer(layer)) {
      this.map.removeLayer(layer);
    } else {
      this.map.addLayer(layer);
    }
  };

  clearLayers = () => {
    Object.values(this.layers).forEach(layer => {
      this.map.removeLayer(layer);
    });
  };

  selectLocation = (id, layerName) => {
    const geojsonLayer = this.layers[layerName];
    const sublayers = geojsonLayer.getLayers();
    const selectedSublayer = sublayers.find(layer => {
      return layer.feature.geometry.id === id;
    });

    if (selectedSublayer.feature.geometry.type === 'Point') {
      this.map.flyTo(selectedSublayer.getLatLng(), 10);
    } else {
      this.map.flyToBounds(selectedSublayer.getBounds(), 10);
    }

    selectedSublayer.fireEvent('click');
  };

  createButton = (label, container) => {
    const btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.setAttribute('class', classes.buttonSmall);
    btn.innerHTML = label;
    return btn;
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
    currentType: state.location.currentType,
    loading: state.aqiWeather.loading,
    locations: state.location.locations,
    types: state.location.types,
    locationSelected: state.location.locationSelected
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeType: type => dispatch(actions.changeType(type)),
    openModal: data => dispatch(actions.openModal(data)),
    getInfo: (id, info) => dispatch(actions.getLocationInfo(id, info))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationMap);
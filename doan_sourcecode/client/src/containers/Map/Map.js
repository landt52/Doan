import React, { Component } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import Spinner from '../../components/Spinner/Spinner';
import classes from './Map.css';
import { selectMapBoundary } from './MapReselect';

class Map extends Component {
  state = {
    max: 0
  }

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

    this.info = L.control();
    this.info.onAdd = () => {
      this.info.div = L.DomUtil.create('div', classes.info);
      this.info.update();
      return this.info.div;
    };

    this.info.update = districtData => {
      this.info.div.innerHTML =
        `<h4>${this.props.filterData}</h4>` +
        (districtData
          ? `<b>${districtData.name}</b><br />${
              districtData.data.something[this.props.filterData]
            }`
          : 'Di chuột lên 1 tỉnh');
    };

    this.info.addTo(this.map);

    this.legend = L.control({ position: 'bottomright' });
    this.legend.onAdd = () => {
      this.legend.div = L.DomUtil.create('div',[classes.legend, classes.info].join(' '));
      return this.legend.div;
    };

    this.legend.update = () => {
      let grades = [
        0,
        Math.floor(this.state.max / 5),
        Math.floor((this.state.max * 2) / 5),
        Math.floor((this.state.max * 3) / 5),
        Math.floor((this.state.max * 4) / 5),
        Math.floor(this.state.max)
      ];

      this.legend.div.innerHTML = '';

      for (let i = 0; i < grades.length; i++) {
        this.legend.div.innerHTML +=
          `<i style="background: ${this.getColor(grades[i] + 1)}"></i>` +
          grades[i] +
          (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
    }
    
    this.legend.addTo(this.map);
  }

  componentDidUpdate(prevProps){
    if (this.props.vnfetched || this.props.fetched) {
      if(prevProps.filterData !== this.props.filterData || prevProps.boundary !== this.props.boundary){
        this.map.closePopup();
        this.setState({
          max: Math.max(
            ...this.props.boundary.boundaries.map(district =>
              district.properties.data.something
                ? district.properties.data.something[this.props.filterData]
                : 0
            ),
            0
          )
        });
      }
      this.legend.update();
      this.info.update();
      this.map.setView({ lat: this.props.lat, lng: this.props.lng });

      this.geojson = L.geoJSON(this.props.boundary.boundaries, {
        style: this.style,
        onEachFeature: this.onEachDistrict
      }).addTo(this.map);
    }
  }

  highlightFeature = e => {
    const layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
      opacity: 1
    });

    this.info.update(layer.feature.geometry.properties);

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  resetHighlight = e => {
    this.geojson.resetStyle(e.target);
    this.info.update();
  };

  onEachDistrict = (feature, layer) => {
    layer.bindPopup(feature.properties.name);
    if (feature.properties.data.something) {
      let popupContent = this.getInfoFrom(
        feature.properties.data.something,
        `${classes.table}`
      );
      layer.bindPopup(popupContent);
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight
      });
    }
  };

  getColor = d => {
    return d > this.state.max
      ? '#800026'
      : d > Math.floor((this.state.max * 4) / 5)
      ? '#BD0026'
      : d > Math.floor((this.state.max * 3) / 5)
      ? '#FC4E2A'
      : d > Math.floor((this.state.max * 2) / 5)
      ? '#FD8D3C'
      : d > Math.floor(this.state.max / 5)
      ? '#FED976':'#FFEDA0';
  };

  style = feature => {
    const data = feature.geometry.properties.data.something;
    return {
      fillColor: this.getColor(data ? +data[this.props.filterData] : 0),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  getInfoFrom = (object, className) => {
    let cols = Object.entries(object), bodyRows = '';

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
    let map = this.props.loading ? (
      <div style={{height: '92vh'}}>
        <Spinner />
      </div>
    ) : (
      <div id='map' style={{ height: '92vh', width: '100vw', marginTop: '0px' }}
      ></div>
    );

    return map;
  }
}

const mapStateToProps = state => {
  return {
    boundary: selectMapBoundary(state),
    lat: state.map.lat,
    lng: state.map.lng,
    err: state.map.err,
    loading: state.map.loading,
    filterData: state.map.filterData,
    vnfetched: state.map.vnfetched,
    fetched: state.map.fetched
  };
};

export default connect(mapStateToProps)(Map);

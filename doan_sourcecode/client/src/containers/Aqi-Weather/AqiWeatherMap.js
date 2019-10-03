import React, { Component } from 'react';
import L from 'leaflet';
import Spinner from '../../components/Spinner/Spinner';
import {connect} from 'react-redux';

class AqiWeatherMap extends Component {
    componentDidMount(){
        this.map = L.map('map', {
          center: [this.props.lat, this.props.lng],
          zoom: this.props.zoom,
          maxZoom: 20,
          minZoom: 6,
          layers: [
            new L.TileLayer(
              'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              {
                attribution:
                  'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
              }
            )
          ]
        });
        this.layers = {};
        this.map.zoomControl.setPosition('bottomright');
        this.addLocationGeoJson('aqi', this.props.aqi);
    }

    componentDidUpdate() {
      this.addLocationGeoJson('aqi', this.props.aqi);
    }

    checkColor = (aqi) => {
      return aqi >= 301
        ? 'A87383'
        : aqi >= 201
        ? 'A97ABC'
        : aqi >= 151
        ? 'FE6A69'
        : aqi >= 101
        ? 'FE9B57'
        : aqi >= 51
        ? 'FDD74B'
        : 'A8E05F';
    }
    
    addLocationGeoJson = (layerTitle, geojson) => {
      this.layers[layerTitle] = L.geoJSON(geojson, {
        pointToLayer: (feature, latlng) => {
          return L.marker(latlng, {
            icon: L.icon({
              iconUrl:
                `https://ui-avatars.com/api/?rounded=true&size=36&font-size=0.4&length=3&color=fff&background=${this.checkColor(feature.properties.aqi)}&name=${feature.properties.aqi}`,
              iconSize: [30, 30]
            }),
            title: feature.properties.name
          });
        }
      }).addTo(this.map);
    }

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

        // <img
        //   alt=''
        //   src='https://ui-avatars.com/api/?rounded=true&size=36&font-size=0.4&length=3&color=fff&background=fe9b57&name=120'
        //   style={{
        //     position: 'absolute',
        //     left: '0px',
        //     top: '0px',
        //     userSelect: 'none',
        //     width: '40px',
        //     height: '40px',
        //     border: '0px',
        //     padding: '0px',
        //     margin: '0px',
        //     maxWidth: 'none',
        //     opacity: '1',
        //     zIndex: '1000'
        //   }}
        // />;

        return map;
    }
}

const mapStateToProps = state => {
  return {
    aqi: state.aqiWeather.aqi,
    loading: state.aqiWeather.loading
  }
}


export default connect(mapStateToProps)(AqiWeatherMap);
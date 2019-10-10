import React, { Component } from 'react';
import L from 'leaflet';
import Spinner from '../../components/Spinner/Spinner';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import GetIcon from './GetIcon';

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

        this.layerGroup = L.layerGroup().addTo(this.map);
        this.map.zoomControl.setPosition('bottomright');
        this.addLocationGeoJson('aqi', this.props.aqi);
        this.props.changeType('aqi');
    }

    componentDidUpdate() {
        this.layerGroup.clearLayers();
        this.addLocationGeoJson(this.props.type, this.props[this.props.type]);
    }

    checkAqiColor = (aqi) => {
      return +aqi >= 301
        ? 'A87383'
        : +aqi >= 201
        ? 'A97ABC'
        : +aqi >= 151
        ? 'FE6A69'
        : +aqi >= 101
        ? 'FE9B57'
        : +aqi >= 51
        ? 'FDD74B'
        : 'A8E05F';
    }
    
    checkTempColor = (temp) => {
      return +temp >= 50
        ? '9E1010'
        : +temp >= 40
        ? 'D81313'
        : +temp >= 30
        ? 'EA681F'
        : +temp >= 20
        ? 'F6A123'
        : +temp >= 10
        ? 'DADC34'
        : +temp >= 0
        ? '61C9E1'
        : +temp >= -10
        ? '426BB2'
        : +temp >= -20
        ? '8A52A0'
        : +temp >= -30
        ? '99418F'
        : +temp >= -40
        ? '531F56'
        : '101233'
    }

    locationType = (layerTitle, feature) => {
      switch (layerTitle) {
        case `aqi`:
          return `https://ui-avatars.com/api/?rounded=true&size=36&font-size=0.4&length=3&color=fff&background=${this.checkAqiColor(
              feature.properties.aqi
            )}&name=${feature.properties.aqi}`
        case `weather`:
          return encodeURI('data:image/svg+xml,' + GetIcon(feature.properties.icon, this.checkTempColor(feature.properties.temp))).replace('#', '%23')
        default:
          return `https://ui-avatars.com/api/?rounded=true&size=36&font-size=0.4&length=3&color=fff&background=808080&name=N/A`;
      }
    }
    
    addLocationGeoJson = (layerTitle, geojson) => {
      L.geoJSON(geojson, {
        pointToLayer: (feature, latlng) => {
          return L.marker(latlng, {
            icon: L.icon({
              iconUrl: this.locationType(layerTitle, feature),
              iconSize: layerTitle === 'aqi' ? [30, 30] : [40, 40]
            }),
            title: feature.properties.name 
          });
        },
        onEachFeature: layerTitle === 'weather' ? this.onEachLocation : null 
      }).addTo(this.layerGroup);
    }

    onEachLocation = (feature, layer) => {
      layer.on({
        click: (e) => {
          this.props.openModal(feature.properties)
        }
      })
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

        return map;
    }
}

const mapStateToProps = state => {
  return {
    aqi: state.aqiWeather.aqi,
    loading: state.aqiWeather.loading,
    type: state.aqiWeather.type,
    weather: state.aqiWeather.weather
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeType: (type) => dispatch(actions.changeType(type)),
    openModal: (data) => dispatch(actions.openModal(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AqiWeatherMap);
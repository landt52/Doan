import React, {Component} from 'react';
import {connect} from 'react-redux';
import L from 'leaflet';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/Spinner/Spinner';

class Map extends Component {
  async componentDidMount() {
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

    // if(this.props.provinceName){
    //   this.props.loadMapOfVNStart();
    //   boundary = await axios(
    //     `/api/vnBoundaries/${this.props.provinceName}`
    //   );
    // }else{
    //   boundary = await axios('/api/vnBoundaries');
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lat !== this.props.lat
        || nextProps.lng !== this.props.lng) {
        this.map.setView({lat: nextProps.lat, lng: nextProps.lng});
        L.geoJSON(nextProps.boundary.boundaries, {
          style: {
            color: '#225',
            weight: 1,
            opacity: 0.65
          },
          onEachFeature: this.onEachDistrict
        }).addTo(this.map);
    }
  }

  onEachDistrict = (feature, layer) => {
    let data = this.getInfoFrom(feature.properties.data).join(' <br>');
    layer.bindPopup(feature.properties.name.concat(data), { closeButton: false });
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
    let map;
    map = this.props.loading ? (
      <div>
        <Spinner />
      </div>
    ) : (
      <div id='map' style={{height: "92vh",
      width: "100vw", marginTop: "0px"}}></div>
    );

    return map
    }
}

const mapStateToProps = (state) => {
  return {
    lat: state.map.lat,
    lng: state.map.lng,
    boundary: state.map.boundary,
    err: state.map.err,
    loading: state.map.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadMapOfVNStart: () => dispatch(actions.loadMapOfVNStart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);

import React, { Component } from 'react';
import Map from '../Map/Map';
import queryString from 'query-string';

class ProvincePage extends Component {
  state = {
    provinceName: null,
    lat: null,
    lng: null
  }

  componentDidMount(){
    const values = queryString.parse(this.props.location.search);
    this.setState({provinceName: this.props.match.params.provinceName, lat: values.lat, lng: values.lng});
  }

  render() {
    return (
      <Map provinceName={this.state.provinceName} zoom={10} lat={this.state.lat} lng={this.state.lng}/>
    );
  }
}

export default ProvincePage;
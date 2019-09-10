import React, { Component } from 'react';
import axios from 'axios';
import Cards from '../../components/Cards/Cards';
import Spinner from '../../components/Spinner/Spinner';

class Provinces extends Component {
    state = {
        provinces: null,
        lat: null,
        lng: null
    }

    async componentDidMount(){
        const provinces = await axios('/api/citiesName');
        this.setState({provinces: provinces.data.cities, lat: provinces.data.lat, lng: provinces.data.lng});
    }

    render() {
        let cards = <Spinner />
        if(this.state.provinces !== null) cards = (
                                            <Cards
                                              data={this.state.provinces}
                                              lat={this.state.lat}
                                              lng={this.state.lng}
                                              type={"provinces"}
                                            />
                                          );
        return (
            <div>
                <h1>Provinces</h1>
                {cards}
            </div>
        );
    }
}

export default Provinces;
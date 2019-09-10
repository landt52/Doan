import React, { Component } from 'react';
import axios from 'axios';
import Cards from '../../components/Cards/Cards';
import Spinner from '../../components/Spinner/Spinner';

class Districts extends Component {
  state = {
    districts: null,
  }

  async componentDidMount() {
    const districts = await axios('/api/districtsName');
    this.setState({
      districts: districts.data.district,
    });
  }

  render() {
    let cards = <Spinner />;
    if (this.state.districts !== null)
      cards = (
        <Cards
          data={this.state.districts}
          type={"districts"}
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

export default Districts
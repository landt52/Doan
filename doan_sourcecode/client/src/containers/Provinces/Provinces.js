import React, { Component } from 'react';
import Cards from '../../components/Cards/Cards';
import Spinner from '../../components/Spinner/Spinner';
import {connect} from 'react-redux'; 
import * as actionTypes from '../../store/actions/index';

class Provinces extends Component {
    componentDidMount(){
        this.props.loadProvincesCardData();
    }

    render() {
        let cards = this.props.err ? <p>Có lỗi xảy ra</p> : <Spinner />;
        
        if(this.props.provinces !== null) cards = (
                                            <Cards
                                              data={this.props.provinces}
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

const mapStateToProps = state => {
    return {
        provinces: state.provinces.provinces,
        err: state.provinces.err,
        loading: state.provinces.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadProvincesCardData: () => dispatch(actionTypes.loadProvincesCardData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Provinces);
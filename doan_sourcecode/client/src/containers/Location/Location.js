import React, { Component } from 'react';
import * as actions from '../../store/actions/index';
import Map from './LocationMap';
import {connect} from 'react-redux';
import classes from '../../components/TypesDiv/TypesDiv.css';
import infoClasses from '../../components/InfoPanel/InfoPanel.css';
import AddButton from '../../components/AddButton/AddButton';
import TypesDiv from '../../components/TypesDiv/TypesDiv';
import Fuse from '../Fuse/FuzzySearch';
import InfoPanel from '../../components/InfoPanel/InfoPanel';

class Location extends Component {
    constructor(props) {
        super(props);
        this.info = React.createRef();
    }

    componentDidMount(){
        this.props.getAllLocations();
    }

    filterLocation = (e, layerName) => {
        if(e){
            e.target.classList.toggle(classes.toggleActive);
            this.map.toggleLayer(e.target.dataset.type);
        }else{
            const typeDiv = document.querySelector(`div[data-type="${layerName}"]`);
            typeDiv.classList.toggle(classes.toggleActive);
            this.map.toggleLayer(layerName);
        }
    }

    toggleInfo = (e) => {
        if(!Array.from(this.info.classList).includes(infoClasses.infoActive))
            this.info.classList.add(infoClasses.infoActive)
        if(e) e.target.classList.toggle(infoClasses.infoActive)
    }

    filterLayer = (layerName) => {
        const allLayers = document.getElementsByClassName(classes.toggleActive);
        Array.from(allLayers).forEach(layer => {
            layer.classList.toggle(classes.toggleActive)
        })
        
        this.map.clearLayers();
        const typeDiv = document.querySelector(`div[data-type="${layerName}"]`);
        typeDiv.classList.toggle(classes.toggleActive);
        this.map.toggleLayer(layerName);
    }

    render() {
        const addButton = this.props.isAuthenticated ? <AddButton /> : null

        return (
          <React.Fragment>
            <InfoPanel
              toggle={this.toggleInfo}
              infoRef={ref => (this.info = ref)}
              id={this.props.id}
              info={this.props.locationInfo}
              filterLayer={this.filterLayer}
            />
            <Fuse />
            {addButton}
            <Map
              zoom={6}
              lat={16.830832}
              lng={107.067261}
              mapRef={ref => (this.map = ref)}
              clicked={this.filterLocation}
              toggle={this.toggleInfo}
            />
            <TypesDiv types={this.props.types} clicked={this.filterLocation} />
          </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
      types: state.location.types,
      isAuthenticated: state.auth.jwt,
      id: state.location.id,
      locationInfo: state.location.locationSelectedInfo
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getAllLocations: (type) => dispatch(actions.getAllLocations(type))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Location);
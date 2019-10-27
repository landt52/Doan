import React, { Component } from 'react';
import Fuse from 'fuse.js'; 
import {connect} from 'react-redux';
import FuzzySearchBar from '../../components/Fuse/FuzzySearch';
import * as actions from '../../store/actions/index'

class FuzzySearch extends Component {
    state = {
        searchDebounce: null,
        searchbase: [],
        searchResult: []
    }

    componentDidMount() {
        this.options = {
        keys: ['name'],
        shouldSort: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1
        };

        this.fuse = new Fuse([], this.options);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentType !== this.props.currentType) {
            const newLocations = this.props.locations.map(item => {
              return {
                layerName: this.props.currentType,
                name: item.properties.name,
                id: item.id
              };
            });

            const newSearchBase = [
              ...this.state.searchbase,
              ...newLocations
            ];

            this.setState({searchbase: newSearchBase}, () => {
                this.fuse = new Fuse(this.state.searchbase, this.options);
            });   
        }
    }

    onSearch = (data) => {
        clearTimeout(this.state.searchDebounce);
        this.setState({searchDebounce: setTimeout(() => this.search(data), 500)})
    }

    search = (term) => {
        const searchResult = [...this.fuse.search(term).slice(0, 10)];
        this.setState({searchResult})
    }

    resultClick = (result) => {
        this.props.selectedLocation(result)
        this.setState({searchResult: ''});
    }

    render() {
        return <FuzzySearchBar 
            toggleOff={this.toggleOff}
            search={this.onSearch} 
            searchResult={this.state.searchResult}
            resultClick={this.resultClick} />;
    }
}

const mapStateToProps = state => {
    return {
      currentType: state.location.currentType,
      locations: state.location.locations
    };
}

const mapDispatchToProps = dispatch => {
    return {
        selectedLocation: (data) => dispatch(actions.selectedLocation(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FuzzySearch);
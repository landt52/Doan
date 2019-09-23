import React, { Component } from 'react';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';
import Spinner from '../../components/Spinner/Spinner';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

class InfoPage extends Component {
  async componentDidMount() {
      const type = this.props.match.path.split('/')[1];
      const value = this.props.match.params[Object.keys(this.props.match.params)[0]]
      this.props.loadProvinceData(type, value)
  }

  convertFromJSONToHTML = text => {
    return draftToHtml(JSON.parse(text));
  };

  createMarkup = () => {
    return {
      __html: this.convertFromJSONToHTML(this.props.provinceData.data.provinceData.info)};
  } 

  render() {
    let info = (
      <div>
        <Spinner />
      </div>
    );
    if(this.props.fetched){
      info =
        <div dangerouslySetInnerHTML={this.createMarkup()} />
    }
    return info
  }
}

const mapStateToProps = state => {
    return {
        provinceData: state.provinceData.provinceData,
        loading: state.provinceData.loading,
        fetched: state.provinceData.fetched
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadProvinceData: (type, value) => dispatch(actions.loadProvinceData(type, value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPage);
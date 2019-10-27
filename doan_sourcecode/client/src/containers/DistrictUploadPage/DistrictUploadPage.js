import React, { Component } from 'react';
import classes from './DistrictUploadPage.css';
import {toast} from 'react-toastify';
import axios from 'axios';
import { Progress, FormGroup, Label, Input } from 'reactstrap';
import Wysiwyg from '../../components/Wysiwyg/Wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

class DistrictUploadPage extends Component {
  state = {
    selectedFile: null,
    loaded: 0,
    editorState: EditorState.createEmpty(),
    chooseType: 'Map',
    chooseValue: null
  };

  componentDidMount() {
    const type = this.props.match.path.split('/')[1];
    const value = this.props.match.params[
      Object.keys(this.props.match.params)[0]
    ];
    this.props.loadProvinceData(type, value);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.provinceData !== this.props.provinceData) {
      if (this.props.provinceData.data.provinceData.info) {
        const html = draftToHtml(
          JSON.parse(this.props.provinceData.data.provinceData.info)
        );
        const contentBlock = htmlToDraft(html);
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        this.setState({
          editorState: EditorState.createWithContent(contentState)
        });
      }
    }
  }

  inputFile = event => {
    if (
      this.maxSelectFile(event) &&
      this.checkFileType(event) &&
      this.checkFileSize(event)
    ) {
      this.setState({ selectedFile: event.target.files[0], loaded: 0 });
    }
  };

  uploadFile = async () => {
    const data = new FormData();
    data.append('file', this.state.selectedFile);
    data.append('chooseValue', this.state.chooseValue);
    data.append('chooseType', this.state.chooseType)
    try {
      await axios(
        `/api/${this.props.match.path.split('/')[1]}/${
          this.props.match.params[Object.keys(this.props.match.params)[0]]
        }`,
        {
          method: 'POST',
          headers: {
            'content-type': 'multipart/form-data'
          },
          data: data,
          onUploadProgress: ProgressEvent => {
            this.setState({
              loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
            });
          }
        }
      );
      toast.success('Upload thành công');
    } catch (err) {
      toast.error('Upload thất bại');
    }
  };

  maxSelectFile = event => {
    let files = event.target.files;
    if (files.length > 1) {
      const msg = 'Chỉ được upload 1 file';
      event.target.value = null;
      toast.error(msg);
      return false;
    }
    return true;
  };

  checkFileType = event => {
    let files = event.target.files;
    let err = [];
    const types = ['text/csv', 'application/vnd.ms-excel', 'application/pdf'];
    for (let i = 0; i < files.length; i++) {
      if (types.every(type => files[i].type !== type)) {
        err[i] = files[i].type + ' là dạng file không hợp lệ\n';
      }
    }
    for (let i = 0; i < err.length; i++) {
      event.target.value = null;
      toast.error(err[i]);
    }
    return true;
  };

  checkFileSize = event => {
    let files = event.target.files;
    let size = 100000;
    let err = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > size) {
        err[i] = files[i].name + ' dung lượng quá lớn\n';
      }
    }
    for (let i = 0; i < err.length; i++) {
      toast.error(err[i]);
      event.target.value = null;
    }
    return true;
  };

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  uploadInfo = async () => {
    const infoData = convertToRaw(this.state.editorState.getCurrentContent());
    try {
      await axios(
        `/api/${this.props.match.path.split('/')[1]}/edit/${
          this.props.match.params[Object.keys(this.props.match.params)[0]]
        }`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          data: {
            infoData: JSON.stringify(infoData)
          }
        }
      );
      toast.success('Upload thành công');
    } catch (err) {
      toast.error('Upload thất bại');
    }
  };

  uploadImage = async file => {
    const data = new FormData();
    data.append('file', file);
    const fileData = await axios(
      `/api/${this.props.match.path.split('/')[1]}/picture/${
        this.props.match.params[Object.keys(this.props.match.params)[0]]
      }`,
      {
        method: 'POST',
        headers: {
          'content-type': 'image'
        },
        data: data
      }
    );
    return new Promise((resolve, _) => {
      resolve({ data: { link: fileData.data.url } });
    });
  };

  changeType = value => {
    this.setState({chooseType: value, chooseValue: null})
  }

  changeChooseValue = event => {
    this.setState({chooseValue: event.target.value})
  }

  render() {
    let chooseUpload = (
      <FormGroup>
        <Label for='selectType'>Chọn loại dữ liệu</Label>
        <Input
          type='select'
          id='selectType'
          onChange={e => this.changeType(e.target.value)}
        >
          <option>Map</option>
          <option>Info</option>
        </Input>
        {this.state.chooseType === 'Map' ? null : (
          <div>
            <Label for='textType'>Tên dữ liệu</Label>
            <Input type='text' id='textType' required onChange={this.changeChooseValue}/>
          </div>
        )}
      </FormGroup>
    );

    return (
      <div className='container'>
        <div className='row'>
          {this.props.type === 'province' ? chooseUpload : null}
          <div className='offset-md-3 col-md-6'>
            <div className={`form-group ${classes.files}`}>
              <label>Upload your file</label>
              <input
                type='file'
                className='form-control'
                multiple=''
                onChange={this.inputFile}
              />
            </div>
            <div className='form-group'>
              <Progress max='100' color='success' value={this.state.loaded}>
                {Math.round(this.state.loaded, 2)}%
              </Progress>
            </div>
            <button
              type='button'
              className='btn btn-primary btn-block'
              onClick={this.uploadFile}
            >
              Upload
            </button>
          </div>
        </div>
        {this.props.type === 'province' ? (
          <React.Fragment>
            <Wysiwyg
              onEditorStateChange={this.onEditorStateChange}
              editorState={this.state.editorState}
              uploadCallback={this.uploadImage}
              image={true}
            />
            <div className='row'>
              <div className='offset-md-3 col-md-6 pt-5'>
                <button
                  type='button'
                  className='btn btn-primary btn-block'
                  onClick={this.uploadInfo}
                >
                  Change Info
                </button>
              </div>
            </div>
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    provinceData: state.provinceData.provinceData,
    loading: state.provinceData.loading,
    fetched: state.provinceData.fetched
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadProvinceData: (type, value) =>
      dispatch(actions.loadProvinceData(type, value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DistrictUploadPage);
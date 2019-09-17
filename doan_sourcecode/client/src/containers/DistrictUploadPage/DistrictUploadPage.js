import React, { Component } from 'react';
import classes from './DistrictUploadPage.css';
import {toast} from 'react-toastify';
import axios from 'axios';
import { Progress } from 'reactstrap';

class DistrictUploadPage extends Component {
  state = {
    selectedFile: null,
    loaded: 0
  };

  inputFile = event => {
    if (this.maxSelectFile(event) && this.checkFileType(event) && this.checkFileSize(event)) {
      this.setState({ selectedFile: event.target.files[0], loaded: 0 });
    }
  };

  uploadFile = async () => {
    const data = new FormData();
    data.append('file', this.state.selectedFile);
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
    )
      .then(res => {
        toast.success('Upload thành công');
      })
      .catch(err => {
        toast.error('Upload thất bại');
      });
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
    let size = 10000000;
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

  render() {
    return (
        <div className='container'>
          <div className='row'>
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
        </div>
    );
  }
}

export default DistrictUploadPage;
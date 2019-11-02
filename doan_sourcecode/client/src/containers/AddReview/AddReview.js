import React, { Component } from 'react';
import classes from './AddReview.css';
import buttonClasses from '../../components/AddButton/AddButton.css';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { toast } from 'react-toastify';
import ModalImage from '../../components/ModalImage/ModalImage';
import Tooltip from '@material-ui/core/Tooltip';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';

const labels = {
  1: 'I don\'t recommend',
  2: 'Meh',
  3: 'Fine',
  4: 'Very good',
  5: 'This place is a must'
};

const theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '2rem',
        color: 'white',
        backgroundColor: '#50c878'
      }
    }
  }
});

class AddReview extends Component {
  state = {
    value: 2,
    hover: -1,
    review: '',
    selectedPics: [],
    picsURL: []
  };

  componentDidMount(){
    this.setState({value: this.props.value, review: this.props.review})
  }

  inputPics = event => {
    if (
      this.maxSelectFile(event, 3) &&
      this.checkFileType(event) &&
      this.checkFileSize(event)
    ) {
      const url = Array.from(event.target.files).map(picture => URL.createObjectURL(picture));
      this.setState({ selectedPics: event.target.files, picsURL: [...url] });
    }
  };

  createReview = async e => {
    e.preventDefault();
    const data = new FormData();

    for (let i = 0; i < this.state.selectedPics.length; i++) {
      data.append('pics', this.state.selectedPics[i]);
    }

    data.append('rating', this.state.value);
    data.append('review', this.state.review);
    data.append('location', this.props.match.params.locationId);

    try {
      await axios(
        `/api/location/${this.props.match.params.locationId}/reviews`,
        {
          method: 'POST',
          headers: {
            'content-type': 'multipart/form-data'
          },
          data
        }
      );
      toast.success('Viết review thành công');
      this.props.history.goBack();
    } catch ({response}) {
      toast.error(response.data.message);
    }
  }

  IconContainer = props => {
    const { value, ...other } = props;
    return (
      <MuiThemeProvider theme={theme}>
        {' '}
        <Tooltip title={labels[value] || ''}>
          <div style={{ fontSize: '3rem' }} {...other} />
        </Tooltip>
      </MuiThemeProvider>
    );
  };

  maxSelectFile = (event, num) => {
    let files = event.target.files;
    if (files.length > num) {
      const msg = `Chỉ được upload ${num} file`;
      event.target.value = null;
      toast.error(msg);
      return false;
    }
    return true;
  };

  checkFileType = event => {
    let files = event.target.files;
    let err = [];
    const types = ['image/png', 'image/jpeg', 'image/jpg'];
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
    let size = 2097152;
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
    let preview;

    preview = this.state.picsURL.length !== 0 ? (
      <div style={{display: 'flex', width: '100%'}}>
        {this.state.picsURL.map(url => (
          <ModalImage 
          image={url} 
          alt="" 
          ratio={`3:2`}
          length={this.state.picsURL.length}/>
        ))}
      </div>
    ) : null;

    return (
      <div className={classes.review}>
        <div>
          <Box component='fieldset' mb={3} borderColor='transparent'>
            <p>Please rate</p>
            <Rating
              size='large'
              name='simple-controlled'
              value={this.state.value}
              onChange={(event, newValue) => {
                this.setState({ value: newValue });
              }}
              IconContainerComponent={this.IconContainer}
            />
          </Box>
        </div>
        <Form onSubmit={this.createReview}>
          <FormGroup>
            <Label for='exampleText'>Please leave your review</Label>
            <Input
              type='textarea'
              name='text'
              id='review'
              rows='7'
              placeholder='Your review helps others learn about this great place'
              style={{
                fontSize: '1.6rem'
              }}
              value={this.state.review}
              onChange={event => this.setState({ review: event.target.value })}
            />
          </FormGroup>
          {this.props.mode ? null : (
            <React.Fragment>
              <FormGroup>
                <Label for='exampleFile'>Share your moment with us</Label>
                <Input
                  type='file'
                  name='file'
                  id='pics'
                  multiple
                  onChange={this.inputPics}
                />
              </FormGroup>
              {preview}
              <button
                className={[
                  buttonClasses.button,
                  buttonClasses.buttonNormal,
                  buttonClasses.fromLeft
                ].join(' ')}
              >
                Post Review
              </button>
            </React.Fragment>
          )}
        </Form>
      </div>
    );
  }
}

export default AddReview;
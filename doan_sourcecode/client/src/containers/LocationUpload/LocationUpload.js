import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomInput from '../../components/Input/Input';
import {Input} from 'reactstrap';
import Button from '../../components/Button/Button';
import { Label } from 'reactstrap';
import Wysiwyg from '../../components/Wysiwyg/Wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import classes from './LocationUpload.css'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {withRouter} from 'react-router-dom';
import ModalImage from '../../components/ModalImage/ModalImage';

class LocationUpload extends Component {
  state = {
    selectedCover: null,
    selectedCoverURL: null,
    selectedPics: [],
    selectedPicsURL: [],
    editorState: EditorState.createEmpty(),
    forms: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      website: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Website'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      address: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Address'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      phone: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Phone'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      type: {
        elementType: 'select',
        elementConfig: {
          options: [
            {
              value: 'Hotel',
              displayValue: 'Hotel'
            },
            {
              value: 'TouristAttraction',
              displayValue: 'Tourist Attraction'
            },
            {
              value: 'Restaurant',
              displayValue: 'Restaurant'
            },
            {
              value: 'Hospital',
              displayValue: 'Hospital'
            },
            {
              value: 'Airport',
              displayValue: 'Airport'
            }
          ]
        },
        value: 'Hotel',
        validation: {},
        valid: true
      }
    },
    summary: null,
    hours: {
      Mon: ['00:00', '00:00'],
      Tue: ['00:00', '00:00'],
      Wed: ['00:00', '00:00'],
      Thu: ['00:00', '00:00'],
      Fri: ['00:00', '00:00'],
      Sat: ['00:00', '00:00'],
      Sun: ['00:00', '00:00']
    },
    formIsValid: false,
    mode: '',
    deleteReason: ''
  };

  componentDidMount(){
    this.setState({mode: this.props.match.path.split('/')[2]})
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.id !== this.props.id) {
      const html = draftToHtml(JSON.parse(this.props.locations.summary));
      const contentBlock = htmlToDraft(html);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );

      const newState = {
        ...this.state.forms,
        name: {
          ...this.state.forms.name,
          value: this.props.locations.name,
          valid: true
        },
        website: {
          ...this.state.forms.website,
          value: this.props.locations.website,
          valid: true
        },
        phone: {
          ...this.state.forms.phone,
          value: this.props.locations.phone,
          valid: true
        },
        address: {
          ...this.state.forms.address,
          value: this.props.locations.address,
          valid: true
        },
        type: {
          ...this.state.forms.type,
          value: this.props.locations.locationType.locationType,
          valid: true
        }
      };

      const newHours = {
        ...this.state.hours,
        Mon: this.convertHours(this.props.locations.hours.Mon),
        Tue: this.convertHours(this.props.locations.hours.Tue),
        Wed: this.convertHours(this.props.locations.hours.Wed),
        Thu: this.convertHours(this.props.locations.hours.Thu),
        Fri: this.convertHours(this.props.locations.hours.Fri),
        Sat: this.convertHours(this.props.locations.hours.Sat),
        Sun: this.convertHours(this.props.locations.hours.Sun)
      };

      this.setState({
        forms: newState,
        editorState: EditorState.createWithContent(contentState),
        hours: newHours,
        formIsValid: true
      });

      if(this.state.mode === 'checking'){
        this.setState({selectedCoverURL: this.props.locations.cover, selectedPicsURL: this.props.locations.images})
      }
    }
  }

  convertHours = hour => {
    if (hour === 'Closed') return null;
    else if (hour === 'Open 24 hours') return ['00:00', '00:00'];
    else return hour;
  };

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isNumber) {
      isValid =
        Math.abs(parseFloat(value.match(/^-?\d*(\.\d+)?$/)) > 0) && isValid;
    }

    return isValid;
  }

  inputCover = event => {
    if (
      this.maxSelectFile(event, 1) &&
      this.checkFileType(event) &&
      this.checkFileSize(event)
    ) {
      const url = URL.createObjectURL(event.target.files[0]); 
      this.setState({ selectedCover: event.target.files[0], selectedCoverURL: url });
    }
  };

  inputPics = event => {
    if (
      this.maxSelectFile(event, 3) &&
      this.checkFileType(event) &&
      this.checkFileSize(event)
    ) {
      const url = Array.from(event.target.files).map(picture =>
        URL.createObjectURL(picture)
      );
      this.setState({ selectedPics: event.target.files, selectedPicsURL: [...url] });
    }
  };

  createLocation = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('pics', this.state.selectedCover);

    for (let i = 0; i < this.state.selectedPics.length; i++) {
      data.append('pics', this.state.selectedPics[i]);
    }

    const hours = this.state.hours;
    for (let key in hours) {
      if (hours.hasOwnProperty(key)) {
        if (hours[key] === null) {
          hours[key] = 'Closed';
        }
        if (hours[key][0] === '00:00' && hours[key][1] === '00:00') {
          hours[key] = 'Open 24 hours';
        }
      }
    }

    const summary = convertToRaw(this.state.editorState.getCurrentContent());

    data.append('summary', JSON.stringify(summary));
    data.append('lat', this.props.lat);
    data.append('lng', this.props.lng);
    data.append('name', this.state.forms.name.value);
    data.append('address', this.state.forms.address.value);
    data.append('phone', this.state.forms.phone.value);
    data.append('website', this.state.forms.website.value);
    data.append('locationType', this.state.forms.type.value);
    data.append('hours', JSON.stringify(hours));
    try {
      await axios('/api/location', {
        method: 'POST',
        headers: {
          'content-type': 'multipart/form-data'
        },
        data
      });
      toast.success('Upload thành công');
      this.props.history.goBack();
    } catch ({ response }) {
      toast.error(response.data.message);
    }
  };

  editLocation = async e => {
    e.preventDefault();
    let data;
    const hours = this.state.hours;
    for (let key in hours) {
      if (hours.hasOwnProperty(key)) {
        if (hours[key] === null) {
          hours[key] = 'Closed';
        }
        if (hours[key][0] === '00:00' && hours[key][1] === '00:00') {
          hours[key] = 'Open 24 hours';
        }
      }
    }

    const summary = convertToRaw(this.state.editorState.getCurrentContent());

    data = {
      summary: JSON.stringify(summary),
      lat: this.props.lat,
      lng: this.props.lng,
      name: this.state.forms.name.value,
      address: this.state.forms.address.value,
      phone: this.state.forms.phone.value,
      website: this.state.forms.website.value,
      locationType: this.state.forms.type.value,
      hours: JSON.stringify(hours),
    };

    try {
      await axios(`/api/location/${this.props.id}`, {
        method: 'PATCH',
        data
      });
      toast.success('Upload thành công');
      this.props.history.goBack();
    } catch ({ response }) {
      toast.error(response.data.message);
    }
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

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  inputChanged = (event, formName) => {
    const updatedForm = {
      ...this.state.forms,
      [formName]: {
        ...this.state.forms[formName],
        value: event.target.value,
        valid: this.checkValidity(
          event.target.value,
          this.state.forms[formName].validation
        ),
        touched: true
      }
    };

    let formIsValid = true;
    for (let form in updatedForm) {
      formIsValid = updatedForm[form].valid && formIsValid;
    }

    this.setState({ forms: updatedForm, formIsValid });
  };

  onTimeChange = (day, time) => {
    const newTime = {
      ...this.state.hours,
      [day]: time
    };
    this.setState({ hours: newTime });
  };

  approve = async (e) => {
    e.preventDefault();
    if(document.activeElement.innerText === 'Approve'){
      try {
        await axios(
          `/api/location/approve/${this.props.match.params.locationId}`,
          {
            method: 'PATCH',
            data: {
              name: this.props.locations.name,
              writer: this.props.locations.writer
            }
          }
        );
        toast.success('Đồng ý địa điểm');
        this.props.history.goBack();
      } catch ({response}) {
        toast.error(response.data.message);
      }
    }
    if(document.activeElement.innerText === 'Delete'){
      try {
        const reason = prompt("Reason for not approve location");
        if(reason === null || reason === "") return;
        else {
          await axios(
            `/api/location/reject/${this.props.match.params.locationId}`,
            {
              method: 'DELETE',
              data: {
                name: this.props.locations.name,
                writer: this.props.locations.writer,
                reason
              }
            }
          );
          toast.success('Loại địa điểm')
          this.props.history.goBack();
        }
      } catch ({response}) {
        toast.error(response.data.message)
      }
    }
  }

  render() {
    let previewCover, previewImages;
    const timePicker = Object.entries(this.state.hours).map(day => (
      <div key={day[0]}>
        <Label for={day[0]}>{day[0]}</Label>
        <TimeRangePicker
          maxTime='23:59'
          minTime='00:00'
          onChange={e => {
            this.onTimeChange(day[0], e);
          }}
          id={day[0]}
          value={day[1]}
        />
      </div>
    ));

    const forms = [];
    for (let key in this.state.forms) {
      forms.push({
        id: key,
        config: this.state.forms[key]
      });
    }
    let form;
    form = forms.map(form => (
      <CustomInput
        key={form.id}
        id={form.id}
        elementType={form.config.elementType}
        elementConfig={form.config.elementConfig}
        value={form.config.value}
        invalid={!form.config.valid}
        shouldValidate={form.config.validation}
        touched={form.config.touched}
        changed={event => this.inputChanged(event, form.id)}
      />
    ));

    if(this.state.mode === 'checking'){
      form = forms.map(form => (
        <CustomInput
          key={form.id}
          id={form.id}
          elementType={form.config.elementType}
          elementConfig={form.config.elementConfig}
          value={form.config.value}
          invalid={!form.config.valid}
          shouldValidate={form.config.validation}
          touched={form.config.touched}
          readOnly
        />
      ));
    }

    previewCover = this.state.selectedCoverURL ? (
      <div style={{ display: 'flex', width: '100%' }}>
          <ModalImage
            image={this.state.selectedCoverURL}
            alt=''
            ratio={`3:2`}
            length={1}
          />
      </div>
    ) : null;

    previewImages =
      this.state.selectedPicsURL.length !== 0 ? (
        <div style={{ display: 'flex', width: '100%' }}>
          {this.state.selectedPicsURL.map(url => (
            <ModalImage
              key={url}
              image={url}
              alt=''
              ratio={`3:2`}
              length={this.state.selectedPicsURL.length}
            />
          ))}
        </div>
      ) : null;

    return (
      <div className={classes.locationUpload}>
        <form
          onSubmit={
            this.state.mode === 'checking'
              ? this.approve
              : this.props.mode === 'edit'
              ? this.editLocation
              : this.createLocation
          }
        >
          <CustomInput
            key={'lat'}
            id={'lat'}
            elementType={'input'}
            value={this.props.lat}
            readOnly
          />
          <CustomInput
            key={form.id}
            id={form.id}
            elementType={'input'}
            value={this.props.lng}
            readOnly
          />
          {form}
          {timePicker}
          {this.state.mode === 'checking' ? (
            <React.Fragment>
              {previewCover}
              {previewImages}
            </React.Fragment>
          ) : null}
          {this.props.mode === 'edit' ? null : (
            <React.Fragment>
              <Label for='cover'>Upload cover image</Label>
              <Input
                type='file'
                id='cover'
                onChange={this.inputCover}
                required
              />
              {previewCover}
              <Label for='pics'>Upload Pictures(max 3)</Label>
              <Input
                type='file'
                id='pics'
                multiple
                onChange={this.inputPics}
                required
              />
              {previewImages}
            </React.Fragment>
          )}
          <Wysiwyg
            onEditorStateChange={this.onEditorStateChange}
            editorState={this.state.editorState}
            image={false}
          />
          {this.state.mode === 'checking' ? (
            <React.Fragment>
              <Button btnType='Success' onClick={this.approveLocation}>
                Approve
              </Button>
              <Button btnType='Danger' onClick={this.reject}>
                Delete
              </Button>
            </React.Fragment>
          ) : this.props.mode === 'edit' ? (
            <Button btnType='Success' disabled={!this.state.formIsValid}>
              Edit
            </Button>
          ) : (
            <Button btnType='Success' disabled={!this.state.formIsValid}>
              Create Location
            </Button>
          )}
        </form>
      </div>
    );
  }
}

export default withRouter(LocationUpload);
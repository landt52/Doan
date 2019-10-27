import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomInput from '../../components/Input/Input';
import {Input} from 'reactstrap';
import Button from '../../components/Button/Button';
import { Label } from 'reactstrap';
import Wysiwyg from '../../components/Wysiwyg/Wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';

class LocationUpload extends Component {
  state = {
    selectedCover: null,
    selectedPics: null,
    editorState: EditorState.createEmpty(),
    forms: {
      lat: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Latitude'
        },
        value: '',
        validation: {
          required: true,
          isNumber: true
        },
        valid: false,
        touched: false
      },
      lng: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Longitude'
        },
        value: '',
        validation: {
          required: true,
          isNumber: true
        },
        valid: false,
        touched: false
      },
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
    formIsValid: false
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
      this.setState({ selectedCover: event.target.files[0] });
    }
  };

  inputPics = event => {
    if (
      this.maxSelectFile(event, 3) &&
      this.checkFileType(event) &&
      this.checkFileSize(event)
    ) {
      this.setState({ selectedPics: event.target.files });
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
        if(hours[key][0] === '00:00' && hours[key][1] === '00:00'){
          hours[key] = 'Open 24 hours'
        }
      }
    }

    const summary = convertToRaw(this.state.editorState.getCurrentContent());

    data.append('summary', JSON.stringify(summary));
    data.append('lat', this.state.forms.lat.value);
    data.append('lng', this.state.forms.lng.value);
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
      this.props.history.push('/');
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

  render() {
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

    let form = forms.map(form => (
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

    return (
      <div className='container'>
        <div className='row'>
          <div className='offset-md-3 col-md-6'>
            <form onSubmit={this.createLocation}>
              {form}
              {timePicker}
              <Label for='cover'>Upload cover image</Label>
              <Input
                type='file'
                id='cover'
                onChange={this.inputCover}
                required
              />
              <Label for='pics'>Upload Pictures(max 3)</Label>
              <Input
                type='file'
                id='pics'
                multiple
                onChange={this.inputPics}
                required
              />
              <Wysiwyg
                onEditorStateChange={this.onEditorStateChange}
                editorState={this.state.editorState}
                image={false}
              />
              <Button btnType='Success' disabled={!this.state.formIsValid}>
                Create Location
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default LocationUpload;
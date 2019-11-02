import React, { Component } from 'react';
import axios from 'axios';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import classes from './UserPage.css';
import { toast } from 'react-toastify';
import buttonClasses from '../../components/AddButton/AddButton.css';
import Spinner from '../../components/Spinner/Spinner';
import {Link} from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';

class UserPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forms: {
        userName: {
          elementType: 'input',
          elementConfig: {
            type: 'text',
            placeholder: 'User Name'
          },
          value: '',
          validation: {
            required: true,
            minLength: 6,
            maxLength: 20
          },
          valid: false
        },
        email: {
          elementType: 'input',
          elementConfig: {
            type: 'email',
            placeholder: 'Your Email'
          },
          value: '',
          validation: {
            required: true,
            isEmail: true,
            maxLength: 20
          },
          valid: false
        },
        currentPassword: {
          elementType: 'input',
          elementConfig: {
            type: 'password',
            placeholder: 'Current Password'
          },
          value: '',
          validation: {
            required: true,
            minLength: 6
          },
          valid: false,
          touched: false
        },
        newPassword: {
          elementType: 'input',
          elementConfig: {
            type: 'password',
            placeholder: 'New Password'
          },
          value: '',
          validation: {
            required: true,
            minLength: 6
          },
          valid: false,
          touched: false
        },
        passwordConfirm: {
          elementType: 'input',
          elementConfig: {
            type: 'password',
            placeholder: 'Password Confirm'
          },
          value: '',
          validation: {
            required: true,
            minLength: 6
          },
          valid: false,
          touched: false
        }
      },
      photo: '',
      file: null,
      mode: 'info',
      myLocations: []
    };

    this.avatarChange = React.createRef();
    this.passwordChange = React.createRef();
  }

  componentDidMount() {
    axios('/api/user/myInfo').then(res => {
      const newFormsData = {
        ...this.state.forms,
        userName: {
          ...this.state.forms['userName'],
          value: res.data.data.user.userName
        },
        email: {
          ...this.state.forms['email'],
          value: res.data.data.user.email
        }
      };

      this.setState({ forms: newFormsData, photo: res.data.data.user.photo });
    });
  }

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

    return isValid;
  }

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

    this.setState({ forms: updatedForm });
  };

  submitInfo = event => {
    event.preventDefault();
    axios({
      url: '/api/user/updateInfo',
      method: 'PATCH',
      data: {
        userName: this.state.forms.userName.value,
        email: this.state.forms.email.value
      }
    })
      .then(() => toast.success('Đổi thông tin thành công'))
      .catch(err => toast.error(err.response.data.message));
  };

  changePassword = event => {
    event.preventDefault();
    axios({
      url: '/api/user/updatePassword',
      method: 'PATCH',
      data: {
        passwordCurrent: this.state.forms.currentPassword.value,
        password: this.state.forms.newPassword.value,
        passwordConfirm: this.state.forms.passwordConfirm.value
      }
    })
      .then(() => {
        toast.success('Đổi password thành công');
      })
      .catch(err => {
        toast.error(err.response.data.message);
      });
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

  updateAvatar = event => {
    if (
      this.maxSelectFile(event, 1) &&
      this.checkFileType(event) &&
      this.checkFileSize(event)
    ) {
      this.setState(
        { photo: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] }
      );
    }
  };

  changeAvatar = async () => {
    const data = new FormData();
    if(this.state.file) {
      data.append('avatar', this.state.file);
    try {
      await axios('/api/user/changeAvatar', {
        method: 'PATCH',
        headers: {
          'content-type': 'multipart/form-data'
        },
        data
      });
      toast.success('Upload thành công');
    } catch (error) {
       toast.error(error.response.data.message);
    }
  }
  }

  loadLocations = async () => {
    this.setState({mode: 'location'});
    try {
      const data = await axios('/api/user/myLocations');
      this.setState({myLocations: data.data.locations});
    } catch ({response}) {
      toast.error({response})
    }
  }

  deleteReview = async id => {
    try {
      await axios(`/api/location/${id}`, {
        method: 'DELETE'
      });
      toast.success('Xóa địa điểm thành công')
      this.props.history.goBack()
    } catch ({response}) {
      toast.error({response})
    }

  }

  render() {
    const forms = [];
    for (let key in this.state.forms) {
      forms.push({
        id: key,
        config: this.state.forms[key]
      });
    }

    let form = forms.map(form => (
      <Input
        key={form.id}
        label={form.config.elementConfig.placeholder}
        elementType={form.config.elementType}
        elementConfig={form.config.elementConfig}
        value={form.config.value}
        invalid={!form.config.valid}
        shouldValidate={form.config.validation}
        touched={form.config.touched}
        changed={event => this.inputChanged(event, form.id)}
      />
    ));

    const [userName, email, ...rest] = form;

    return (
      <div className={classes.UserPage}>
        <div className={classes.AvatarChange}>
          <img
            src={this.state.photo}
            alt='Avatar'
            className={classes.avatar}
            onClick={() => this.avatarChange.current.click()}
          />
          <h2 className={classes.name}>{this.state.forms.userName.value}</h2>
          <input
            type='file'
            id='selectedFile'
            style={{ display: 'none' }}
            ref={this.avatarChange}
            onChange={this.updateAvatar}
          />
          <Button btnType='Success' clicked={this.changeAvatar}>
            Change Avatar
          </Button>
          <button
            style={{
              letterSpacing: 0,
              width: '100%',
              background: 'transparent'
            }}
            className={[
              buttonClasses.button,
              buttonClasses.buttonNormal,
              buttonClasses.fromLeft
            ].join(' ')}
            onClick={() => this.setState({ mode: 'info' })}
          >
            Change Info
          </button>
          <button
            style={{
              letterSpacing: 0,
              width: '100%',
              background: 'transparent'
            }}
            className={[
              buttonClasses.button,
              buttonClasses.buttonNormal,
              buttonClasses.fromLeft
            ].join(' ')}
            onClick={this.loadLocations}
          >
            My Locations
          </button>
          <button
            style={{
              letterSpacing: 0,
              width: '100%',
              background: 'transparent'
            }}
            className={[
              buttonClasses.button,
              buttonClasses.buttonNormal,
              buttonClasses.fromLeft
            ].join(' ')}
            onClick={() => this.setState({ mode: 'review' })}
          >
            My Reviews
          </button>
        </div>
        {this.state.mode === 'info' ? (
          <div className={classes.Settings}>
            <h1>Account Setting</h1>
            <form className={classes.AccountSetting} onSubmit={this.submitInfo}>
              {userName}
              {email}
              <Button btnType='Success'>Change Info</Button>
            </form>
            <br />
            <hr className={classes.hr} />
            <h1>Change Password</h1>
            <form
              className={classes.PasswordChange}
              onSubmit={this.changePassword}
            >
              {rest}
              <Button btnType='Success'>Change Password</Button>
            </form>
          </div>
        ) : this.state.mode === 'location' ? (
          <div>
            {this.state.myLocations.length === 0 ? (
              <Spinner />
            ) : (
              this.state.myLocations.map(location => (
                <div key={location.id} className={classes.locationCard}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1
                    }}
                  >
                    <Link
                      to={{
                        pathname: `/location/${location.id}`
                      }}
                    >
                      {location.location.name}
                    </Link>
                    <Rating value={location.location.rating} readOnly />
                    <Link to={{pathname: `/location/edit/${location.id}`}}>
                      <button
                        className={buttonClasses.buttonSmall}>
                        Edit
                      </button>
                    </Link>
                    <button
                      className={buttonClasses.buttonSmallDelete}
                      onClick={() => this.deleteReview(location.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <img
                    style={{ flexBasis: '20%', width: '20%' }}
                    src={location.location.cover}
                    alt={location.location.name}
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          <h2>HIIII</h2>
        )}
      </div>
    );
  }
}

export default UserPage;
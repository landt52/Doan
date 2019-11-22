import React, { Component } from 'react';
import axios from 'axios';
import CustomInput from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import classes from './UserPage.css';
import { toast } from 'react-toastify';
import buttonClasses from '../../components/AddButton/AddButton.css';
import { FormGroup, Input } from 'reactstrap';
import Spinner from '../../components/Spinner/Spinner';
import {Link} from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import Reviews from '../../components/Reviews/Reviews';
import {connect} from 'react-redux';
import UserCard from '../../components/UserCard/UserCard';
import Pagination from '../../components/Pagination/Pagination';
import SearchBar from '../../components/SearchBar/SearchBar';
import Tickets from '../../components/Tickets/Tickets';
import ManageIcons from '../ManageIcons/ManageIcons';

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
      myLocations: null,
      myReviews: null,
      users: null,
      allLocations: null,
      allReviews: null,
      currentPage: 1,
      itemsPerPage: 20,
      filterLocation: null,
      filterAllLocation: null,
      filterUser: null,
      filterReview: null,
      filterAllReview: null,
      pendingLocations: null,
      tickets: null
    };
    this.indexOfLastItem = this.state.currentPage * this.state.itemsPerPage;
    this.indexOfFirstItem = this.indexOfLastItem - this.state.itemsPerPage;
    this.avatarChange = React.createRef();
    this.passwordChange = React.createRef();
  }

  getCurrentItems = items => {
    if(items.length > 1 && items !== null)
    return items.slice(this.indexOfFirstItem, this.indexOfLastItem);
    else return [...items]
  };

  componentDidMount() {
    axios('/api/user/myInfo')
      .then(res => {
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
      })
      .catch(err => toast.error(err.response.data.message));
    axios('/api/user/myTicket')
      .then(res => {
        this.setState({tickets: res.data.tickets});
      })
    if (this.props.role === 'Admin') {
      axios('/api/location/isPending')
        .then(res => {
          this.setState({
            pendingLocations: res.data.pendingLocations
          });
        })
        .catch(({ response }) => {
          toast.err(response.data.message);
        });
    }
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
      this.setState({
        photo: URL.createObjectURL(event.target.files[0]),
        file: event.target.files[0]
      });
    }
  };

  changeAvatar = async () => {
    const data = new FormData();
    if (this.state.file) {
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
  };

  loadLocations = async () => {
    this.setState({ mode: 'location' });
    try {
      const data = await axios('/api/user/myLocations');
      this.setState({
        myLocations: data.data.locations,
        currentPage: 1,
        filterLocation: data.data.locations
      });
    } catch ({ response }) {
      toast.error(response.data.message);
    }
  };

  loadReviews = async () => {
    this.setState({ mode: 'review' });
    try {
      const data = await axios('/api/user/myReviews');
      this.setState({
        myReviews: data.data.reviews,
        filterReview: data.data.reviews,
        currentPage: 1
      });
    } catch ({ response }) {
      toast.error(response.data.message);
    }
  };

  deleteLocation = async id => {
    try {
      await axios(`/api/location/${id}`, {
        method: 'DELETE'
      });

      const remainLocations =
        this.state.myLocations !== null
          ? this.state.myLocations.filter(location => location.id !== id)
          : null;
      const remainAllLocations =
        this.state.allLocations !== null
          ? this.state.allLocations.filter(location => location.id !== id)
          : null;

      this.setState({
        myLocations: remainLocations,
        filterLocation: remainLocations,
        allLocations: remainAllLocations,
        filterAllLocation: remainAllLocations,
        currentPage: 1
      });
      toast.success('Xóa địa điểm thành công');
    } catch ({ response }) {
      toast.error(response.data.message);
    }
  };

  loadTickets = () => {
    this.setState({ mode: 'tickets' });
  }

  acceptTicket = async (e, id) => {
    try {
      await axios(`/api/user/myTicket/${id}`, {
        method: 'DELETE'
      })
      const remainTickets =
        this.state.tickets !== null
          ? this.state.tickets.filter(ticket => ticket._id !== id)
          : null;
      this.setState({tickets: remainTickets});
    } catch ({response}) {
      toast.error(response.data.message);
    }
  }

  deleteLocationAdmin = async (id, writer, name) => {
    try {
      const reason = prompt('Reason to delete this location');

      if(reason === null || reason === "") return;
      else{
          await axios(
            `/api/location/reject/${id}`,
            {
              method: 'DELETE',
              data: {
                name,
                writer,
                reason
              }
            }
          );
          const remainLocations =
            this.state.myLocations !== null
              ? this.state.myLocations.filter(location => location.id !== id)
              : null;
          const remainAllLocations =
            this.state.allLocations !== null
              ? this.state.allLocations.filter(location => location.id !== id)
              : null;

          this.setState({
            myLocations: remainLocations,
            filterLocation: remainLocations,
            allLocations: remainAllLocations,
            filterAllLocation: remainAllLocations,
            currentPage: 1
          });
          toast.success('Xóa địa điểm thành công');
      }
     
    } catch ({ response }) {
      toast.error(response.data.message);
    }
  };

  updateReview = async (reviewId, rating, review) => {
    try {
      const updateReview = await axios(`/api/review/${reviewId}`, {
        method: 'PATCH',
        data: {
          rating,
          review
        }
      });

      const reviews = [...this.state.myReviews];
      const reviewIndex = this.state.myReviews.findIndex(
        review => review.id === updateReview.data.data.review.id
      );
      const updatedReview = {
        ...reviews[reviewIndex],
        rating: updateReview.data.data.review.rating,
        review: updateReview.data.data.review.review
      };
      reviews[reviewIndex] = updatedReview;

      this.setState({ myReviews: reviews, filterReview: reviews });
      toast.success('Đổi thông tin review thành công');
    } catch ({ response }) {
      toast.error(response.data.message);
    }
  };

  deleteReview = async id => {
    try {
      await axios(`/api/review/${id}`, {
        method: 'DELETE'
      });

      const remainReviews =
        this.state.myReviews !== null
          ? this.state.myReviews.filter(review => review.id !== id)
          : null;

      const remainAllReviews =
        this.state.allReviews !== null
          ? this.state.allReviews.filter(review => review.id !== id)
          : null;

      this.setState({
        myReviews: remainReviews,
        allReviews: remainAllReviews,
        filterReview: remainReviews,
        filterAllReview: remainAllReviews,
        currentPage: 1
      });
      toast.success('Xóa review thành công');
    } catch ({ response }) {
      toast.error(response.data.message);
    }
  };

  loadUsers = async () => {
    this.setState({ mode: 'manage user' });
    const users = await axios('/api/user');
    this.setState({
      users: users.data.data.users,
      filterUser: users.data.data.users,
      currentPage: 1
    });
  };

  deactivateUser = async id => {
    try {
      await axios(`/api/user/deactivateUser/${id}`, {
        method: 'DELETE'
      });
      toast.success('Khóa tài khoản thành công');

      const remainUsers = this.state.users.filter(user => user.id !== id);

      this.setState({
        users: remainUsers,
        filterUser: remainUsers,
        currentPage: 1
      });
    } catch ({ response }) {
      toast.error(response.data.message);
    }
  };

  updateUser = async (userName, email, id) => {
    try {
      const updateUser = await axios(`/api/user/${id}`, {
        method: 'PATCH',
        data: {
          userName,
          email
        }
      });

      const users = [...this.state.users];
      const userIndex = this.state.users.findIndex(
        user => user.id === updateUser.data.data.user.id
      );
      const updatedUser = {
        ...users[userIndex],
        email: updateUser.data.data.user.email,
        userName: updateUser.data.data.user.userName
      };
      users[userIndex] = updatedUser;

      this.setState({ users, filterUser: users });
      toast.success('Đổi thông tin thành công');
    } catch ({ response }) {
      toast.error(response.data.message);
    }
  };

  loadAllLocations = async () => {
    this.setState({ mode: 'manage location' });
    try {
      const locations = await axios('/api/location');
      this.setState({
        allLocations: locations.data.data.locationsData,
        filterAllLocation: locations.data.data.locationsData,
        currentPage: 1
      });
    } catch ({ response }) {
      toast.error(response.data.message);
    }
  };

  loadAllReviews = async () => {
    this.setState({ mode: 'manage reviews' });
    try {
      const reviews = await axios('/api/review');
      this.setState({
        allReviews: reviews.data.data.reviews,
        filterAllReview: reviews.data.data.reviews,
        currentPage: 1
      });
    } catch ({ response }) {
      toast.error(response.data.message);
    }
  };

  loadMapIcons = () => {
    this.setState({mode: 'manage icons'})
  }

  paginate = pageNumber => {
    this.setState({ currentPage: pageNumber });
  };

  filterLocation = e => {
    let currentLocations = [],
      filterLocation = [],
      currentAllLocations = [],
      filterAllLocation = [];
    if (e.target.value !== '') {
      currentLocations = this.state.myLocations;
      currentAllLocations = this.state.allLocations;
      filterLocation =
        currentLocations !== null
          ? [
              // eslint-disable-next-line array-callback-return
              ...this.state.myLocations.filter(location => {
                if (location.location.name) {
                  const ll = location.location.name.toLowerCase();
                  const lt = e.target.value.toLowerCase();
                  return ll.includes(lt);
                }
              })
            ]
          : [];
      filterAllLocation =
        currentAllLocations !== null
          ? [
              // eslint-disable-next-line array-callback-return
              ...this.state.allLocations.filter(location => {
                if (location.location.name) {
                  const ll = location.location.name.toLowerCase();
                  const lt = e.target.value.toLowerCase();
                  return ll.includes(lt);
                }
              })
            ]
          : [];
      this.setState({ filterLocation, filterAllLocation });
    } else
      this.setState({
        filterLocation: this.state.myLocations,
        filterAllLocation: this.state.allLocations
      });
  };

  filterUser = e => {
    let currentUsers = [],
      filterUser = [];
    if (e.target.value !== '') {
      currentUsers = this.state.users;
      filterUser =
        currentUsers !== null
          ? [
              // eslint-disable-next-line array-callback-return
              ...this.state.users.filter(user => {
                if (user.userName) {
                  const lu = user.userName.toLowerCase();
                  const lt = e.target.value.toLowerCase();
                  return lu.includes(lt);
                }
              })
            ]
          : [];
      this.setState({ filterUser });
    } else
      this.setState({
        filterUser: this.state.users
      });
  };

  filterReview = e => {
    let currentReviews = [],
      filterReview = [],
      currentAllReviews = [],
      filterAllReview = [];
    if (e.target.value !== '') {
      currentReviews = this.state.myReviews;
      currentAllReviews = this.state.allReviews;
      filterReview =
        currentReviews !== null
          ? [
              // eslint-disable-next-line array-callback-return
              ...this.state.myReviews.filter(review => {
                if (review.location.location.name) {
                  const ll = review.location.location.name.toLowerCase();
                  const lt = e.target.value.toLowerCase();
                  return ll.includes(lt);
                }
              })
            ]
          : [];
      filterAllReview =
        currentAllReviews !== null
          ? [
              // eslint-disable-next-line array-callback-return
              ...this.state.allReviews.filter(review => {
                if (review.location.location.name) {
                  const ll = review.location.location.name.toLowerCase();
                  const lt = e.target.value.toLowerCase();
                  return ll.includes(lt);
                }
              })
            ]
          : [];
      this.setState({ filterReview, filterAllReview });
    } else
      this.setState({
        filterReview: this.state.myReviews,
        filterAllReview: this.state.allReviews
      });
  };

  render() {
    this.indexOfLastItem = this.state.currentPage * this.state.itemsPerPage;
    this.indexOfFirstItem = this.indexOfLastItem - this.state.itemsPerPage;
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
            onClick={this.loadReviews}
          >
            My Reviews
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
            onClick={this.loadTickets}
          >
            Approval / Rejection
            {this.state.tickets && this.state.tickets.length !== 0 ? (
              <span className={classes.pendingCount}>
                {this.state.tickets.length}
              </span>
            ) : null}
          </button>
          {this.props.role === 'Admin' ? (
            <React.Fragment>
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
                onClick={this.loadUsers}
              >
                Manage Users
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
                onClick={this.loadAllLocations}
              >
                Manage Locations{' '}
                {this.state.pendingLocations &&
                this.state.pendingLocations.length !== 0 ? (
                  <span className={classes.pendingCount}>
                    {this.state.pendingLocations.length}
                  </span>
                ) : null}
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
                onClick={this.loadAllReviews}
              >
                Manage Reviews
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
                onClick={this.loadMapIcons}
              >
                Manage Map Icons
              </button>
            </React.Fragment>
          ) : null}
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
          <div style={{ width: '100%' }}>
            {!this.state.myLocations ? (
              <Spinner />
            ) : this.state.myLocations.length !== 0 ? (
              <React.Fragment>
                <SearchBar changed={this.filterLocation} />
                {this.getCurrentItems(this.state.filterLocation).map(
                  location => (
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
                        <Link
                          to={{ pathname: `/location/edit/${location.id}` }}
                        >
                          <button className={buttonClasses.buttonSmall}>
                            Edit
                          </button>
                        </Link>
                        <button
                          className={buttonClasses.buttonSmallDelete}
                          onClick={() => this.deleteLocation(location.id)}
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
                  )
                )}
                <Pagination
                  itemsPerPage={this.state.itemsPerPage}
                  totalItems={this.state.filterLocation.length}
                  paginate={this.paginate}
                  currentPage={this.state.currentPage}
                />
              </React.Fragment>
            ) : this.state.myLocations === null ? (
              <h2 className={classes.notFound}>Bạn chưa tạo địa điểm</h2>
            ) : (
              <SearchBar changed={this.filterLocation} />
            )}
          </div>
        ) : this.state.mode === 'review' ? (
          <div style={{ width: '100%' }}>
            {!this.state.myReviews ? (
              <Spinner />
            ) : this.state.myReviews.length !== 0 ? (
              <React.Fragment>
                <SearchBar changed={this.filterReview} />
                {this.getCurrentItems(this.state.filterReview).map(review => (
                  <Reviews
                    key={review.id}
                    userId={this.props.userId}
                    data={review}
                    deleteReview={this.deleteReview}
                    editReview={this.updateReview}
                  />
                ))}
                <Pagination
                  itemsPerPage={this.state.itemsPerPage}
                  totalItems={this.state.filterReview.length}
                  paginate={this.paginate}
                  currentPage={this.state.currentPage}
                />
              </React.Fragment>
            ) : this.state.myReviews === null ? (
              <h2 className={classes.notFound}>Bạn chưa viết đánh giá nào</h2>
            ) : (
              <SearchBar changed={this.filterReview} />
            )}
          </div>
        ) : this.state.mode === 'tickets' ? (
          <div style={{ width: '100%' }}>
            {!this.state.tickets ? (
              <Spinner />
            ) : this.state.tickets.length !== 0 ? (
              <React.Fragment>
                {this.getCurrentItems(this.state.tickets).map(ticket => (
                  <Tickets
                    key={ticket._id}
                    ticket={ticket}
                    acceptTicket={this.acceptTicket}
                  />
                ))}
                <Pagination
                  itemsPerPage={this.state.itemsPerPage}
                  totalItems={this.state.tickets.length}
                  paginate={this.paginate}
                  currentPage={this.state.currentPage}
                />
              </React.Fragment>
            ) : (
              this.state.tickets.length === 0 && (
                <h2 className={classes.notFound}>Không có thông báo nào</h2>
              )
            )}
          </div>
        ) : this.state.mode === 'manage user' ? (
          <div style={{ width: '100%' }}>
            {!this.state.users ? (
              <Spinner />
            ) : this.state.users.length !== 0 ? (
              <React.Fragment>
                <SearchBar changed={this.filterUser} />
                {this.getCurrentItems(this.state.filterUser).map(user => (
                  <UserCard
                    data={user}
                    currentID={this.props.userId}
                    key={user.id}
                    deactivateUser={this.deactivateUser}
                    updateUser={this.updateUser}
                  />
                ))}
                <Pagination
                  itemsPerPage={this.state.itemsPerPage}
                  totalItems={this.state.filterUser.length}
                  paginate={this.paginate}
                  currentPage={this.state.currentPage}
                />
              </React.Fragment>
            ) : this.state.users === null ? (
              <h2 className={classes.notFound}>Không tìm thấy user</h2>
            ) : (
              <SearchBar changed={this.filterUser} />
            )}
          </div>
        ) : this.state.mode === 'manage location' ? (
          <div style={{ width: '100%' }}>
            {!this.state.allLocations ? (
              <Spinner />
            ) : this.state.allLocations.length !== 0 ? (
              <React.Fragment>
                <SearchBar changed={this.filterLocation} />
                <FormGroup>
                  <Input
                    type='select'
                    id='selectType'
                    style={{ width: '30%' }}
                    onChange={e => {
                      this.setState({
                        mode: e.target.value.toLowerCase()
                      });
                    }}
                  >
                    <option>Manage Location</option>
                    <option>Pending Locations</option>
                  </Input>
                </FormGroup>
                {this.getCurrentItems(this.state.filterAllLocation).map(
                  location => (
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
                        <Link
                          to={{ pathname: `/location/edit/${location.id}` }}
                        >
                          <button className={buttonClasses.buttonSmall}>
                            Edit
                          </button>
                        </Link>
                        <button
                          className={buttonClasses.buttonSmallDelete}
                          onClick={() =>
                            this.deleteLocationAdmin(
                              location.id,
                              location.location.writer,
                              location.location.name
                            )
                          }
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
                  )
                )}
                <Pagination
                  itemsPerPage={this.state.itemsPerPage}
                  totalItems={this.state.filterAllLocation.length}
                  paginate={this.paginate}
                  currentPage={this.state.currentPage}
                />
              </React.Fragment>
            ) : this.state.myLocations === null ? (
              <React.Fragment>
                <h2 className={classes.notFound}>Không có địa điểm nào</h2>
                <FormGroup>
                  <Input
                    type='select'
                    id='selectType'
                    style={{ width: '30%' }}
                    onChange={e => {
                      this.setState({
                        mode: e.target.value.toLowerCase()
                      });
                    }}
                  >
                    <option>Manage Location</option>
                    <option>Pending Locations</option>
                  </Input>
                </FormGroup>
              </React.Fragment>
            ) : (
              <SearchBar changed={this.filterLocation} />
            )}
          </div>
        ) : this.state.mode === 'pending locations' ? (
          <div style={{ width: '100%' }}>
            {!this.state.pendingLocations ? (
              <Spinner />
            ) : this.state.pendingLocations.length !== 0 ? (
              <React.Fragment>
                <FormGroup>
                  <Input
                    type='select'
                    id='selectType'
                    style={{ width: '30%' }}
                    onChange={e => {
                      this.setState({
                        mode: e.target.value.toLowerCase()
                      });
                    }}
                  >
                    <option>Pending Locations</option>
                    <option>Manage Location</option>
                  </Input>
                </FormGroup>
                {this.getCurrentItems(this.state.pendingLocations).map(
                  location => (
                    <div key={location.id} className={classes.locationCard}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          flexGrow: 1
                        }}
                      >
                        <p>{location.location.name}</p>
                        <Rating value={location.location.rating} readOnly />
                        <p>Author: {location.location.writer.userName}</p>
                        <Link
                          to={{ pathname: `/location/checking/${location.id}` }}
                        >
                          <button className={buttonClasses.buttonSmall}>
                            Info
                          </button>
                        </Link>
                      </div>
                      <img
                        style={{ flexBasis: '20%', width: '20%' }}
                        src={location.location.cover}
                        alt={location.location.name}
                      />
                    </div>
                  )
                )}
                <Pagination
                  itemsPerPage={this.state.itemsPerPage}
                  totalItems={this.state.pendingLocations.length}
                  paginate={this.paginate}
                  currentPage={this.state.currentPage}
                />
              </React.Fragment>
            ) : (
              <h2 className={classes.notFound}>
                Không có địa điểm nào mới được tạo
              </h2>
            )}
          </div>
        ) : this.state.mode === 'manage review ' ? (
          <div style={{ width: '100%' }}>
            {!this.state.allReviews ? (
              <Spinner />
            ) : this.state.allReviews.length !== 0 ? (
              <React.Fragment>
                <SearchBar changed={this.filterReview} />
                {this.getCurrentItems(this.state.filterAllReview).map(
                  review => (
                    <Reviews
                      key={review.id}
                      userId={this.props.userId}
                      data={review}
                      deleteReview={this.deleteReview}
                      editReview={this.updateReview}
                      role={this.props.role}
                    />
                  )
                )}
                <Pagination
                  itemsPerPage={this.state.itemsPerPage}
                  totalItems={this.state.filterAllReview.length}
                  paginate={this.paginate}
                  currentPage={this.state.currentPage}
                />
              </React.Fragment>
            ) : this.state.allReviews === null ? (
              <h2 className={classes.notFound}>Không có đánh giá nào</h2>
            ) : (
              <SearchBar changed={this.filterReview} />
            )}
          </div>
        ) : (
          <ManageIcons />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.auth.id,
    role: state.auth.role
  };
}

export default connect(mapStateToProps)(UserPage);
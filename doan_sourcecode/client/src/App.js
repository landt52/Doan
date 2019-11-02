import React, {Component, lazy, Suspense} from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from './store/actions/index';
import Auxiliary from './hoc/Auxiliary/Auxiliary';
import ErrorBoundary from './ErrorBoundary';
import Navigation from './hoc/Navigation/Navigation'; 
const Districts = lazy(() => import('./containers/Districts/Districts')); 
const ProvincePage = lazy(() => import('./containers/EditPage/ProvincePage'));
const VNPage = lazy(() => import('./containers/EditPage/VNPage'));
const DistrictUploadPage = lazy(() => import('./containers/DistrictUploadPage/DistrictUploadPage'));
const InfoPage = lazy(() => import('./containers/InfoPage/InfoPage'));
const AqiWeather = lazy(() => import('./containers/Aqi-Weather/AqiWeather')); 
const LocationUpload = lazy(() => import('./containers/LocationUpload/LocationUploadMap')); 
const Login = lazy(() => import('./containers/Login/Login'));
const Logout = lazy(() => import('./containers/Logout/Logout')); 
const Signup = lazy(() => import('./containers/Signup/Signup'));
const UserPage = lazy(() => import('./containers/UserPage/UserPage'));
const Provinces = lazy(() => import('./containers/Provinces/Provinces'));
const Location = lazy(() => import('./containers/Location/Location'));
const LocationInfo = lazy(() => import('./containers/LocationPage/LocationPage'));
const Review = lazy(() => import('./containers/AddReview/AddReview'));
const EditLocation = lazy(() => import('./containers/LocationEdit/LocationEdit'));

class App extends Component {
  componentDidMount(){
    this.props.autoSignup();
  }

  render(){
    let routes = (
      <Auxiliary>
        <Switch>
          <Suspense fallback={<div>...Loading</div>}>
            <ErrorBoundary>
              <Route
                path='/provinces/:provinceName'
                exact
                component={ProvincePage}
              />
              <Route
                path='/provinces/info/:provinceId'
                exact
                component={InfoPage}
              />
              <Route path='/map' exact component={VNPage} />
              <Route path='/aqi' exact component={AqiWeather} />
              <Route path='/location' exact component={Location} />
              <Route
                path='/location/:locationId'
                exact
                component={LocationInfo}
              />
              <Route path='/login' exact component={Login} />
              <Route path='/signup' exact component={Signup} />
              <Route path='/' exact component={Provinces} />
              <Redirect to='/' />
            </ErrorBoundary>
          </Suspense>
        </Switch>
        <ToastContainer />
      </Auxiliary>
    );

    if(this.props.isAuthenticated && this.props.role !== 'Admin'){
      routes = (
        <Auxiliary>
          <Switch>
            <Suspense fallback={<div>...Loading</div>}>
              <ErrorBoundary>
                <Route
                  path='/provinces/:provinceName'
                  exact
                  component={ProvincePage}
                />
                <Route
                  path='/provinces/info/:provinceId'
                  exact
                  component={InfoPage}
                />
                <Route path='/map' exact component={VNPage} />
                <Route path='/aqi' exact component={AqiWeather} />
                <Route path='/location' exact component={Location} />
                <Route
                  path='/location/:locationId'
                  exact
                  component={LocationInfo}
                />
                <Route path='/addLocation' exact component={LocationUpload} />
                <Route path='/location/:locationId/review' exact component={Review} />
                <Route path='/location/edit/:locationId' exact component={EditLocation} />
                <Route path='/logout' exact component={Logout} />
                <Route path='/user' exact component={UserPage} />
                <Route path='/' exact component={Provinces} />
                <Redirect to='/' />
              </ErrorBoundary>
            </Suspense>
          </Switch>
          <ToastContainer />
        </Auxiliary>
      );
    }

    if(this.props.isAuthenticated && this.props.role === 'Admin'){
      routes = (
        <Auxiliary>
          <Switch>
            <Suspense fallback={<div>...Loading</div>}>
              <ErrorBoundary>
                <Route path='/districts' exact component={Districts} />
                <Route
                  path='/provinces/:provinceName'
                  exact
                  component={ProvincePage}
                />
                <Route
                  path='/provinces/info/:provinceId'
                  exact
                  component={InfoPage}
                />
                <Route
                  path='/provinces/edit/:provinceId'
                  exact
                  render={props => (
                    <DistrictUploadPage {...props} type='province' />
                  )}
                />
                <Route
                  path='/districts/edit/:districtId'
                  exact
                  render={props => (
                    <DistrictUploadPage {...props} type='district' />
                  )}
                />
                <Route
                  path='/location/edit/:locationId'
                  exact
                  component={EditLocation}
                />
                <Route path='/map' exact component={VNPage} />
                <Route path='/aqi' exact component={AqiWeather} />
                <Route path='/location' exact component={Location} />
                <Route
                  path='/location/:locationId'
                  exact
                  component={LocationInfo}
                />
                <Route path='/addLocation' exact component={LocationUpload} />
                <Route
                  path='/location/:locationId/review'
                  exact
                  component={Review}
                />
                <Route path='/logout' exact component={Logout} />
                <Route path='/user' exact component={UserPage} />
                <Route path='/' exact component={Provinces} />
                <Redirect to='/' />
              </ErrorBoundary>
            </Suspense>
          </Switch>
          <ToastContainer />
        </Auxiliary>
      );
    }

    return (
      <Navigation>
        {routes}
      </Navigation>
    );
  }
}; 

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.jwt,
    role: state.auth.role
  }
}

const mapDispatchToProps = dispatch => {
  return {
    autoSignup: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

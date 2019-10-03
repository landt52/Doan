import React, {Component} from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Navigation from './hoc/Navigation/Navigation';
import Districts from './containers/Districts/Districts';
import Provinces from './containers/Provinces/Provinces';
import ProvincePage from './containers/EditPage/ProvincePage';
import VNPage from './containers/EditPage/VNPage';
import DistrictUploadPage from './containers/DistrictUploadPage/DistrictUploadPage';
import InfoPage from './containers/InfoPage/InfoPage';
import AqiWeather from './containers/Aqi-Weather/AqiWeather';
import Auxiliary from './hoc/Auxiliary/Auxiliary';

class App extends Component {
  render(){
    let routes = (
      <Auxiliary>
        <Switch>
          <Route path='/provinces' exact component={Provinces} />
          <Route path='/provinces/:provinceName' exact component={ProvincePage} />
          <Route path='/provinces/edit/:provinceId' exact component={DistrictUploadPage}/>
          <Route path='/provinces/info/:provinceId' exact component={InfoPage}/>
          <Route path='/districts/edit/:districtId' exact component={DistrictUploadPage} />
          <Route path='/districts' exact component={Districts} />
          <Route path='/aqi' exact component={AqiWeather} />
          <Route path='/' exact component={VNPage} />
          <Redirect to='/' />
        </Switch>
        <ToastContainer />
      </Auxiliary>
    );

    return (
      <Navigation>
        {routes}
      </Navigation>
    );
  }
}; 

export default withRouter(App);

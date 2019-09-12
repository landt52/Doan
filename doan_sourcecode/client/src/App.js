import React, {Component} from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Map from './containers/Map/Map';
import Navigation from './hoc/Navigation/Navigation';
import Districts from './containers/Districts/Districts';
import Provinces from './containers/Provinces/Provinces';
import ProvincePage from './containers/EditPage/ProvincePage';
import DistrictUploadPage from './containers/DistrictUploadPage/DistrictUploadPage';
import Auxiliary from './hoc/Auxiliary/Auxiliary';

class App extends Component {
  render(){
    let routes = (
      <Auxiliary>
        <Switch>
          <Route path='/provinces' exact component={Provinces} />
          <Route path='/provinces/:provinceName' component={ProvincePage} />
          <Route path='/districts/:districtId' component={DistrictUploadPage} />
          <Route path='/districts' exact component={Districts} />
          <Route
            path='/'
            exact
            component={() => {
              return <Map zoom={6}/>;
            }}
          />
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

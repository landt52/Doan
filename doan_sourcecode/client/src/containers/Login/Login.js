import React, { Component } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import {Link, Redirect} from 'react-router-dom';
import classes from './Login.css';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';

class Login extends Component {
  state = {
    forms: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
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

    let formIsValid = true;
    for (let form in updatedForm) {
      formIsValid = updatedForm[form].valid && formIsValid;
    }

    this.setState({ forms: updatedForm, formIsValid });
  };

  submit = event => {
    event.preventDefault();
    this.props.login(
      this.state.forms.email.value,
      this.state.forms.password.value
    );
    this.props.setAuthRedirect("/");
  };

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
          elementType={form.config.elementType}
          elementConfig={form.config.elementConfig}
          value={form.config.value}
          invalid={!form.config.valid}
          shouldValidate={form.config.validation}
          touched={form.config.touched}
          changed={event => this.inputChanged(event, form.id)}
        />
      ));

      let redirect = null;

      redirect = this.props.isAuthenticated && <Redirect to={this.props.redirect} exact="true" />

    return (
      <div className={classes.Login}>
        <form onSubmit={this.submit}>
          {form}
          {redirect}
          <Button disabled={!this.state.formIsValid} btnType='Success'>
            SUBMIT
          </Button>
          <p>
            Dont' have account yet ?{' '}
            <Link to='/signup' exact='true'>
              Signup
            </Link>
          </p>
          <p>
            Forgot Password ?{' '}
            <Link to='/forgotPassword' exact='true'>
              Forgot Password
            </Link>
          </p>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.jwt,
    loading: state.auth.loading,
    redirect: state.auth.redirect
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: (email, password) => dispatch(actions.auth(email, password)),
    setAuthRedirect: () => dispatch(actions.setAuthRedirect())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
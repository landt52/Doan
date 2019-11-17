import React, { Component } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import classes from './ForgotPassword.css';
import axios from 'axios';
import {toast} from 'react-toastify';

class ForgotPassword extends Component {
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
            token: {
                elementType: 'input',
                elementConfig: {
                type: 'test',
                placeholder: 'Insert Token Here'
                },
                validation: {
                    minLength: 0
                },
                value: '',
                valid: true,
                touched: true
            }
        },
        formIsValid: false,
        mode: '',
        token: '',
        resetPasswordForms: {
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
        passwordIsValid: false
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

        let formIsValid = true;
        for (let form in updatedForm) {
        formIsValid = updatedForm[form].valid && formIsValid;
        }

        this.setState({ forms: updatedForm, formIsValid });
    };

    passwordChanged = (event, formName) => {
         const updatedForm = {
           ...this.state.resetPasswordForms,
           [formName]: {
             ...this.state.resetPasswordForms[formName],
             value: event.target.value,
             valid: this.checkValidity(
               event.target.value,
               this.state.resetPasswordForms[formName].validation
             ),
             touched: true
           }
         };

         let formIsValid = true;
         for (let form in updatedForm) {
           formIsValid = updatedForm[form].valid && formIsValid;
         }

         this.setState({
           resetPasswordForms: updatedForm,
           passwordIsValid: formIsValid
         });
    };

    submit = async e => {
        e.preventDefault();
        try {
            await axios('/api/user/forgotPassword', {
              method: 'POST',
              data: {
                email: this.state.forms.email.value
              }
            });
            toast.success("Hãy kiểm tra email")
        } catch ({reponse}) {
            toast.error(reponse.data.message);
        }
    };

    insertToken = e => {
        e.preventDefault();
        this.setState({mode: 'Reset Password', token: this.state.forms.token.value})
    }

    resetPassword = async (e) => {
      e.preventDefault();
      const data = {
        password: this.state.resetPasswordForms.password.value,
        passwordConfirm: this.state.resetPasswordForms.passwordConfirm.value,
      }

      try {
        await axios(`/api/user/resetPassword/${this.state.token}`, {
          method: "PATCH",
          data
        })
        toast.success("Đổi password thành công")
        this.props.login(this.state.forms.email.value, this.state.resetPasswordForms.password.value);
      } catch ({response}) {
        toast.error(response.data.message);
      } 
    }

    render() {
        const forms = [], passwordForms = [];
        for (let key in this.state.forms) {
          forms.push({
            id: key,
            config: this.state.forms[key]
          });
        }

        for (let key in this.state.resetPasswordForms) {
          passwordForms.push({
            id: key,
            config: this.state.resetPasswordForms[key]
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

        let passwordForm = passwordForms.map(form => (
          <Input
            key={form.id}
            elementType={form.config.elementType}
            elementConfig={form.config.elementConfig}
            value={form.config.value}
            invalid={!form.config.valid}
            shouldValidate={form.config.validation}
            touched={form.config.touched}
            changed={event => this.passwordChanged(event, form.id)}
          />
        ));

        const [email, token] = form;
        const [password, passwordConfirm] = passwordForm;

        return (
          <div className={classes.forgotPassword}>
            {this.state.mode !== 'Reset Password' ? (
              <React.Fragment>
                <form onSubmit={this.submit}>
                  {email}
                  <Button disabled={!this.state.formIsValid} btnType='Success'>
                    Request Token
                  </Button>
                </form>
                <form onSubmit={this.insertToken}>
                  {token}
                  <Button
                    disabled={!this.state.forms.token.value}
                    btnType='Success'
                  >
                    To Password Reset
                  </Button>
                </form>
              </React.Fragment>
            ) : (
                <form onSubmit={this.resetPassword}>
                  {password}
                  {passwordConfirm}
                  <Button disabled={!this.state.passwordIsValid} btnType='Success'>
                    Reset Password
                  </Button>
                </form>
            )}
          </div>
        );
    }
}

export default ForgotPassword;

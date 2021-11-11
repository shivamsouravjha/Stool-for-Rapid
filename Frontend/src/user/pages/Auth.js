import React, { useState, useContext, Fragment } from 'react';
import ReactSession from '../../Reactsession';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_FIXLENGTH,
  VALIDATOR_PASSWORD,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
   
  const [formState, inputHandler, setFormData] = useForm(
    {
      username: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.username.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();
    
    setIsLoading(true);

    if (isLoginMode) {
      try {
        const response = await fetch("http://localhost:5001/api/users/account/login", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: formState.inputs.username.value,
            password: formState.inputs.password.value
          })
        });
        const responseData = await response.json();
        if(responseData['error']) {
          console.log(responseData.error)
          throw new Error(responseData.error);
        }
        setIsLoading(false);
        auth.login(responseData.data.userId, responseData.data.token);
        localStorage.setItem("username", formState.inputs.username.value);
        localStorage.setItem("userId", responseData.data.userId);
        ReactSession.set("username", formState.inputs.username.value);
        ReactSession.set("userId",responseData['data']['userId'] );
        ReactSession.set("token",responseData['data']['token'] );
      } catch (err) {
        setIsLoading(false);
        setError(err.message || 'Something went wrong, please try again.');
      }
    } else {
      try {
        // var day=parseInt(formState.inputs.sample.value.substr(8));
        // var month=parseInt(formState.inputs.sample.value.substr(5,7));
        // var year=parseInt(formState.inputs.sample.value.substr(0,4));
        var checkuser=formState.inputs.username.value.slice(-4);
        var checkpan=formState.inputs.panNumber.value.slice(-4);
        if(checkpan !== checkuser){
          throw new Error("Use 4 last character of pan");
        }
        const response = await fetch('http://localhost:5001/api/users/account/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            username: formState.inputs.username.value,
            number: formState.inputs.number.value,
            panNumber: formState.inputs.panNumber.value,
            aadhar: formState.inputs.aadhar.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            // dob:{"year":year,"month":month,"day":day}
          })
        });
        const responseData = await response.json();
        if(responseData['error']) {
          console.log(responseData.error)
          throw new Error(responseData.error);
        }
        setIsLoading(false);
        console.log(responseData.data);
        auth.login(responseData.data.userId, responseData.data.token);
        localStorage.setItem("username", formState.inputs.username.value);
        localStorage.setItem("userId", responseData.data.userId);
        ReactSession.set("username", formState.inputs.username.value);
        ReactSession.set("userId",responseData['data']['userId'] );
        ReactSession.set("token",responseData['data']['token'] );
      } catch (err) {
        setIsLoading(false);
        setError(err.message || 'Something went wrong, please try again.');
      }
    }
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h1>Login Required</h1>
        <h4>It is mandatory to fill all the fields<span>*</span></h4>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />)
          }
          
          {!isLoginMode && (
            <Input
              element="input"
              id="email"
              type="email"
              label="E-Mail address"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
            />)
          }
          {!isLoginMode && (
              <Input
                element="input"
                id="number"
                type="text"
                label="Your Mobile Number"
                validators={[VALIDATOR_FIXLENGTH(10)]}
                errorText="Please enter exact 10 digit Mobile number."
                onInput={inputHandler}
              />)
          }  
          {!isLoginMode && (
            <Input
              element="input"
              id="panNumber"
              type="text"
              label="Your 10 digit PAN Card Number"
              validators={[VALIDATOR_FIXLENGTH(10)]}
              errorText="Please enter exact 10 digit Pancard number."
              onInput={inputHandler}
            />)
          }
          {!isLoginMode && (
            <Input
              element="input"
              id="aadhar"
              type="text"
              label="Your 12 digit AADHAR Number"
              validators={[VALIDATOR_FIXLENGTH(12)]}
              errorText="Please enter exact 12 digit aadhar number."
              onInput={inputHandler}
            />)
          }
          {/* {!isLoginMode && (
            <Input
              element="input"
              id="sample"
              type="date"
              label="Enter Date of Birth"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please select date."
              onInput={inputHandler}
            />)
          } */}
          {!isLoginMode && (
            <Input
              element="input"
              id="username"
              type="text"
              label = "Create a Username"
              placeholder=" Username must've last 4 digits of PAN number"
              validators={[VALIDATOR_MINLENGTH(7)]}
              errorText="Create a user Name of length at least 7"
              onInput={inputHandler}
            />)
          }
          {isLoginMode && (
            <Input
              element="input"
              id="username"
              type="text"
              label = "Username"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a username"
              onInput={inputHandler}
            />)
          }
          {!isLoginMode && (
            <Input
              element="input"
              id="password"
              type="password"
              label="Create a Password"
              placeholder="using Combination of {0-9},{a-z},{A-Z}"
              validators={[VALIDATOR_PASSWORD()]}
              errorText="Must contain an uppercanse and lowercase character with a number"
              onInput={inputHandler}
            />)
          }
          {isLoginMode && (
            <Input
              element="input"
              id="password"
              type="password"
              label="Password"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a password."
              onInput={inputHandler}
            />)
          }
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;

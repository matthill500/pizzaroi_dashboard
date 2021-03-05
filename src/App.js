import './App.css';
import React, { Component } from 'react'

import {
  Switch,
  Route,
  withRouter
} from "react-router-dom";

import Navi from './Navi';
import { Container } from 'react-bootstrap';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Stock from './Stock';

class App extends Component {
  REST_API = "http://localhost:8000/api";
  constructor(props){
    super(props);
    let localUser = JSON.parse(localStorage.getItem('user')) || null;
    this.state = {
      user: localUser,
      orders: [],
      error: null
    };
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
  }
  componentDidMount(){
    fetch(this.REST_API + "/orders",{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.user.token
      }
    })
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result);
        this.setState({
          orders: result.data
        });
      },
      (error) => {
        this.setState({
          error: error
        });
      }
    );
  }

  onLoginSuccess(loggedInUser, remember){
    let id;
    
    if(loggedInUser.error !== "Unauthorized"){
    loggedInUser.role.map(result => {
      id = result.id;
    });
    if(id !== 1){
      alert("You are not authorized!");
    }else{
      this.setState({
        user: loggedInUser
      });
      if(remember){
        localStorage.setItem('user', JSON.stringify(loggedInUser));
      }
      this.props.history.push('/dashboard');
    }
   }
  }

  onLogoutSuccess(){
    this.setState({
      user: null
    });
      localStorage.removeItem('user');
  }
  
  render(){
    return (
      <Container fluid style={{width:'80%'}}>
        <Navi onLogoutSuccess={this.onLogoutSuccess} user={this.state.user} />
        <Switch>
          <Route exact path="/login">
              <Login onLoginSuccess={this.onLoginSuccess} />
          </Route>
          <Route  path="/register">
              <Register />
          </Route>
          <Route path="/dashboard">
              <Dashboard 
                orders={this.state.orders}
                user={this.state.user}
              />
          </Route>
          <Route path="/stock">
              <Stock 
                user={this.state.user}
              />
          </Route>
        </Switch>
      </Container>
    );
  }
}


export default withRouter(App);

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
      pizzaOrders: [],
      sideOrders:[],
      actualStock:[],
      idealStock:[],
      topActualStock:[],
      sideActualStock:[],
      topIdealStock:[],
      sideIdealStock:[],
      error: null
    };
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
  }
  componentDidMount(){
    if(this.state.user !== null){
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
          this.setState({
            orders: result.data,
            pizzaOrders: result.queriedOrdersPizzas,
            sideOrders: result.queriedOrdersSides
          });
        },
        (error) => {
          this.setState({
            error: error
          });
        }
      );
      fetch(this.REST_API + "/ActualStock",{
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
          // console.log(result.data);
          this.setState({
            actualStock: result.data,
            topActualStock: result.tops,
            sideActualStock: result.sides
          });
        },
        (error) => {
          this.setState({
            error: error
          });
        }
      );
      fetch(this.REST_API + "/IdealStock",{
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
          // console.log(result.data);
          this.setState({
            idealStock: result.data,
            topIdealStock: result.tops,
            sideIdealStock: result.sides
          });
        },
        (error) => {
          this.setState({
            error: error
          });
        }
      );
    }
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
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      this.setState({
        user: loggedInUser
      });
      if(remember){
        localStorage.setItem('user', JSON.stringify(loggedInUser));
      }
      this.props.history.push('/');
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
          <Route path="/register">
              <Register />
          </Route>
          <Route path="/dashboard">
              <Dashboard 
                orders={this.state.orders}
                pizzas={this.state.pizzaOrders}
                sides={this.state.sideOrders}
                user={this.state.user}
              />
          </Route>
          <Route path="/stock">
              <Stock 
                user={this.state.user}
                actualStock={this.state.actualStock}
                idealStock={this.state.idealStock}
                topActualStock={this.state.topActualStock}
                sideActualStock={this.state.sideActualStock}
                topIdealStock={this.state.topIdealStock}
                sideIdealStock={this.state.sideIdealStock}
              />
          </Route>
        </Switch>
      </Container>
    );
  }
}


export default withRouter(App);

import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

import '@trendmicro/react-sidenav/dist/react-sidenav.css';



class Navi extends Component {
  REST_API = "http://127.0.0.1:8000/api";
  constructor(props){
    super(props);
    this.onLogout = this.onLogout.bind(this);
  }

  onLogout(e){
    fetch(this.REST_API + '/logout',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.props.user.token
      },
      body: ""
    })
    .then(res => res.json())
    .then(
      (result) => {
        this.props.onLogoutSuccess(result.data);
      },
      (error) => {
        console.log(error);
        e.preventDefault();
      }
    )
  }
  render(){
    const user = this.props.user;
    return (
    <SideNav>
    <SideNav.Toggle />
    <SideNav.Nav defaultSelected="home">
      {user === null &&
        <NavItem>
                <NavIcon>
                    <i className="fas fa-sign-in-alt" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>
                <Link to="/login" href="#">
                Login
                </Link>
                </NavText>
        </NavItem>}
        {user === null &&
        <NavItem>
            <NavIcon>
                <i className="fas fa-user-plus" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
            <Link as={Link} to="/register" href="#">
            Register
            </Link>
            </NavText>
        </NavItem>}
        {user !== null &&
        <NavItem>
            <NavIcon>
                <i className="fas fa-tachometer-alt" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
            <Link as={Link} to="dashboard" href="#">
            Dashboard
            </Link>
            </NavText>
        </NavItem>}
        {user !== null &&
        <NavItem>
            <NavIcon>
                <i className="far fa-chart-bar" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
            <Link as={Link} to="stock" href="#">
            Stock
            </Link>
            </NavText>
        </NavItem>}
        {user !== null &&
        <NavItem>
            <NavIcon>
                <i className="fas fa-sign-in-alt" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
            <Link as={Link} to="login" onClick={this.onLogout} href="#">
            Logout
            </Link>
            </NavText>
        </NavItem>}
        
        
    </SideNav.Nav>
    </SideNav>
    );
  }
}

export default Navi;

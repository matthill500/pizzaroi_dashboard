import React, { Component } from 'react';
import Button from 'react-bootstrap/button';
import Card from 'react-bootstrap/card';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';


class Login extends Component {
  REST_API = "http://127.0.0.1:8000/api";
  constructor(props){
    super(props)
    this.state = {
      email: "",
      password: "",
      remember: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleChange(e){
    const target = e.target;
    const field = target.name;
    const value = (target.type === 'checkbox') ? target.checked : target.value;

    this.setState({
      [field]: value
    });

  }
  onSubmit(e){
    e.preventDefault();
    const userDetails = {
    email: this.state.email,
    password: this.state.password
    };
    fetch(this.REST_API + '/login',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDetails)
    })
    .then(res => res.json())
    .then(
      (result) => {
        const user = result;
        this.props.onLoginSuccess(user, this.state.remember);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  render(){
    return (
    <Container style={{ marginTop:'15em', marginLeft:'32em'}}>
    <Card className="mt-4" style={{width:'500px'}}>
      <Card.Body>
        <Card.Title>Login Form</Card.Title>
        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control 
             required
             type="email"
             name="email"
             value={this.state.email}
             onChange={this.handleChange} 
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              required
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="remember">
          <Form.Check 
              type="checkbox" 
              label="Remember me"
              name="remember"
              checked={this.state.remember}
              onChange={this.handleChange}
          />
          </Form.Group>

          <Button variant="primary" type="submit">Login</Button>

        </Form>
      </Card.Body>
    </Card>
    </Container>
    );
  }
}

export default Login;

import React, { Component } from 'react';
import { Card, Container } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner'
import {Line, Pie, Bar} from 'react-chartjs-2'

class Dashboard extends Component {
  render(){
    
    if(this.props.orders.length < 1){
      return <Container style={{textAlign:'center', marginTop:'25em'}}><Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner></Container>
    }

    //LINECHART LOGIC
    const orders = this.props.orders;
    
    const prices = orders.map(order => parseInt(order.price));

    const totalRevenue = prices.reduce(function(total,num){
     return total + num;
   })

   var today = new Date();
   var dd = String(today.getDate()).padStart(2, '0');
   var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
   var yyyy = today.getFullYear();
   today = yyyy + '-' + mm + '-' + dd;

   const todayOrders = orders.filter(order => order.created_at.split('T')[0] === today);
   const todayPrices = todayOrders.map(todayOrder => parseInt(todayOrder.price));

   let todayTotalRevenue = 0;
   if(todayPrices.length >= 1){
     todayTotalRevenue = todayPrices.reduce(function(total,num){
      return total + num;
     }) 
   }
  
  let months = 13;
  let ordersForEachMonth=[];

  for(let i = 1; i < months; i++){
    if(i.toString().length === 1){
      i = "0"+i;
    }
    const ordersPerMonth = orders.filter(order => order.created_at.split('T')[0] <= '2021-'+i+'-31' && order.created_at.split('T')[0] >= '2021-'+i+'-01');
    let ordPerMonth = ordersPerMonth.length;
    ordersForEachMonth.push(ordPerMonth);
  }

  //PIECHART LOGIC
  const pizzaOrders = this.props.pizzas;
  const sideOrders = this.props.sides;

  const pizzas = pizzaOrders.map(pizzaOrder => pizzaOrder.name) 
  const pizzasFinal = pizzas.filter(function(val){return val !== null;})

  const sides = sideOrders.map(sideOrder => sideOrder.name) 
  const sidesFinal = sides.filter(function(val){return val !== null;})

  const totalItems = pizzasFinal.concat(sidesFinal);

  var a = totalItems.reduce(function (acc, curr) {
    if (typeof acc[curr] == 'undefined') {
      acc[curr] = 1;
    } else {
      acc[curr] += 1;
    }
    return acc;
  }, {});

  let titles = Object.getOwnPropertyNames(a);

  let values = Object.values(a);

  //BARCHART LOGIC

  const dayTime = orders.filter(function(order){return order.created_at.slice(11,13) < 17;}).length
  const nightTime = orders.filter(function(order){return order.created_at.slice(11,13)>15;}).length
  

    return (
      <>
       <div className="container-fluid">
       <div className="row justify-content-center" style={{marginBottom:'1em'}}>
      <Card style={{ margin: '20px', width: '12rem', height: '8rem', color:'white', backgroundColor:'#db3d44',float:'left'}}>
        <Card.Body>
          <Card.Title style={{marginTop: '0.8em',fontSize:'16px'}}>Total Revenue</Card.Title>
          <Card.Text>
            €{totalRevenue}
          </Card.Text>
        </Card.Body>
      </Card>
      <Card style={{ margin: '20px', width: '12rem', height: '8rem', color:'white', backgroundColor:'#db3d44', float:'left'}}>
        <Card.Body>
          <Card.Title style={{marginTop: '0.8em', fontSize:'16px'}}>Total Orders</Card.Title>
          <Card.Text>
            {orders.length}
          </Card.Text>
        </Card.Body>
      </Card>
      <Card style={{ margin: '20px', width: '12rem',height: '8rem', color:'white', backgroundColor:'#db3d44', float:'left'}}>
        <Card.Body>
          <Card.Title style={{marginTop: '0.8em', fontSize:'16px'}}>Total Revenue Today</Card.Title>
          <Card.Text>
            €{todayTotalRevenue}
          </Card.Text>
        </Card.Body>
      </Card>
      <Card style={{ margin: '20px', width: '12rem',height: '8rem', color:'white', backgroundColor:'#db3d44', float:'left'}}>
        <Card.Body>
          <Card.Title style={{marginTop: '0.8em', fontSize:'16px'}}>Total Orders Today</Card.Title>
          <Card.Text>
            {todayOrders.length}
          </Card.Text>
        </Card.Body>
      </Card>
      </div>
     
  <div className="row">
    <div className="col-sm-6">
      <Pie
        data={{
          labels: titles,
          datasets:[
            {
              data: values,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2
            },
          ]
        }}
        height={380}
        width={450}
        options={{
          maintainAspectRatio: false,
          scales:{
            yAxes:[
              {
                ticks: {
                  beginAtZero: true,
                  display: false
                }
              }
            ]
          },
          legend:{
            labels:{
              fontSize:12
            }
          }
        }}
      />
     </div>
        <div className="col-sm-6">
        <Bar
        data={{
          labels: ["Day Time", "Night Time"],
        
          datasets:[
            {
              label: 'Orders: Day vs Night',
              data: [dayTime, nightTime],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2
            },
          ]
        }}
        height={380}
        width={450}
        options={{
          maintainAspectRatio: false,
          scales:{
            xAxes: [{
              barPercentage: 0.5
          }],
            yAxes:[
              {
                ticks: {
                  beginAtZero: true,
                }
              }
            ]
          },
          legend:{
            labels:{
              fontSize:15
            }
          }
        }}
      />
        </div>
        </div>
        <div className="row" style={{marginTop: '2.5em'}}>
          <div className="col-sm-12">
          <Line
        data={{
          labels: ['JANUARY', 'FEBURARY', 'MARCH', 'APRIL', 'MAY', 'JUNE','JULY','AUGUST','SEPTEMEBER','OCTOBER','NOVEMBER','DECEMEBER'],
          datasets:[
            {
              label: 'Number of Orders Per Month',
              data: ordersForEachMonth,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2
            },
          ]
        }}
        height={350}
        width={150}
        options={{
          maintainAspectRatio: false,
          scales:{
            yAxes:[
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
          legend:{
            labels:{
              fontSize:25
            }
          }
        }}
      />
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default Dashboard;

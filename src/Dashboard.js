import React, { Component } from 'react';
import { Card, Container } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner'
import {Line} from 'react-chartjs-2'
class Dashboard extends Component {
  render(){
    
    if(this.props.orders.length < 1){
      return <Container style={{textAlign:'center', marginTop:'25em'}}><Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner></Container>
    }

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

    return (
      <>
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
        height={250}
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
      </>
    );
  }
}

export default Dashboard;

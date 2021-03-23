import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner'
import {Bar} from 'react-chartjs-2'
class Stock extends Component {
  render(){
    if(this.props.actualStock.length < 1 && this.props.idealStock.length < 1){
      return <Container style={{textAlign:'center', marginTop:'25em'}}><Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner></Container>
    }
    const actualStock = this.props.actualStock;
    const idealStock = this.props.idealStock;

    //actually used logic
    var today = new Date();
    var yd = String(today.getDate()-1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() +1).padStart(2, '0'); //January is 0!
    if(dd < 1){
      dd = '01';
    }
    var yyyy = today.getFullYear();
    var yesterday = yyyy + '-' + mm + '-' + yd;
    var today = yyyy + '-' + mm + '-' + dd;

    const yesterdayStock = actualStock.filter(stock => stock.date === yesterday)
    const yDayQty = yesterdayStock.map(stock => stock.Qty);
    const todayStock = actualStock.filter(stock => stock.date === today)
    const tDayQty = todayStock.map(stock => stock.Qty)

    const actuallyUsed = [];

    for(let i = 0; i<tDayQty.length;i++){
      actuallyUsed.push(yDayQty[i] - tDayQty[i])
    }

    //ideally used logic

    const totalActual = actuallyUsed.reduce(function(a, b) {return a+b;},0)

    const ideallyUsed = idealStock.map(stock => stock.Qty)

    const totalIdeal = ideallyUsed.reduce(function(a, b) {return a+b;},0)


    return (
    <>
      <h1>Stock</h1>
      <Bar
        data={{
          labels: ["Actual", "Ideal"],
        
          datasets:[
            {
              label: 'Ideal vs Actual Stock',
              data: [totalActual, totalIdeal],
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
              barPercentage: 0.4
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
    </>
    );
  }
}

export default Stock;

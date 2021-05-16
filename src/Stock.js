import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner'
import {Bar} from 'react-chartjs-2'
class Stock extends Component {
  render(){
    if(this.props.actualStock.length < 1 && this.props.idealStock.length < 1){
      return <Container style={{textAlign:'center', marginTop:'25em'}}><Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner></Container>
    }

    //chart data
    const actualStock = this.props.actualStock;
    const idealStock = this.props.idealStock;

    //table data
    const topActualStock = this.props.topActualStock;

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
    today = yyyy + '-' + mm + '-' + dd;

    const yesterdayStock = actualStock.filter(stock => stock.date === yesterday)
    const yDayQty = yesterdayStock.map(stock => stock.Qty);

    const todayStock = actualStock.filter(stock => stock.date === today)
    const tDayQty = todayStock.map(stock => stock.Qty)

    const actuallyUsed = [];

    for(let i = 0; i<tDayQty.length;i++){
      actuallyUsed.push(yDayQty[i] - tDayQty[i])
    }

    const totalActual = actuallyUsed.reduce(function(a, b) {return a+b;},0)

    //ideally used logic
    const todayIdealStock = idealStock.filter(stock => stock.date === today)

    const ideallyUsed = todayIdealStock.map(stock => stock.Qty)

    const totalIdeal = ideallyUsed.reduce(function(a, b) {return a+b;},0)

    //Table logic

    const names = topActualStock.map(stock => stock.name);

    const topActualStockClean = topActualStock.filter(stock => stock.top_id !== null && stock.date === today);
  
    const data = [{}];

    for(let j = 0; j<topActualStockClean.length; j++){
      data[j+1] = {
        'id': j+1,
        'name': names[j],
        'actuallyUsed': actuallyUsed[j],
         'ideallyUsed': ideallyUsed[j],
         'difference': actuallyUsed[j]-ideallyUsed[j]
      };
    }

    data.sort((a,b) => b.difference - a.difference)
    // console.log(data);
    
    return (
    <>
     <div className="container-fluid">
     <div className="row" style={{padding:'1.25em'}}>
      <h1>Stock Usage</h1>
      <Bar
        data={{
          labels: ["Actual Usage", "Ideal Usage"],
          datasets:[
            {
              label: 'Ideally vs Actually Used '+today,
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
              boxWidth:0,
              fontSize:15
            }
          }
        }}
      />
      </div>
      <div className="row">
      <Table striped bordered hover>
      <thead>
        <tr>
      
          <th>Item</th>
          <th>Ideal usage (Portions)</th>
          <th>Actual usage (Portions)</th>
          <th>Difference</th>
        </tr>
      </thead>
      <tbody>
      {data.map((item, index) => {
        const {name, actuallyUsed, ideallyUsed, difference} = item
        return (
          <tr key={index}>
            <td>{name}</td>
            <td>{ideallyUsed}</td>
            <td>{actuallyUsed}</td>
            <td>{difference} {index < 4 && index >0 && <p style={{color:'red'}}>Attention needed: <b>Overused</b></p>}</td>
          </tr>
        )
      })}
      </tbody>
    </Table>
    </div>
  </div>
    </>
    );
  }
}

export default Stock;

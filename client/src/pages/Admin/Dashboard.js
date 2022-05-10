import React, { useContext, useEffect, useReducer } from 'react'
import getError from '../../components/getError';
import { Store } from '../../context/Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, Card, Row, Col, Button } from 'react-bootstrap'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reducer = (state, action) => {
  switch(action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true};

    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload};

    case "FETCH_FAIL":
      return { ...state, error: action.payload}
  }
}

const Dashboard = () => {
  
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{summary, loading, error}, dispatch] = useReducer(Reducer, {
    loading: true,
    error: ''
  })


  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: "FETCH_REQUEST"})
      try {
        const { data } = await axios.get('http://localhost:5000/api/orders/summary', {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        })
        dispatch({type: "FETCH_SUCCESS", payload: data})
        // console.log(data);
      } catch (err) {
        dispatch({type: "FETCH_FAIL", payload: getError})
        toast.error(error);
      }
    }
    fetchData();
  },[userInfo]);

  const saleData = {
  labels: summary?.dailyOrders?.map(x => x._id),
  datasets: [
    {
      label: 'Sales',
      data: summary?.dailyOrders?.map(x => x.sales),
      backgroundColor:'rgba(54, 162, 235, 0.2)',
      borderColor:'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
};

const productData = {
  labels: summary?.productCategories?.map(x => x._id),
  datasets: [
    {
      label: 'Product Categroies',
      data: summary?.productCategories?.map(x => x.count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(38, 21, 80, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(38, 21, 80, 1)',
      ],
      borderWidth: 1
    }
  ]
}

  return (
    <Container>
      {loading ? <div>loading...</div>
      :
        <div>
          <Row>

            <Col md={4}>
              <Card className='text-center p-3 my-3'>
                <Card.Title>
                  {summary.users && summary.users[0] ? summary.users[0].numUsers : 0}
                </Card.Title>
                <Card.Text>Users</Card.Text>
              </Card>
            </Col>

            <Col md={4}>
              <Card className='text-center p-3 my-3'>
                <Card.Title>
                  {summary.orders && summary.users[0] ? summary.orders[0].numOrders : 0}
                </Card.Title>
                <Card.Text>Orders</Card.Text>
              </Card>
            </Col>

            <Col md={4}>
              <Card className='text-center p-3 my-3'>
                <Card.Title>
                  $ {' '}{summary.orders && summary.users[0] ? summary.orders[0].totalSales : 0}
                </Card.Title>
                <Card.Text>Total Sales</Card.Text>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <div className='my-3'>
                {summary.dailyOrders.length === 0 
                ? <Button variant='danger' disabled>NO Sale For Today</Button>
                  : (<Line data={saleData}/>)
                }
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className='my-3'>
                {summary.productCategories.length === 0 
                ? <Button variant='danger' disabled>NO Category</Button>
                  : (<Pie data={productData} />)
                }
              </div>
            </Col>
          </Row>
        </div>
    }
    </Container>
  )
}

export default Dashboard
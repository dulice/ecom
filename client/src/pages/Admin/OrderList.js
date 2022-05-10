import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Button, Container, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getError from '../../components/getError';
import { Store } from '../../context/Store';

const Reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true};

    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload};

    case "FETCH_FAIL":
      return { ...state, error: action.payload};

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true};

    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true};

    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false};

    default:
      return state;
  }
}

const OrderList = () => {

  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{loading, error, orders, loadingDelete, successDelete}, dispatch ] = useReducer(Reducer, {
    loading: true,
    error: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: "FETCH_REQUEST"});
      try {
        const { data } = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        });
        dispatch({type: "FETCH_SUCCESS", payload: data});
        // console.log(data);
      } catch (err) {
        dispatch({type: "FETCH_FAIL", payload: getError(err)});
        toast.error(error);
      }
    }
    fetchData();
  },[userInfo]);

  const deleteHandler = async (id) => {
    if(window.confirm("Are you sure you want to delete?")) {
      dispatch({type: "DELETE_REQUEST"});
      try {
        await axios.delete(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        })
        dispatch({type: "DELETE_SUCCESS"});
        toast.success("Delete Successfully!");
        window.location.reload();
      } catch (err) {
        dispatch({type: "DELETE_FAIL", payload: getError(err)});
        toast.error(error)
      }
    }
  }

  return (
    <Container>
      <div>
        <Helmet>
          <title>Orders</title>
        </Helmet>
        <h2>Orders</h2>
        {loading ? <div>Loading...</div>
        :
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user ? order.user.name: 'DELETED USER'}</td>
                  <td>{order.createdAt.substring(0,10)}</td>
                  <td>$ {order.totalPrice}</td>
                  <td>{order.isPaid ? order.isPaid.substring(0,10): 'NO'}</td>
                  <td>{order.isDelivered ? order.deliverAt.substring(0,10): 'NO'}</td>
                  <td>
                    <Button variant='primary' className='me-3' onClick={() => navigate(`/order/${order._id}`)}>DETAILS</Button>
                    {loadingDelete 
                    ? <Button variant='danger' disabled>DELETE...</Button>
                    : <Button variant='danger' onClick={() => deleteHandler(order._id)}>DELETE</Button>
                    }                   
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
      </div>
    </Container>
  )
}

export default OrderList
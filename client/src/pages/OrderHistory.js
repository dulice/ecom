import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Container, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import getError from '../components/getError'
import { Store } from '../context/Store';
import { Link } from 'react-router-dom'

const Reducer = (state, action) => {
    switch(action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true}

        case "FETCH_SUCCESS":
            return {...state, orders: action.payload, loading: false};

        case "FETCH_FAIL":
            return { ...state, error: action.payload};

        default:
            return state;
    }
}

const OrderHistory = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{loading, error, orders}, dispatch] = useReducer(Reducer, {
        loading: true,
        orders: [],
        error: ''
    })
   
    useEffect(() => {
        const fetchOrder = async () => {
            dispatch({type: "FETCH_REQUEST"});
            try {
                const { data } = await axios.get('http://localhost:5000/api/orders/mine', {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                });
                console.log(data);
                dispatch({type: "FETCH_SUCCESS", payload: data});
            } catch (err) {
                dispatch({type: "FETCH_FAIL", payload: getError(err)})
            }
        }
        fetchOrder();
    },[userInfo, dispatch])
  return (
    <Container>
        {loading ? <div>Loading...</div>
        : error ? <div className='text-danger'>{error}</div>             
        :   <div>
                <Helmet>
                    <title>Order History</title>
                </Helmet>
                <h2 className='my-5'>Order History</h2>
                <Table striped hover bordered>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((product) => {
                            return (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{new Date(product.createdAt).toDateString()}</td>
                                    <td>$ {product.totalPrice}</td>
                                    <td>{product.isPaid ? new Date(product.updatedAt).toDateString() : 'NO' }</td>
                                    <td>{product.isDelivered? new Date(product.updatedAt).toDateString() : 'NO' }</td>
                                    <td>
                                        <Link to={`/order/${product._id}`}>Detail</Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>

            </div>
        }
    </Container>
  )
}

export default OrderHistory
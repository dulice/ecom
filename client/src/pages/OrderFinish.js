import React, { useContext, useEffect, useReducer } from 'react'
import { Card, Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom'
import { Store } from '../context/Store';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import getError from '../components/getError';

const Reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true}

        case "FETCH_SUCCESS":
            return {
                ...state, 
                loading: false,
                order: action.payload
            }

        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload}

        case "DELIVER_REQUEST":
            return { ...state, loadingDeliver: true}

        case "DELIVER_SUCCESS":
            return {
                ...state, 
                loadingDeliver: false,
                deliverSuccess: true,
            }

        case "DELIVER_FAIL":
            return { ...state, loadingDeliver: false, deliverSuccess: false}

        default:
            return state;
    }
}

const OrderFinish = () => {
    const {id: orderId} = useParams();
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const { cart, userInfo } = state;

    const [{order, loading, error, loadingDeliver, deliverSuccess }, dispatch]  = useReducer(Reducer, {
        order: {},
        loading: true,
        error: ''
    })

    useEffect(() => {
        const fetchOrder = async () => {
            dispatch({type: "FETCH_REQUEST"});
            try {
                const { data } = await axios.get(`http://localhost:5000/api/orders/${orderId}`,{
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                })
                dispatch({type: "FETCH_SUCCESS", payload: data})
            } catch (err) {
                dispatch({type: "FETCH_FAIL", payload: err.message })
            }
        }
        if(!userInfo) {
            navigator('/login')
        }
        if(!order._id || (order._id && order._id !== orderId)) {
            fetchOrder();
        }
    },[orderId, dispatch, userInfo]);
    
    // console.log(order);

    const deliverHandler = async () => {
        dispatch({type: "DELIVER_REQUEST"});
        try {
            await axios.put(`http://localhost:5000/api/orders/${orderId}/deliver`, {}, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            dispatch({type: "DELIVER_SUCCESS"});
            toast.success("Order Delivered!");
        } catch (err) {
            dispatch({type: "DELIVER_FAIL", payload: getError(err)});
            toast.error(error)
        }
    }
  return (
    <Container>
        {loading ? <div>Loading...</div>
        :
            <div>
                <Helmet>
                    <title>OrderId: {orderId}</title>
                </Helmet>
                <h2 className="my-5">OrderId: {orderId}</h2>
                <Row>
                    <Col md={12} lg={8}>
                        <Card className="p-3 mb-3">
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name: {' '}</strong>
                                {cart.shippingAddress.fullName}
                            </Card.Text>
                            <Card.Text>
                                <strong>Address: {' '}</strong>
                                {cart.shippingAddress.address},{cart.shippingAddress.city},{cart.shippingAddress.postalCode},{cart.shippingAddress.country}.

                                 {cart.shippingAddress.location &&
                                    cart.shippingAddress.location.lat && (
                                        <a
                                        target="_new"
                                        href={`https://maps.google.com?q=${cart.shippingAddress.location.lat},${cart.shippingAddress.location.lng}`}
                                        >
                                        Show On Map
                                        </a>
                                )}

                            </Card.Text>
                            {order.isDelivered 
                                ? <Button variant='success' disabled>Delivered</Button>
                                :  <Button variant='danger' disabled>Not Delivered</Button>
                            }
                        </Card>
                        <Card className="p-3 mb-3">
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Method: {' '}</strong>
                                {cart.paymentMethod}
                            </Card.Text>
                            {order.isPaid
                                ? <Button variant='success' disabled>Paid</Button>
                                :  <Button variant='danger' disabled>Not Paid</Button>
                            }
                        </Card>
                        <Card className="p-3 mb-3">
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant='flush'>
                                {order?.orderItems?.map(item => {
                                    return (
                                        <ListGroup.Item key={item._id}>
                                            <Row>
                                                <Col md={6}>
                                                    <img src={item.image} alt={item.name} height="50px"/>
                                                    <Link className='link' to={`/products/${item.slug}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={3} className="d-flex align-items-center">{item.quantity}</Col>
                                                <Col md={3} className="d-flex align-items-center">$ {item.price * item.quantity}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )
                                })}
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col md={12} lg={4}>
                        <Card className='p-3'>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={6}>Items Price: </Col>
                                        <Col md={6}> 
                                            <h5>
                                            $ {order.itemsPrice}
                                            </h5>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={6}>Shipping: </Col>
                                        <Col md={6}> 
                                            <h5>
                                            $ {order.shippingPrice}
                                            </h5>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={6}>Tax: </Col>
                                        <Col md={6}> 
                                            <h5>
                                            $ {order.taxPrice}
                                            </h5>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={6}>Total Price: </Col>
                                        <Col md={6}> 
                                            <h5>
                                            $ {order.totalPrice}
                                            </h5>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                        {loadingDeliver 
                        ? <Button className="my-3" disabled>Delivering...</Button>
                        : userInfo && userInfo.isAdmin 
                        ? <Button className='my-3' onClick={deliverHandler}>Deliver</Button> 
                        : null                       
                        }
                    </Col>
                </Row>
            </div>
        }
    </Container>
  )
}

export default OrderFinish
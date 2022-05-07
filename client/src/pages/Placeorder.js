import React, { useContext, useEffect, useReducer } from 'react'
import { Button, Card, Container, ListGroup, Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import CheckoutStep from '../components/CheckoutStep'
import { Store } from '../context/Store'
import axios from 'axios'

const Reducer = (state, action) => {
    switch(action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true};

        case "FETCH_SUCCESS": 
            return { ...state, loading: false};

        case "FETCH_FAIL":
            return { ...state, loading: false};

        default:
            return state;
    }
}

const Placeorder = () => {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { cart, userInfo } = state;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; 
    cart.itemsPrice = cart.cartItems.reduce((sum, num) => sum + (num.price * num.quantity), 0);
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10)
    cart.taxPrice = (cart.itemsPrice * 0.08).toFixed(2);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + Number(cart.taxPrice);

    const [{ loading }, dispatch] = useReducer(Reducer, {
        loading: true
    })

    const placeorderHandler = async () => {
        dispatch({type: "FETCH_REQUEST"})
        try {
            const {data} = await axios.post('http://localhost:5000/api/orders', {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                }
            )
            console.log(data)
            dispatch({type: "FETCH_SUCCESS"})
            localStorage.removeItem('cartItems')
            navigate(`/order/${data.order._id}`)
        } catch (err) {
            dispatch({type: "FETCH_FAIL"})
            toast.error(err.message)
        }
    }

    useEffect(() => {
        if(!cart.paymentMethod) {
            navigate('/payment')
        }
    },[navigate, cart.paymentMethod]);

  return (
    <Container>
        <div>
            <CheckoutStep step1 step2 step3 step4 />
            <Helmet>
                <title>Order Review</title>
            </Helmet>
            <h2>Order Review</h2>
            <Row>
                <Col xs={12} md={8}>
                    <Card className='p-3'>
                        <Card.Title>Shipping</Card.Title>
                        <Card.Text><strong>Name: </strong> {cart.shippingAddress.fullName}</Card.Text>
                        <Card.Text>
                            <strong>Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.country}, {cart.shippingAddress.postalCode}
                        </Card.Text>
                        <Link to='/shipping'>Edit</Link>
                    </Card>
                    <Card className='p-3'>
                        <Card.Title>Payment</Card.Title>
                        <Card.Text><strong>Method: </strong> {cart.paymentMethod}</Card.Text>
                        <Link to='/payment'>Edit</Link>
                    </Card>
                    <Card className='p-3'>
                        <Card.Title>Items</Card.Title>
                        <ListGroup variant='flush'>
                            {cart.cartItems.map(item => {
                                return (
                                    <ListGroup.Item key={item._id}>
                                        <Row>
                                            <Col md={6}>
                                                <img src={item.image} alt={item.name} height="50px"/>
                                                <Link className='link' to={`/products/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={2} className="d-flex align-items-center">{item.quantity}</Col>
                                            <Col md={2} className="d-flex align-items-center">$ {item.price * item.quantity}</Col>
                                            <Col md={2} className="d-flex align-items-center">
                                                <Button variant='primary'>
                                                    <Link className='link text-white' to='/cart'>Edit</Link>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                        <Link to='/cart'>Edit</Link>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card className='p-3'>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Items Price: </Col>
                                    <Col md={6}> 
                                        <h5>
                                        $ {cart.itemsPrice}
                                        </h5>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Shipping: </Col>
                                    <Col md={6}> 
                                        <h5>
                                        $ {cart.shippingPrice}
                                        </h5>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Tax: </Col>
                                    <Col md={6}> 
                                        <h5>
                                        $ {cart.taxPrice}
                                        </h5>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Total Price: </Col>
                                    <Col md={6}> 
                                        <h5>
                                        $ {cart.totalPrice}
                                        </h5>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button 
                                    variant='primary'
                                    disabled={cart.cartItems.length < 1}
                                    onClick={placeorderHandler}
                                >Place Order</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    </Container>
  )
}

export default Placeorder
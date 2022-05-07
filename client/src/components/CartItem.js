import React, { useContext } from 'react'
import { Card, Col, Container, ListGroup, Row, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../context/Store'
import { FiMinusCircle, FiPlusCircle, FiTrash2 } from 'react-icons/fi'
import axios from 'axios';

const CartItem = () => {
  const { state, dispatch } = useContext(Store);
  const { cart: {cartItems}} = state;
  const navigate = useNavigate();

  const updateCartHandler = async (product, quantity) => {
    const {data} = await axios.get(`http://localhost:5000/api/products/${product._id}`);
    if(data.countInStock < quantity) {
      alert("Product is out of stock");
      return;
    }
    if(quantity < 1) return;
    dispatch({
       type: "CART_ADD_ITEM",
       payload: {
         ...product,
         quantity
       }
     })
  }

  const removeFromCart = (item) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: item
    })
  }

  const checkOutHandler = () => {
    navigate('/signin?redirect=/shipping');
  }

  return (
    <Container>
      <h2>Shopping Cart</h2>
      {
        cartItems.length < 1 
        ? <p>No Item selected go to <Link to="/">Shopping</Link></p>
        :
      
      <Row>
        <Col md={12} lg={8}>
          <Card>
            <ListGroup variant='flush'>
              {cartItems.map(item => {
                return (
                  <ListGroup.Item key={item._id}>
                    <Row>
                      <Col md={4}>
                        <img src={item.image} alt={item.name} height="50px"/>
                        <Link to={`/products/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={4} className="d-flex align-items-center">
                        
                        <Button variant='outline-primary' onClick={() => updateCartHandler(item, item.quantity - 1)}>
                          <FiMinusCircle />
                        </Button>
                        <p className='m-3'>{item.quantity} x ${item.price}</p>
                        <Button variant='outline-primary' onClick={() =>updateCartHandler(item, item.quantity + 1)}>
                          <FiPlusCircle />
                        </Button>
                        
                      </Col>
                      <Col md={3} className="d-flex align-items-center">
                        $ { item.price * item.quantity}
                      </Col>
                      <Col md={1} className="d-flex align-items-center">
                        <Button variant='outline-primary' onClick={() => removeFromCart(item)}>
                          <FiTrash2 />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )
              })}
            </ListGroup>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <ListGroup.Item>
            <Row>
              <Col md={6}>Total Items: </Col>
              <Col md={6}> 
                <h5>
                  {cartItems.reduce((sum, num) => sum + num.quantity, 0)}
                </h5>
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}>Total Price: </Col>
              <Col md={6}> 
                <h5>
                  $ {cartItems.reduce((sum, num) => sum + (num.price * num.quantity), 0)}
                </h5>
              </Col>
              <Col md={12}> 
                <Button variant="primary" className='w-100 my-3' onClick={checkOutHandler}>Proceed to CheckOut</Button>
              </Col>
            </Row>           
          </ListGroup.Item>
        </Col>
      </Row>
      }
    </Container>
  )
}

export default CartItem
import axios from 'axios'
import React, { useContext } from 'react'
import { Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Store } from '../context/Store'
import Rating from './Rating'

const Product = ({product}) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const existItem = cartItems.find((x) => x._id === product._id);
  const quantity = existItem ? existItem.quantity + 1 : 1;
  const addToCartHandler = async (item) => {
    const { data } = await axios.get(`http://localhost:5000/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };


  return (
    
        <Card >
            <Card.Img variant="top" src={product?.image} />
                <Card.Body>
                <Link to={`/products/${product?.slug}`} className="link">  
                    <Card.Title>{product?.name}</Card.Title>
                </Link>
                <Card.Title>$ {product?.price}</Card.Title>
                <Rating />
                <h6>{product?.numReviews} Reviews</h6>
                {
                    product?.countInStock < quantity
                    ?   <Button variant="primary" disabled>Out Of Stock</Button>
                    :   <Button variant="primary" onClick={() => addToCartHandler(product)}>Add To Cart</Button>
                }               
            </Card.Body>                         
        </Card>
  )
}

export default Product
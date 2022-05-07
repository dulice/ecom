import React, { useContext, useEffect, useReducer } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import axios from 'axios'
import Rating from '../components/Rating';
import { CartContext } from '../context/AddToCartContext';
import { Helmet } from 'react-helmet-async';
import { Store } from '../context/Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductDetail = () => {
    const param = useParams();
    const { slug } = param;

    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const res = await axios.get(`http://localhost:5000/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [slug]);

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;

    const existItem = cart.cartItems.find(item => item._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const addToCartHandler = async () => {
        const res = await axios.get(`http://localhost:5000/api/products/${product._id}`);
        if(res.data.countInStock < 1) {
          alert("product is out of stock");
          return;
        }
        ctxDispatch({
          type: "CART_ADD_ITEM",
          payload: {
            ...product,
            quantity
          }
        })
    };

  return (
    <Container>
        {loading ? <Loading /> :
        error ? <p className='text-danger'>{error}</p> :
        <Row >
            <Col sm={12} md={6} lg={5} className='my-5'>
                {product?.image && <img src={product.image} alt="" className='border rounded w-100'/>}
            </Col>

            <Col sm={12} md={6} lg={4} className='my-5'>
                <Helmet>
                    <title>{product.name}</title>
                </Helmet>
                <h3>{product?.name}</h3>  
                <span>
                    <Rating />
                    {product.numReviews} Reviews
                </span>         
                <p className='my-3'>Price: $ {product?.price}</p>
                <h6>Descripton: </h6>
                <p className="text-black-50">{product?.description}</p>
            </Col>

            <Col  sm={12} md={6} lg={3} className="border rounded p-3 h-50 my-5">

                <div className='d-flex justify-content-between'>
                    <h6>Price:</h6>
                    <h6>${product?.price}</h6>
                </div>

                <div className='d-flex justify-content-between align-items-center my-3'>
                    <h6>Status:</h6>
                    {
                        product?.countInStock > quantity ?
                        <Button variant="info" size="sm">In Stock</Button> :
                        <Button variant="danger" size="sm">Out Of Stock</Button> 
                    }
                </div>

                {/* <div className='d-flex justify-content-between align-items-center'>
                    <p className=" text-black-50">Items Left</p>
                    <p className='border rounded p-2 text-black-50'>{product?.countInStock}</p>
                </div> */}

                {
                    product?.countInStock > quantity ?
                    <Button variant="primary" onClick={addToCartHandler}>Add To Cart</Button> :
                    <Button disabled variant="primary">Add To Cart</Button>
                }
                
            </Col>
        </Row>
        }
    </Container>
  )
}

export default ProductDetail
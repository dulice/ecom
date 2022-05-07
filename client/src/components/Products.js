import React, { useContext, useEffect, useReducer } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Loading from './Loading'
import Product from './Product'
import { Helmet } from 'react-helmet-async'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Products = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchProduct = async() => {
      dispatch({type: "FETCH_REQUEST"});
      try{
         const res = await axios.get("http://localhost:5000/api/products");
        dispatch({type: "FETCH_SUCCESS", payload: res.data});
      } catch (err) {
        dispatch({type: "FETCH_FAIL", payload: err.message});
      }
    }
    fetchProduct();
  },[]);


  return (
    <div>
        <Container>
          <Helmet>
            <title>Amazon</title>
          </Helmet>
            {
              loading ? <Loading /> :
              error ? <div className='text-danger'>{error}</div> :
              <Row>
                {products?.map(product => {
                    return (
                      <Col xs={12} md={4} lg={3} className="mt-4" key={product?.slug}>
                        <Product product={product} />
                      </Col>
                    )
                })}
            </Row>
            }
        </Container>
    </div>
  )
}

export default Products
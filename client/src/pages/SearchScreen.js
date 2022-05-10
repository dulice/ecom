import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react'
import { Row, Col, Container, Button, Form } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import getError from '../components/getError'
import { Helmet } from 'react-helmet-async'
import { FaTimesCircle } from 'react-icons/fa'
import Product from '../components/Product';

const Reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true};

        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                products: action.payload.products,
                countProducts: action.payload.countProducts,
                page: action.payload.page,
                pages: action.payload.pages
            }

        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload}

        default:
            return state;
    }
}

const prices = [ 
    {
        name: '$1 to $50',
        value: '1-50',
    },
    {
        name: '$51 to $200',
        value: '51-200',
    },
    {
        name: '$201 to $1000',
        value: '201-1000',
    }
]

const ratings = [
    {
        name: '4 stars and up',
        value: 4
    },
    {
        name: '3 stars and up',
        value: 3
    },
    {
        name: '2 stars and up',
        value: 2
    },
    {
        name: '1 stars and up',
        value: 1
    },
]

const SearchScreen = () => {

    const navigate = useNavigate();
    //all path behind ?
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const category = searchParams.get('category') || 'all';
    const query = searchParams.get('query') || 'all';
    const price = searchParams.get('price') || 'all';
    const rating = searchParams.get('rating') || 'all';
    const order = searchParams.get('order') || 'newest';
    const page =searchParams.get('page') || 1;

    const [{ pages, products, countProducts, loading, error }, dispatch] = useReducer(Reducer, {
        loading: true,
        error: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: "FETCH_REQUEST"})
            try {

                const {data} = await axios.get(`http://localhost:5000/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`);
                dispatch({type: "FETCH_SUCCESS", payload: data});
                // console.log(data);
            }catch (err) {
                dispatch({type: "FETCH_FAIL", payload: getError(err)});
                toast.error(error);
            }
        }
        fetchData();
    },[page, query, category, price, rating, order, dispatch]);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await axios.get('http://localhost:5000/api/products/categories');
            setCategories(data);
        }
        fetchCategories();
    },[setCategories]);

    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page;
        const filterQuery = filter.query || query;
        const filterCategory = filter.category || category;
        const filterPrice = filter.price || price;
        const filterRating = filter.rating || rating;
        const filterOrder = filter.order || order;
        return `/search?category=${filterCategory}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}&page=${filterPage}`
    }

  return (
    <Container>
        <Helmet>
            <title>Search Products</title>
        </Helmet>
        <Row>
            <Col md={3} className='border-end'>
                <h3>Category</h3>
                <ul>
                    <li>
                        <Link className={[category === 'all' ? 'text-bold': '', 'link']} to={getFilterUrl({category: 'all'})}>All</Link>
                    </li>
                   {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? 'text-bold' : ''}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
                </ul>

                <h3>Price</h3>
                <ul>
                    <li>
                        <Link className={[price === 'all' ? 'text-bold': '', 'link']} to={getFilterUrl({price: 'all'})}>All</Link>
                    </li>
                   {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    className={p.value === price ? 'text-bold' : ''}
                    to={getFilterUrl({ price: p.value })}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
                </ul>

                <h3>Rating</h3>
                <ul>
                    <li>
                        <Link className={[rating === 'all' ? 'text-bold': '', 'link']} to={getFilterUrl({rating: 'all'})}>All</Link>
                    </li>
                   {ratings.map((r) => (
                <li key={r.value}>
                  <Link
                    className={r.value === rating ? 'text-bold' : ''}
                    to={getFilterUrl({ rating: r.value })}
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
                </ul>

            </Col>
            <Col md={9}>
                { loading ? <div>Loading...</div>
                :
                    <div>
                        <div className="d-flex justify-content-between">
                            <div className='d-fex align-items-center my-2'>
                                {countProducts === 0 ? 'No' :  countProducts + ' Results'}
                                {query !== 'all' && ' : ' + query}
                                {category !== 'all' && ' : ' + category}
                                {price !== 'all' && ' : ' + price}
                                {rating !== 'all' && ' : ' + rating}
                                { query !== 'all' ||
                                    category !== 'all' ||
                                    price !== 'all' ||
                                    rating !== 'all' 
                                    ? (
                                            < FaTimesCircle className='ms-2' onClick={() => navigate('/search')}/>
                                    ) : null
                                }
                            </div>
                            <div>
                                <strong>Sort By: {' '}</strong>
                                <Form.Select
                                    value={order}
                                    onChange={(e) => navigate(getFilterUrl({ order: e.target.value}))}
                                >
                                    <option value="newest">Lastest Products</option>
                                    <option value="lowest">Price: Low to High</option>
                                    <option value="higest">Price: High to Low</option>
                                    <option value="toprated">Avg. Customer Review</option>
                                </Form.Select>
                            </div>
                        </div>
                        {products.length === 0 && <Button disabled variant='danger'>No Product Found</Button>}
                        <Row>
                            {products.map((product) => (
                                <Col sm={6} lg={4} className="my-3" key={product._id}>
                                    <Product product={product}></Product>
                                </Col>
                            ))}
                        </Row>

                        <div>
                {[...Array(pages).keys()].map((x) => (
                  <Link
                    key={x + 1}
                    className="mx-1"
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </Link>
                ))}
              </div>
                    </div>
                }
            </Col>
        </Row>
    </Container>
  )
}

export default SearchScreen
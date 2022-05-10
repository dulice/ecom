import React, { useContext, useEffect, useReducer } from 'react'
import getError from '../../components/getError';
import { Store } from '../../context/Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, Table, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const Reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true};

    case "FETCH_SUCCESS":
      return { 
        ...state,
        products: action.payload.products,
        countProducts: action.payload.countProducts,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false
      };

    case "FETCH_FAIL":
      return { ...state, error: action.payload};

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, deleteSuccess: false};

    case "DELETE_SUCCESS":
      return { 
        ...state,
        loadingDelete: false,
        deleteSuccess: true
      };

    case "DELETE_FAIL":
      return { ...state, deleteSuccess: false, loadingDelete: false};

    default:
      return state;
  }
}

const ProductsList = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{error, loading, products, countProducts, page, pages, loadingDelete, deleteSuccess}, dispatch] = useReducer(Reducer, {
    loading: true,
    error: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: "FETCH_REQUEST"});
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/admin?page=${page}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        })
        dispatch({type: "FETCH_SUCCESS", payload: data});
        // console.log(data);
      } catch (err) {
      dispatch({type: "FETCH_FAIL", payload: getError(err)});
       toast.error(error);
      }
    }
    fetchData();
  },[userInfo, dispatch])

  const createHandler = async () => {
    if(window.confirm("Are you sure you want to create new product?")) {
      dispatch({type: "FETCH_REQUEST"});
      try {
        const { data } = await axios.post('http://localhost:5000/api/products',
          {},
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`
            }
          }
        )
        dispatch({type: "FETCH_SUCCESS", payload: data});
        toast.success("Create Product Successfully");
        navigate(`/admin/productsList/${data._id}`);
      } catch (err) {
        dispatch({type: "FETCH_FAIL", payload: getError(err)});
        toast.error(error);
      }
    }
  }

  const deleteHandler = async (id) => {
    if(window.confirm("Are you sure you want to delete?")){
      dispatch({type: "DELTET_REQUEST"});
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`,{
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        });
        dispatch({type: "DELETE_SUCCESS"});
        toast.success("Delect Product Successfully.")
      } catch (err) {
        dispatch({type: "DELETE_FAIL"});
        toast.error("Delete Fail.")
      }
    }
  }
  return (
    <Container>
      <h2>Products</h2>
      <Button variant='primary' onClick={createHandler}>
        Create Product
      </Button>
      {loading ? <div>Loading...</div>
      :
      <div>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>$ {product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <Button variant='primary' className='me-2'>
                    <Link to={`/admin/productsList/${product._id}`} className='text-white link'>Edit</Link>
                  </Button>
                  <Button variant='danger' onClick={()=>deleteHandler(product._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {[...Array(pages).keys()].map((x) => (
          <Link key={x+1} to={`/admin/productsList?page=${x+1}`} className='mx-1'>
            <Button variant='light'>{x+1}</Button>
          </Link>
        ))}
      </div>
      }
    </Container>
  )
}

export default ProductsList